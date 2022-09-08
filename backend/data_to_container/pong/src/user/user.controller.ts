import { Body, Controller, Get, Param, Post, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { user } from 'src/bdd/users.entity';
import { ChangeUserNameDto } from './dto/changeUserName.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { EndOfMatchDto } from './dto/endOfMatch.dto';
import { FlipTwoFactorAuthDto } from './dto/flipTwoFactorAuyh.dto';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
    constructor( private readonly UserService : UserService ) {}

    @Get('all')
    @ApiOperation({ summary: 'Get all user of the table' })
    @ApiResponse({ status: 200, description: 'Found users', type: user })
    async getAllUser() : Promise<user[]>{
        return await this.UserService.getAllUser();
    }

    @Get('/:userUid')
    @ApiOperation({ summary: 'Get user by userUid' })
    @ApiResponse({ status: 200, description: 'Found user by uid', type: user })
    @UsePipes(ValidationPipe)
    async getUser(@Param('userUid') userUid : string) : Promise<user> {
        return await this.UserService.getUser(userUid);
    }

    @Post('create')
    @ApiOperation({ summary: 'Create a new user' })
    @ApiParam({ name: 'CreateUserDto', type: CreateUserDto })
    @ApiResponse({ status: 200, description: 'The created user', type: user })
    @UsePipes(ValidationPipe)
    async createUser(@Body() UserToCreate : CreateUserDto) : Promise<user> {
        return await this.UserService.createUser(UserToCreate);
    }

    @Post('changeUsername')
    @ApiOperation({ summary: 'Change the username of the user' })
    @ApiParam({ name: 'ChangeUserNameDto', type: ChangeUserNameDto })
    @UsePipes(ValidationPipe)
    async changeUserName(@Body() userToChange : ChangeUserNameDto) {
        return await this.UserService.changeUserName(userToChange);
    }

    @Post('flipTwoFactorAuth')
    @UsePipes(ValidationPipe)
    async flipTwoFactorAuth(@Body() userToChange : FlipTwoFactorAuthDto) {
        return await this.UserService.flipTwoFactorAuth(userToChange);
    }

    @Post('endOfMatch')
    @ApiOperation({ summary: 'Save score at the end of the match' })
    @ApiParam({ name: 'EndOfMatchDto', type: EndOfMatchDto })
    @UsePipes(ValidationPipe)
    async endOfMatch(@Body() players : EndOfMatchDto) : Promise<void> {
        return await this.UserService.endOfMatch(players);
    }

}
