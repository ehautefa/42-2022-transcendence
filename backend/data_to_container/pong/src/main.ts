import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	// await app.listen(3000);
}
bootstrap();

const io = require("socket.io")(3001, {
  cors: {
    origin: ["http://localhost:3000"],
  },
})

io.on("connection", socket => {
  console.log(socket.id)
  socket.on('custom-event', (str) => {
    console.log(" string received =", str)
  })
})
