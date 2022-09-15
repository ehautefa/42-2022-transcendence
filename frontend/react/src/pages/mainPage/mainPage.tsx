import NavBar from "../../components/NavBar/NavBar"
import "../../index.css"
import { getMe } from "./request"

function MainPage() {
	getMe();

	return (<>
		<NavBar />
			<div className="login" >
				<h1>Bienvenue dans notre transcendence !</h1>
			</div>
	</>)
}

export default MainPage