import { useState } from "react";
import "./ChatSideNav.css";
import InviteUser from "./menu/InviteUser";

function ChatSideNav() {
    var sidenav = document.getElementById("mySidenav");

    function openNav() {
        if (sidenav !== null) {
            sidenav.classList.add("active");
        }
    }

    function closeNav() {
        if (sidenav !== null)  {
            sidenav.classList.remove("active");
        }
    }

    return (
        <>
            <div id="mySidenav" className="sidenav">
                <button id="closeBtn" className="close" onClick={closeNav}>×</button>
                <ul>
                    {/* All User */}
                    <li><InviteUser /></li>
                    <li><a href="#">Leave Room</a></li>
                    {/* Admin */}
                    <li><a href="#">Add Admin</a></li>
                    <li><a href="#">Remove Admin</a></li>
                    <li><a href="#">Mute User</a></li>
                    <li><a href="#">Unmute User</a></li>
                    <li><a href="#">Ban User</a></li>
                    <li><a href="#">Unban User</a></li>
                    {/* Owner */}
                    <li><a href="#">Set Password</a></li>
                    <li><a href="#">Edit Password</a></li>
                    <li><a href="#">Remove Password</a></li>
                    <li><a href="#">Give Ownership</a></li>
                    <li><a href="#">Delete Room</a></li>
                </ul>
            </div>

            <button id="openBtn" onClick={openNav}>
                <span className="burger-icon">
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
            </button>
        </>
    )
}

export default ChatSideNav;