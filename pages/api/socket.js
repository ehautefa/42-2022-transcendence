import { Server } from "socket.io";

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
    res.socket.server.io = io

	io.on('connect', (socket) => {
		socket.on('chat message', (msg) => {
		  io.emit('chat message', msg);
		});
	  });
}
  res.end()
}

export default SocketHandler
