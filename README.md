# n8n-nodes-byteplus

**n8n community node for BytePlus AI services** - Image Generation, Video Generation, and Text Generation.

## Features

| Service | Capabilities |
|---------|-------------|
| **Image Generation** | Generate images using Seedream models (2K, 1080p, 720p, 1024x1024) |
| **Video Generation** | Create videos from text + reference images using Seedance |
| **Text Generation** | Generate text responses using Seed LLM |

## Installation

### Option 1: Community Node (Recommended)

1. In your n8n instance, go to **Settings > Community Nodes**
2. Click **Install**
3. Enter `n8n-nodes-byteplus`
4. Agree to the risks and click **Install**

### Option 2: Manual Installation

```bash
npm install n8n-nodes-byteplus
```

## Setup

### 1. Get BytePlus API Credentials

1. Sign up at [BytePlus](https://www.byteplus.com/)
2. Navigate to the ARK console
3. Generate an API key

### 2. Configure Credentials in n8n

1. In n8n, go to **Credentials**
2. Click **New Credential**
3. Search for **BytePlus API**
4. Enter your API key and configure endpoints if needed

## Usage

### Image Generation

Generate images from text prompts using Seedream models.

**Parameters:**
- **Prompt** (required): Text description of the image
- **Model**: Seedream 4.0 (default), Seedream 3.0, or Custom
- **Size**: 2K, 1080p, 720p, or 1024x1024
- **Watermark**: Add watermark (default: true)

**Output:** Images are displayed directly in n8n output panel with download URLs.

### Video Generation

Create videos from text descriptions and reference images using Seedance.

**Parameters:**
- **Prompt** (required): Text description of the video
- **Reference Image URL** (required): Public https:// URL of reference image
- **Model**: Seedance 1.0 Lite I2V (default) or Custom
- **Max Wait Time**: Polling timeout in seconds (default: 300)

### Text Generation

Generate text responses using Seed LLM.

**Parameters:**
- **Prompt** (required): Question or prompt text
- **Model**: Model ID for specific Seed LLM models

## Local Development

### Prerequisites

- Node.js >=18.0.0
- n8n installed locally (`npm install -g n8n` or use `npx`)

### Quick Start

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo-url>
   cd n8n-nodes-byteplus
   npm install
   ```

2. **Build the node:**
   ```bash
   npm run build
   ```

3. **Start n8n with the custom node:**
   ```bash
   N8N_CUSTOM_EXTENSIONS="/path/to/n8n-nodes-byteplus" npx n8n start
   ```
   > **Note:** `npm run dev` only runs the TypeScript compiler in watch mode — it does not start n8n. You need to run n8n separately.

4. **Access n8n:**
   - Open http://localhost:5678
   - Create your workflow
   - Add BytePlus node from the nodes panel
   - Configure your BytePlus API credentials

> **Port note:** n8n defaults to port 5678 for the editor UI. Port 5679 is used internally by the Task Broker — do not set `N8N_PORT=5679` as it will conflict.

### Development Commands

```bash
# Build the node
npm run build

# Watch mode for development
npm run dev

# Lint code
npm run lint

# Fix linting issues
npm run lintfix

# Format code
npm run format

# Type checking
npm run typecheck
```

### Project Structure

```
n8n-nodes-byteplus/
├── credentials/
│   └── BytePlusApi.credentials.ts    # API credential configuration
├── nodes/
│   └── BytePlus/
│       ├── BytePlus.node.ts          # Main node definition
│       ├── byteplus.svg              # Node icon
│       └── actions/
│           ├── Image/                # Image generation operations
│           ├── Video/                # Video generation operations
│           └── Text/                 # Text generation operations
├── dist/                             # Built files (auto-generated)
├── package.json                      # Dependencies and scripts
└── tsconfig.json                     # TypeScript configuration
```

## Security

- **No credentials are hardcoded in this repo** (only field definitions)
- **Secure your n8n instance before exposing it** (auth + access controls), especially if using tunnels for OAuth redirects
- **Keep TLS verification enabled** (avoid `NODE_TLS_REJECT_UNAUTHORIZED=0` unless you fully understand the MITM risk)

## API Reference

| Operation | Endpoint |
|-----------|----------|
| Image Generation | `/api/v3/images/generations` |
| Video Generation | `/api/v3/contents/generations/tasks` |
| Text Generation | `/api/v3/chat/completions` |

## Troubleshooting

### Common Issues

**Node not appearing in n8n:**
- Ensure you built the project (`npm run build`)
- Verify `N8N_CUSTOM_EXTENSIONS` points to the correct path
- Restart n8n after rebuilding

**API authentication errors:**
- Verify your BytePlus API key is correct
- Check the base URL is set properly
- Ensure your BytePlus account has necessary permissions

**Build errors:**
- Run `npm install` to ensure all dependencies are installed
- Check Node.js version (>=18.0.0 required)

## License

MIT

## Links

- [BytePlus Documentation](https://www.byteplus.com/en/docs)
- [BytePlus ARK Console](https://console.byteplus.com/ark)
- [n8n Community Nodes](https://docs.n8n.io/integrations/community-nodes/)
