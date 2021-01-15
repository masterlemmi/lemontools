import { PersonSimple } from './person-simple';

export class Person {
    id : number;
firstName : String;
lastName : String;
nickname : String;
fullName : String;
initials : String;
photoUrl : String;
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
