import NavBar from "../../components/NavBar/NavBar"
import "./Profil.css"
import { FetchUser, GetMatchHistory, GetAllUsers } from "./request"
import { User } from "../../type";
import { useState } from "react";
import PopupEditUsername from "../../components/Popup/Popup";

var update = true;

function MyProfile() {
	const uid = localStorage.getItem('uid');
	const emptyUser : User = {userUuid: "", userName: ""};
	const [user, setUser] = useState(emptyUser);
	const [matchHistory, setMatchHistory] = useState([]);
	const [allUsers, setAllUsers] = useState([]);
	fetchUser();

	async function fetchUser() {
		if (uid && update) {
			const user = await FetchUser(uid);
			const matchHistory = await GetMatchHistory(user.userName);
			const allUsers = await GetAllUsers();
			setAllUsers(allUsers);
			setMatchHistory(matchHistory);
			setUser(user);
			update = false;
		}
	}
	
	console.log("MATCH HISTORY", matchHistory);

	return (<>
		<NavBar />
		<div className="mainComposantProfile">
			<div className="flex">
				<div className="info container">
					<h3>Profile</h3>
					<ul>
						<li className="flex-li">
							<div className="Username">Username : {user.userName}</div>
							<PopupEditUsername />
						</li>
						<li>Current Status: Online</li>
						<li>Wins : {user.wins}</li>
						<li>Losses : {user.losses}</li>
					</ul>
					<button className="enable">Enable two-factor authentication</button>
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
					<table>
						<thead>
							<tr>
								<th>UserName</th>
								<th>Status</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{allUsers.map((users: any) => {
								return (<tr key="{users.userUid}">
									<td><a href={"./profile?uid=" + users.userUid}>{users.userName}</a></td>
									<td>Online</td>
									<td>Launch a Game</td>
								</tr>);
							})}
						</tbody>
					</table>
				</div>
				<div className="stats container">
					<h3>Match History</h3>
					<table>
						<thead>
							<tr>
								<th>Other Player</th>
								<th>My Score</th>
								<th>Other Score</th>
							</tr>
						</thead>
						<tbody>
							{matchHistory.map((match: any) => {
								return (<tr key="{match.matchId}">
									<td>{uid === match.user1?.userUuid ? (match.user2?.userName) : (match.user1?.userName)}</td>
									<td>{uid === match.user1?.userUuid ? (match.score1) : (match.score2)}</td>
									<td>{uid === match.user1?.userUuid ? (match.score2) : (match.score1)}</td>
								</tr>);
							})}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</>)
}

export default MyProfile