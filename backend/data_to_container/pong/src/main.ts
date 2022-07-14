import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import fs = require('fs');


const httpsOptions = {
	key: fs.readFileSync('/usr/src/app/ssl/selfsigned.key'),
	cert: fs.readFileSync('/usr/src/app/ssl/selfsigned.csr'),
}

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		httpsOptions,
	  });
	  await app.listen(3001);
}
bootstrap();

// const io = require("socket.io")(3001, {
//   cors: {
//     origin: ["http://localhost:3000"],
//   },
// })

// io.on("connection", socket => {
//   console.log(socket.id)
//   socket.on('custom-event', (str) => {
//     console.log(" string received =", str)
//   })
// })
