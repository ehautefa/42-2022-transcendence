
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm'
@Entity('questions')
export class Question extends BaseEntity {

    @PrimaryGeneratedColumn({
        comment: 'This is the id of question entity'
    })
    question_id: number;

    @Column({
        type: 'varchar',
    })
    question_name: string;


}