import React from "react";
import { verify } from "../apis/auth";
import { jwtDecode } from "jwt-decode";
import BadRouteHandler from "../routes/BadRouteHandler";

export async function checkUserAuth(token) {

    const unAuth = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.reload();
    }

    verify(token)
        .then(isValid => {
            let localUsername = localStorage.getItem("username"), usernameFromValidToken = (jwtDecode(token)).user_name;
            if (localUsername !== usernameFromValidToken) unAuth();
            return true;
        })
        .catch(error => {
            console.error(error);
            unAuth();
        })
}