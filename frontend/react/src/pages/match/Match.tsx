import NavBar from "../../components/NavBar/NavBar"
import "./Match.css"
import { useState } from "react"
import { GameWindowState } from "../../type";
import { getSocketPong } from "../../App"

const socket = getSocketPong();


function Match() {
	var emptyState: GameWindowState[] = [];
	const [games, setGames] = useState(emptyState);
	socket.emit("getGames", (games: GameWindowState[]) => {
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
					</tr>
				</thead>
				<tbody>
					{games.map((game: GameWindowState) => {
						if (!game.isGameOver
							&& game.playerLeftName !== ""
							&& game.playerRightName !== "") {
							return (<tr key="{game.id}">
								<td>
									<a href={"./game?id=" + game.id}>Watch</a>
								</td>
								<td>{game.playerLeftName}</td>
								<td>{game.scoreLeft}</td>
								<td>{game.playerRightName}</td>
								<td>{game.scoreRight}</td>
							</tr>);
						}
						else
							return null;
					})}

				</tbody>
			</table>
		</div>
	</>)
}

export default Match