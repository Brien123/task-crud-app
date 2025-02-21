import { Body, Controller, Get, Param, Post, Put, Req, UseGuards, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './schemas/task.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { TaskListDto } from './dto/list-task.dto';
import { GetTaskDto } from './dto/get-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TasksService) {}

  @UseGuards(JwtAuthGuard) 
  @Post()
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: Request,
  ): Promise<Task> {
    const user = req.user as any;
    if (user && user.userId) {
      return this.taskService.createTask(createTaskDto, user.userId);
    }
    throw new Error('User not found');
  }

    // Get all tasks for the current user
    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllTasks(@Req() req: Request): Promise<TaskListDto[]> {
    const user = req.user as any;
    if (user && user.userId) {
        return this.taskService.getAllTasks(user.userId);
    }
    throw new Error('User not authorized');
    }

    // Get a single task
    @UseGuards(JwtAuthGuard)
    @Get(':taskId')
    async getTaskById(
    @Req() req: Request,): Promise<GetTaskDto> {
    const user = req.user as any;
    if (user && user.userId) {
        return this.taskService.getTaskById(req.params.taskId, user.userId);
    }
    throw new Error('User not authorized');
    }

    // Update a task
    @UseGuards(JwtAuthGuard)
    @Put(':taskId')
    async updateTask(
      @Body() updateTaskDto: UpdateTaskDto,
      @Req() req: Request
    ): Promise<GetTaskDto> {
      const user = req.user as any;
      if (user && user.userId) {
        const taskId = req.params.taskId;
        return this.taskService.updateTask(user.userId, taskId, updateTaskDto);
      }
      throw new Error('User not authorized');
    }

    // Delete a task
    @UseGuards(JwtAuthGuard)
    @Delete(':taskId')
    async deleteTask(
      @Req() req: Request
    ): Promise<void> {
      const user = req.user as any;
      if (user && user.userId) {
        const taskId = req.params.taskId;
        return this.taskService.deleteTask(user.userId, taskId);
      }
      throw new Error('User not authorized');
    }

}
