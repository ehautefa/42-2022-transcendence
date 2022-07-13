import './NavBar.module.css'

function navBar() {
	return (<nav id="navBar">
			<div>
				<a href="http://localhost:3000">Something</a>
			</div>
			<div>
				<ul id="nav">
					<li><a href="#">Home</a></li>
					<li><a href="#">About</a></li>
					<li><a href="#">Contact</a></li>
					<li><a href="#">Services</a></li>
				</ul>
			</div>
			<div class="menu" id="menu">
				<span></span>
				<span></span>
				<span></span>
			</div>
		</nav>)
}

export default navBar;