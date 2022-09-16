export async function getMe() {

    var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var credentials: RequestCredentials = "include";
	var url: string = process.env.REACT_APP_BACK_URL + "/user/me"
	var requestOptions = {
		method: 'GET',
		headers: myHeaders,
        credentials: credentials,
        // withcredenbotials: true,
	};

	let user =  await fetch(url, requestOptions);
    console.log(user);

    // TO DO, put username and uid in localstorage
}