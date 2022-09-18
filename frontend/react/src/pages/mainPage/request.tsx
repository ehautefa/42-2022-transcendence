import { getSocketStatus } from "../../App"
import { Socket } from "socket.io-client";

const socket: Socket = getSocketStatus();

export async function getMe() {

    var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var credentials: RequestCredentials = "include";
	var url: string = process.env.REACT_APP_BACK_URL + "/user/me"
	var requestOptions = {
		method: 'GET',
		headers: myHeaders,
        credentials: credentials,
	};

	await (await fetch(url, requestOptions)).json().then(
		(result) => {
			localStorage.setItem('uid', result.userUuid);
			localStorage.setItem('userName', result.userName);
			socket.on('init', (data: any) => {
				console.log("INIT", data);
			});
		}
	)
}