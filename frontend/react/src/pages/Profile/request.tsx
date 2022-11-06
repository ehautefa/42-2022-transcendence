var credentials: RequestCredentials = "include";

export async function getFriends(userUuid: string) {
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

	var url: string = "/user/friends/" + userUuid;
	var requestOptions = {
		method: 'GET',
		headers: myHeaders,
		credentials: credentials
	};

	let friends = await (await fetch(url, requestOptions)).json();
	if (await friends.statusCode === 401) {
		window.location.assign("/auth/login");
	}
	return await friends;
}

export async function FetchUser(uid: string) {
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

	var url: string = "/user/" + uid;
	var requestOptions = {
		method: 'GET',
		headers: myHeaders,
        credentials: credentials
	};

	let user = await (await fetch(url, requestOptions)).json();
	if (await user.statusCode === 401) {
		window.location.assign("/auth/login");
	}
	return await user;
}

export async function isMyBlocked(userUuid: string) {
	var url: string = "/user/isBlocked";

	var urlencoded = new URLSearchParams();
	urlencoded.append("userUuid", userUuid);

	var requestOptions = {
		method: 'POST',
		body: urlencoded,
		credentials: credentials
	};

	let result = await (await fetch(url, requestOptions)).json();
	if (await result.statusCode === 401) {
		window.location.assign("/auth/login");
	}
	return await result;
}

export async function isMyFriends(userUuid: string) {
	var url: string = "/user/isMyFriends";

	var urlencoded = new URLSearchParams();
	urlencoded.append("userUuid", userUuid);

	var requestOptions = {
		method: 'POST',
		body: urlencoded,
		credentials: credentials
	};

	let result = await (await fetch(url, requestOptions)).json();
	if (await result.statusCode === 401) {
		window.location.assign("/auth/login");
	}
	return await result;
}

export async function getPicture(uid: string) {
	var url: string = "/user/picture/" + uid;
	var requestOptions = {
		method: 'GET',
        credentials: credentials
	};
	
	return await fetch(url, requestOptions);
}

