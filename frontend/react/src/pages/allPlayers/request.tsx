var credentials: RequestCredentials = "include";

export async function getAllUuidWithUserName() {
	const url = process.env.REACT_APP_BACK_URL + "/user/allUuidWithUserName";
	var requestOptions = {
		method: 'GET',
        credentials: credentials
	};

	let users = await (await fetch(url, requestOptions)).json();
	if (users.statusCode === 401) {
		window.location.replace(process.env.REACT_APP_BACK_URL + "/auth/login");
	}
	console.log("USERS", users);
	return await users;
}

export async function addFriend(friendUuid: string) {
	var url: string = process.env.REACT_APP_BACK_URL + "/user/makeFriendRequest";

	var urlencoded = new URLSearchParams();
	urlencoded.append("userUuid", friendUuid);

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
	urlencoded.append("userUuid", friendUuid);

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