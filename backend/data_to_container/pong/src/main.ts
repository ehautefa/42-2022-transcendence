import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { readFileSync } from "fs";
import { createServer } from 'https';


const httpsOptions = createServer({
	key: readFileSync('/usr/src/app/ssl/selfsigned.key'),
	cert: readFileSync('/usr/src/app/ssl/selfsigned.csr'),
});

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {cors: true});
	await app.listen(3011);
}
bootstrap();
