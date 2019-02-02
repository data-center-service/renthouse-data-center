import { Controller, Get, Query } from '@nestjs/common';
import { ApiUseTags, ApiOperation, ApiResponse, ApiImplicitQuery } from '@nestjs/swagger';
import { MessagePattern } from '@nestjs/microservices';
import { AnjukeService } from '../service/anjuke.service';

@ApiUseTags('租房')
@Controller('rent_houses')
export class RentHouseController {

    constructor(
        private readonly anjukeService: AnjukeService,
    ) { }

}