import { Controller, Post } from '@nestjs/common';
import { ApiService } from './api.service';

@Controller('api')
export class ApiController {
    constructor(private readonly apiService : ApiService) {}

    @Post('code')
    receiveCode()
    {
        return this.apiService.receive_code()
    }

}
