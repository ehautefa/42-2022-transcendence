import type { NextPage } from 'next'
import Head from 'next/head'
import LoginForm from '../components/login-form'
import mainPage from './mainPage';
import { io } from "socket.io-client";
import styles from '../styles/Home.module.css'

export const socket = io("http://deb:3000");

const Home: NextPage = () => {
	//Connect to server
	socket.on("connect", () => {
		console.log("connection established ", socket.id);
		sessionStorage.setItem("socket", socket);
	});
	return (
		<div className={styles.container}>
			<Head>
				<title>Login Page</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				<mainPage socket={socket} />
			</main>

			<footer className={styles.footer}>
			</footer>
		</div>
	)
}

export default Home
