import NavBar from "../components/NavBar"
import styles from "../styles/Home.module.css"
import Profile from "../components/Profile"

function mainPage() {
	console.log("mainPage", Profile.name);
	return (<div>
		<NavBar />
			<div className={styles.login} >
				<h1>Bienvenue dans notre transcendence !</h1>
				<Profile />
			</div>
	</div>)
}

export default mainPage