import NavBar from "../../components/NavBar/NavBar"
import "./Match.css"
import { useEffect, useState } from "react"
import { GameWindowState } from "../../type";
import { getSocketPong } from "../../App"
import { Link } from "react-router-dom";



function Match() {
	const socket = getSocketPong();
	const [games, setGames] = useState([] as GameWindowState[]);

	useEffect(() => {
		socket.emit("getGames", (games: GameWindowState[]) => {
			setGames(games);
		});
	}, []);

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
					{games.map((game) => (
						<tr key={game.matchId}>
							<td><Link to={"/game?id=" + game.matchId}>Watch</Link></td>
							<td>{game.playerLeftName}</td>
							<td>{game.scoreLeft}</td>
							<td>{game.playerRightName}</td>
							<td>{game.scoreRight}</td>
							<td>{game.begin}</td>
						</tr>)
					)}
				</tbody>
			</table>
		</div>
	</>)
}

export default Match