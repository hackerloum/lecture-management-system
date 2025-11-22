# Netlify Deployment Guide

This guide will help you deploy the Lecturer Management System to Netlify.

## Prerequisites

- A Netlify account (sign up at https://netlify.com)
- Your GitHub repository connected to Netlify

## Deployment Steps

### Option 1: Deploy via Netlify UI (Recommended)

1. **Connect Repository**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub account and select the repository: `hackerloum/lecture-management-system`

2. **Configure Build Settings**
   Netlify should auto-detect the settings from `netlify.toml`, but verify:
   - **Base directory:** `app`
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`

3. **Environment Variables** (if needed)
   - Go to Site settings → Environment variables
   - Add any required environment variables:
     - `NEXT_PUBLIC_APP_URL` (your Netlify site URL)
     - Any Supabase or API keys if you're using them

4. **Deploy**
   - Click "Deploy site"
   - Wait for the build to complete
   - Your site will be live at `https://your-site-name.netlify.app`

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize Site**
   ```bash
   cd app
   netlify init
   ```
   - Follow the prompts to link your site
   - Select "Create & configure a new site"

4. **Deploy**
   ```bash
   netlify deploy --prod
   ```

## Build Configuration

The `netlify.toml` file contains:
- **Base directory:** `app` (where your Next.js app is located)
- **Build command:** `npm run build`
- **Publish directory:** `.next` (Next.js output)
- **Node version:** 20
- **Next.js plugin:** Automatically configured for optimal Next.js deployment

## Important Notes

1. **Node Version**: The project uses Node.js 20 (specified in `app/.nvmrc`)

2. **Dependencies**: Make sure all dependencies are listed in `app/package.json`

3. **Environment Variables**: 
   - Add any sensitive keys in Netlify's environment variables section
   - Never commit `.env` files to the repository

4. **Build Time**: First build may take 5-10 minutes. Subsequent builds are faster.

5. **Custom Domain**: 
   - Go to Site settings → Domain management
   - Add your custom domain
   - Follow DNS configuration instructions

## Troubleshooting

### Build Fails
- Check build logs in Netlify dashboard
- Ensure Node version is 20
- Verify all dependencies are installed correctly

### Routing Issues
- Next.js routing should work automatically with the Netlify Next.js plugin
- If you see 404 errors, check that `netlify.toml` redirects are configured

### Environment Variables Not Working
- Ensure variables are prefixed with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding new environment variables

## Support

For Netlify-specific issues, check:
- [Netlify Documentation](https://docs.netlify.com)
- [Next.js on Netlify](https://docs.netlify.com/integrations/frameworks/next-js/)

