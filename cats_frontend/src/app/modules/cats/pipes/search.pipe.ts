import { Pipe, PipeTransform } from "@angular/core";
import { ICat } from "../models/cat.model";

@Pipe({
    name: 'search'
})
export class SearchPipe implements PipeTransform{
    
    transform(cats: ICat[], search: string): any[] {
        if (!cats || !search) {
            return cats;
        }
    
        search = search.toLowerCase();
    
        return cats.filter(item => {
            const itemName = item.name.toLowerCase();
            return itemName.includes(search);
        });
    }
    
}