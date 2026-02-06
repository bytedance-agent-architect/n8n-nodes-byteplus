# TikTok Node Setup Guide

This guide walks you through configuring your TikTok Developer account to use the TikTok node in n8n.

## Prerequisites

- A TikTok account
- A phone with the TikTok app installed

## Security Notes (Read This)

- Treat your **Client Secret**, **Access Token**, and **Refresh Token** as secrets. Avoid sharing terminal output/screenshots when running `get-tiktok-token.sh`.
- If you use a tunnel (ngrok/cloudflared) so TikTok can reach your redirect URI, **protect your n8n instance** (authentication + access controls). Do not expose a dev n8n instance to the public internet unauthenticated.
- Keep TLS verification enabled. Do **not** set `NODE_TLS_REJECT_UNAUTHORIZED=0` unless you fully understand the MITM risk.

## Step 1: Create a TikTok Developer Account

1. Go to [TikTok for Developers](https://developers.tiktok.com)
2. Click **Log in** (use your TikTok account)
3. Complete the developer registration if prompted

## Step 2: Create an App

1. Click your **profile icon** (top right) → **Manage apps**
2. Click **Create app**
3. Fill in the required fields:
   - **App name**: Your app's name (e.g., "My Video Uploader")
   - **Description**: Brief description of your app
   - **App icon**: Upload an icon
   - **Category**: Select appropriate category
   - **Terms of Service URL**: URL to your terms page
   - **Privacy Policy URL**: URL to your privacy policy page
4. Click **Create**

## Step 3: Add Required Products

In your app dashboard:

1. Go to **Products** section
2. Click **Add products**
3. Add the following:
   - **Login Kit** (required for OAuth)
   - **Content Posting API** (required for video uploads)

## Step 4: Configure Login Kit

1. Click on **Login Kit** in your products
2. Under **Platform**, click **Configure for Web**
3. Set **Web/Desktop URL** to your website or GitHub repo URL
4. Add **Redirect URI**:
   ```
   https://your-n8n-domain.com/rest/oauth2-credential/callback
   ```
   > Note: TikTok does not allow `localhost`. Use a tunnel service like ngrok or cloudflared for local development.

## Step 5: Configure Content Posting API

1. Click on **Content Posting API** in your products
2. Enable **Direct Post** toggle (for future use when audited)
3. Note: Domain verification is optional if uploading via file (not URL)

## Step 6: Configure Scopes

1. Go to **Scopes** section
2. You should see these scopes available:
   - `user.info.basic` (from Login Kit)
   - `video.upload` (from Content Posting API)
   - `video.publish` (from Content Posting API)

## Step 7: Add Test Users (Sandbox Mode)

1. Go to **Sandbox** section
2. Click **Target Users** → **Add**
3. Enter your TikTok username
4. Save

> Important: Only users added as Target Users can test the OAuth flow in sandbox mode.

## Step 8: Get Your Credentials

1. Go to **App details** section
2. Copy your:
   - **Client Key** (this is your Client ID)
   - **Client Secret**

## Step 9: Get OAuth Token

Since TikTok's OAuth requires PKCE and doesn't allow localhost, use the provided script:

```bash
cd /path/to/creative-agent-n8n
./get-tiktok-token.sh
```

The script will:
1. Ask for your Client Key, Client Secret, and Redirect URI
2. Generate an OAuth URL to open in your browser
3. After you authorize, paste the code from the redirect URL
4. Return your access token, refresh token, and open ID

## Step 10: Configure n8n Credentials

1. In n8n, go to **Credentials** → **Add Credential**
2. Search for **TikTok API**
3. Fill in:
   - **Client Key**: Your TikTok app Client Key
   - **Client Secret**: Your TikTok app Client Secret
   - **Access Token**: From the script output
   - **Refresh Token**: From the script output
   - **Open ID**: From the script output
4. Click **Save**

## Usage

### For Unaudited Apps (Sandbox)

Videos are sent to the user's TikTok notifications:
1. Open TikTok app
2. Go to **Inbox** → **System notifications**
3. Tap the notification to edit and post the video

### Rate Limits

- ~5-15 videos per day per user
- Too many pending (unposted) videos triggers spam protection
- Wait 24 hours if you hit rate limits

## Getting Full Access (Audit)

To post videos directly (without manual approval step):

1. Test your integration thoroughly in sandbox
2. Go to your app → **Submit for review**
3. Provide:
   - Demo video showing your integration
   - Description of your use case
   - How users will use your app
4. Wait 1-3 weeks for TikTok review
5. Once approved, videos post directly to user profiles

## Troubleshooting

### "client_key" error
- Verify Client Key is correct (no extra spaces)
- Ensure Login Kit is added to your app
- Add yourself as a Target User in Sandbox

### "scope" error
- Add Content Posting API product to your app
- Check that video.upload and video.publish scopes are available

### "redirect_uri" error
- Redirect URI must match exactly (including trailing slashes)
- TikTok doesn't allow localhost - use ngrok/cloudflared

### "unaudited_client_can_only_post_to_private_accounts" error
- This is expected for unaudited apps
- Videos go to inbox/notifications instead of direct posting
- Submit for audit to enable direct posting

### "spam_risk_too_many_pending_share" error
- Too many pending videos in queue
- Post or delete existing notifications in TikTok app
- Wait 24 hours before trying again

## Using Cloudflared for Local Development

If you need a public URL for local n8n:

```bash
# Install cloudflared
brew install cloudflare/cloudflare/cloudflared

# Create tunnel to your local n8n
cloudflared tunnel --url http://localhost:5679
```

Use the generated URL (e.g., `https://xxx.trycloudflare.com`) as your redirect URI.

Remember to update your docker-compose.yml:
```yaml
environment:
  - N8N_EDITOR_BASE_URL=https://xxx.trycloudflare.com
  - WEBHOOK_URL=https://xxx.trycloudflare.com
```
