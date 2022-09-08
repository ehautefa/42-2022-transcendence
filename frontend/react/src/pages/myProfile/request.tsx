
export async function FetchUser(uid: string) {
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

	var url: string = process.env.REACT_APP_BACK_URL + "/user/" + uid;
	var requestOptions = {
		method: 'GET',
		headers: myHeaders,
	};

	let user =  await fetch(url, requestOptions);
	return await user.json();
}

export async function CreateUser() {
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
	
	var urlencoded = new URLSearchParams();
	urlencoded.append("userName", "Elise");
	urlencoded.append("userPassword", "bidule");
	
	const requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: urlencoded
	};
	
	const url = process.env.REACT_APP_BACK_URL + "/user/create";
	let user = await (await fetch(url, requestOptions)).json();
	return user;
}

export async function GetMatchHistory(userName: string) {
	var url: string = process.env.REACT_APP_BACK_URL +  "/match/user/" + userName;
	var requestOptions = {
		method: 'GET'
	};

	let match = await fetch(url, requestOptions);
	return await match.json();
}

export function ChangeUsername(userUuid: string, newName: string) {
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

	var urlencoded = new URLSearchParams();
	urlencoded.append("userUuid", userUuid);
	urlencoded.append("newName", newName);
	
	const requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: urlencoded
	};
	
	const URL = process.env.REACT_APP_BACK_URL + "/user/changeUsername";
	console.log("URL:", URL);
	fetch(URL, requestOptions)
		.catch(error => console.log('error', error));
}

export async function GetAllUsers() {
	var url: string = process.env.REACT_APP_BACK_URL + "/user/all";
	var requestOptions = {
		method: 'GET',
	};

	let users = await fetch(url, requestOptions);
	return await users.json();
}