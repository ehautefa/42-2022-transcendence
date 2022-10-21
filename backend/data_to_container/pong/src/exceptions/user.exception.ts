import { HttpException, HttpStatus } from "@nestjs/common";

export class UserException extends HttpException {}

export class ArgUndefinedException extends UserException {
      constructor(ArgsName: string = "An argument") {
    super(ArgsName +' is undefined', HttpStatus.FORBIDDEN);
  }
 }

export class FailToFindObjectFromDBException extends UserException {
      constructor(objectName: string = "an object",
      tableName: string = "a table",
      dbName: string = "the database") {
    super('Fail to find ' + objectName + ' from ' + tableName + '\'s table from ' + dbName + '!' , HttpStatus.FORBIDDEN);
  }
 }

export class FailToFindObjectFromanEntity extends UserException {
      constructor(objectName: string = "an object",
      objectField: string = 'Unknown',
      entityName: string = 'Unknown') {
    super('Fail to find ' + objectName + ' in the field ' + objectField + ' in ' + entityName + 'entinty', HttpStatus.FORBIDDEN);
  }
 }

export class UserAreAlreadyFriends extends UserException {
      constructor(
        user1Name: string = 'user1',
        user2Name: string = 'user2',
      ) {
    super(user1Name + ' and ' + user2Name + ' are already friends', HttpStatus.FORBIDDEN);
  }
 }

export class UserAreNotFriends extends UserException {
      constructor(
        user1Name: string = 'user1',
        user2Name: string = 'user2',
      ) {
    super(user1Name + ' and ' + user2Name + ' are not friends', HttpStatus.FORBIDDEN);
  }
 }

export class UserAreNotBlocked extends UserException {
      constructor(
        user1Name: string = 'user1',
        user2Name: string = 'user2',
      ) {
    super(user1Name + ' and ' + user2Name + ' are not friends', HttpStatus.FORBIDDEN);
  }
 }

export class UserIsBlockedException extends UserException {
      constructor(
        userName :string = 'user1',
        userName2 :string = 'user2',
      ) {
    super('Can\'t be friend, ' + userName + ' is blocked by ' + userName2, HttpStatus.FORBIDDEN);
  }
 }

export class UserIsTheSameException extends UserException {
      constructor() {
    super('User is asking for himself', HttpStatus.FORBIDDEN);
  }
 }

export class UserNameAlreadyExistException extends UserException {
      constructor(
        userName: string = 'UnknownUserName',
      ) {
    super('Username : ' + userName + ' already exit', HttpStatus.FORBIDDEN);
  }
 }

export class UserFriendRequestAlreadyPendingException extends UserException {
      constructor() {
    super('Friend request already in pending', HttpStatus.FORBIDDEN);
  }
 }

export class FailToFindAUniqNameException extends UserException {
      constructor(
        userName: string = 'the user'
      ) {
    super('Fail to find a uniq name for ' + userName, HttpStatus.FORBIDDEN);
  }
 }

export class TwoFactorAuthAlreadyDisableException extends UserException {
      constructor() {
    super('Two factor Auth Already disable', HttpStatus.FORBIDDEN);
  }
 }

export class TwoFactorAuthAlreadyEnableException extends UserException {
      constructor() {
    super('Two factor Auth Already enable', HttpStatus.FORBIDDEN);
  }
 }