import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { readFileSync } from "fs";
import { createServer } from 'https';
import * as cookieParser from 'cookie-parser';


const httpsOptions = createServer({
	key: readFileSync('/usr/src/app/ssl/selfsigned.key'),
	cert: readFileSync('/usr/src/app/ssl/selfsigned.csr'),
});

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors({
		origin: ['https://localhost:3000'],
		credentials: true,
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

	app.use(function (req, res, next) {

		// Website you wish to allow to connect
		res.setHeader('Access-Control-Allow-Origin', 'https://localhost:3000');

		// Request methods you wish to allow
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

		// Request headers you wish to allow
		res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

		// Set to true if you need the website to include cookies in the requests sent
		// to the API (e.g. in case you use sessions)
		res.setHeader('Access-Control-Allow-Credentials', true);

		// Pass to next layer of middleware
		next();
	});

	await app.listen(3011);
}
bootstrap();
