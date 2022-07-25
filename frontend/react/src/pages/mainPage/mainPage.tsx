import NavBar from "../../components/NavBar/NavBar"
import "../../index.css"


function mainPage() {
	// var router = useRouter();
	// var token = router.query["code"];

	// Recuperation de la socket initialiser dans index
	// const socket = getSocket();
	// if (token) {
	// 	socket.emit("token", token);
	// }
	
	return (<div>
		<NavBar />
			<div className="login" >
				<h1>Bienvenue dans notre transcendence !</h1>
			</div>
	</div>)
}

export default mainPage