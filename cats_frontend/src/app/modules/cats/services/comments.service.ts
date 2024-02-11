import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IComment } from "../models/comment.model";
import { Observable, map } from "rxjs";
import { environment } from "src/app/environment/environment";

@Injectable({
    providedIn: 'root'
})
export class CommentsService {
    constructor(private http: HttpClient) { }

    get(catId: string): Observable<IComment[]> {
        return this.http.get(`${environment.api_url}/v1/comments/`, {
            params: {
                cat: catId
            }
        }).pipe(map((data: any ) => {
            let results: IComment[] = [];
            for(let item of data.results) {
                results.push({
                    id: item.id,
                    cat: item.cat,
                    text: item.text, 
                    note: item.note
                });
            }
            return results;
        }));
    }

    create(comment: IComment): Observable<IComment> {
        return this.http.post<IComment>(`${environment.api_url}/v1/comments/`, comment);
    }

    update(comment: IComment): Observable<IComment> {
        return this.http.patch<IComment>(`${environment.api_url}/v1/comments/${comment.id}/`, comment);
    }

    delete(id: string): Observable<any> {
        return this.http.delete(`${environment.api_url}/v1/comments/${id}/`);
    }
}