import { IComment } from "./comment.model";

export interface ICat {
    id: number;
    name: string;
    breed: string;
    description: string;
    birthday: string;
    avg_rating: number;
    comments?: IComment[];
}