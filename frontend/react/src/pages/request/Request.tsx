import { useState } from "react";
import "./Request.css";
import { acceptFriendRequest, getMyRequests } from "./requests";
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

	function refuse(userUuid: string) {
		// refuseRequest(userUuid);
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
						return (<tr key={request}>
							<td className="pp">
							</td>
							<td><a href={"./profile?uid=" + request}>elise</a></td>
							<td><button className="enable" onClick={() => acceptFriendRequest(request)}>Accept</button></td>
							<td><button className="enable" onClick={() => refuse(request)}>Refuse</button></td>
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