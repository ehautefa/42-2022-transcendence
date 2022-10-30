import NavBar from "../../components/NavBar/NavBar"
import "./Game.css"
import { getSocketPong } from "../../App"
import { useState } from "react"
import { useLocation } from "react-router-dom";
import { GameWindow } from "./GameWindow"

function Game() {
	const socket = getSocketPong();
	var index = new URLSearchParams(useLocation().search).get('id');
	const initialLayer = index === null ? 0 : 1;
	console.log(initialLayer);
	const [layer, setLayer] = useState(initialLayer); // 0 - matchMaking button, 1 - waiting for opponent, 2 - game 

	window.history.pushState = function () {
		console.log("pushState", arguments);
		socket.emit("leaveGame");
	};

	if (index !== null) {
		socket.emit('joinGame', index);
	} else {
		index = "";
	}

	function matchMaking() {
		socket.emit('getPlayer', (matchId: string) => {
			if (matchId === "")
				setLayer(1);
			else
				setLayer(2)
		});
	}

	socket.on('beginGame', () => {
		setLayer(2);
	});

	return (<>
		<NavBar />
		<div className="mainComposantGame">
			<GameWindow id={index} />
			{ layer === 0 &&
				<button
					className="matchMakingButton"
					onClick={() => matchMaking()}>
					Find another player
				</button>
			}
			{ layer === 1 &&
				<div className="loader-container">
					<div className="spinner"></div>
				</div>
			}
		</div>
	</>);
}

export default Game;