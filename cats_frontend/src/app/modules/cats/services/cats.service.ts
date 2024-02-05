import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ICat } from "../models/cat.model";
import { Observable } from "rxjs";
import { environment } from "src/app/environment/environment";

@Injectable({
    providedIn: 'root'
})
export class CatsService {
    constructor(private http: HttpClient) { }

    get(): Observable<ICat[]> {
        return this.http.get<ICat[]>(`${environment.api_url}/v1/cats`);
    }

    create(cat: ICat): Observable<ICat> {
        return this.http.post<ICat>(`${environment.api_url}/v1/cats`, cat);
    }

    update(cat: ICat): Observable<ICat> {
        return this.http.patch<ICat>(`${environment.api_url}/v1/cats/${cat.id}`, cat);
    }

    delete(id: number): Observable<any> {
        return this.http.delete(`${environment.api_url}/v1/cats/${id}`);
    }
}