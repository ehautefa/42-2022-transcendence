import NavBar from "../../components/NavBar/NavBar"
import "./Match.css"
import { useState } from "react"
import { GameWindowState } from "../../type";
import { getSocket } from "../../App"

const socket = getSocket();


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
						<th>User1</th>
						<th>User2</th>
						<th>Score1</th>
						<th>Score2</th>
					</tr>
				</thead>
				<tbody>
					{games.map((game: GameWindowState) => {
						if (!game.isGameOver
							&& game.playerLeft !== ""
							&& game.playerRight !== "") {
							return (<tr key="{game.id}">
								<td>
									<a href={"./game?id=" + game.id}>Watch</a>
								</td>
								<td>Pika</td>
								<td>Elise</td>
								<td>{game.scoreLeft}</td>
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