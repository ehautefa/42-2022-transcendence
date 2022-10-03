var credentials: RequestCredentials = "include";

export async function getFriends(userUuid: string) {
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

	var url: string = process.env.REACT_APP_BACK_URL + "/user/friends/" + userUuid;
	var requestOptions = {
		method: 'GET',
		headers: myHeaders,
		credentials: credentials
	};

	let friends = await (await fetch(url, requestOptions)).json();
	if (friends.statusCode === 401) {
		window.location.replace(process.env.REACT_APP_BACK_URL + "/auth/login");
	}
	return await friends;
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

