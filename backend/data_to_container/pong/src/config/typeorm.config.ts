import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'postgres',
    port: 3020,
    username: 'pong_adm',
    password: 'pingpong',
    database: 'pong_db',
    entities: [],
    synchronize: true,
};