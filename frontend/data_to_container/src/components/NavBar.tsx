import styles from '../styles/NavBar.module.css'

function navBar() {
	return (<div className={styles.nav}>
				<div id="nav-header">
					<a href="https://localhost:3000">
						Transcendence
					</a>
				</div>
				<div className={styles.navButton}>
				</div>

				<div className={styles.navLinks}>
					<a href="//github.io/jo_geek" target="_blank">Game</a>
					<a href="http://stackoverflow.com/users/4084003/" target="_blank">Chat</a>
					<a href="/monProfil" >Mon Profil</a>
				</div>
		</div>)
}

export default navBar;