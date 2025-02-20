import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { Model } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { User } from 'src/users/schemas/user.schema';
import { TaskListDto } from './dto/list-task.dto';
import { GetTaskDto } from './dto/get-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
    constructor(
        @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
        @InjectModel(User.name) private readonly userModel: Model<User>,
      ) {}

    // Create a new task
    async createTask(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
        console.log(userId)
        // Check if the user exists
        const user = await this.userModel.findById(userId);
        if (!user) {
        throw new Error('User not found');
        }

        // Create a new task with the user reference
        const newTask = new this.taskModel({
        ...createTaskDto,
        user: user._id,
        });

        // Save the task to the database
        return newTask.save();
    }

    // Fetch all tasks for a user
    async getAllTasks(userId: string): Promise<TaskListDto[]> {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const tasks = await this.taskModel.find({ user: user._id }).exec();

        // Map tasks to the DTO format
        return tasks.map(task => {
        return {
            id: task._id.toString(),
            title: task.title,
            description: task.description,
            status: task.status,
            createdAt: task.createdAt,
        };
        });
    }

    // Fetch a single task
    async getTaskById(taskId: string, userId: string): Promise<GetTaskDto> {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        
        const task = await this.taskModel.findOne({ _id: taskId, user: user._id }).exec();
        if (!task) {
            throw new Error('Task not found');
        }
        return {
            id: task._id.toString(),
            title: task.title,
            description: task.description,
            status: task.status,
            createdAt: task.createdAt,
        };
    }

  // Update a task (Only if it belongs to the user)
  async updateTask(userId: string, taskId: string, updateTaskDto: UpdateTaskDto): Promise<GetTaskDto> {
    const user = await this.userModel.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    const task = await this.taskModel.findOne({ _id: taskId, user: user._id });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    Object.assign(task, updateTaskDto);
    const savedTask = await task.save();
    return {
        id: savedTask._id.toString(),
        title: savedTask.title,
        description: savedTask.description,
        status: savedTask.status,
        createdAt: savedTask.createdAt,
    };
  }

  // Delete a task (Only if it belongs to the user)
    async deleteTask(userId: string, taskId: string): Promise<void> {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const task = await this.taskModel.findOne({ _id: taskId, user: user._id });
        if (!task) {
            throw new NotFoundException('Task not found');
        }
        await this.taskModel.deleteOne({ _id: taskId, user: user._id }).exec();
    }

}
