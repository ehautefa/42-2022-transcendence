import { useState } from "react";
import { User, Match } from "../../type";

let i: number = 0;

export function FetchUser(uid: string) : User {
	let emptyUser: User = {userUuid: ""};
	const [user, setUser] = useState(emptyUser);

	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

	var url: string = "http://localhost:3011/user/" + uid;
	var requestOptions = {
		method: 'GET',
		headers: myHeaders,
	};

	fetch(url, requestOptions)
		.then(response => response.text())
		.then(result => setUser(JSON.parse(result)))
		.catch(error => console.log('error', error));
	return (user);
}

export function CreateUser() : string {
	console.log("create", i, "users");
	let emptyUser: User = {userUuid: ""};
	const [user, setUser] = useState(emptyUser);

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
	
	fetch("http://localhost:3011/user/create", requestOptions)
		.then(response => response.text())
		.then(result => setUser(JSON.parse(result)))
		.catch(error => console.log('error', error));
    const uid = user.userUuid;
    return (uid);
}

export async function GetMatchHistory(uid: string) {
	var url: string = "http://localhost:3011/match/user/" + uid;
	var requestOptions = {
		method: 'GET'
	};

	const match = await fetch(url, requestOptions)
		.then(response => response.text())
		.then(result => {
			return result;
		})
		.catch(error => console.log('error', error));
	console.log("GetMatchHistory", match);
	return (match);
}


export function GetAllMatch() : Match[] {
	let emptyMatch: Match[] = [];
	const [match, setMatch] = useState(emptyMatch);
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

	var url: string = "http://localhost:3011/match/all";
	var requestOptions = {
		method: 'GET',
		headers: myHeaders,
	};

	fetch(url, requestOptions)
		.then(response => response.text())
		.then(result => setMatch(JSON.parse(result)))
		.catch(error => console.log('error', error));
	return (match);
}

export function EditUsername(userUuid: string, newName: string) {
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
	
	fetch("http://localhost:3011/user/changeUsername", requestOptions)
		.then(response => response.text())
		.then(result => JSON.parse(result))
		.catch(error => console.log('error', error));
}