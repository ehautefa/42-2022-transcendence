import { Routes, Route } from 'react-router-dom';
import MainPage from "./pages/mainPage/mainPage";
import Game from "./pages/game/Game";
import Chat from "./pages/chat/Chat";
import MyProfile from './pages/myProfile/myProfile';
import Match from "./pages/match/Match"
import Win from "./pages/endGame/win";
import Lose from "./pages/endGame/lose";
import GameOver from "./pages/endGame/GameOver";
import Profile from './pages/Profile/Profile';
import AllPlayers from './pages/allPlayers/allPlayers';
import Request from './pages/request/Request';
import EditProfilePicture from './pages/myProfile/editProfilePicture';
import NotFound from './pages/notFound/notFound';
import TwoFa from './pages/twoFa/twoFa';
import Home from './Home';
import Login from './pages/login/login';


export default function App() {
    return (<>
        <Routes>
            <Route path="/" element={<Home />}>
                <Route path="login" element={<Login />} />
                <Route path="twoFa" element={<TwoFa />} />
                <Route path="mainPage" element={<MainPage />} />
                <Route path="game" element={<Game />} />
                <Route path="chat" element={<Chat />} />
                <Route path="myProfile" element={<MyProfile />} />
                <Route path="match" element={<Match />} />
                <Route path="endGame/lose" element={<Lose />} />
                <Route path="endGame/win" element={<Win />} />
                <Route path="profile" element={<Profile />} />
                <Route path="allPlayers" element={<AllPlayers />} />
                <Route path="endGame/gameOver" element={<GameOver />} />
                <Route path="request" element={<Request />} />
                <Route path="myProfile/editProfilePicture" element={<EditProfilePicture />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    </>
    );
}

