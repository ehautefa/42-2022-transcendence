import { useState } from "react";
import "./Request.css";
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
		// const response = await getMyRequest();
		// setRequests(response);
	}

	function accept(userUuid: string) {
		// acceptRequest(userUuid);
	}

	function refuse(userUuid: string) {
		// refuseRequest(userUuid);
	}

	return (<>
		<NavBar />
		<div className="allPlayers">
			{requests.map((request:players) => (
				<div className="onePlayer" key={request.userUuid}>
					<div className="pp"></div>
					<a href={"./profile?uid=" + request.userUuid}>{request.userName}</a>
					<button className="enable" onClick={() => accept(request.userUuid)}>Accept</button>
					<button className="enable" onClick={() => refuse(request.userUuid)}>Refuse</button>
				</div>
			))}
		</div>
	</>
	);
}

export default Request;