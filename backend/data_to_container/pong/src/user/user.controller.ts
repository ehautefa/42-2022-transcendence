import { Body, Controller, Get, Inject, Param, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { user } from 'src/bdd/users.entity';
import { ChangeUserNameDto } from './dto/changeUserName.dto';
import { EndOfMatchDto } from './dto/endOfMatch.dto';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { HandleFriendDto } from './dto/handleFriend.dto';
import { StatusGateway } from 'src/status/status.gateway';
import { SendAlertDto } from 'src/status/dto/sendAlert.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { of } from 'rxjs';
import { join } from 'path';

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly UserService: UserService) { }

  @Inject(StatusGateway)
  private readonly StatusGateway: StatusGateway;

  @Post('uploadPicture')
  @ApiOperation({ summary: 'Upload picture' })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file',
    {
      storage: diskStorage({
        destination: './uploads/pp',
        filename: (req, file, cb) => {
          const filename: string = req.user.userUuid;
          cb(null, `${filename}.jpeg`);
        }})
    }))
  uploadPicture(@UploadedFile(
    new ParseFilePipe({validators: [ new MaxFileSizeValidator({ maxSize: 1000 }), new FileTypeValidator({ fileType: 'jpeg' }),],}),
  ) file: any, @Req() req) {
    console.log("uploadPicture", file);
  }

  @Get('myPicture')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get my picture' })
  async getMyPicture(@Req() req, @Res() res) {
    return (of(res.sendFile(join(process.cwd(), `uploads/pp/${req.user.userUuid}.jpeg`))));
  }

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

  @Get('getMyRequests')
  @ApiOperation({ summary: 'Get myFriends (from cookie)' })
  @UseGuards(JwtAuthGuard)
  async getMyRequests(@Req() req, @Res() res) {
    res.send(req.user.requestPending);
  }

  @Post('isMyFriends')
  @ApiOperation({ summary: 'check if we are friends' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async isMyFriends(@Req() req, @Res() res, @Body() userToHandle: HandleFriendDto) {
    console.log("ismyfriend", userToHandle);
    return await this.UserService.isMyFriend(req.user, await this.UserService.getCompleteUser(userToHandle.userUuid));
  }

  @Post('isBlocked')
  @ApiOperation({ summary: 'check if we are blocked' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async isBlocked(@Req() req, @Res() res, @Body() userToHandle: HandleFriendDto) {
    console.log("ismyblocked", userToHandle);
    return await this.UserService.isBlocked(req.user, await this.UserService.getCompleteUser(userToHandle.userUuid));
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
    res.send(req.user.blocked);
  }

  @Post('makeFriendRequest')
  @ApiOperation({ summary: 'Make Friend Request' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async makeFriendRequest(@Req() req, @Res() res, @Body() userToHandle: HandleFriendDto) {
    console.log("makeFriendRequest");
    res.send(await this.UserService.makeFriendRequest(req.user, await this.UserService.getCompleteUser(userToHandle.userUuid)))
  }

  @Post('acceptFriendRequest')
  @ApiOperation({ summary: 'accept Friend Request' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async acceptFriendRequest(@Req() req, @Res() res, @Body() userToHandle: HandleFriendDto) {
    console.log("acceptFriendRequest", userToHandle);
    res.send(await this.UserService.acceptFriendRequest(req.user, await this.UserService.getCompleteUser(userToHandle.userUuid)));
  }

  @Post('refuseFriendRequest')
  @ApiOperation({ summary: 'Refuse Friend Request' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async refuseFriendRequest(@Req() req, @Res() res, @Body() userToHandle: HandleFriendDto) {
    console.log("refuseFriendRequest", userToHandle);
    res.send(await this.UserService.refuseFriendRequest(req.user, await this.UserService.getCompleteUser(userToHandle.userUuid)));
  }

  @Post('removeFriend')
  @ApiOperation({ summary: 'remove Friend(with uUid) to me (from cookie)' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async removeFriend(@Req() req, @Res() res, @Body() userToHandle: HandleFriendDto) {
    const ret: user[] = await this.UserService.removeFriend(req.user, await this.getCompleteUser(userToHandle.userUuid))
    // return res.status(404).send("User not found");
    const sendAlert: SendAlertDto = {
      userUuid: userToHandle.userUuid,
      message: `${req.user.userName} removed you from his friend list`,
    }
    this.StatusGateway.sendAlert(sendAlert);

    //same??
    res.send(req.user.friend);
    //same??
    res.send(ret);
  }


  @Post('addBlocked')
  @ApiOperation({ summary: 'Add Blocked(with uUid) to me (from cookie)' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async addBlocked(@Req() req, @Res() res, @Body() userToHandle: HandleFriendDto) {
    res.send(await this.UserService.addBlocked(req.user, await this.UserService.getCompleteUser(userToHandle.userUuid)));
  }

  @Post('removeBlocked')
  @ApiOperation({ summary: 'remove Blocked(with uUid) to me (from cookie)' })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async removeBlocked(@Req() req, @Res() res, @Body() userToHandle: HandleFriendDto) {
    res.send(await this.UserService.removeBlocked(req.user, await this.UserService.getCompleteUser(userToHandle.userUuid)));
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
    return await this.UserService.endOfMatch(players.loserUuid, players.winnerUuid);
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