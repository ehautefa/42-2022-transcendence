import NavBar from "../../components/NavBar/NavBar"
import { GameWindow } from "../game/Game"


export function Game(id:number) {
	return (<div>
		<NavBar />
		<div className="mainComposantGame">
			<GameWindow id={id}/>
		</div>
	</div>)
}

export default Game;