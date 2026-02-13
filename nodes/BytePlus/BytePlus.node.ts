import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from "n8n-workflow";

import * as image from "./actions/Image";
import * as video from "./actions/Video";
import * as text from "./actions/Text";

export class BytePlus implements INodeType {
  description: INodeTypeDescription = {
    displayName: "BytePlus",
    name: "bytePlus",
    icon: "file:byteplus.svg",
    group: ["transform"],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description:
      "BytePlus AI Services - Image Generation, Video Generation, and Text Generation",
    defaults: {
      name: "BytePlus",
    },
    inputs: ["main"],
    outputs: ["main"],
    credentials: [
      {
        name: "bytePlusApi",
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
            name: "Image",
            value: "image",
            description: "Generate an image",
          },
          {
            name: "Video",
            value: "video",
            description: "Generate a video",
          },
          {
            name: "Text",
            value: "text",
            description: "Message a model",
          },
        ],
        default: "text",
      },
      // Image operations
      ...image.description,
      // Text operations
      ...text.description,
      // Video operations
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

        if (resource === "image") {
          responseData = await image.execute.call(this, i, operation);
        } else if (resource === "text") {
          responseData = await text.execute.call(this, i, operation);
        } else if (resource === "video") {
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
            // Already formatted as INodeExecutionData (has json/binary properties)
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
