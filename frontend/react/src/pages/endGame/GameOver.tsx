import NavBar from "../../components/NavBar/NavBar"
import { NavLink } from "react-router-dom";

import "./endGame.css"

function GameOver() {
    return (
        <>
            <NavBar />
            <div className="endGame">
                <h1>Game Over</h1>
                <NavLink to="/match">See all match in Game</NavLink>
            </div>
        </>
    );
}

export default GameOver;