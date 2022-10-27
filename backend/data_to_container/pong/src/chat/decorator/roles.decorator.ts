import { SetMetadata } from '@nestjs/common';

export type Role = 'admin' | 'owner';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
