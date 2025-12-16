import type { IExecuteFunctions, IDataObject, INodeProperties } from 'n8n-workflow';
export declare const description: INodeProperties[];
export declare function execute(this: IExecuteFunctions, index: number, operation: string): Promise<IDataObject>;
