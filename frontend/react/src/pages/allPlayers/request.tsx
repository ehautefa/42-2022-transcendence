var credentials: RequestCredentials = "include";

export async function getAllUuidWithUserNameWithoutMe(myUserUuid: string) {
	const url = process.env.REACT_APP_BACK_URL + "/user/allUuidWithUserName";
	var requestOptions = {
		method: 'GET',
        credentials: credentials
	};

	let users = await (await fetch(url, requestOptions)).json();
	if (users.statusCode === 401) {
		window.location.replace(process.env.REACT_APP_BACK_URL + "/auth/login");
	}
	for (let i = 0; i < users.length; i++) {
		if (users[i].userUuid === myUserUuid) {
			users.splice(i, 1);
			break;
		}
	}
	console.log("users", users);
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
	return await result;
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
	return await result;
}

export async function getMyBlocked() {
	const url = process.env.REACT_APP_BACK_URL + "/user/myBlocked";
	var requestOptions = {
		method: 'GET',
		credentials: credentials
	};

	let users = await (await fetch(url, requestOptions)).json();
	if (users.statusCode === 401) {
		window.location.replace(process.env.REACT_APP_BACK_URL + "/auth/login");
	}
	return await users;
}

export async function addBlocked(friendUuid: string) {
	var url: string = process.env.REACT_APP_BACK_URL + "/user/addBlocked";

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
	return await result;
}

export async function removeBlocked(friendUuid: string) {
	var url: string = process.env.REACT_APP_BACK_URL + "/user/removeBlocked";

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
	return await result;
}