import {Affiliation} from "./affiliation";
import {BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryColumn} from "typeorm";

@Entity()
export class Author extends BaseEntity {
    @PrimaryColumn()
    // A v3 UUID
    uuid: string;

    @Column()
    given: string;

    @Column()
    family: string;

    @Column()
    sequence: string;

    @ManyToMany(type => Affiliation)
    @JoinTable()
    affiliation: Affiliation[];
}
