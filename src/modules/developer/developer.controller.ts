import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { DeveloperService } from './developer.service';
import { Developer } from '@prisma/client';
import { CreateDeveloperDto } from './dtos/create-developer.dto';
import { UpdateDeveloperDto } from './dtos/update-developer.dto';
import { DataResponse } from '@/common/types/data-response.type';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@/common/guards/auth.guard';

@ApiTags('developers')
@ApiBearerAuth()
@Controller('developers')
@UseGuards(AuthGuard)
export class DeveloperController {
  public constructor(private readonly developerService: DeveloperService) {}

  @Post('/')
  public async create(
    @Body() dto: CreateDeveloperDto,
  ): Promise<DataResponse<Developer>> {
    const developer = await this.developerService.create(dto);

    return {
      message: 'Developer created successfully',
      data: developer,
      status: HttpStatus.CREATED,
    };
  }

  @Get('/')
  public async find(): Promise<DataResponse<Developer[]>> {
    const developer = await this.developerService.find();

    return {
      message: 'Developer fetched successfully',
      data: developer,
      status: HttpStatus.OK,
    };
  }

  @Get('/:id')
  public async findById(
    @Param('id') id: string,
  ): Promise<DataResponse<Developer>> {
    const developer = await this.developerService.findById(id);

    return {
      message: 'Developer fetched successfully',
      data: developer,
      status: HttpStatus.OK,
    };
  }

  @Patch('/:id')
  public async update(
    @Param('id') id: string,
    @Body() dto: UpdateDeveloperDto,
  ): Promise<DataResponse<Developer>> {
    const developer = await this.developerService.update(id, dto);

    return {
      message: 'Developer updated successfully',
      data: developer,
      status: HttpStatus.OK,
    };
  }

  @Delete('/:id')
  public async delete(
    @Param('id') id: string,
  ): Promise<DataResponse<Developer>> {
    const developer = await this.developerService.delete(id);

    return {
      message: 'Developer deleted successfully',
      data: developer,
      status: HttpStatus.OK,
    };
  }
}
