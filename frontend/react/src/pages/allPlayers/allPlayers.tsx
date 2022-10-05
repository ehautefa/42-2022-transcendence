import { getAllUuidWithUserName } from "./request";
import { useState } from "react";
import "./allPlayers.css";
import { addFriend, removeFriend, getMyBlocked, addBlocked, removeBlocked } from "./request";
import NavBar from "../../components/NavBar/NavBar";
import { getSocketStatus } from "../../App";
import { getMyFriends } from "../myProfile/request";
import { getMe } from "../myProfile/request";

const socketStatus = getSocketStatus();
var update = true;

type players = {
	userUuid: string;
	userName: string;
	online: boolean;
}

function AllPlayers() {
	const emptyUser : players[] = [];
	const [users, setUsers] = useState([]);
	const [friends, setFriends] = useState(emptyUser);
	const [blocked, setBlocked] = useState(emptyUser);
	const [me, setMe] = useState({userUuid: "", userName: ""});
	const [invitationSent, setInvitationSent] = useState(false);

	if (update) {
		update = false;
		fetchPlayers();
	}


	async function fetchPlayers() {
		const response = await getAllUuidWithUserName();
		socketStatus.emit('getFriendsStatus', response, (data: any) => {
			setUsers(data);
		});
		const myFriends = await getMyFriends();
		setFriends(myFriends);
		const myBlocked = await getMyBlocked();
		setBlocked(myBlocked);
		const me = await getMe();
		setMe(me);
	}

	function isMyFriend(userUuid: string) {
		for (let i = 0; i < friends.length; i++) {
			if (friends[i].userUuid === userUuid) {
				return true;
			}
		}
		return false;
	}

	function isBlocked(userUuid: string) {
		for (let i = 0; i < blocked.length; i++) {
			if (blocked[i].userUuid === userUuid) {
				return true;
			}
		}
		return false;
	}

	async function handleBlock(userUuid: string, block: boolean) {
		let newBlocked = [];
		if (block) {
			newBlocked = await addBlocked(userUuid);
		} else {
			newBlocked = await removeBlocked(userUuid);
		}
		setBlocked(newBlocked);
	}

	async function handleFriend(userUuid: string, friend: boolean) {
		let newFriends = [];
		if (friend) {
			setInvitationSent(true);
			newFriends = await addFriend(userUuid);
		} else {
			newFriends = await removeFriend(userUuid);
		}
		setFriends(newFriends);
	}

	return (<>
		<NavBar />
		<div className="allPlayers">
			<table>
				<thead>
					<tr>
						<th></th>
						<th>UserName</th>
						<th>Status</th>
						<th></th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{users.map((user: players) => {
						if (user.userUuid == me.userUuid)
							return ;
						return(<tr key={user.userUuid}>
							<td className="pp">
							</td>
							<td><a href={"./profile?uid=" + user.userUuid}>{user.userName}</a></td>
							<td>{user.online ? <p>Online</p> : <p>Offline</p>}</td>
							<td>{
								isMyFriend(user.userUuid) ?
									<button className="enable"  onClick={() => handleFriend(user.userUuid, false)}>Remove from friends</button>
									: ( invitationSent ?
									<button className="enable unclickable" onClick={() => handleFriend(user.userUuid, true)}>Invitation sent</button>
									: <button className="enable" onClick={() => handleFriend(user.userUuid, true)}>Add Friend</button>
									)
								}</td>
							<td>{
								isBlocked(user.userUuid) ?
									<button className="enable" onClick={() => handleBlock(user.userUuid, false)}>Unblock</button>
									: <button className="enable" onClick={() => handleBlock(user.userUuid, true)}> Block </button>
							}</td>
						</tr>
					)})}
				</tbody>
			</table>
		</div>
	</>
	);
}

export default AllPlayers;