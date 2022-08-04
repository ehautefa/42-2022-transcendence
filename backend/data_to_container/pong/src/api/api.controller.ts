import { Controller, Param, Post } from '@nestjs/common';
import { ApiService } from './api.service';

@Controller('api')
export class ApiController {
    constructor(private readonly apiService : ApiService) {}

    @Post('code/:value')
    receiveCode()
    {
        // return this.apiService.receiveCode()
    }

}
