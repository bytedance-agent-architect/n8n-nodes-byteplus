import type { INodeProperties } from 'n8n-workflow';
import * as generateImage from './generateImage.operation';
export declare const description: INodeProperties[];
export { generateImage };
export declare function execute(this: import('n8n-workflow').IExecuteFunctions, index: number, operation: string): Promise<import("n8n-workflow").INodeExecutionData>;
