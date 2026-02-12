import type {
  IExecuteFunctions,
  INodeProperties,
  IDataObject,
  IHttpRequestMethods,
  INodeExecutionData,
} from "n8n-workflow";

function supportsStreamParameter(modelId: string): boolean {
  const match = modelId.match(/^seedream-(\d+)-/);
  if (!match) return false;

  const majorVersion = Number(match[1]);
  return Number.isInteger(majorVersion) && majorVersion >= 4;
}

export const description: INodeProperties[] = [
  {
    displayName: "Model",
    name: "model",
    type: "options",
    options: [
      { name: "Seedream 4.5 (Default)", value: "seedream-4-5-251128" },
      { name: "Seedream 4.0", value: "seedream-4-0-250828" },
      { name: "Custom (Enter Below)", value: "custom" },
    ],
    default: "seedream-4-5-251128",
    displayOptions: {
      show: {
        resource: ["image"],
        operation: ["generateImage"],
      },
    },
    description: "Model to use for image generation",
  },
  {
    displayName: "Prompt",
    name: "prompt",
    type: "string",
    typeOptions: {
      rows: 4,
    },
    default: "",
    required: true,
    displayOptions: {
      show: {
        resource: ["image"],
        operation: ["generateImage"],
      },
    },
    description: "Text description of the image to generate",
  },
  {
    displayName: "Input Image (Optional for Editing)",
    name: "image",
    type: "string",
    default: "",
    displayOptions: {
      show: {
        resource: ["image"],
        operation: ["generateImage"],
      },
    },
    description:
      "Optional input image URL or base64 string for image-to-image generation",
  },
  {
    displayName: "Custom Model ID",
    name: "customModel",
    type: "string",
    default: "",
    displayOptions: {
      show: {
        resource: ["image"],
        operation: ["generateImage"],
        model: ["custom"],
      },
    },
    description: "Enter a custom model ID",
  },
  {
    displayName: "Size",
    name: "size",
    type: "options",
    options: [
      { name: "1440x2560 (9:16)", value: "1440x2560" },
      { name: "1664x2496 (2:3)", value: "1664x2496" },
      { name: "1728x2304 (3:4)", value: "1728x2304" },
      { name: "2048x2048 (1:1)", value: "2048x2048" },
      { name: "2304x1728 (4:3)", value: "2304x1728" },
      { name: "2496x1664 (3:2)", value: "2496x1664" },
      { name: "2560x1440 (16:9)", value: "2560x1440" },
      { name: "2K", value: "2K" },
      { name: "3024x1296 (21:9)", value: "3024x1296" },
      { name: "4K", value: "4K" },
    ],
    default: "2K",
    displayOptions: {
      show: {
        resource: ["image"],
        operation: ["generateImage"],
      },
    },
    description: "Size of the generated image",
  },
  {
    displayName: "Watermark",
    name: "watermark",
    type: "boolean",
    default: true,
    displayOptions: {
      show: {
        resource: ["image"],
        operation: ["generateImage"],
      },
    },
    description: "Whether to add a watermark to the generated image",
  },
  {
    displayName: "Additional Options",
    name: "additionalOptions",
    type: "collection",
    placeholder: "Add Option",
    default: {},
    displayOptions: {
      show: {
        resource: ["image"],
        operation: ["generateImage"],
      },
    },
    options: [
      {
        displayName: "Response Format",
        name: "responseFormat",
        type: "options",
        options: [
          { name: "URL", value: "url" },
          { name: "Base64", value: "b64_json" },
        ],
        default: "url",
        description: "Format of the returned image",
      },
    ],
  },
];

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData> {
  const credentials = await this.getCredentials("bytePlusApi");
  const prompt = this.getNodeParameter("prompt", index) as string;
  const inputImage = this.getNodeParameter("image", index, "") as string;
  const modelSelection = this.getNodeParameter("model", index) as string;
  const customModel = this.getNodeParameter("customModel", index, "") as string;
  const size = this.getNodeParameter("size", index) as string;
  const watermark = this.getNodeParameter("watermark", index) as boolean;
  const additionalOptions = this.getNodeParameter(
    "additionalOptions",
    index,
    {},
  ) as IDataObject;
  const hasInputImage = inputImage.trim().length > 0;

  // Resolve model: use custom if selected, otherwise use dropdown value.
  const model = modelSelection === "custom" ? customModel : modelSelection;

  const baseUrl = credentials.baseUrl as string;
  const imageEndpoint = credentials.imageEndpoint as string;

  const body: IDataObject = {
    model,
    prompt,
    response_format: additionalOptions.responseFormat || "url",
    size: size || "2K",
    watermark,
  };
  if (supportsStreamParameter(model)) {
    body.stream = false;
  }
  if (hasInputImage) {
    body.image = inputImage;
  }

  const options = {
    method: "POST" as IHttpRequestMethods,
    url: `${baseUrl}${imageEndpoint}`,
    body,
    json: true,
  };

  const response = await this.helpers.httpRequestWithAuthentication.call(
    this,
    "bytePlusApi",
    options,
  );

  // Extract the image URL from the response
  const imageUrl = response?.data?.[0]?.url || response?.url || null;

  // Download the image as binary data so it can be displayed in n8n
  let binaryData = {};
  if (imageUrl) {
    try {
      const imageResponse = await this.helpers.request({
        method: "GET",
        url: imageUrl,
        encoding: null, // Returns Buffer
        resolveWithFullResponse: true,
      });

      const contentType = imageResponse.headers["content-type"] || "image/png";
      const fileName = `generated-image-${Date.now()}.${contentType.split("/")[1] || "png"}`;

      binaryData = {
        data: await this.helpers.prepareBinaryData(
          imageResponse.body as Buffer,
          fileName,
          contentType,
        ),
      };
    } catch (error) {
      // If download fails, continue without binary data
      console.error("Failed to download image:", error);
    }
  }

  return {
    json: {
      success: true,
      prompt,
      imageUrl,
      rawResponse: response,
    },
    binary: binaryData,
  };
}
