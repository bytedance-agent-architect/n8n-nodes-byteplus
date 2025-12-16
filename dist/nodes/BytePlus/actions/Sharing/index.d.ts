import type { INodeProperties } from 'n8n-workflow';
import * as publishToTikTok from './publishToTikTok.operation';
export declare const description: INodeProperties[];
export { publishToTikTok };
export declare function execute(this: import('n8n-workflow').IExecuteFunctions, index: number, operation: string): Promise<import("n8n-workflow").IDataObject>;
