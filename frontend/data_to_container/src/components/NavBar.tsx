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
					<a href="/Game">Game</a>
					<a href="/Chat">Chat</a>
					<a href="/myProfile" >My Profile</a>
				</div>
		</div>)
}

export default navBar;