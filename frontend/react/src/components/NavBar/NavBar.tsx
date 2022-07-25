import './NavBar.css'

function navBar() {
	return (<div className="nav">
		<input type="checkbox" className="check" id="nav-ckeck">
		</input>
		<div id="nav-header">
			<a href="https://localhost:3000">
				Transcendence
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
			<a href="/Game">Game</a>
			<a href="/Chat">Chat</a>
			<a href="/myProfile" >My Profile</a>
		</div>
	</div>)
}

export default navBar;