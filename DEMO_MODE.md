# Demo Mode Instructions

## What was changed

I've enabled demo mode to bypass authentication so you can show the app to someone without requiring login.

### Changes made:

1. **Modified `client/lib/auth-context.tsx`**:

   - Added `DEMO_MODE` constant that bypasses authentication
   - Creates a fake demo user when demo mode is enabled
   - Skips all API authentication checks

2. **Updated `client/.env.example`**:
   - Added `NEXT_PUBLIC_DEMO_MODE=true` environment variable option

## How to use

### Option 1: Current setup (Demo mode always on)

The app is now set to demo mode by default. Just run:

```bash
npm run dev
```

The app will automatically:

- Skip login/registration
- Show the dashboard directly
- Display "Demo User" as the logged-in user

### Option 2: Control via environment variable

To control demo mode via environment variable:

1. Create a `.env.local` file in the `client` folder:

```bash
NEXT_PUBLIC_DEMO_MODE=true
```

2. Set `DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'` in `auth-context.tsx`

## To disable demo mode later

Simply change the `DEMO_MODE` constant in `client/lib/auth-context.tsx`:

```typescript
const DEMO_MODE = false;
```

Or set the environment variable to false:

```bash
NEXT_PUBLIC_DEMO_MODE=false
```

## What the demo user can access

- Dashboard with all UI elements
- Navigation between pages
- All frontend functionality
- Mock user data (Demo User, demo@example.com)

## Limitations in demo mode

- API calls to the backend may fail (but UI will still work)
- No real data persistence
- Meta API integration won't work without proper authentication
- Some features requiring server-side authentication will show errors

## Reverting changes

To restore normal authentication, simply set `DEMO_MODE = false` in the auth context file.
