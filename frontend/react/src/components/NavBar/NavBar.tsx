import './NavBar.css'

function navBar() {
	return (<div className="nav">
		<input type="checkbox" className="check" id="nav-ckeck">
		</input>
		<div id="nav-header">
			<a href="http://localhost:3000">
				TRANSCENDENCE
			</a>
		</div>
		<div className="navButton">
			<label htmlFor="nav-check">
				<span></span>
				<span></span>
				<span></span>
			</label>
		</div>

		<div className="navLinks">
			<a href="/Game">GAME</a>
			<a href="/Chat">CHAT</a>
			<a href="/myProfile" >PROFILE</a>
		</div>
	</div>)
}

export default navBar;