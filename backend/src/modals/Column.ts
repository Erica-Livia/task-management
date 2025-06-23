import { Entity, Column as TypeORMColumn, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Board } from './Board';
import { Task } from './Task';

@Entity('columns')
export class Column {
    @PrimaryGeneratedColumn()
    id!: number;

    @TypeORMColumn({ length: 100 })
    name!: string;

    @TypeORMColumn({ type: 'int' })
    position!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

    @ManyToOne(() => Board, (board) => board.columns, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'boardId' })
    board!: Board;

    @OneToMany(() => Task, (task) => task.column, { cascade: true })
    tasks!: Task[];
}