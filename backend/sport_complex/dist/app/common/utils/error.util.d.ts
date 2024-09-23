import { Builder } from "../lib/builder";
export declare enum ErrorMethod {
    duplicated = "duplicated",
    notFound = "notFound"
}
export declare enum RequestAction {
    create = "creating",
    update = "updating"
}
type ErrorParamsMap = {
    [ErrorMethod.duplicated]: {
        action: RequestAction;
    };
    [ErrorMethod.notFound]: {
        id: string;
    };
};
export type ExtractErrorMethod<T extends ErrorMethod> = T extends keyof ErrorParamsMap ? ErrorParamsMap[T] : never;
export declare class ErrorBuilder extends Builder {
    build<Method extends ErrorMethod>(method: Method, options?: ExtractErrorMethod<Method>): string;
}
export {};
