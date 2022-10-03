var credentials: RequestCredentials = "include";

export async function getMe() {

    var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

	var url: string = process.env.REACT_APP_BACK_URL + "/user/me";
	console.log("GETME URL", url);
	var requestOptions = {
		method: 'GET',
		headers: myHeaders,
        credentials: credentials,
	};

	let user =  await (await fetch(url, requestOptions)).json()
	if (user.statusCode === 401) {
		window.location.replace(process.env.REACT_APP_BACK_URL + "/auth/login");
	}
	return await user;
}

export async function FetchUser(uid: string) {
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

	var url: string = process.env.REACT_APP_BACK_URL + "/user/" + uid;
	var requestOptions = {
		method: 'GET',
		headers: myHeaders,
        credentials: credentials
	};

	let user = await (await fetch(url, requestOptions)).json();
	if (user.statusCode === 401) {
		window.location.replace(process.env.REACT_APP_BACK_URL + "/auth/login");
	}
	return await user;
}

export async function GetMatchHistory(userName: string) {
	var url: string = process.env.REACT_APP_BACK_URL +  "/match/user/" + userName;
	var requestOptions = {
		method: 'GET',
		credentials: credentials
	};

	let match = await (await fetch(url, requestOptions)).json();
	if (match.statusCode === 401) {
		window.location.replace(process.env.REACT_APP_BACK_URL + "/auth/login");
	}
	return await match;
}

export async  function ChangeUsername(newName: string) {
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
	
	const URL = process.env.REACT_APP_BACK_URL + "/user/changeUsername";
	let result = await fetch(URL, requestOptions);
	if (result.status === 401) {
		window.location.replace(process.env.REACT_APP_BACK_URL + "/auth/login");
	}
}

export async function GetAllUsers() {
	var url: string = process.env.REACT_APP_BACK_URL + "/user/allUuidWithUserName";
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

export async function enableTwoFactorAuth() {
	var url: string = process.env.REACT_APP_BACK_URL + "/user/enableTwoFactorAuth";
	var requestOptions = {
		method: 'POST',
		credentials: credentials
	};

	let result = await (await fetch(url, requestOptions)).json();
	if (result.statusCode === 401) {
		window.location.replace(process.env.REACT_APP_BACK_URL + "/auth/login");
	}
	return await result;
}

export async function disableTwoFactorAuth() {
	var url: string = process.env.REACT_APP_BACK_URL + "/user/disableTwoFactorAuth";
	var requestOptions = {
		method: 'POST',
		credentials: credentials
	};

	let result = await (await fetch(url, requestOptions)).json();
	if (result.statusCode === 401) {
		window.location.replace(process.env.REACT_APP_BACK_URL + "/auth/login");
	}
	return await result;
}

export async function getMyFriends() {
	var url: string = process.env.REACT_APP_BACK_URL + "/user/myFriends";
	var requestOptions = {
		method: 'GET',
		credentials: credentials
	};

	let friends = await( await fetch(url, requestOptions)).json();
	console.log("FRIENDS", friends);
	if (friends.statusCode === 401) {
		window.location.replace(process.env.REACT_APP_BACK_URL + "/auth/login");
	}
	return await friends;
}