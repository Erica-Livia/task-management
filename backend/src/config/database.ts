import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../modals/User';
import {Board} from "../modals/Board";
import {Column} from "../modals/Column";
import {Task} from "../modals/Task";
import {Subtask} from "../modals/Subtask";

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5433'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'task_management_db',
  synchronize: true, 
  entities: [User, Board, Column, Task, Subtask],

  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established successfully');
  } catch (error) {
    console.error('Error during database initialization', error);
    throw error;
  }
};