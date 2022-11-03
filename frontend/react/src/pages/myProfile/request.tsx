var credentials: RequestCredentials = "include";

export async function getMe() {

	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

	var url: string = "/user/me";
	var requestOptions = {
		method: 'GET',
		headers: myHeaders,
		credentials: credentials,
	};

	let user = await (await fetch(url, requestOptions)).json()
	if (user.statusCode === 401) {
		window.location.assign("/auth/login");
	}
	return await user;
}

export async function GetMatchHistory(userName: string) {
	var url: string = "/match/user/" + userName;
	var requestOptions = {
		method: 'GET',
		credentials: credentials
	};

	let match = await (await fetch(url, requestOptions)).json();
	if (match.statusCode === 401) {
		window.location.assign("/auth/login");
	}
	return await match;
}

export async function ChangeUsername(newName: string) {
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

	var urlencoded = new URLSearchParams();
	urlencoded.append("newName", newName);

	const requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: urlencoded,
		credentials: credentials
	};

	const URL :string = "/user/changeUsername";
	let result = await fetch(URL, requestOptions);
	console.log(result);
	if (result.status === 403) {
		console.log("Username already taken");
		alert("Username already taken");
		return null;
	}
	if (result.status === 401) {
		window.location.assign("/auth/login");
	}
}

export async function disableTwoFactorAuth() {
	var url: string = "/user/disableTwoFactorAuth";
	var requestOptions = {
		method: 'POST',
		credentials: credentials
	};

	let result = await (await fetch(url, requestOptions)).json();
	if (result.statusCode === 401) {
		window.location.assign("/auth/login");
	}
	return await result;
}

export async function getMyFriends() {
	var url: string = "/user/myFriends";
	var requestOptions = {
		method: 'GET',
		credentials: credentials
	};

	let friends = await (await fetch(url, requestOptions)).json();
	if (friends.statusCode === 401) {
		window.location.assign("/auth/login");
	}
	return await friends;
}