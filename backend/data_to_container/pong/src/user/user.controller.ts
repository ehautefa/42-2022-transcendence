import { Body, Controller, Get, Inject, Param, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { user } from 'src/bdd/users.entity';
import { ChangeUserNameDto } from './dto/changeUserName.dto';
import { EndOfMatchDto } from './dto/endOfMatch.dto';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { FindOrCreateUserDto } from './dto/findOrCreate.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { HandleFriendDto } from './dto/handleFriend.dto';
import { StatusGateway } from 'src/status/status.gateway';

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly UserService: UserService) { }

  @Inject(StatusGateway)
  private readonly StatusGateway: StatusGateway;

  @Get('all')
  @ApiOperation({ summary: 'Get all user of the table' })
  @ApiResponse({ status: 200, description: 'Found users', type: user })
  @UseGuards(JwtAuthGuard)
  async getAllUser(): Promise<user[]> {
    return await this.UserService.getAllUser();
  }

  @Get('allUuidWithUserName')
  @ApiOperation({ summary: 'Get all user Uuid of the table' })
  @UseGuards(JwtAuthGuard)
  async getAllUserUuidWithUserName() {
    return await this.UserService.getAllUserUuidWithUserName();
  }

  @Get('me')
  @ApiOperation({ summary: 'Get me (from cookie)' })
  @ApiResponse({ status: 200, description: 'Found user by uid', type: user })
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req, @Res() res) {
    res.send(req.user);
  }

  @Get('myFriends')
  @ApiOperation({ summary: 'Get myFriends (from cookie)' })
  @UseGuards(JwtAuthGuard)
  async getMyFriends(@Req() req, @Res() res) {
    res.send(req.user.friends);
  }

  @Get('friends/:userUuid')
  @ApiOperation({ summary: 'Get friends of a user' })
  @ApiParam({ name: 'userUuid', type: String })
  @UseGuards(JwtAuthGuard)
  async getFriends(@Req() req, @Param('userUuid') userUuid: string) {
    return await this.UserService.getFriends(userUuid);
  }

  @Get('myBlocked')
  @ApiOperation({ summary: 'Get myblocked (from cookie)' })
  @UseGuards(JwtAuthGuard)
  async getMyblocked(@Req() req, @Res() res) {
    res.send(req.blocked);
  }

  // @Post('addFriend')
  // @ApiOperation({ summary: 'Add Friend(with uUid) to me (from cookie)' })
  // @UseGuards(JwtAuthGuard)
  // @UsePipes(ValidationPipe)
  // async addFriend(@Req() req, @Res() res, @Body() userToHandle: HandleFriendDto) {
  //   console.log("User COntroller addFriend", req.user, userToHandle)
  // res.send(this.UserService.addFriend(req.user, userToHandle.userUuidToHandle));
  // }

  @Post('addBlocked')
  @ApiOperation({ summary: 'Add Blocked(with uUid) to me (from cookie)' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async addBlocked(@Req() req, @Res() res, @Body() userToHandle: HandleFriendDto) {
    res.send(this.UserService.addBlocked(req.user, userToHandle.userUuidToHandle));
  }

  @Post('removeFriend')
  @ApiOperation({ summary: 'remove Friend(with uUid) to me (from cookie)' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async removeFriend(@Req() req, @Res() res, @Body() userToHandle: HandleFriendDto) {
    res.send(this.UserService.removeFriend(req.user, userToHandle.userUuidToHandle));
  }

  @Post('removeBlocked')
  @ApiOperation({ summary: 'remove Blocked(with uUid) to me (from cookie)' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async removeBlocked(@Req() req, @Res() res, @Body() userToHandle: HandleFriendDto) {
    res.send(this.UserService.removeBlocked(req.user, userToHandle.userUuidToHandle));
  }

  @Post('enableTwoFactorAuth')
  @ApiOperation({ summary: 'Enable two factor auth to me (from cookie)' })
  @UseGuards(JwtAuthGuard)
  async enableTwoFactorAuth(@Req() req) {
    return await this.UserService.enableTwoFactorAuth(req.user);
  }

  @Post('disableTwoFactorAuth')
  @ApiOperation({ summary: 'Disable two factor auth to me (from cookie)' })
  @UseGuards(JwtAuthGuard)
  async disableTwoFactorAuth(@Req() req) {
    return await this.UserService.disableTwoFactorAuth(req.user);
  }

  @Post('changeUsername')
  @ApiOperation({ summary: 'Change my username (from cookie)' })
  @ApiParam({ name: 'ChangeUserNameDto', type: ChangeUserNameDto })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async changeUserName(@Req() req, @Body() userToChange: ChangeUserNameDto) {
    return await this.UserService.changeUserName(req.user, userToChange.newName);
  }

  @Post('endOfMatch')
  @ApiOperation({ summary: 'Save score at the end of the match' })
  @ApiParam({ name: 'EndOfMatchDto', type: EndOfMatchDto })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async endOfMatch(@Body() players: EndOfMatchDto): Promise<void> {
    return await this.UserService.endOfMatch(players);
  }

  //TO_DELL IN PROD
  //Check NODE_ENV = PRODUCTION?
  @Post('create')
  @ApiOperation({ summary: 'Create a new user ONLY in DEV?' })
  @ApiResponse({ status: 200, description: 'The created user', type: user })
  @UsePipes(ValidationPipe)
  async createUser(@Body() UserToCreate: FindOrCreateUserDto): Promise<user> {
    // console.log(process.env.NODE_ENV)
    return await this.UserService.FindOrCreateUser(UserToCreate);
  }

  @Get('/:userUid')
  @ApiOperation({ summary: 'Get user by userUid' })
  @ApiResponse({ status: 200, description: 'Found user by uid', type: user })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async getCompleteUser(@Param('userUid') userUid: string): Promise<user> {
    //   console.log("getCompleteUser conrtoller", userUid)
    return await this.UserService.getCompleteUser(userUid);
  }
}