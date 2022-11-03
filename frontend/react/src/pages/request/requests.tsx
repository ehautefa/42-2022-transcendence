var credentials: RequestCredentials = "include";

export async function acceptFriendRequest(friendUuid: string) {
	var url: string = "/user/acceptFriendRequest";

	console.log("acceptFriendRequest", friendUuid);
	var urlencoded = new URLSearchParams();
	urlencoded.append("userUuid", friendUuid);

	var requestOptions = {
		method: 'POST',
		body: urlencoded,
		credentials: credentials
	};

	let result = await (await fetch(url, requestOptions)).json();
	if (result.statusCode === 401) {
		window.location.assign("/auth/login");
	}
	return await result;
}

export async function refuseFriendRequest(friendUuid: string) {
	var url: string = "/user/refuseFriendRequest";

	console.log("refuseFriendRequest", friendUuid);
	var urlencoded = new URLSearchParams();
	urlencoded.append("userUuid", friendUuid);

	var requestOptions = {
		method: 'POST',
		body: urlencoded,
		credentials: credentials
	};

	let result = await (await fetch(url, requestOptions)).json();
	if (result.statusCode === 401) {
		window.location.assign("/auth/login");
	}
	return await result;
}

export async function getMyRequests() {
	var url: string = "/user/getMyRequests";

	var requestOptions = {
		method: 'GET',
		credentials: credentials
	};

	let result = await (await fetch(url, requestOptions)).json();
	if (result.statusCode === 401) {
		window.location.assign("/auth/login");
	}
	return result;
}