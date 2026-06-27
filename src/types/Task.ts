export type TaskType =
  | "med"
  | "vet"
  | "procedure1"
  | "procedure2"
  | "procedure3"
  | "procedure4";

export interface Task {
  id: number;
  petId: number;
  title: string;
  description?: string;
  date: string;
  time: string;
  completed: boolean;
  type: TaskType;
}
