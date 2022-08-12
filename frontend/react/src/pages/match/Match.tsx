import NavBar from "../../components/NavBar/NavBar"
import "./Match.css"
import { useState } from "react"
import { GameWindowState } from "../../type";
import { getSocket } from "../../App"
import { GameWindow } from "../game/Game"
import { Game } from "../test/Test"

const socket = getSocket();




function Match() {
	var emptyState: GameWindowState[] = [];
	const [games, setGames] = useState(emptyState);
	socket.emit("getGames", (games:GameWindowState[]) => {
		setGames(games);
	});
	function redirectGame(id:number) {
		return <GameWindow id={id}/>;
	}
	return (<>
		<NavBar />
		<div className="tableMatch">
			<h3>Match in game</h3>
			<table>
				<thead>
					<tr>
						<th>ID</th>
						<th>User1</th>
						<th>User2</th>
						<th>Score1</th>
						<th>Score2</th>
					</tr>
				</thead>
				<tbody>
					{games.map((game:GameWindowState) => {
						return (<tr key="{game.id}">
							<td>
								<button onClick={() =>Game(0)}>
									{game.id}
								</button>
							</td>
							<td>Pika</td>
							<td>Elise</td>
							<td>{game.scoreLeft}</td>
							<td>{game.scoreRight}</td>
						</tr>);
					})}

				</tbody>
			</table>
		</div>
		</>)
}

export default Match