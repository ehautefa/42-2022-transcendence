import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import { Server } from "socket.io"
import { readFileSync } from "fs";
import { createServer } from 'https';


const httpsOptions = createServer({
	key: readFileSync('/usr/src/app/ssl/selfsigned.key'),
	cert: readFileSync('/usr/src/app/ssl/selfsigned.csr'),
});

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
		await app.listen(3380);
}
bootstrap();

const io = require("socket.io")(3001, {
	cors: {
		origin: ["https://localhost:3000"],
	},
})

// const io = new Server(httpsOptions, {
// 	cors: {
// 		origin: ["https://localhost:3000"],
// 	},
// })

io.on("connection", (socket) => {
	console.log(socket.id)
	socket.on('token', (token) => {
		console.log(" token received =", token)
	})
})
