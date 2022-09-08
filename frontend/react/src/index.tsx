import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from "./pages/mainPage/mainPage";
import Game from "./pages/game/Game";
import Chat from "./pages/chat/Chat";
import MyProfile from './pages/myProfile/myProfile';
import Match from "./pages/match/Match"
import Win from "./pages/endGame/win";
import Lose from "./pages/endGame/lose";
import GameOver from "./pages/endGame/GameOver";
import Profile from './pages/Profile/Profile';
import ReceivePopUp from './components/ReceivePopUp/ReceivePopUp';
import { getSocket } from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const socket = getSocket();

var id = 0;

socket.on('invitePlayer', (data: any) => {
	console.log("INVITE PLAYER ON", data);
	console.log('my uid', localStorage.getItem('uid'));
	if (data.invitedUid === localStorage.getItem('uid')) {
		console.log("You are invite by", data.userName);
		// open a popup with a link to the game
		document.getElementById("ReceivePopupBackground")!.style.display = "block";
		id = data.id;
		
	}
})


root.render(<>
	<ReceivePopUp arg={id} />
	<BrowserRouter>
    	<Routes>
			<Route path="/" element={<App />} />
			<Route path="mainPage" element={<MainPage />} />
			<Route path="game" element={<Game />} />
			<Route path="chat" element={<Chat />} />
			<Route path="myProfile" element={<MyProfile />} />
			<Route path="match" element={<Match />} />
			<Route path="endGame/lose" element={<Lose />} />
			<Route path="endGame/win" element={<Win />} />
			<Route path="profile" element={<Profile />} />
			<Route path="endGame/gameOver" element={<GameOver />} />
		</Routes>
	</BrowserRouter>
</>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
