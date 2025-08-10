import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import { AdCopy } from '../entities/ad-copy.entity';
import { AdCreative } from '../entities/ad-creative.entity';
import { CreativeType } from '../types/shared.types';

export interface AdCopyRequest {
  productName: string;
  productDescription: string;
  targetAudience: string;
  adObjective: string;
  tone?: string;
  variations?: number;
}

export interface AdImageRequest {
  productName: string;
  productDescription: string;
  style?: string;
  aspectRatio?: string;
}

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;

  constructor(
    private configService: ConfigService,
    @InjectRepository(AdCopy)
    private adCopyRepository: Repository<AdCopy>,
    @InjectRepository(AdCreative)
    private adCreativeRepository: Repository<AdCreative>,
  ) {
    this.genAI = new GoogleGenerativeAI(this.configService.get('GEMINI_API_KEY'));
  }

  async generateAdCopy(userId: string, request: AdCopyRequest) {
    const { productName, productDescription, targetAudience, adObjective, tone = 'professional', variations = 3 } = request;

    const prompt = `You are an expert Facebook ads copywriter. Create ${variations} compelling Facebook ad copy variations for:

Product: ${productName}
Description: ${productDescription}
Target Audience: ${targetAudience}
Ad Objective: ${adObjective}
Tone: ${tone}

For each variation, provide:
1. Headline (max 40 characters)
2. Primary Text (max 125 characters)
3. Description (max 30 characters)
4. Call-to-Action suggestion

IMPORTANT: Return ONLY a valid JSON array with objects containing: headline, primaryText, description, callToAction

Example format:
[
  {
    "headline": "Amazing Product Here",
    "primaryText": "Discover the best solution for your needs. Limited time offer!",
    "description": "Get yours today",
    "callToAction": "Shop Now"
  }
]`;

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();

      if (!content) {
        throw new BadRequestException('Failed to generate ad copy');
      }

      // Clean the response to extract JSON
      let jsonContent = content.trim();
      if (jsonContent.startsWith('```json')) {
        jsonContent = jsonContent.replace(/```json\n?/, '').replace(/\n?```$/, '');
      }
      if (jsonContent.startsWith('```')) {
        jsonContent = jsonContent.replace(/```\n?/, '').replace(/\n?```$/, '');
      }

      // Parse the JSON response
      const adCopies = JSON.parse(jsonContent);

      // Validate the response structure
      if (!Array.isArray(adCopies)) {
        throw new BadRequestException('Invalid response format from AI');
      }

      // Save to database
      const savedCopies = await Promise.all(
        adCopies.map(async (copy: any) => {
          const adCopy = this.adCopyRepository.create({
            headline: copy.headline || 'Generated Headline',
            primaryText: copy.primaryText || 'Generated primary text',
            description: copy.description || 'Generated description',
            callToAction: copy.callToAction || 'Learn More',
            prompt,
            aiModel: 'gemini-1.5-flash',
            temperature: 0.8,
            userId,
          });
          return this.adCopyRepository.save(adCopy);
        }),
      );

      return savedCopies;
    } catch (error) {
      console.error('Error generating ad copy:', error);
      throw new BadRequestException('Failed to generate ad copy: ' + error.message);
    }
  }

  async generateAdImage(userId: string, request: AdImageRequest) {
    const { productName, productDescription, style = 'modern', aspectRatio = '1:1' } = request;

    // Check if Stability AI is configured
    const stabilityApiKey = this.configService.get('STABILITY_API_KEY');
    
    if (!stabilityApiKey) {
      throw new BadRequestException(
        'Image generation is not available. To enable this feature, please:\n\n' +
        '1. Get a Stability AI API key from https://platform.stability.ai/\n' +
        '2. Add STABILITY_API_KEY to your server/.env file\n' +
        '3. Restart the server\n\n' +
        'Alternative: You can use the ad copy generator which works with your current Gemini setup.'
      );
    }

    const prompt = `Create a high-quality, professional product image for Facebook ads:

Product: ${productName}
Description: ${productDescription}
Style: ${style}
Aspect Ratio: ${aspectRatio}

The image should be:
- Eye-catching and scroll-stopping
- Professional and clean
- Suitable for Facebook advertising
- High contrast and vibrant colors
- Include the product prominently
- Minimal text overlay
- ${style} aesthetic`;

    try {
      // Use Stability AI
      const response = await axios.post(
        'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
        {
          text_prompts: [{ text: prompt }],
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          samples: 1,
          steps: 30,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${stabilityApiKey}`,
          },
        },
      );

      const imageBase64 = response.data.artifacts[0]?.base64;
      if (!imageBase64) {
        throw new BadRequestException('Failed to generate image from Stability AI');
      }

      // In a real app, you'd upload this to cloud storage (AWS S3, etc.)
      // For now, we'll store the base64 data
      const imageUrl = `data:image/png;base64,${imageBase64}`;

      const creative = this.adCreativeRepository.create({
        type: CreativeType.IMAGE,
        imageUrl,
        prompt,
        aiModel: 'stable-diffusion-xl',
        style,
        userId,
      });
      const savedCreative = await this.adCreativeRepository.save(creative);

      return savedCreative;
    } catch (error) {
      console.error('Error generating ad image:', error);
      
      if (error.response?.status === 401) {
        throw new BadRequestException('Invalid Stability AI API key. Please check your STABILITY_API_KEY in the environment variables.');
      } else if (error.response?.status === 402) {
        throw new BadRequestException('Insufficient credits in your Stability AI account. Please add credits at https://platform.stability.ai/');
      } else if (error.response?.data?.message) {
        throw new BadRequestException(`Stability AI error: ${error.response.data.message}`);
      }
      
      throw new BadRequestException('Failed to generate ad image. Please try again or check your Stability AI configuration.');
    }
  }

  async getAdCopyHistory(userId: string) {
    return this.adCopyRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  async getAdCreativeHistory(userId: string) {
    return this.adCreativeRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }
}