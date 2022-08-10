import { Body, Controller, Get, Param, Post, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { user } from 'src/bdd/users.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { EndOfMatchDto } from './dto/endOfMatch.dto';
import { getUserDto } from './dto/getUser';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor( private readonly UserService : UserService ) {}

    @Get('all')
    async getAllUser() : Promise<user[]>{
        return await this.UserService.getAllUser();
    }

    @Get('/:userUid')
    @UsePipes(ValidationPipe)
    async getUser(@Param('userUid') userUid : string) : Promise<user> {
        return await this.UserService.getUser(userUid);
    }

    @Post('create')
    @UsePipes(ValidationPipe)
    async createUser(@Body() UserToCreate : CreateUserDto) : Promise<user> {
        return await this.UserService.createUser(UserToCreate);
    }

    @Post('endOfMatch')
    @UsePipes(ValidationPipe)
    async endOfMatch(@Body() players : EndOfMatchDto) : Promise<void> {
        return await this.UserService.endOfMatch(players);
    }

    // @Post('changeName')
    // @UsePipes(ValidationPipe)
    // async changeUserName(@Body() body)
    // {
        // return await this.UserService.changeUserName(body);
    // }
}
