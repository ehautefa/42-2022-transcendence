import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";

function Tmp() {
    var cookie : string | undefined = Cookies.get('access_token');
    console.log("cookie", cookie);
    
    if (cookie === undefined) {
        window.location.replace(process.env.REACT_APP_FRONT_UR + "/");
    } else {
        const token : any = jwtDecode(cookie);
        console.log("token", token);
        if (token && token.isTwoFactorAuthenticated !== undefined && token.isTwoFactorAuthenticated === false) {
            console.log("redirect");
            window.location.replace(process.env.REACT_APP_FRONT_URL + "/twoFa");
        } else {
            console.log("no redirect");
            window.location.replace(process.env.REACT_APP_FRONT_URL + "/mainPage");
        }
    }
    
    return (<></>)
}

export default Tmp;