import NavBar from "../components/NavBar"

function mainPage() {
	const socket = sessionStorage.getItem("socket");
	socket.emit("custom-event", "coucou");
	return (<div>
		<NavBar />
		<h1>Bienvenue dans notre transcendence !</h1>
	</div>)
}

export default mainPage