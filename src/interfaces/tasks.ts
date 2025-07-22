import { Timestamp } from '@angular/fire/firestore';

/**
 * Interface for task data with ID.
 */
export interface Tasks {
  id: string;
  assignedTo: string[];
  category: string;
  date: Timestamp;
  description: string;
  priority: string;
  status: string;
  subtasks: { title: string; done: boolean }[];
  title: string;
}

/**
 * Interface for task data stored in Firestore.
 */
export interface TasksFirestoreData {
  assignedTo?: string[];
  category?: string;
  date?: Date | Timestamp;
  description?: string;
  priority?: string;
  subtasks?: { title: string; done: boolean }[];
  title?: string;
  status?: string;
}

/**
 * Interface for subtask items within tasks.
 */
export interface Subtask {
  title: string;
  done: boolean;
}
