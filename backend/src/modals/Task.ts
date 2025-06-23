import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Column as BoardColumn } from './Column';
import { Subtask } from './Subtask';

@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 255 })
    title!: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ length: 100 })
    status!: string;

    @Column({ type: 'int' })
    position!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt?: Date;


    @ManyToOne(() => BoardColumn, (column) => column.tasks, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'columnId' })
    column!: BoardColumn;

    @OneToMany(() => Subtask, (subtask) => subtask.task, { cascade: true })
    subtasks!: Subtask[];
}