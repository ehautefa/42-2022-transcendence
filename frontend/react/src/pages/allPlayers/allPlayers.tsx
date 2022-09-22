import { getAllUuidWithUserName } from "./request";
import { useState } from "react";
import "./allPlayers.css";
import { addInFriend, removeFromFriend } from "../Profile/request";
import NavBar from "../../components/NavBar/NavBar";
import {getSocketStatus} from "../../App";

const socketStatus = getSocketStatus();

type players = {
	userUuid: string;
	userName: string;
	status: boolean;
}

function AllPlayers() {
	const [users, setUsers] = useState([]);
	fetchPlayers();

	
	async function fetchPlayers() {
		const response = await getAllUuidWithUserName();
		setUsers(response);
		socketStatus.emit('getFriendsStatus', users, (data: any) => {
			setUsers(data);
		});
	}

	return (<>
		<NavBar />
		<div className="allPlayers">
			{users.map((user:players) => (
				<div className="onePlayer">
					<div className="pp"></div>
					<a href={"./profile?uid=" + user.userUuid}>{user.userName}</a>
					{user.status ? <p>Online</p> : <p>Offline</p>}
					<button className="enable" onClick={() => addInFriend(user.userUuid)}>Add in friends</button>
					<button className="enable" onClick={() => removeFromFriend(user.userUuid)}>Remove from friends</button>
				</div>
			))}
		</div>
	</>
	);
}

export default AllPlayers;