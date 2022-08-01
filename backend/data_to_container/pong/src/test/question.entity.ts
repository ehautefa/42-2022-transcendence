
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { Quiz } from './quiz.entity';
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

    @ManyToOne(() => Quiz, (quiz) => quiz.questions)
    quiz: Quiz

}