import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ICat } from "../models/cat.model";
import { Observable, map } from "rxjs";
import { environment } from "src/app/environment/environment";
import { IApiParams, IApiResult, IMetaParams } from "../models/api.model";

@Injectable({
    providedIn: 'root'
})
export class CatsService {
    constructor(private http: HttpClient) { }

    get(
        params?: IMetaParams,
    ): Observable<{ cats: ICat[], count: number}> {

        const apiParams: IApiParams = {};

        if(params?.page) {
            apiParams['page'] = params.page.toString();
        }

        if(params?.search) {
            apiParams['search'] = params.search;
        }

        if(params?.field) {
            apiParams['ordering'] = params.field;
        }

        if (params?.filter) {
            const { filter } = params;
            for (const key in filter) {
                const { value, matchMode } = filter[key];
                if (value) {
                    apiParams[`${key}__${matchMode}`] = value;
                }
            }
        }

        return this.http.get<IApiResult>(`${environment.api_url}/v1/cats/`, {
            params: apiParams,
        }).pipe(map((data: IApiResult ) => {
            return {cats: data.results, count: data.count};
        }));
    }

    create(cat: ICat): Observable<ICat> {
        return this.http.post<ICat>(`${environment.api_url}/v1/cats/`, cat);
    }

    update(cat: ICat): Observable<ICat> {
        return this.http.patch<ICat>(`${environment.api_url}/v1/cats/${cat.id}/`, cat);
    }

    delete(id: string): Observable<any> {
        return this.http.delete(`${environment.api_url}/v1/cats/${id}/`);
    }
}