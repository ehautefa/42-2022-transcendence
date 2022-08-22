import NavBar from "../../components/NavBar/NavBar"
import "./Profil.css"
import { FetchUser, GetMatchHistory } from "./request"
import { User } from "../../type";


function myProfile() {
	const uid = localStorage.getItem('uid');
	
	let user: User = {userUuid: ""}; 
	if (uid) {
		user = FetchUser(uid);
		GetMatchHistory(uid);
	}


	return (<div>
		<NavBar />
		<div className="mainComposantProfile">
			<div className="flex">
				<div className="info container">
					<h3>Profile</h3>
					<ul>
						<li>Name : {user.userName} <a href="/myProfile">(edit)</a></li>
						<li>Current Status: Online</li>
						<li>Wins : {user.wins}</li>
						<li>Losses : {user.losses}</li>
					</ul>
					<button>Enable two-factor authentication</button>
				</div>
				<a href="./editProfil">
					<div className="pp">
						<p>Edit</p>
					</div>
				</a>
			</div>
			<div className="flex">
				<div className="friends container">
					<h3>Friends</h3>
				</div>
				<div className="stats container">
					<h3>Match History</h3>
				</div>
			</div>
		</div>
	</div>)
}

export default myProfile