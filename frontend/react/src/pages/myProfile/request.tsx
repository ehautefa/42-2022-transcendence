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

	return await (await fetch(url, requestOptions)).json()
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

	let user =  await fetch(url, requestOptions);
	return await user.json();
}

export async function GetMatchHistory(userName: string) {
	var url: string = process.env.REACT_APP_BACK_URL +  "/match/user/" + userName;
	var requestOptions = {
		method: 'GET'
	};

	let match = await fetch(url, requestOptions);
	return await match.json();
}

export function ChangeUsername(newName: string) {
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
	fetch(URL, requestOptions)
		.catch(error => console.log('error', error));
}

export async function GetAllUsers() {
	var url: string = process.env.REACT_APP_BACK_URL + "/user/allUuidWithUserName";
	var requestOptions = {
		method: 'GET',
        credentials: credentials
	};

	let users = await fetch(url, requestOptions);
	return await users.json();
}