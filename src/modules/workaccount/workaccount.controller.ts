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
import { WorkAccountService } from './workaccount.service';
import { WorkAccount } from '@prisma/client';
import { CreateWorkAccountDto } from './dtos/create-workaccount.dto';
import { UpdateWorkAccountDto } from './dtos/update-workaccount.dto';
import { DataResponse } from '@/common/types/data-response.type';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@/common/guards/auth.guard';

@ApiTags('workaccounts')
@Controller('workaccounts')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class WorkAccountController {
  public constructor(private readonly workaccountService: WorkAccountService) {}

  @Post('/')
  public async create(
    @Body() dto: CreateWorkAccountDto,
  ): Promise<DataResponse<WorkAccount>> {
    const workaccount = await this.workaccountService.create(dto);

    return {
      message: 'WorkAccount created successfully',
      data: workaccount,
      status: HttpStatus.CREATED,
    };
  }

  @Get('/')
  public async find(): Promise<DataResponse<WorkAccount[]>> {
    const workaccount = await this.workaccountService.find();

    return {
      message: 'WorkAccount fetched successfully',
      data: workaccount,
      status: HttpStatus.OK,
    };
  }

  @Get('/sale/:saleId')
  public async findBySaleId(
    @Param('saleId') saleId: string,
  ): Promise<DataResponse<WorkAccount[]>> {
    const workaccount = await this.workaccountService.findBySaleId(saleId);

    return {
      message: 'WorkAccount fetched successfully',
      data: workaccount,
      status: HttpStatus.OK,
    };
  }

  @Get('/:id')
  public async findById(
    @Param('id') id: string,
  ): Promise<DataResponse<WorkAccount>> {
    const workaccount = await this.workaccountService.findById(id);

    return {
      message: 'WorkAccount fetched successfully',
      data: workaccount,
      status: HttpStatus.OK,
    };
  }

  @Patch('/:id')
  public async update(
    @Param('id') id: string,
    @Body() dto: UpdateWorkAccountDto,
  ): Promise<DataResponse<WorkAccount>> {
    const workaccount = await this.workaccountService.update(id, dto);

    return {
      message: 'WorkAccount updated successfully',
      data: workaccount,
      status: HttpStatus.OK,
    };
  }

  @Delete('/:id')
  public async delete(
    @Param('id') id: string,
  ): Promise<DataResponse<WorkAccount>> {
    const workaccount = await this.workaccountService.delete(id);

    return {
      message: 'WorkAccount deleted successfully',
      data: workaccount,
      status: HttpStatus.OK,
    };
  }
}
