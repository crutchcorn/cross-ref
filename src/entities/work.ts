import {Author} from "./author";
import {BaseEntity, Entity} from "typeorm";

@Entity()
export class Work extends BaseEntity {
    doi: string;
    title: string[];
    author: Author;
    created: Date;
}
