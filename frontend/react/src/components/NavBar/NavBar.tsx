import './NavBar.css'
import { useEffect, useState } from 'react'
import bell from "../../assets/bell.png"
import { getMyRequests } from "../../pages/request/requests"



function NavBar() {
	const [isNavExpanded, setIsNavExpanded] = useState(false)
	const [isBellExpanded, setIsBellExpanded] = useState(false)

	useEffect(() => {
		getMyRequests().then(
			(response) => {
				setIsBellExpanded(response.length > 0)
			}
		)
	})

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
					{
						isBellExpanded && <li className='request'>
							<a href="/request">
								<img src={bell} alt="request" />
							</a>
						</li>
					}
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