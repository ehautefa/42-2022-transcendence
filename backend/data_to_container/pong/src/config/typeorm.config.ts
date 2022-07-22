import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'postgres',
    port: 3020,
    username: 'root',
    password: 'root',
    database: 'test_db',
    entities: [],
    synchronize: true,
};