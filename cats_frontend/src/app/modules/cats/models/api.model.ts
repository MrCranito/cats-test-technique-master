import { ICat } from "./cat.model";

export interface IMetaParams {
    page?: number,
    search?: string,
    field?: string,
    filter?: IFilterParams
}

export interface IFilterParams {
    [key: string]: {
        value: string;
        matchMode: string;
    };
}

export interface IApiParams {
    [key: string]: string;
}

export interface IApiResult {
    results: ICat[];
    count: number;
    next?: string;
    previous?: string;
}