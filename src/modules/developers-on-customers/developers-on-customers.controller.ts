import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {DevelopersOnCustomersService} from './developers-on-customers.service';
import { DevelopersOnCustomers } from '@prisma/client';
import { DataResponse } from '@/common/types/data-response.type';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@/common/guards/auth.guard';

@ApiTags('assign-developers-on-customers')
@Controller('assign')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class DevelopersOnCustomersController {
  public constructor(private readonly developersoncustomersService: DevelopersOnCustomersService) {}

  @Get('/')
  public async find(): Promise<DataResponse<DevelopersOnCustomers[]>> {
    const developersoncustomers = await this.developersoncustomersService.find();

    return {
      message: 'DevelopersOnCustomers fetched successfully',
      data: developersoncustomers,
      status: HttpStatus.OK,
    };
  }

  @Get('/customer')
  public async findByDeveloperId(@Query('customer-id') id: string): Promise<DataResponse<DevelopersOnCustomers[]>> {
	const developersOnCustomers = await this.developersoncustomersService.findByCustomerId(id);


    return {
      message: 'DevelopersOnCustomers fetched successfully',
      data: developersOnCustomers,
      status: HttpStatus.OK,
    };
  }

  @Get('/developer')
  public async findByCustomerId(@Query('developer-id') id: string): Promise<DataResponse<DevelopersOnCustomers[]>> {
    const developersOnCustomers = await this.developersoncustomersService.findByDeveloperId(id);

	return {
	  message: 'DevelopersOnCustomers fetched successfully',
	  data: developersOnCustomers,
	  status: HttpStatus.OK,
	};
  }
}
