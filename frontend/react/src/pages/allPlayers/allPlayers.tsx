import { getAllUuidWithUserName } from "./request";
import { useState } from "react";
import "./allPlayers.css";
import { addFriend, removeFriend } from "./request";
import NavBar from "../../components/NavBar/NavBar";
import {getSocketStatus} from "../../App";
import { getMyFriends } from "../myProfile/request";

const socketStatus = getSocketStatus();
var update = true;

type players = {
	userUuid: string;
	userName: string;
	status: boolean;
}

function AllPlayers() {
	const emptyFriends = new Array<players>();
	const [users, setUsers] = useState([]);
	const [friends, setFriends] = useState(emptyFriends);
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
	}

	return (<>
		<NavBar />
		<div className="allPlayers">
			{users.map((user:players) => (
				<div className="onePlayer" key={user.userUuid}>
					<div className="pp"></div>
					<a href={"./profile?uid=" + user.userUuid}>{user.userName}</a>
					{user.status ? <p>Online</p> : <p>Offline</p>}
					{
						friends.includes(user) ?
						<button className="enable" onClick={() => removeFriend(user.userUuid)}>Remove from friends</button>
						: <button className="enable" onClick={() => addFriend(user.userUuid)}>Add in friends</button>
					}
				</div>
			))}
		</div>
	</>
	);
}

export default AllPlayers;