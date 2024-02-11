export interface IApiParams {
    page?: number,
    search?: string,
    field?: string,
    filters?: { [key: string]: {value: string, matchMode: string}}
}