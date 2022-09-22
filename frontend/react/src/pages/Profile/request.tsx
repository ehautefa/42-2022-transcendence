var credentials: RequestCredentials = "include";

export function addInFriend(userUuid: string) {
	addFriend(userUuid);
}

export function removeFromFriend(userUuid: string) {
	removeFriend(userUuid);
}

export async function addFriend(friendUuid: string) {
	var url: string = process.env.REACT_APP_BACK_URL + "/user/addFriend";

	var urlencoded = new URLSearchParams();
	urlencoded.append("userUuidToHandle", friendUuid);

	var requestOptions = {
		method: 'POST',
		body: urlencoded,
		credentials: credentials
	};

	let result = await (await fetch(url, requestOptions)).json();
	if (result.statusCode === 401) {
		window.location.replace(process.env.REACT_APP_BACK_URL + "/auth/login");
	}
}

export async function removeFriend(friendUuid: string) {
	var url: string = process.env.REACT_APP_BACK_URL + "/user/removeFriend";

	var urlencoded = new URLSearchParams();
	urlencoded.append("userUuidToHandle", friendUuid);

	var requestOptions = {
		method: 'POST',
		body: urlencoded,
		credentials: credentials
	};

	let result = await (await fetch(url, requestOptions)).json();
	if (result.statusCode === 401) {
		window.location.replace(process.env.REACT_APP_BACK_URL + "/auth/login");
	}
}