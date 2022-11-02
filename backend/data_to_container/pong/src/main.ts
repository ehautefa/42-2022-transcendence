import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';


async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		cors: {
			origin: [process.env.REACT_APP_FRONT_URL,
				// "https://signin.intra.42.fr/",
				// "https://api.intra.42.fr/"
			],
			methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
			allowedHeaders: ['Content-Type', 'Authorization'],
			exposedHeaders: ['Authorization'],
			credentials: true,
		}
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
