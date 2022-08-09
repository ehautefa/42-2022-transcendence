import NavBar from "../../components/NavBar/NavBar"
import "./Profil.css"
import { useState, useEffect } from "react";

function MyComponent() {

	useEffect(() => {
		var myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

		var urlencoded = new URLSearchParams();
		urlencoded.append("userName", "pika");

		const requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: urlencoded
		};

		fetch("http://localhost:3011/user/create", requestOptions)
			.then(response => response.text())
			.then(result => console.log(result))
			.catch(error => console.log('error', error));
	}, [])
	return <div>hello</div>
}


function myProfile() {
	MyComponent();
	return (<div>
		<NavBar />
		<div className="mainComposant">
			<div className="flex">
				<div className="info">
					<h3>Profile</h3>
					<ul>
						<li>Name : Pika <a>(edit)</a></li>
						<li>Current Status: Online</li>
						<li>Wins : 0</li>
						<li>Losses : 0</li>
					</ul>
					<button>Enable two-factor authentication</button>
				</div>
				<div className="pp">
					<a href="./editProfil">Editer</a>
				</div>
			</div>
			<div className="flex">
				<div className="friends">
					<h3>Friends</h3>
				</div>
				<div className="stats">
					<h3>Match History</h3>
				</div>
			</div>
		</div>
	</div>)
}

export default myProfile