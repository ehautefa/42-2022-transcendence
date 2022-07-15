import NavBar from "../components/NavBar"
import styles from "../styles/Home.module.css"

function mainPage() {
	return (<div>
		<NavBar />
			<div className={styles.login} >
				<h1>Bienvenue dans notre transcendence !</h1>
			</div>
	</div>)
}

export default mainPage