import { useEffect, useState } from "react";
import { acceptFriendRequest, getMyRequests, refuseFriendRequest, respondToInvitation } from "./requests";
import NavBar from "../../components/NavBar/NavBar";
import { Link } from "react-router-dom";
import { Room } from "../../type";
import { getSocketChat } from "../../App";

function Request() {
	const [requests, setRequests] = useState([]);
	const [chatInvitations, setChatInvitations] = useState([] as Room[]);
	const socketChat = getSocketChat();


	async function fetchRequest() {
		const response = await getMyRequests();
		setRequests(response);
		console.log("Request", response);
	}

	useEffect(() => {
		socketChat.on('updatePending', () => {
			socketChat.emit('getPendingInvitations', (invitation: Room[]) => {
				setChatInvitations(invitation);
			});
		})
		return () => {
			socketChat.off('updatePending');
		}
	})

	useEffect(() => {
		fetchRequest();
		socketChat.emit('getPendingInvitations', (invitation: Room[]) => {
			setChatInvitations(invitation);
		});
	}, [socketChat]);

	async function handleRequest(userUuid: string, accept: boolean) {
		let newRequest = [];
		if (accept) {
			newRequest = await acceptFriendRequest(userUuid);
		} else {
			newRequest = await refuseFriendRequest(userUuid);
		}
		setRequests(newRequest);
	}

	async function HandleInvitation(this: any, roomId: string, accept: boolean) {
		respondToInvitation(roomId, accept);
		if (accept === true && chatInvitations.length <= 1 && requests.length === 0) {
			window.location.assign("/chat?room=" + roomId);
			// window.location.href = "/chat?room=" + roomId;
			// this.props.history.push("/chat?room=" + roomId);
			// window.history.replaceState("", "", "/chat?room=" + roomId);
			// this.navigate("/chat?room=" + roomId);
		}

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
							<td><button className="enable" onClick={() => HandleInvitation(room.id, true)}>Accept</button></td>
							<td><button className="enable" onClick={() => HandleInvitation(room.id, false)}>Refuse</button></td>
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