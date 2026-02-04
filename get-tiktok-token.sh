#!/bin/bash

echo "=== TikTok OAuth Token Generator ==="
echo ""

# Get client credentials
read -p "Enter your TikTok Client Key: " CLIENT_KEY
read -p "Enter your TikTok Client Secret: " CLIENT_SECRET
read -p "Enter your Redirect URI (e.g., https://your-url.trycloudflare.com/callback): " REDIRECT_URI

# Generate PKCE code verifier and challenge
CODE_VERIFIER=$(openssl rand -base64 32 | tr -d '=/+' | cut -c1-43)
CODE_CHALLENGE=$(echo -n "$CODE_VERIFIER" | openssl dgst -sha256 -binary | base64 | tr -d '=' | tr '/+' '_-')

echo ""
echo "=== Step 1: Open this URL in your browser ==="
echo ""
echo "https://www.tiktok.com/v2/auth/authorize/?client_key=${CLIENT_KEY}&scope=user.info.basic,video.publish,video.upload&response_type=code&redirect_uri=${REDIRECT_URI}&code_challenge=${CODE_CHALLENGE}&code_challenge_method=S256"
echo ""
echo "=== Step 2: After authorizing, you'll be redirected. Copy the 'code' from the URL ==="
echo ""
read -p "Paste the code here: " AUTH_CODE

echo ""
echo "=== Step 3: Exchanging code for token... ==="
echo ""

# Exchange code for token
curl -s -X POST "https://open.tiktokapis.com/v2/oauth/token/" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_key=${CLIENT_KEY}" \
  -d "client_secret=${CLIENT_SECRET}" \
  -d "code=${AUTH_CODE}" \
  -d "grant_type=authorization_code" \
  -d "redirect_uri=${REDIRECT_URI}" \
  -d "code_verifier=${CODE_VERIFIER}"

echo ""
echo ""
echo "=== Copy the access_token and open_id from above into n8n ==="
