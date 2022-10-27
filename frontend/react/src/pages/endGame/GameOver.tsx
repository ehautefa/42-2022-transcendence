import NavBar from "../../components/NavBar/NavBar"
import { Link } from "react-router-dom";

import "./endGame.css"

function GameOver() {
    return (
        <>
            <NavBar />
            <div className="endGame">
                <h1>Game Over</h1>
                <Link to="/match">See all match in Game</Link>
            </div>
        </>
    );
}

export default GameOver;