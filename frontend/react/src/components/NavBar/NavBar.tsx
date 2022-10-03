import './NavBar.css'
import { useState } from 'react'

function NavBar() {
	const [isNavExpanded, setIsNavExpanded] = useState(false)

	return (
		<nav className="nav">
			<a href="/" className="nav-header">
				TRANSCENDENCE
			</a>
			<button className="navButton" onClick={() => {
				console.log("clicked:", isNavExpanded);
				setIsNavExpanded(!isNavExpanded);
			}}>
	 			<span></span>
	 			<span></span>
	 			<span></span>
	 			<span></span>
				<span></span>
			</button>
			<div
				className={isNavExpanded ? "navLinks expanded" : "navLinks"}>
				<ul>
					<li>
						<a href="/request">REQUEST</a>
					</li>
					<li>
						<a href="/allPlayers" >PLAYERS</a>
					</li>
					<li>
						<a href="/Match">MATCH</a>
					</li>
					<li>
						<a href="/Game">GAME</a>
					</li>
					<li>
						<a href="/Chat">CHAT</a>
					</li>
					<li>
						<a href="/myProfile" >PROFILE</a>
					</li>
				</ul>
			</div>
		</nav>)
}

export default NavBar;