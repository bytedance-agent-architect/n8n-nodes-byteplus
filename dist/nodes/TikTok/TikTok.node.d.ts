import type { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
export declare class TikTok implements INodeType {
    description: INodeTypeDescription;
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
