import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { NotificationService } from './notification.service';

import { Notification } from '@prisma/client';

import { CreateNotificationDto } from './dtos/create-notification.dto';
import { UpdateNotificationDto } from './dtos/update-notification.dto';

import { DataResponse } from '@/common/types/data-response.type';

import { ApiTags } from '@nestjs/swagger';

import { MESSAGES } from '@/common/constants/messages.contants';

@ApiTags('notifications')
@Controller('notifications')
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

  @Get('/user/:userId')
  public async findByUserId(
    @Param('userId') userId: string,
  ): Promise<DataResponse<Notification[]>> {
    const notification = await this.notificationService.findByUserId(userId);

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
