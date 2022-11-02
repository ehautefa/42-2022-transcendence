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

	let user =  await (await fetch(url, requestOptions)).json();
	if (user.statusCode === 401) {
		window.location.assign(process.env.REACT_APP_BACK_URL + "/auth/login");
	}
	return user;
}