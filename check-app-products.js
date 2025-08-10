const axios = require('axios');

const APP_ID = '1077119497427018';
const APP_SECRET = '580f1f3e2ca415dbfa68283f4a1caf6e';

console.log('🔍 Checking App Products and Permissions...\n');

async function checkAppProducts() {
  try {
    // Get app access token
    const tokenResponse = await axios.get(`https://graph.facebook.com/oauth/access_token`, {
      params: {
        client_id: APP_ID,
        client_secret: APP_SECRET,
        grant_type: 'client_credentials'
      }
    });

    const appAccessToken = tokenResponse.data.access_token;
    console.log('✅ App Access Token obtained');

    // Check app details
    const appResponse = await axios.get(`https://graph.facebook.com/v19.0/${APP_ID}`, {
      headers: { 'Authorization': `Bearer ${appAccessToken}` },
      params: {
        fields: 'id,name,category,subcategory,app_domains,privacy_policy_url,terms_of_service_url'
      }
    });

    console.log('📱 App Details:');
    console.log('- Name:', appResponse.data.name);
    console.log('- ID:', appResponse.data.id);
    console.log('- Category:', appResponse.data.category);
    console.log('- Subcategory:', appResponse.data.subcategory);

    console.log('\n💡 Next Steps:');
    console.log('1. Go to https://developers.facebook.com/apps/' + APP_ID);
    console.log('2. Look for "Add Product" or "Products" section');
    console.log('3. Add "Marketing API" product');
    console.log('4. Complete any required setup steps');
    console.log('5. Try Graph API Explorer again');

    console.log('\n🔗 Direct Links:');
    console.log('- App Dashboard: https://developers.facebook.com/apps/' + APP_ID);
    console.log('- Add Products: https://developers.facebook.com/apps/' + APP_ID + '/add-product/');
    console.log('- Graph API Explorer: https://developers.facebook.com/tools/explorer/' + APP_ID);

  } catch (error) {
    console.log('❌ Error checking app:', error.response?.data || error.message);
    
    console.log('\n🔧 Manual Steps:');
    console.log('1. Go to https://developers.facebook.com/apps/' + APP_ID);
    console.log('2. Check if your app is in "Development" or "Live" mode');
    console.log('3. Add Marketing API product if not already added');
    console.log('4. Make sure you have admin access to the app');
  }
}

checkAppProducts();