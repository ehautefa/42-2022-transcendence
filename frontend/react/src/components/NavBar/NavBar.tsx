import './NavBar.css'
import { useEffect, useState } from 'react'
import bell from "../../assets/bell.png"
import { getMyRequests } from "../../pages/request/requests"
import { NavLink } from "react-router-dom"
import { Room } from '../../type'
import { getSocketChat, getSocketStatus } from "../../Home"



function NavBar() {
	const [isNavExpanded, setIsNavExpanded] = useState(false)
	const [isBellExpanded, setIsBellExpanded] = useState(false)
	const socketChat = getSocketChat();
	const socketStatus = getSocketStatus();


	useEffect(() => {
		socketStatus.on('refreshRequest', () => {
			getMyRequests().then(
				(response) => {
					socketChat.emit('getPendingInvitations', (invitation: Room[]) => {
						setIsBellExpanded(invitation.length > 0 || response.length > 0)
					});
				}
			)
		})
		getMyRequests().then(
			(response) => {
				if (response && response.length > 0) {
					setIsBellExpanded(true);
				}
			});
		socketChat.emit('getPendingInvitations', (invitation: Room[]) => {
			if (invitation.length > 0) {
				setIsBellExpanded(true);
			}
		});
	}, [socketChat, socketStatus])

	return (
		<nav className="nav">
			<NavLink to="/" className="nav-header">
				TRANSCENDENCE
			</NavLink>
			<button className="navButton" onClick={() => {
				setIsNavExpanded(!isNavExpanded);
			}}>
				<span></span>
				<span></span>
				<span></span>
			</button>
			<div
				className={isNavExpanded ? "navLinks expanded" : "navLinks"}>
				<ul>
					{
						isBellExpanded && <li className='request'>
							<NavLink to="/request">
								<img src={bell} alt="request" />
							</NavLink>
						</li>
					}
					<li>
						<NavLink to="/allPlayers" >PLAYERS</NavLink>
					</li>
					<li>
						<NavLink to="/Match">MATCH</NavLink>
					</li>
					<li>
						<NavLink to="/Game">GAME</NavLink>
					</li>
					<li>
						<NavLink to="/Chat">CHAT</NavLink>
					</li>
					<li>
						<NavLink to="/myProfile" >PROFILE</NavLink>
					</li>
				</ul>
			</div>
		</nav>)
}

export default NavBar;