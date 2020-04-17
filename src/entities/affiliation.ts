import {BaseEntity, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class Affiliation extends BaseEntity {
    @PrimaryColumn()
    name: string;
}
