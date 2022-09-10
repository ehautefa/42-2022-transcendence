import './index.css';
import { io } from 'socket.io-client'
import { CreateUser } from "./pages/myProfile/request";
import { useModal } from './context/modal-context';

// Create my socket
let socketOptions = {
	transportOptions: {
		polling: {
			extraHeaders: {
				Authorization: 'Bearer 464654564'
			}
		}
	}
};
const URL_BACK: string = process.env.REACT_APP_BACK_URL === undefined ? "" : process.env.REACT_APP_BACK_URL;;
const socket = io(URL_BACK, socketOptions);


export function getSocket() {
	return socket;
}

export default function App() {
	const { setModal } = useModal();
  socket.on('invitePlayer', (data: any) => {
	  console.log("INVITE PLAYER ON", data);
	  console.log('my uid', localStorage.getItem('uid'));
	  if (data.invitedUid === localStorage.getItem('uid')) {
		  console.log("You are invite by", data.userName);
		  // open a popup with a link to the game
		  setModal(data.id);
	  }
  })
	var uid: string = localStorage.getItem('uid') !== null ? localStorage.getItem('uid')! : "";
	// Connect my socket to server
	socket.on("connect", () => {
		console.log("SOCKET FRONT:", socket.id, " : ", socket.connected);
	});
	if (uid === "") {
		let user = CreateUser();
		user.then((user) => {
			localStorage.setItem('uid', user.userUuid);
			console.log("userUuid:", user.userUuid);
			localStorage.setItem('userName', user.userName);
		})
	}
	return (<>
		<div className='login'>
			<a href="/mainPage">
				<h1>Try to login</h1>
			</a>
		</div>
	</>
	);
}

