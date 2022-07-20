import NavBar from "../components/NavBar"
import Head from 'next/head'
import styles from "../styles/Profil.module.css"
import { getSocket } from "./index"

function Game() {
	// Recuperation de la socket initialiser dans index
	const socket = getSocket();

	return (<div>
		<Head>
			<title>My Profile</title>
			<meta name="description" content="My profile" />
			<link rel="icon" href="./public/favicon.ico" />
		</Head>
		<NavBar />
		<div className={styles.mainComposant}>
			</div>
	</div>)
}

export default Game