export interface IApiParams {
    page?: number,
    search?: string,
    field?: string,
    filter?: { [key: string]: {value: string, matchMode: string}}
}