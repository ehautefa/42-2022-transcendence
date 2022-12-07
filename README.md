# ft_transcendence
Final project of 42's Common Core.<br />
Single page web application powering the mighty Pong contest !
- Beautiful retro design;
- Accessible via 42 Authentication;
- SQL injections proof.

![ft_transcendence](https://user-images.githubusercontent.com/52586053/206234436-b429ddc6-55fe-4638-99d8-a4e3f2e41e9e.gif)

## Features
### A multiplayer playable Pong game:
- Matchmaking system;
- Custom options (ball color, bar size);
- Game responsiveness;
- Spectator mode.
### User accounts
- Customizable name and avatar;
- Possible two factor authentication via Google Authenticator;
- Friends management system;
- Displayed status (online, offline);
- Stats, game history, achievements.
### A fully functional web chat:
- Direct messages;
- Public rooms, private rooms on invitation and protected rooms accessible via password;
- Possibility to block, mute or ban other users;
- Roles management system: owner, administrator or simple user;
- Game invitations.


## Technologies used

<p align="center">
<img height="100" src="https://logos-download.com/wp-content/uploads/2016/09/React_logo_wordmark.png">
&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
<img height="100" src="https://cdn.icon-icons.com/icons2/2699/PNG/512/socketio_logo_icon_168806.png">
<br />
<img height="100" src="https://camo.githubusercontent.com/c704e8013883cc3a04c7657e656fe30be5b188145d759a6aaff441658c5ffae0/68747470733a2f2f6e6573746a732e636f6d2f696d672f6c6f676f5f746578742e737667">
&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
<img height="100" src="https://github.com/typeorm/typeorm/raw/master/resources/logo_big.png">
<br />
<img height="100" src="https://user-images.githubusercontent.com/52586053/205859300-63c23a51-5f49-43c6-bb80-a68b8274e3c0.png">
<br />
<img height="100" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Docker_%28container_engine%29_logo.svg/1280px-Docker_%28container_engine%29_logo.svg.png">
&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
<img height="100" src="https://miro.medium.com/max/453/1*QVFjsW8gyIXeCUJucmK4XA.png">
</p>

## Usage
### Step 1
Create an application on your 42 account (if you do not have a 42 account, you can get one [here](https://42.fr/admissions/42-piscine/)):<br />
`Settings` => `API` => `REGISTER A NEW APP`<br />
Fill up the informations of your app the way you want except for the `Redirect URI` field which must be:<br />
`https://hostname:4443/auth/login` (`https` is mandatory, no `/` at the end).<br />
For a local setup, `hostname` will be the hostname of your machine, which you can get by typing `hostname` in your terminal.

### Step 2
Add the `.env` file to the root of the project. You can find a template [here](https://gist.github.com/rotrojan/8327ed83703c88a0f114cbf7869d7e10).
Be sure to fill it properly:
- The `APP_HOST` variable is set to your hostname;
- The `FT_CLIENT_ID` variable is set to the UID you got on step 1;
- The `FT_CLIENT_SECRET` variable is set to the secret you got on step 1;
- The `JWT_ACCESS_TOKEN_SECRET` variable is set to a a string of characters you can ramdomly generate.

### Step 3
Build the app.
```
docker-compose up --build
```
You can now navigate to `https://hostname:4443` (do not forget to replace `hostame`) and enjoy a good old Pong Game with your 42's friends. 😉
