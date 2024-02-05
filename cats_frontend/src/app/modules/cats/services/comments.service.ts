import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IComment } from "../models/comment.model";
import { Observable } from "rxjs";
import { environment } from "src/app/environment/environment";

@Injectable({
    providedIn: 'root'
})
export class CommentsService {
    constructor(private http: HttpClient) { }

    get(): Observable<IComment[]> {
        return this.http.get<IComment[]>(`${environment.api_url}/v1/comments/`);
    }

    create(comment: IComment): Observable<IComment> {
        return this.http.post<IComment>(`${environment.api_url}/v1/comments/`, comment);
    }

    update(comment: IComment): Observable<IComment> {
        return this.http.patch<IComment>(`${environment.api_url}/v1/comments/${comment.id}/`, comment);
    }

    delete(id: number): Observable<any> {
        return this.http.delete(`${environment.api_url}/v1/comments/${id}/`);
    }
}