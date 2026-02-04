# n8n-nodes-byteplus

This is an n8n community node package providing access to multiple AI services:

| Node | Services |
|------|----------|
| **BytePlus** | Image Generation (Seedream), Video Generation (Seedance) |
| **TikTok** | Video Upload to TikTok |
| **Gemini** | Text Generation, Image Analysis (Vision) |
| **AWS Bedrock** | Text Generation (Claude, Nova, Llama, Mistral) |

## Installation

### Community Node (Recommended)

1. Go to **Settings > Community Nodes** in n8n
2. Select **Install**
3. Enter `n8n-nodes-byteplus`
4. Agree to the risks and click **Install**

### Manual Installation

```bash
npm install n8n-nodes-byteplus
```

---

## BytePlus Node

### Credentials

1. Sign up at [BytePlus](https://www.byteplus.com/)
2. Navigate to the ARK console
3. Generate an API key
4. In n8n, go to **Credentials > New Credential > BytePlus API**
5. Enter your API key and configure endpoints if needed

### Operations

#### Image: Generate Image
Generate images from text prompts using Seedream. **Images are displayed directly in n8n output panel.**

| Parameter | Required | Description |
|-----------|----------|-------------|
| Prompt | Yes | Text description of the image |
| Model | No | Seedream 4.0 (default), Seedream 3.0, or Custom |
| Size | No | 2K, 1080p, 720p, or 1024x1024 |
| Watermark | No | Add watermark (default: true) |

**Example Output:**
```json
{
  "success": true,
  "prompt": "A beautiful sunset over mountains",
  "imageUrl": "https://..."
}
```
Plus binary image data displayed in n8n.

#### Video: Generate Video
Generate videos from text and reference images using Seedance.

| Parameter | Required | Description |
|-----------|----------|-------------|
| Prompt | Yes | Text description of the video |
| Reference Image URL | Yes | Public https:// URL of reference image |
| Model | No | Seedance 1.0 Lite I2V (default) or Custom |
| Max Wait Time | No | Polling timeout in seconds (default: 300) |

**Example Output:**
```json
{
  "success": true,
  "taskId": "task_123",
  "status": "completed",
  "videoUrl": "https://...",
  "elapsedTime": "45.2s"
}
```

#### Text: Answer Question
Generate text responses using Seed LLM.

| Parameter | Required | Description |
|-----------|----------|-------------|
| Prompt | Yes | Question or prompt text |
| Model | No | Model ID |

---

## TikTok Node

Upload videos to TikTok directly from your n8n workflows.

### Credentials

See [TikTok Setup Guide](docs/TIKTOK_SETUP.md) for detailed instructions.

**Quick Setup:**
1. Create app at [TikTok Developer Portal](https://developers.tiktok.com)
2. Add **Login Kit** and **Content Posting API** products
3. Run `./get-tiktok-token.sh` to get OAuth tokens
4. In n8n, create **TikTok API** credential with your tokens

### Operations

#### Video: Upload Video
Upload videos to TikTok.

| Parameter | Required | Description |
|-----------|----------|-------------|
| Video Source | Yes | URL or Binary Data |
| Video URL | Yes* | Public URL of video (*if source is URL) |
| Binary Property | Yes* | Binary property name (*if source is Binary) |
| Title | Yes | Video title/caption (max 2200 chars) |
| Privacy Level | No | Public, Friends Only, or Private |
| Disable Comments | No | Disable comments on video |
| Disable Duet | No | Disable duets |
| Disable Stitch | No | Disable stitches |

**Example Output:**
```json
{
  "success": true,
  "publishId": "v_inbox_file~v2.123456789",
  "message": "Video uploaded to TikTok",
  "uploadStatus": 201,
  "processingStatus": {
    "data": {
      "status": "PROCESSING_UPLOAD",
      "uploaded_bytes": 7571947
    }
  }
}
```

### Important Notes

- **Unaudited apps**: Videos go to user's TikTok notifications (must manually post)
- **Audited apps**: Videos post directly to profile
- **Rate limits**: ~5-15 videos per day per user
- **Token refresh**: Tokens auto-refresh; refresh token valid for 1 year

---

## Gemini Node

### Credentials

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Create an API Key
3. In n8n, go to **Credentials > New Credential > Gemini API**
4. Enter your API key

### Operations

#### Text: Generate Text
Generate text using Google Gemini models.

| Parameter | Required | Description |
|-----------|----------|-------------|
| Prompt | Yes | The prompt to send to Gemini |
| Model | No | Gemini 2.0 Flash (default), 1.5 Flash, or 1.5 Pro |
| System Instruction | No | System prompt to guide behavior |
| Temperature | No | Randomness (0-2, default: 1.0) |
| Max Output Tokens | No | Maximum response length (default: 1024) |

**Example Output:**
```json
{
  "success": true,
  "prompt": "Explain quantum computing",
  "model": "gemini-2.0-flash",
  "generatedText": "Quantum computing is..."
}
```

#### Image: Analyze Image
Analyze images using Gemini Vision.

| Parameter | Required | Description |
|-----------|----------|-------------|
| Image URL | Yes | URL of image to analyze |
| Prompt | Yes | Question about the image |
| Model | No | Gemini model to use |

**Example Output:**
```json
{
  "success": true,
  "analysisText": "The image shows a cat sitting on a windowsill..."
}
```

---

## AWS Bedrock Node

### Credentials

1. Go to [AWS IAM Console](https://console.aws.amazon.com/iam/)
2. Create a user with `AmazonBedrockFullAccess` policy
3. Generate Access Key (select "Local code" use case)
4. In n8n, go to **Credentials > New Credential > AWS Bedrock API**
5. Enter:
   - Access Key ID
   - Secret Access Key
   - Region (e.g., `us-east-1`)

### Operations

#### Text: Generate Text
Generate text using AWS Bedrock foundation models.

| Parameter | Required | Description |
|-----------|----------|-------------|
| Prompt | Yes | The prompt to send to the model |
| Model | No | Amazon Nova Lite (default), Nova Pro, Claude 3.5 Sonnet, Claude 3 Haiku, Llama 3.1, Mistral 7B |
| System Prompt | No | System instruction to guide behavior |
| Temperature | No | Randomness (0-1, default: 0.7) |
| Max Tokens | No | Maximum response length (default: 1024) |

**Supported Models:**

| Provider | Models |
|----------|--------|
| Amazon | Nova Lite, Nova Micro, Nova Pro |
| Anthropic | Claude 3.5 Sonnet, Claude 3 Haiku, Claude 3 Sonnet |
| Meta | Llama 3.1 8B Instruct, Llama 3.1 70B Instruct |
| Mistral | Mistral 7B Instruct |

**Example Output:**
```json
{
  "success": true,
  "prompt": "Summarize this article...",
  "model": "amazon.nova-lite-v1:0",
  "generatedText": "The article discusses..."
}
```

---

## Development

### Local Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the node:
   ```bash
   npm run build
   ```

### Running with Docker

Start n8n with the custom nodes:

```bash
docker-compose up
```

Access n8n at `http://localhost:5679`

### Project Structure

```
n8n-nodes-byteplus/
├── credentials/
│   ├── BytePlusApi.credentials.ts
│   ├── GeminiApi.credentials.ts
│   ├── AwsBedrockApi.credentials.ts
│   └── TikTokOAuth2Api.credentials.ts
├── nodes/
│   ├── BytePlus/
│   │   ├── BytePlus.node.ts
│   │   ├── byteplus.svg
│   │   └── actions/
│   │       ├── Image/
│   │       ├── Video/
│   │       └── Text/
│   ├── TikTok/
│   │   ├── TikTok.node.ts
│   │   ├── tiktok.svg
│   │   └── actions/
│   │       └── Video/
│   ├── Gemini/
│   │   ├── Gemini.node.ts
│   │   ├── gemini.svg
│   │   └── actions/
│   │       ├── Text/
│   │       └── Image/
│   └── AwsBedrock/
│       ├── AwsBedrock.node.ts
│       ├── awsbedrock.svg
│       └── actions/
│           └── Text/
├── package.json
├── tsconfig.json
└── docker-compose.yml
```

## Security

API keys are **not stored in the code**. They are:
- Entered via n8n UI (Credentials)
- Encrypted by n8n
- Stored in n8n's database (Docker volume)
- Retrieved at runtime by nodes

The credential files only define the **structure** (field names, types), not actual values.

## API Reference

| Node | Service | Endpoint |
|------|---------|----------|
| BytePlus | Image Generation | `/api/v3/images/generations` |
| BytePlus | Video Generation | `/api/v3/contents/generations/tasks` |
| TikTok | Video Upload | `open.tiktokapis.com/v2/post/publish/inbox/video/init/` |
| Gemini | Text/Vision | `generativelanguage.googleapis.com/v1beta/models/` |
| AWS Bedrock | Text Generation | `bedrock-runtime.{region}.amazonaws.com/model/{model}/invoke` |

## License

MIT

## Links

- [BytePlus Documentation](https://www.byteplus.com/en/docs)
- [TikTok Developer Portal](https://developers.tiktok.com)
- [TikTok Setup Guide](docs/TIKTOK_SETUP.md)
- [Google AI Studio](https://aistudio.google.com/)
- [AWS Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)
- [n8n Community Nodes](https://docs.n8n.io/integrations/community-nodes/)
