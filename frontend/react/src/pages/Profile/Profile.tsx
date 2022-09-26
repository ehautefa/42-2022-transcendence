import NavBar from "../../components/NavBar/NavBar"
import "../myProfile/Profil.css";
import { FetchUser, GetMatchHistory } from "../myProfile/request"
import { User } from "../../type";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { addInFriend, removeFromFriend, getFriends } from "./request";

var update = true;

function Profile() {

	// get user uid in url
	// to do a link to the profile of the user 
	// use <a href={"./profile?uid=" + useruid}>profile</a>

	const uid = new URLSearchParams(useLocation().search).get('uid');
	const emptyUser: User = { userUuid: "", userName: "" };
	const [user, setUser] = useState(emptyUser);
	const [matchHistory, setMatchHistory] = useState([]);
	const [friends, setFriends] = useState([]);
	fetchUser();

	async function fetchUser() {
		if (uid && update) {
			const user = await FetchUser(uid);
			const matchHistory = await GetMatchHistory(uid);
			const friends = await getFriends(user.userUuid);
			setMatchHistory(matchHistory);
			setUser(user);
			setFriends(friends);
			update = false;
		}
	}

	return (<>
		<NavBar />
		<div className="mainComposantProfile">
			<div className="flex">
				<div className="info container">
					<h3>Profile</h3>
					<ul>
						<li className="flex-li">
							<div className="Username">Username : {user.userName}</div>
						</li>
						<li>Current Status: Online</li>
						<li>Wins : {user.wins}</li>
						<li>Losses : {user.losses}</li>
					</ul>
					<button className="enable" onClick={() => addInFriend(user.userUuid)}>Add in friends</button>
					<button className="enable" onClick={() => removeFromFriend(user.userUuid)}>Remove from friends</button>
				</div>
				<div className="pp nohover">
				</div>
			</div>
			<div className="flex">
				<div className="friends container">
					<h3>Friends</h3>
					<table>
						<thead>
							<tr>
								<th>UserName</th>
								<th>Status</th>
							</tr>
						</thead>
						<tbody>
							{friends.map((users: any) => {
								return (<tr key={users.userUuid}>
									<td><a href={"./profile?uid=" + users.userUuid}>{users.userName}</a></td>
									{users.status ? <td>Online</td> : <td>Offline</td>}
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
								<th>ID</th>
								<th>Other Player</th>
								<th>My Score</th>
								<th>Other Score</th>
							</tr>
						</thead>
						<tbody>
							{matchHistory.map((match: any) => {
								return (<tr key="{match.matchId}">
									<td>{match.matchId}</td>
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

export default Profile