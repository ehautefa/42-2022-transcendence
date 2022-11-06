var credentials: RequestCredentials = "include";

export async function getAllUuidWithUserNameWithoutMe(myUserUuid: string) {
	const url : string = "/user/allUuidWithUserName";
	var requestOptions = {
		method: 'GET',
        credentials: credentials
	};

	let users = await (await fetch(url, requestOptions)).json();
	if (await users.statusCode === 401) {
		window.location.assign("/auth/login");
		return ;
	}
	for (let i = 0; i < users.length; i++) {
		if (users[i].userUuid === myUserUuid) {
			users.splice(i, 1);
			break;
		}
	}
	return await users;
}

export async function addFriend(friendUuid: string) {
	var url: string = "/user/makeFriendRequest";

	var urlencoded = new URLSearchParams();
	urlencoded.append("userUuid", friendUuid);

	var requestOptions = {
		method: 'POST',
		body: urlencoded,
		credentials: credentials
	};

	let result = await (await fetch(url, requestOptions)).json();
	if (await result.statusCode === 401) {
		window.location.assign("/auth/login");
	} else if (await result.statusCode === 403) {
		alert(await result.message);
	} else {
		return result;
	}
	return [];
}

export async function removeFriend(friendUuid: string) {
	var url: string = "/user/removeFriend";

	var urlencoded = new URLSearchParams();
	urlencoded.append("userUuid", friendUuid);

	var requestOptions = {
		method: 'POST',
		body: urlencoded,
		credentials: credentials
	};

	let result = await (await fetch(url, requestOptions)).json();
	if (await result.statusCode === 401) {
		window.location.assign("/auth/login");
	} else if (await result.statusCode === 403) {
		alert(await result.message);
	} else 
		return result;
	return [];
}

export async function getMyBlocked() {
	const url : string = "/user/myBlocked";
	var requestOptions = {
		method: 'GET',
		credentials: credentials
	};

	let users = await (await fetch(url, requestOptions)).json();
	if (await users.statusCode === 401) {
		window.location.assign("/auth/login");
		return ;
	} 
	return await users;
}

export async function addBlocked(friendUuid: string) {
	var url: string = "/user/addBlocked";

	var urlencoded = new URLSearchParams();
	urlencoded.append("userUuid", friendUuid);

	var requestOptions = {
		method: 'POST',
		body: urlencoded,
		credentials: credentials
	};

	let result = await (await fetch(url, requestOptions)).json();
	if (await result.statusCode === 401) {
		window.location.assign("/auth/login");
	} else if (await result.statusCode === 403) {
		alert(await result.message);
		return [];
	} else {
		return await result;
	}
}

export async function removeBlocked(friendUuid: string) {
	var url: string = "/user/removeBlocked";

	var urlencoded = new URLSearchParams();
	urlencoded.append("userUuid", friendUuid);

	var requestOptions = {
		method: 'POST',
		body: urlencoded,
		credentials: credentials
	};

	let result = await (await fetch(url, requestOptions)).json();
	if (await result.statusCode === 401) {
		window.location.assign("/auth/login");
	} else if (await result.statusCode === 403) {
		alert(await result.message);
		return [];
	} else {
		return await result;
	}
}