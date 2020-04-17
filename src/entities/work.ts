import {Author} from "./author";
import {BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryColumn} from "typeorm";

@Entity()
export class Work extends BaseEntity {
    @PrimaryColumn()
    doi: string;

    @Column("simple-array")
    title: string[];

    @ManyToMany(type => Author)
    @JoinTable()
    author: Author[];

    @Column('datetime')
    created: Date;
}
