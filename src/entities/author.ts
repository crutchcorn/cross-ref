import {Affiliation} from "./affiliation";
import {BaseEntity, Entity} from "typeorm";

@Entity()
export class Author extends BaseEntity {
    given: string;
    family: string;
    sequence: string;
    affiliation: Affiliation[];
}
