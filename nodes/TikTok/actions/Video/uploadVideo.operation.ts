import type {
  IExecuteFunctions,
  INodeProperties,
  IDataObject,
  JsonObject,
} from "n8n-workflow";
import { NodeApiError, NodeOperationError } from "n8n-workflow";

export const description: INodeProperties[] = [
  {
    displayName: "Video Source",
    name: "videoSource",
    type: "options",
    options: [
      {
        name: "URL",
        value: "url",
        description: "Pull video from a public URL",
      },
      {
        name: "Binary Data",
        value: "binary",
        description: "Upload video from binary input",
      },
    ],
    default: "url",
    required: true,
    displayOptions: {
      show: {
        resource: ["video"],
        operation: ["uploadVideo"],
      },
    },
    description: "Source of the video to upload",
  },
  {
    displayName: "Video URL",
    name: "videoUrl",
    type: "string",
    default: "",
    required: true,
    displayOptions: {
      show: {
        resource: ["video"],
        operation: ["uploadVideo"],
        videoSource: ["url"],
      },
    },
    description: "Public URL of the video to upload",
  },
  {
    displayName: "Binary Property",
    name: "binaryProperty",
    type: "string",
    default: "data",
    required: true,
    displayOptions: {
      show: {
        resource: ["video"],
        operation: ["uploadVideo"],
        videoSource: ["binary"],
      },
    },
    description: "Name of the binary property containing the video file",
  },
  {
    displayName: "Title",
    name: "title",
    type: "string",
    default: "",
    required: true,
    displayOptions: {
      show: {
        resource: ["video"],
        operation: ["uploadVideo"],
      },
    },
    description: "Title/caption for the TikTok video (max 2200 characters)",
  },
  {
    displayName: "Additional Options",
    name: "additionalOptions",
    type: "collection",
    placeholder: "Add Option",
    default: {},
    displayOptions: {
      show: {
        resource: ["video"],
        operation: ["uploadVideo"],
      },
    },
    options: [
      {
        displayName: "Brand Content Toggle",
        name: "brandContentToggle",
        type: "boolean",
        default: false,
        description: "Whether this is branded content",
      },
      {
        displayName: "Brand Organic Toggle",
        name: "brandOrganicToggle",
        type: "boolean",
        default: false,
        description: "Whether this is organic branded content",
      },
      {
        displayName: "Disable Comments",
        name: "disableComments",
        type: "boolean",
        default: false,
        description: "Whether to disable comments on the video",
      },
      {
        displayName: "Disable Duet",
        name: "disableDuet",
        type: "boolean",
        default: false,
        description: "Whether to disable duets with this video",
      },
      {
        displayName: "Disable Stitch",
        name: "disableStitch",
        type: "boolean",
        default: false,
        description: "Whether to disable stitches with this video",
      },
      {
        displayName: "Privacy Level",
        name: "privacyLevel",
        type: "options",
        options: [
          { name: "Public", value: "PUBLIC_TO_EVERYONE" },
          { name: "Friends Only", value: "MUTUAL_FOLLOW_FRIENDS" },
          { name: "Private", value: "SELF_ONLY" },
        ],
        default: "PUBLIC_TO_EVERYONE",
        description: "Who can view this video",
      },
    ],
  },
];

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<IDataObject> {
  const videoSource = this.getNodeParameter("videoSource", index) as string;
  const title = this.getNodeParameter("title", index) as string;
  const additionalOptions = this.getNodeParameter(
    "additionalOptions",
    index,
    {},
  ) as IDataObject;

  const privacyLevel =
    (additionalOptions.privacyLevel as string) || "PUBLIC_TO_EVERYONE";
  const disableComments = additionalOptions.disableComments === true;
  const disableDuet = additionalOptions.disableDuet === true;
  const disableStitch = additionalOptions.disableStitch === true;
  const brandContentToggle = additionalOptions.brandContentToggle === true;
  const brandOrganicToggle = additionalOptions.brandOrganicToggle === true;

  const baseUrl = "https://open.tiktokapis.com";

  // Step 1: Initialize video upload
  const initBody: IDataObject = {
    post_info: {
      title,
      privacy_level: privacyLevel,
      disable_comment: disableComments,
      disable_duet: disableDuet,
      disable_stitch: disableStitch,
      brand_content_toggle: brandContentToggle,
      brand_organic_toggle: brandOrganicToggle,
    },
    source_info: {},
  };

  let videoBuffer: Buffer | undefined;

  if (videoSource === "url") {
    // Download video from URL and upload as file (avoids domain verification requirement)
    const videoUrl = this.getNodeParameter("videoUrl", index) as string;

    // Download the video
    let videoResponse: any;
    try {
      videoResponse = await this.helpers.httpRequest({
        method: "GET",
        url: videoUrl,
        encoding: "arraybuffer",
        returnFullResponse: true,
      });
    } catch (error) {
      throw new NodeApiError(this.getNode(), error as JsonObject, {
        itemIndex: index,
      });
    }
    videoBuffer = Buffer.from(videoResponse.body as ArrayBuffer);
    const fileSize = videoBuffer.length;

    (initBody.source_info as IDataObject).source = "FILE_UPLOAD";
    (initBody.source_info as IDataObject).video_size = fileSize;
    (initBody.source_info as IDataObject).chunk_size = fileSize;
    (initBody.source_info as IDataObject).total_chunk_count = 1;
  } else {
    // Binary upload - need to get file size first
    const binaryProperty = this.getNodeParameter(
      "binaryProperty",
      index,
    ) as string;
    this.helpers.assertBinaryData(index, binaryProperty);
    videoBuffer = await this.helpers.getBinaryDataBuffer(index, binaryProperty);
    const fileSize = videoBuffer.length;

    (initBody.source_info as IDataObject).source = "FILE_UPLOAD";
    (initBody.source_info as IDataObject).video_size = fileSize;
    (initBody.source_info as IDataObject).chunk_size = fileSize;
    (initBody.source_info as IDataObject).total_chunk_count = 1;
  }

  // Get credentials
  const credentials = await this.getCredentials("tiktokOAuth2Api");
  let accessToken = credentials.accessToken as string;
  const refreshToken = credentials.refreshToken as string;
  const clientKey = credentials.clientKey as string;
  const clientSecret = credentials.clientSecret as string;

  // Helper function to refresh token
  const refreshAccessToken = async (): Promise<string> => {
    let refreshResponse: any;
    try {
      refreshResponse = await this.helpers.httpRequest({
        method: "POST",
        url: "https://open.tiktokapis.com/v2/oauth/token/",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `client_key=${clientKey}&client_secret=${clientSecret}&grant_type=refresh_token&refresh_token=${refreshToken}`,
      });
    } catch (error) {
      throw new NodeApiError(this.getNode(), error as JsonObject, {
        itemIndex: index,
      });
    }
    if (refreshResponse.access_token) {
      return refreshResponse.access_token as string;
    }
    throw new NodeOperationError(
      this.getNode(),
      "Failed to refresh TikTok access token",
      {
        itemIndex: index,
      },
    );
  };

  // Try request, refresh token if needed
  let initResponse: any;
  try {
    // Use inbox endpoint (required for unaudited apps)
    const initHttpResponse = await this.helpers.httpRequest({
      method: "POST",
      url: `${baseUrl}/v2/post/publish/inbox/video/init/`,
      body: initBody,
      json: true,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      returnFullResponse: true,
      ignoreHttpStatusErrors: true,
    });

    // Check if token expired
    if (initHttpResponse.body?.error?.code === "access_token_invalid") {
      throw new NodeOperationError(this.getNode(), "Token expired", {
        itemIndex: index,
      });
    }

    // Get actual response body
    initResponse = (initHttpResponse.body || initHttpResponse) as IDataObject;
  } catch (error) {
    // Try refreshing token
    try {
      accessToken = await refreshAccessToken();
      let retryResponse: any;
      try {
        retryResponse = await this.helpers.httpRequest({
          method: "POST",
          url: `${baseUrl}/v2/post/publish/inbox/video/init/`,
          body: initBody,
          json: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          returnFullResponse: true,
          ignoreHttpStatusErrors: true,
        });
      } catch (retryError) {
        throw new NodeApiError(this.getNode(), retryError as JsonObject, {
          itemIndex: index,
        });
      }
      initResponse = retryResponse.body || retryResponse;
    } catch (refreshError) {
      if (
        refreshError instanceof NodeApiError ||
        refreshError instanceof NodeOperationError
      ) {
        throw refreshError;
      }
      throw new NodeApiError(this.getNode(), refreshError as JsonObject, {
        itemIndex: index,
        message: `TikTok API error: ${(error as Error).message}. Refresh also failed.`,
      });
    }
  }

  // Handle errors
  if (initResponse.error) {
    const errorCode = initResponse.error.code;
    const errorMsg =
      initResponse.error.message || JSON.stringify(initResponse.error);
    if (errorCode !== "ok") {
      throw new NodeApiError(this.getNode(), initResponse as JsonObject, {
        itemIndex: index,
        message: `TikTok API error [${errorCode}]: ${errorMsg}`,
      });
    }
  }

  // If response doesn't have expected structure, show what we got
  if (!initResponse.data && !initResponse.error) {
    throw new NodeOperationError(
      this.getNode(),
      `Unexpected TikTok response: ${JSON.stringify(initResponse)}`,
      { itemIndex: index },
    );
  }

  const publishId = initResponse.data?.publish_id;
  const uploadUrl = initResponse.data?.upload_url;

  // Upload video file to TikTok
  if (!uploadUrl) {
    throw new NodeOperationError(
      this.getNode(),
      "No upload URL returned from TikTok",
      { itemIndex: index },
    );
  }

  if (!videoBuffer) {
    throw new NodeOperationError(this.getNode(), "No video data to upload", {
      itemIndex: index,
    });
  }

  // Upload the video file
  let uploadResponse: any;
  try {
    uploadResponse = await this.helpers.httpRequest({
      method: "PUT",
      url: uploadUrl,
      body: videoBuffer,
      headers: {
        "Content-Type": "video/mp4",
        "Content-Range": `bytes 0-${videoBuffer.length - 1}/${videoBuffer.length}`,
      },
      returnFullResponse: true,
      ignoreHttpStatusErrors: true,
    });
  } catch (error) {
    throw new NodeApiError(this.getNode(), error as JsonObject, {
      itemIndex: index,
    });
  }

  // Check upload status using the status endpoint
  let statusResponse: any;
  try {
    statusResponse = await this.helpers.httpRequest({
      method: "POST",
      url: `${baseUrl}/v2/post/publish/status/fetch/`,
      body: { publish_id: publishId },
      json: true,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      returnFullResponse: true,
      ignoreHttpStatusErrors: true,
    });
  } catch (error) {
    throw new NodeApiError(this.getNode(), error as JsonObject, {
      itemIndex: index,
    });
  }

  const statusData = statusResponse.body || statusResponse;

  return {
    success: true,
    publishId,
    message: "Video uploaded to TikTok. Check status for details.",
    uploadStatus: uploadResponse.statusCode,
    processingStatus: statusData,
    initResponse,
    details: {
      title,
      privacyLevel,
      videoSource,
      videoSize: videoBuffer?.length,
    },
  };
}
