import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiService {
    receiveCode(code : string) : string
    {
        console.log(code)
        return code;
    }
}