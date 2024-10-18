export declare function getObjectValue(obj: Record<string, any>, path: string, throwError?: boolean): any;
export declare function assignObjectValue(obj: Record<string, any>, path: string, value: any, throwError?: boolean): Record<string, any>;
export declare function flattenObject(obj: any, parentKey?: string): Record<string, any>;
