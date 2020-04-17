import {Affiliation} from "./affiliation";
import {BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Author extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

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
