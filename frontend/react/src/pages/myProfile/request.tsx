import { useState } from "react";
import { User, Match } from "../../type";

export async function FetchUser(uid: string) {
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

	var url: string = "http://localhost:3011/user/" + uid;
	var requestOptions = {
		method: 'GET',
		headers: myHeaders,
	};

	let user =  await fetch(url, requestOptions);
	return await user.json();
}

export function CreateUser() : string {
	let emptyUser: User = {userUuid: "", userName: ""};
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
	console.log("New user:", user);
	localStorage.setItem('userName', user.userName);
    const uid = user.userUuid;
    return (uid);
}

export async function GetMatchHistory(userName: string) {
	var url: string = "http://localhost:3011/match/user/" + userName;
	var requestOptions = {
		method: 'GET'
	};

	let match = await fetch(url, requestOptions);
	return await match.json();
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
	
	fetch("http://localhost:3011/user/changeUsername", requestOptions)
		.catch(error => console.log('error', error));
}