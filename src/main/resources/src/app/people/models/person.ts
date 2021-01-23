import { PersonSimple } from './person-simple';

export class Person {
    id : number;
firstName : String;
lastName : String;
nickname : String;
gender: string;
fullName : String;
initials : String;
photo : string;
photoUrl : string;
email : String;
address : String;
age : number;
deceased : boolean;
dateOfBirth : Date;
dateOfDeath : Date;
parents : PersonSimple[];
children : PersonSimple[]; //possibility of multiple parents
siblings : PersonSimple[];
relationships: Object[];
links: Object[]
notes : String;

}
