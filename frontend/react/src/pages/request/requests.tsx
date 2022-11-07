import { Socket } from "socket.io-client";
import { getSocketChat } from "../../Home";

var credentials: RequestCredentials = "include";

export async function acceptFriendRequest(friendUuid: string) {
	var url: string = "/user/acceptFriendRequest";

	var urlencoded = new URLSearchParams();
	urlencoded.append("userUuid", friendUuid);

	var requestOptions = {
		method: 'POST',
		body: urlencoded,
		credentials: credentials
	};

	let result = await (await fetch(url, requestOptions)).json();
	if (await result.statusCode === 401) {
		window.location.assign("/");
	} else if (await result.statusCode === 403) {
		alert(await result.message);
		return [];
	} else
		return await result;
}

export async function refuseFriendRequest(friendUuid: string) {
	var url: string = "/user/refuseFriendRequest";

	var urlencoded = new URLSearchParams();
	urlencoded.append("userUuid", friendUuid);

	var requestOptions = {
		method: 'POST',
		body: urlencoded,
		credentials: credentials
	};

	let result = await (await fetch(url, requestOptions)).json();
	if (await result.statusCode === 401) {
		window.location.assign("/");
	} else if (await result.statusCode === 403) {
		alert(await result.message);
		return [];
	} else
		return await result;
}

export function respondToInvitation(roomId: string, acceptInvitaion: boolean) {
	const socket: Socket = getSocketChat();

	const param = {
		roomId: roomId,
		acceptInvitation: acceptInvitaion
	}
	socket.emit('respondToInvitation', param);
}

export async function getMyRequests() {
	var url: string = "/user/getMyRequests";

	var requestOptions = {
		method: 'GET',
		credentials: credentials
	};

	let result = await fetch(url, requestOptions);
	if (result.status === 401) {
		window.location.assign("/");
		return;
	}
	if (result)
		return result.json();
	return [];
}