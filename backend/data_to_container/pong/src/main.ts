import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';

const httpsOptions = {
	key: fs.readFileSync('/usr/src/app/ssl/selfsigned.key'),
	cert: fs.readFileSync('/usr/src/app/ssl/selfsigned.csr'),
};

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { httpsOptions });
	// await app.listen(3001);
}
bootstrap();

const io = require("socket.io")(3001, {
	cors: {
		origin: ["https://localhost:3000"],
	},
})

io.on("connection", socket => {
	console.log(socket.id)
	socket.on('token', (token) => {
		console.log(" token received =", token)
	})
})
