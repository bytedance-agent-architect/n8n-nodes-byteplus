import type { INodeProperties } from 'n8n-workflow';
import * as analyzeImage from './analyzeImage.operation';
export declare const description: INodeProperties[];
export { analyzeImage };
export declare function execute(this: import('n8n-workflow').IExecuteFunctions, index: number, operation: string): Promise<import("n8n-workflow").IDataObject>;
