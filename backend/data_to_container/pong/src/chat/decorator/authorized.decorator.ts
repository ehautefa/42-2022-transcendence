import { SetMetadata } from '@nestjs/common';

export type Authorization = 'notBlocked' | 'notBanned' | 'notMuted';

export const Authorized = (...authorization: Authorization[]) =>
  SetMetadata('authorization', authorization);
