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
	if (await user.statusCode === 401) {
		window.location.assign("/");
		return ;
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
	if (await match.statusCode === 401) {
		window.location.assign("/");
		return ;
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
	let result = await (await fetch(URL, requestOptions)).json();
	if (await result.statusCode === 403) {
		alert(await result.message);
		return null;
	} else if (await result.statusCode === 401) {
		window.location.assign("/");
	}
}

export async function disableTwoFactorAuth() {
	var url: string = "/user/disableTwoFactorAuth";
	var requestOptions = {
		method: 'POST',
		credentials: credentials
	};

	let result = await (await fetch(url, requestOptions)).json();
	if (await result.statusCode === 401) {
		window.location.assign("/");
	} else if (await result.statusCode === 403) {
		alert(await result.message);
		return {};
	} else
		return await result;
}

export async function getMyFriends() {
	var url: string = "/user/myFriends";
	var requestOptions = {
		method: 'GET',
		credentials: credentials
	};

	let friends = await (await fetch(url, requestOptions)).json();
	if (await friends.statusCode === 401) {
		window.location.assign("/");
		return ;
	}
	return await friends;
}