import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { NotificationService } from './notification.service';

import { Notification } from '@prisma/client';

import { CreateNotificationDto } from './dtos/create-notification.dto';
import { UpdateNotificationDto } from './dtos/update-notification.dto';

import { DataResponse } from '@/common/types/data-response.type';

import { ApiTags } from '@nestjs/swagger';

import { MESSAGES } from '@/common/constants/messages.contants';

import { Request } from 'express';

import { AuthGuard } from '@/common/guards/auth.guard';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationController {
  public constructor(
    private readonly notificationService: NotificationService,
  ) {}

  @Post('/')
  public async create(
    @Body() dto: CreateNotificationDto,
  ): Promise<DataResponse<Notification>> {
    const notification = await this.notificationService.create(dto);

    return {
      message: MESSAGES.CREATED,
      data: notification,
      status: HttpStatus.CREATED,
    };
  }

  @Get('/')
  public async find(): Promise<DataResponse<Notification[]>> {
    const notification = await this.notificationService.find();

    return {
      message: MESSAGES.FETCHED,
      data: notification,
      status: HttpStatus.OK,
    };
  }

  @Get('/report/:reportId')
  public async findByReportId(
    @Param('reportId') reportId: string,
  ): Promise<DataResponse<Notification[]>> {
    const notification =
      await this.notificationService.findByReportId(reportId);

    return {
      message: MESSAGES.FETCHED,
      data: notification,
      status: HttpStatus.OK,
    };
  }

  @Get('from')
  public async findByFromUserId(
    @Req() request: Request,
  ): Promise<DataResponse<Notification[]>> {
    const { id } = request['user'];
    const notification = await this.notificationService.findByFromUserId(id);

    return {
      message: MESSAGES.FETCHED,
      data: notification,
      status: HttpStatus.OK,
    };
  }

  @Get('to')
  public async findByToUserId(
    @Req() request: Request,
  ): Promise<DataResponse<Notification[]>> {
    const { id } = request['user'];
    const notification = await this.notificationService.findByToUserId(id);

    return {
      message: MESSAGES.FETCHED,
      data: notification,
      status: HttpStatus.OK,
    };
  }

  @Get('/:id')
  public async findById(
    @Param('id') id: string,
  ): Promise<DataResponse<Notification>> {
    const notification = await this.notificationService.findById(id);

    return {
      message: MESSAGES.FETCHED,
      data: notification,
      status: HttpStatus.OK,
    };
  }

  @Patch('/:id')
  public async update(
    @Param('id') id: string,
    @Body() dto: UpdateNotificationDto,
  ): Promise<DataResponse<Notification>> {
    const notification = await this.notificationService.update(id, dto);

    return {
      message: MESSAGES.UPDATED,
      data: notification,
      status: HttpStatus.OK,
    };
  }

  @Delete('/:id')
  public async delete(
    @Param('id') id: string,
  ): Promise<DataResponse<Notification>> {
    const notification = await this.notificationService.delete(id);

    return {
      message: MESSAGES.DELETED,
      data: notification,
      status: HttpStatus.OK,
    };
  }
}
