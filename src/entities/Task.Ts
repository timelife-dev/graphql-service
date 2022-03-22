import { ObjectType, Field } from "type-graphql";
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@ObjectType()
@Entity()
export class Task extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  summary: string;

  @Field()
  @Column({ nullable: true, default: "" })
  description: string;

  @Field(() => String, {nullable:true})
  @Column({ nullable: true, type: "timestamptz"})
  dueDate: Date;

  @Field(() => String)
  @Column()
  @CreateDateColumn()
  createdDate: Date;

  @Field(() => String)
  @Column()
  @UpdateDateColumn()
  updatedDate: Date;
}
