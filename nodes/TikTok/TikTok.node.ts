import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from "n8n-workflow";

import * as video from "./actions/Video";

export class TikTok implements INodeType {
  description: INodeTypeDescription = {
    displayName: "TikTok",
    name: "tikTok",
    icon: "file:tiktok.svg",
    group: ["transform"],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: "Upload videos to TikTok",
    defaults: {
      name: "TikTok",
    },
    inputs: ["main"],
    outputs: ["main"],
    credentials: [
      {
        name: "tiktokOAuth2Api",
        required: true,
      },
    ],
    properties: [
      {
        displayName: "Resource",
        name: "resource",
        type: "options",
        noDataExpression: true,
        options: [
          {
            name: "Video",
            value: "video",
            description: "Upload videos to TikTok",
          },
        ],
        default: "video",
      },
      ...video.description,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const resource = this.getNodeParameter("resource", 0) as string;
    const operation = this.getNodeParameter("operation", 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let responseData;

        if (resource === "video") {
          responseData = await video.execute.call(this, i, operation);
        }

        if (responseData) {
          if (Array.isArray(responseData)) {
            for (const item of responseData as INodeExecutionData[]) {
              returnData.push({
                ...item,
                pairedItem: item.pairedItem ?? { item: i },
              });
            }
          } else if (responseData.json !== undefined) {
            const itemData = responseData as INodeExecutionData;
            returnData.push({
              ...itemData,
              pairedItem: itemData.pairedItem ?? { item: i },
            });
          } else {
            returnData.push({
              json: responseData,
              pairedItem: { item: i },
            });
          }
        }
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: { error: (error as Error).message },
            pairedItem: { item: i },
          });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
