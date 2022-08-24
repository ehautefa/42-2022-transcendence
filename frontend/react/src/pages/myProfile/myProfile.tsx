import NavBar from "../../components/NavBar/NavBar"
import "./Profil.css"
import { FetchUser, GetMatchHistory } from "./request"
import { User } from "../../type";
import { useState } from "react";

var update = true;

function MyProfile() {
	const uid = localStorage.getItem('uid');
	
	let user: User = {userUuid: ""}; 
	
	if (uid && update === true) {
		update = false;
		user = FetchUser(uid);
		// const [matchs, setMatchs] = useState(GetMatchHistory(uid));
		// console.log(matchs);
	}


	return (<div>
		<NavBar />
		<div className="mainComposantProfile">
			<div className="flex">
				<div className="info container">
					<h3>Profile</h3>
					<ul>
						<li>Name : {user.userName} <a href="/myProfile">(edit)</a></li>
						<li>Current Status: Online</li>
						<li>Wins : {user.wins}</li>
						<li>Losses : {user.losses}</li>
					</ul>
					<button>Enable two-factor authentication</button>
				</div>
				<a href="./editProfil">
					<div className="pp">
						<p>Edit</p>
					</div>
				</a>
			</div>
			<div className="flex">
				<div className="friends container">
					<h3>Friends</h3>
				</div>
				<div className="stats container">
					<h3>Match History</h3>
					{/* <table>
						<thead>
							<tr>
								<th>ID</th>
								<th>Other Player</th>
								<th>My Score</th>
								<th>Other Score</th>
							</tr>
						</thead>
						<tbody>
							{matchs.map((match: Match) => {
								return (<tr key="{match.matchId}">
									<td>{match.matchId}</td>
									<td>{uid === match.user1?.userUuid ? (match.user2?.userName) : (match.user1?.userName)}</td>
									<td>{uid === match.user1?.userUuid ? (match.score1) : (match.score2)}</td>
									<td>{uid === match.user1?.userUuid ? (match.score2) : (match.score1)}</td>
								</tr>);
							})}
						</tbody>
					</table> */}
				</div>
			</div>
		</div>
	</div>)
}

export default MyProfile