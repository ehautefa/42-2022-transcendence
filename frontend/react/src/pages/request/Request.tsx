import { useState } from "react";
import "./Request.css";
import { acceptFriendRequest, getMyRequests, refuseFriendRequest } from "./requests";
import NavBar from "../../components/NavBar/NavBar";

var update = true;

type players = {
	userUuid: string;
	userName: string;
	status: boolean;
}

function Request() {
	const [requests, setRequests] = useState([]);
	if (update) {
		update = false;
		fetchRequest();
	}


	async function fetchRequest() {
		const response = await getMyRequests();
		setRequests(response);
		console.log("REquest", response);
	}

	async function handleRequest(userUuid: string, accept: boolean) {
		if (accept) {
			await acceptFriendRequest(userUuid);
		} else {
			await refuseFriendRequest(userUuid);
		}
		fetchRequest();
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
					{requests.map((request: any) => {
						return (<tr key={request.userUuid}>
							<td className="pp">
							</td>
							<td><a href={"./profile?uid=" + request.userUuid}>{request.userName}</a></td>
							<td><button className="enable" onClick={() => handleRequest(request.userUuid, true)}>Accept</button></td>
							<td><button className="enable" onClick={() => handleRequest(request.userUuid, false)}>Refuse</button></td>
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