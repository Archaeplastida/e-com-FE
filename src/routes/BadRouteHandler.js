import React from 'react';
import { useNavigate } from 'react-router-dom';

const BadRouteHandler = ({condition}) => {
    const navigate = useNavigate();
    if(condition === "bad route") navigate("/");
    if(condition === "unauth") navigate("/login");
    return(
        <p>404</p>
    )
}

export default BadRouteHandler;