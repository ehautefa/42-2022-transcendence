import NavBar from "../../components/NavBar/NavBar"
import "./Game.css"
import { getSocket } from "../../App" 
import { useState } from "react"
import { useLocation } from "react-router-dom";
import { GameWindow } from "./GameWindow"
import ReceivePopUp from "../../components/ReceivePopUp/ReceivePopUp";

const socket = getSocket();

socket.on('invitePlayer', (data: any) => {
	console.log("INVITE PLAYER ON", data);
	console.log('my uid', localStorage.getItem('uid'));
	if (data.invitedUid === localStorage.getItem('uid')) {
		console.log("You are invite by", data.userName);
		// open a popup with a link to the game
		alert("You are invite by " + data.userName);
	}
})

function Game() {
	const index = new URLSearchParams(useLocation().search).get('id');
	var id_state: number = index === null ? -1 : parseInt(index);
	const displaying_state = index === null ? { display: "block" } : { display: "none" };
	const [displaying, setDisplaying] = useState(displaying_state);
	const [id, setId] = useState(id_state);
	const uid = localStorage.getItem('uid');
	const userName = localStorage.getItem('userName');

	if (id !== -1) {
		socket.emit('joinGame', id);
	}

	function matchMaking() {
		let arg = {
			"userUuid": uid,
			"userName": userName
		}
		socket.emit('getPlayer', arg , (id_game: number) => {
			setDisplaying({ display: "none" });
			setId(id_game)
		});
	}
	return (<>
		<NavBar />
		<div className="mainComposantGame">
			<GameWindow id={id} />
			<ReceivePopUp />
			<button style={displaying}
				className="matchMakingButton"
				onClick={() => matchMaking()}>
				Find another player
			</button>
		</div>
	</>)
}

export default Game;