import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ICat } from "../models/cat.model";
import { Observable, map } from "rxjs";
import { environment } from "src/app/environment/environment";
import { IApiParams } from "../models/api.model";

@Injectable({
    providedIn: 'root'
})
export class CatsService {
    constructor(private http: HttpClient) { }

    get(
        params?: IApiParams,
    ): Observable<{ cats: ICat[], count: number}> {


        const apiParams: {[key: string]: any} = {};

        if(params?.page) {
            apiParams['page'] = params.page;
        }

        if(params?.search) {
            apiParams['search'] = params.search;
        }

        if(params?.field) {
            apiParams['ordering'] = params.field;
        }

        if(params?.filter) {
            for(let key in params.filter) {
                if(params.filter[key].value) {
                    if(key === 'breed') {
                        switch(params.filter[key].matchMode) {
                            case 'in':
                                apiParams[key + '__in'] = params.filter[key].value
                                break;
                            case 'contains':
                                apiParams[key + '__contains'] = params.filter[key].value
                                break;
                        }
                    } else if(key === 'avg_rating') {
                        switch(params.filter[key].matchMode) {
                            case 'gte':
                                apiParams[key + '__gte'] = params.filter[key].value
                                break;
                            case 'lte':
                                apiParams[key + '__lte'] = params.filter[key].value
                                break;
                            case 'gt':
                                apiParams[key + '__gt'] = params.filter[key].value
                                break;
                            case 'lt':
                                apiParams[key + '__lt'] = params.filter[key].value
                                break;
                        }
                    }   
                }
            }
        }

        return this.http.get(`${environment.api_url}/v1/cats/`, {
            params: apiParams,
        }).pipe(map((data: any ) => {
            let results: ICat[] = [];
            for(let item of data.results) {
                results.push({
                    id: item.id,
                    name: item.name,
                    breed: item.breed,
                    birthday: item.birthday,
                    description: item.description,
                    avg_rating: item.avg_rating,
                });
            }
            return {cats: results, count: data.count};
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