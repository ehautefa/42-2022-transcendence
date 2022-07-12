// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
	name: string
}

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	console.log("Here we are in the backend");
	res.status(200).json({ name: 'John Doe' })
}

// import { Server } from 'socket.io'

// export default function handler(
// 	req: NextApiRequest,
// 	res: NextApiResponse<Data>) {
// 	if (!res.socket.server.io) {
// 		console.log('*First use, starting socket.io')

// 		const io = new Server(res.socket.server)

// 		io.on('connection', socket => {
// 			socket.broadcast.emit('a user connected')
// 			socket.on('hello', msg => {
// 				socket.emit('hello', 'world!')
// 			})
// 		})

// 		res.socket.server.io = io
// 	} else {
// 		console.log('socket.io already running')
// 	}
// 	res.end()
// }

// export const config = {
// 	api: {
// 		bodyParser: false
// 	}
// }

// // export default handler;