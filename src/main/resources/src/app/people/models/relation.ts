import { PersonSimple } from "./person-simple";

export class Relation {
    
    constructor(n: string){
        this.label = n;
    }
    label: string;
    people: PersonSimple[] = [];
}
