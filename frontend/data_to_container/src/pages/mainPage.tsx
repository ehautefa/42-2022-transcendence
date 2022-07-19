import NavBar from "../components/NavBar"
import styles from "../styles/Home.module.css"
import {getSocket} from "../pages/index"
import { useRouter } from "next/router";


function mainPage() {
	var router = useRouter();
	var token = router.query["code"];

	// Recuperation de la socket initialiser dans index
	const socket = getSocket();
	if (token) {
		socket.emit("token", token);
	}
	
	return (<div>
		<NavBar />
			<div className={styles.login} >
				<h1>Bienvenue dans notre transcendence !</h1>
			</div>
	</div>)
}

export default mainPage