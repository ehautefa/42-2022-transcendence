import NavBar from "../../components/NavBar/NavBar"
import "../myProfile/Profil.css";
import { GetMatchHistory } from "../myProfile/request"
import { User } from "../../type";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { addFriend, removeFriend, addBlocked, removeBlocked } from "../allPlayers/request";
import { getFriends, FetchUser, isMyFriends, getPicture } from "./request";
import { getSocketChat } from "../../Home";

function Profile() {

	// get user uid in url
	// to do a link to the profile of the user 
	// use <Link to={"/profile?uid=" + useruid}>profile</Link>

	const uid = new URLSearchParams(useLocation().search).get('uid');
	const emptyUser: User = { userUuid: "", userName: "" };
	const [user, setUser] = useState(emptyUser);
	const [matchHistory, setMatchHistory] = useState([]);
	const [isMyFriend, setIsMyFriend] = useState(false);
	const [friends, setFriends] = useState([]);
	const [isBlocked, setIsBlocked] = useState(false);
	const [invitationSent, setInvitationSent] = useState(false);
	const [picture, setPicture] = useState("");
	let navigate = useNavigate();
	
	async function fetchUser(uid: string) {
		const user = await FetchUser(uid);
		setUser(user);
		const picture = await getPicture(user.userUuid);
		setPicture(picture.url);
		const matchHistory = await GetMatchHistory(user.userName);
		setMatchHistory(matchHistory);
		const friends = await getFriends(user.userUuid);
		setFriends(friends);
		const isFriend = await isMyFriends(user.userUuid);
		setIsMyFriend(isFriend);
	}
	
	useEffect(() => {
		if (uid) {
			fetchUser(uid);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function handleBlock(userUuid: string, block: boolean) {
		if (block) {
			addBlocked(userUuid);
			setIsBlocked(true);
		} else {
			removeBlocked(userUuid);
			setIsBlocked(false);
		}
	}

	async function handleFriend(userUuid: string, friend: boolean) {
		if (friend) {
			setInvitationSent(true);
			addFriend(userUuid);
		} else {
			removeFriend(userUuid);
			setIsMyFriend(false);
		}
	}

	function writeDM() {
		const socketChat = getSocketChat();
		socketChat.emit("joinDMRoom", {uuid: user.userUuid}, (roomId: string) => {
			console.log("roomId", roomId);
			navigate("/chat?room=" + roomId);
		});
	}


	return (<>
		<NavBar />
		<div className="mainComposantProfile">
			<div className="flex">
				<div className="info container">
					<div className="flex-message">
						<h3>Profile</h3>
					</div>
					<ul>
						<li className="flex-li">
							<div className="Username">Username : {user.userName}</div>
						</li>
						<li>Current Status: Online</li>
						<li>Wins : {user.wins}</li>
						<li>Losses : {user.losses}</li>
					</ul>
					<button className="enable" onClick={writeDM}>Write message</button>
					{
						isMyFriend ?
						<button className="enable"  onClick={() => handleFriend(user.userUuid, false)}>Remove from friends</button>
						: ( invitationSent ?
							<button className="enable unclickable">Invitation sent</button>
							: <button className="enable" onClick={() => handleFriend(user.userUuid, true)}>Add Friend</button>
							)
						}
					{
						isBlocked ?
						<button className="enable" onClick={() => handleBlock(user.userUuid, false)}>Unblock</button>
						: <button className="enable" onClick={() => handleBlock(user.userUuid, true)}>Block</button>
					}
				</div>
				<div className="ppFriends">
					<img src={picture} alt={"Avatar of " + user.userName} />
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
									<td><Link to={"./profile?uid=" + users.userUuid}>{users.userName}</Link></td>
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
								<th>Other Player</th>
								<th>My Score</th>
								<th>Other Score</th>
							</tr>
						</thead>
						<tbody>
							{matchHistory.map((match: any) => {
								return (<tr key={match.matchId}>
									<td>{user.userUuid === match.user1?.userUuid ? (match.user2?.userName) : (match.user1?.userName)}</td>
									<td>{user.userUuid === match.user1?.userUuid ? (match.score1) : (match.score2)}</td>
									<td>{user.userUuid === match.user1?.userUuid ? (match.score2) : (match.score1)}</td>
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