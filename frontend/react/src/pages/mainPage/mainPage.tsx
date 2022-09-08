import { useLocation } from "react-router-dom";

import NavBar from "../../components/NavBar/NavBar"
import "../../index.css"


function MainPage() {
	const code = new URLSearchParams(useLocation().search).get('code');

	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
	
	var urlencoded = new URLSearchParams();
	if (code)
		urlencoded.append('code', code);
	
	const requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: urlencoded
	};
	
	fetch("http://localhost:3011/auth/firstConnection", requestOptions)
		.then(response => response.text())
		.then(result => console.log("YO", result))
		.catch(error => console.log("Error :", error))


	return (<div>
		<NavBar />
			<div className="login" >
				<h1>{code}Bienvenue dans notre transcendence !</h1>
			</div>
	</div>)
}

export default MainPage