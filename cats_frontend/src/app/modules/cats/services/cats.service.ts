import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ICat } from "../models/cat.model";
import { Observable, map } from "rxjs";
import { environment } from "src/app/environment/environment";

@Injectable({
    providedIn: 'root'
})
export class CatsService {
    constructor(private http: HttpClient) { }

    get(
        page?: number,
        search?: string,
        field?: string,
        filter?: { [key: string]: {value: string, matchMode: string}}
    ): Observable<{ cats: ICat[], count: number}> {


        const params: {[key: string]: any} = {};

        if(page) {
            params['page'] = page;
        }

        if(search) {
            params['search'] = search;
        }

        if(field) {
            params['ordering'] = field;
        }

        if(filter) {
            console.log(filter);
            for(let key in filter) {
                if(filter[key].value) {
                    if(key === 'breed') {
                    
                        switch(filter[key].matchMode) {
                            case 'in':
                                params[key + '__in'] = filter[key].value
                                break;
                            case 'contains':
                                params[key + '__contains'] = filter[key].value
                                break;
                        }
                    } else if(key === 'avg_rating') {
                        switch(filter[key].matchMode) {
                            case 'gte':
                                params[key + '__gte'] = filter[key].value
                                break;
                            case 'lte':
                                params[key + '__lte'] = filter[key].value
                                break;
                            case 'gt':
                                params[key + '__gt'] = filter[key].value
                                break;
                            case 'lt':
                                params[key + '__lt'] = filter[key].value
                                break;
                        }
                    }   
                }
            }
        }

        return this.http.get(`${environment.api_url}/v1/cats/`, {
            params: params,
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