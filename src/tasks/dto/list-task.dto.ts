import { TaskStatus } from '../schemas/task.schema';

export class TaskListDto {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: Date;
}
