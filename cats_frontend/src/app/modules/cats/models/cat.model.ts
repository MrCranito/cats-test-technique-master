import { IComment } from "./comment.model";

export interface ICat {
    id?: string;
    name: string;
    breed: string;
    birthday: string;
    description: string;
    avg_rating?: number;
    comments?: IComment[];
}