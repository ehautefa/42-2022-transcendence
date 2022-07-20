import NavBar from "../components/NavBar"
import Head from 'next/head'
import styles from "../styles/Profil.module.css"
import { getSocket } from "./index"
import Image from 'next/image';

function myProfile() {
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
			<div className={styles.flex}>
				<div className={styles.info}>
					<h3>Profile</h3>
					<ul>
						<li>Name : Pika <a>(edit)</a></li>
						<li>Current Status: Online</li>
						<li>Wins : 0</li>
						<li>Losses : 0</li>	
					</ul>
					<button>Enable two-factor authentication</button>
				</div>
				<div className={styles.pp}>
					<a href="./editProfil">Editer</a>
				</div>
			</div>
			<div className={styles.flex}>
				<div className={styles.friends}>
					<h3>Friends</h3>
				</div>
				<div className={styles.stats}>
					<h3>Match History</h3>
				</div>
			</div>
		</div>
	</div>)
}

export default myProfile