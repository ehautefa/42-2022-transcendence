import NavBar from "../../components/NavBar/NavBar"
import "./Game.css"
import { getSocketPong } from "../../App"
import { useState } from "react"
import { useLocation } from "react-router-dom";
import { GameWindow } from "./GameWindow"

const socket = getSocketPong();

function Game() {
	var index = new URLSearchParams(useLocation().search).get('id');
	// const [displaying, setDisplaying] = useState({ display: "none"});
	const [loading, setLoading] = useState(true);
	if (index == null) {
		// setDisplaying({ display: "block" });
		// setLoading(false);
		index = "";
	}

	if (index !== "") {
		socket.emit('joinGame', index);
	}

	function matchMaking() {
		socket.emit('getPlayer', (matchId: string) => {
			// setDisplaying({ display: "none" });
			// if (matchId === "")
				// setLoading(true);
			// else
				// setLoading(false)
		});
	}

	socket.on('beginGame', () => {
		console.log("beginGame");
		// setLoading(false);
	});

	return (<>
		<NavBar />
		<div className="mainComposantGame">
			<GameWindow id={index} />
			{ !loading ?
				<button
					className="matchMakingButton"
					onClick={() => matchMaking()}>
					Find another player
				</button> :
				<div className="loader-container">
					<div className="spinner"></div>
				</div>
			}
		</div>
	</>);
}

export default Game;