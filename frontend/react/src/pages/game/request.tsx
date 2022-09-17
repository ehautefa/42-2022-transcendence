import { useState } from "react";

export function createMatch(user1uid:string, user2uid:string) : string {
    console.log("create matches", user1uid, "and", user2uid);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("user1uid", user1uid);
    urlencoded.append("user2uid", user2uid);

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded
    };

    fetch("http://localhost:3011/match/createMatch", requestOptions)
        .then(response => response.text())
        .then(result => console.log(JSON.parse(result)))
        .catch(error => console.log('error', error));
    return ("");
}