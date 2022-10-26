import NavBar from "../../components/NavBar/NavBar"
import "./endGame.css"
import { NavLink } from "react-router-dom";

function Lose() {
    return (
        <>
            <NavBar />
            <div className="endGame">
                <h1>You lost</h1>
                <NavLink to="/game">Replay</NavLink>
            </div>
        </>
    );
}

export default Lose;