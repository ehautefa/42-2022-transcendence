import "./notFound.css";
import { Link } from "react-router-dom";

function notFound() {
    return (
        <>
            <div className="notFound">
                <h1>404 : Page Not Found</h1>
                <Link to="/">Return to Home</Link>
            </div>
        </>
    );
}

export default notFound;
