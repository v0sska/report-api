import { ApiProperty } from '@nestjs/swagger';

export class DataResponse<T> {
  @ApiProperty()
  message: string;

  @ApiProperty()
  status: number;

  @ApiProperty()
  data: T;
}
