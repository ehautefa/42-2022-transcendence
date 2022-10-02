import NavBar from "../../components/NavBar/NavBar"
import "./Game.css"
import { getSocketPong } from "../../App"
import { useState } from "react"
import { useLocation } from "react-router-dom";
import { GameWindow } from "./GameWindow"

const socket = getSocketPong();

function Game() {
	var index = new URLSearchParams(useLocation().search).get('id');
	const [layer, setLayer] = useState(1); // 0 - matchMaking button, 1 - waiting for opponent, 2 - game 

	if (index !== null) {
		socket.emit('joinGame', index);
	} else {
		setLayer(0);
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