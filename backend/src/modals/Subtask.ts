import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Task } from './Task';

@Entity('subtasks')
export class Subtask {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 255 })
    title!: string;

    @Column({ default: false })
    isCompleted!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

    @ManyToOne(() => Task, (task) => task.subtasks, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'taskId' })
    task!: Task;
}