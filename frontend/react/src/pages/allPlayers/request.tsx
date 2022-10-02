var credentials: RequestCredentials = "include";

export async function getAllUuidWithUserName() {
	const url = process.env.REACT_APP_BACK_URL + "/user/allUuidWithUserName";
	var requestOptions = {
		method: 'GET',
        credentials: credentials
	};

	let users = await (await fetch(url, requestOptions)).json();
	if (users.statusCode === 401) {
		window.location.replace(process.env.REACT_APP_BACK_URL + "/auth/login");
	}
	console.log("USERS", users);
	return await users;
}