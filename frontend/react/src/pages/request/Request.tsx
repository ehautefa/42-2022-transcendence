import { useEffect, useState } from "react";
import { acceptFriendRequest, GetInvitationChat, getMyRequests, refuseFriendRequest, respondToInvitation } from "./requests";
import NavBar from "../../components/NavBar/NavBar";
import { Link } from "react-router-dom";
import { Room } from "../../type";

function Request() {
	const [requests, setRequests] = useState([]);
	const [chatInvitations, setChatInvitations] = useState([] as Room[]);

	async function fetchRequest() {
		const response = await getMyRequests();
		setRequests(response);
		console.log("Request", response);
	}

	useEffect(() => {
		fetchRequest();
		setChatInvitations(GetInvitationChat());
	}, []);

	async function handleRequest(userUuid: string, accept: boolean) {
		let newRequest = [];
		if (accept) {
			newRequest = await acceptFriendRequest(userUuid);
		} else {
			newRequest = await refuseFriendRequest(userUuid);
		}
		setRequests(newRequest);
	}

	return (<>
		<NavBar />
		<div className="allPlayers">
			<table>
				<tbody>
					{requests.map((request: any) => {
						return (<tr key={request.userUuid}>
							<td>User</td>
							<td><Link to={"./profile?uid=" + request.userUuid}>{request.userName}</Link></td>
							<td><button className="enable" onClick={() => handleRequest(request.userUuid, true)}>Accept</button></td>
							<td><button className="enable" onClick={() => handleRequest(request.userUuid, false)}>Refuse</button></td>
						</tr>
						)
					})}
					{chatInvitations.map((room: Room) => {
						return (<tr key={room.id}>
							<td>Room</td>
							<td>{room.name}</td>
							<td><button className="enable" onClick={() => respondToInvitation(room.id, true)}>Accept</button></td>
							<td><button className="enable" onClick={() => respondToInvitation(room.id, false)}>Refuse</button></td>
						</tr>
						)
					})}
				</tbody>
			</table>

		</div>
	</>
	);
}

export default Request;