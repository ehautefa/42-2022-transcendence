import styles from '../styles/NavBar.module.css'

function navBar() {
	return (<div className={styles.nav}>
		<input type="checkbox" className={styles.check} id="nav-ckeck">
		</input>
		<div id="nav-header">
			<a href="https://localhost:3000">
				Transcendence
			</a>
		</div>
		<div className={styles.navButton}>
			<label for="nav-check">
				<span></span>
				<span></span>
				<span></span>
			</label>
		</div>

		<div className={styles.navLinks}>
			<a href="/Game">Game</a>
			<a href="/Chat">Chat</a>
			<a href="/myProfile" >My Profile</a>
		</div>
	</div>)
}

export default navBar;