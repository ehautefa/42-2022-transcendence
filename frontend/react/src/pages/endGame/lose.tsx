import NavBar from "../../components/NavBar/NavBar"
import "./endGame.css"
import { Link } from "react-router-dom";

function Lose() {
    return (
        <>
            <NavBar />
            <div className="endGame">
                <h1>You lost</h1>
                <Link to="/game">Replay</Link>
            </div>
        </>
    );
}

export default Lose;