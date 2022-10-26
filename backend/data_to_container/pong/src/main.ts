import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { readFileSync } from "fs";
import { createServer } from 'https';
import * as cookieParser from 'cookie-parser';
import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';


const httpsOptions: HttpsOptions = {
	key: readFileSync('/usr/src/app/ssl/selfsigned.key'),
	cert: readFileSync('/usr/src/app/ssl/selfsigned.csr'),
};


async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		cors: {
			origin: ['https://localhost:3000'],
			methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
			allowedHeaders: ['Content-Type', 'Authorization'],
			exposedHeaders: ['Authorization'],
			credentials: true,
		},
		httpsOptions
	});

	const config = new DocumentBuilder()
		.setTitle('Transcendence')
		.setDescription('The Transcendence API description')
		.setVersion('1.0')
		.addTag('match')
		.addTag('user')
		.addTag('pong')
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	app.use(cookieParser());
	await app.listen(3011);
}
bootstrap();
