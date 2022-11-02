import Cookies from "js-cookie";
import NavBar from "../../components/NavBar/NavBar"
import "../../index.css"

function MainPage() {
	var cookie : string = Cookies.get('access_token');
	console.log("cookie", cookie);

	return (<>
		<NavBar />
		<div className="login" >
			<h1>Bienvenue dans notre transcendence !</h1>
		</div>
	</>)
}

export default MainPage;