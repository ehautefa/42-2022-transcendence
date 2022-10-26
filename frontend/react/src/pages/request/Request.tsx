import { useEffect, useState } from "react";
import { acceptFriendRequest, getMyRequests, refuseFriendRequest } from "./requests";
import NavBar from "../../components/NavBar/NavBar";
import { NavLink } from "react-router-dom";

function Request() {
	const [requests, setRequests] = useState([]);

	async function fetchRequest() {
		const response = await getMyRequests();
		setRequests(response);
		console.log("REquest", response);
	}

	useEffect(() => {
		fetchRequest();
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
							<td className="pp">
							</td>
							<td><NavLink to={"./profile?uid=" + request.userUuid}>{request.userName}</NavLink></td>
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