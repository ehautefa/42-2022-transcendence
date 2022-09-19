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
		}
	)
}