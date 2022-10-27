import NavBar from "../../components/NavBar/NavBar"
import "./Match.css"
import { useState } from "react"
import { GameWindowState } from "../../type";
import { getSocketPong } from "../../App"
import { Link } from "react-router-dom";

const socket = getSocketPong();


function Match() {
	const emptyGames : GameWindowState[] = [];
	const [games, setGames] = useState(emptyGames);
	socket.emit("getGames", (games: GameWindowState[]) => {
		console.log("Socket getGames", games);
		setGames(games);
	});


	return (<>
		<NavBar />
		<div className="tableMatch">
			<h3>Match in game</h3>
			<table>
				<thead>
					<tr>
						<th></th>
						<th>First Player</th>
						<th>Score</th>
						<th>Second Player</th>
						<th>Score</th>
						<th>Begin</th>
					</tr>
				</thead>
				<tbody>
					{games.map((value) => {
							return (<tr key="{value.id}">
								<td>
									<Link to={"./game?id=" + value.id}>Watch</Link>
								</td>
								<td>{value.playerLeftName}</td>
								<td>{value.scoreLeft}</td>
								<td>{value.playerRightName}</td>
								<td>{value.scoreRight}</td>
								<td>{value.begin}</td>
							</tr>)
					})}

				</tbody>
			</table>
		</div>
	</>)
}

export default Match