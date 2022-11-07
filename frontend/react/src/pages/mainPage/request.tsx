export async function getMe() {

    var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var credentials: RequestCredentials = "include";
	var url: string = "/user/me"
	var requestOptions = {
		method: 'GET',
		headers: myHeaders,
        credentials: credentials,
	};

	let user =  await (await fetch(url, requestOptions)).json();
	if (await user.statusCode === 401) {
		window.location.assign("/");
		return ;
	}
	return user;
}