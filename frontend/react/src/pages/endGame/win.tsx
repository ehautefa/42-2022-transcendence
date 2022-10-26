import { NavLink } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar"
import "./endGame.css"

function Win() {
    return (
        <>
            <NavBar />
            <div className="endGame">
                <h1>You won</h1>
                <NavLink to="/game">Replay</NavLink>
            </div>
        </>
    );
}

export default Win;