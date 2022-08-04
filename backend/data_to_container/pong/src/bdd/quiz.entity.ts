import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Question } from "./question.entity";

@Entity('quizes')
export class Quiz extends BaseEntity {

    @PrimaryGeneratedColumn({
    comment: 'The quiz unique identifier'
})
id: number;

@Column({
    type: 'varchar',
})
title: string;

@Column({
    type: 'text',
})
description: string;

@OneToMany(() => Question, (question) => question.quiz)
questions: Question[];

}