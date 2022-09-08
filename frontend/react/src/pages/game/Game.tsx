import NavBar from "../../components/NavBar/NavBar"
import "./Game.css"
import { getSocket } from "../../App" 
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom";
import { GameWindow } from "./GameWindow"
import { usePopup, PopupContextType  } from "../../components/ReceivePopUp/popUpContext";

const socket = getSocket();

// useEffect(() => {
// 	socket.on('invitePlayer', (data: any) => {
// 		console.log("INVITE PLAYER ON", data);
// 		console.log('my uid', localStorage.getItem('uid'));
// 		if (data.invitedUid === localStorage.getItem('uid')) {
// 			console.log("You are invite by", data.userName);
// 			// open a popup with a link to the game
			
// 		}
// 	})
// })

function Game() {
	const index = new URLSearchParams(useLocation().search).get('id');
	var id_state: number = index === null ? -1 : parseInt(index);
	const displaying_state = index === null ? { display: "block" } : { display: "none" };
	const [displaying, setDisplaying] = useState(displaying_state);
	const [id, setId] = useState(id_state);
	const uid = localStorage.getItem('uid');
	const userName = localStorage.getItem('userName');
	const arg = usePopup()
	const { triggerPopup, clearPopup} = arg as PopupContextType;
	
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
		triggerPopup(
			<div className="Popup-mother invitePlayer">
				<h2>You receive an invitation from </h2>
				<button onClick={() => clearPopup()}>Close</button>
				<a href={"./game?id="}>Join Game</a>
			</div>
		)
	}
	return (<>
		<NavBar />
		<div className="mainComposantGame">
			<GameWindow id={id} />
			<button style={displaying}
				className="matchMakingButton"
				onClick={() => matchMaking()}>
				Find another player
			</button>
		</div>
	</>)
}

export default Game;