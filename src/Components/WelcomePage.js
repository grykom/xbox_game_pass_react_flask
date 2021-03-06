import React, { useContext } from 'react';
import { GamesContext } from "../Context";


function WelcomePage() {
    const { welcomeInfo } = useContext(GamesContext);
    return (
        <div>
            <img className="full-width" src={welcomeInfo.imageUrl} alt={welcomeInfo.title}></img>
            <h2 className="text-center m-t-1">{welcomeInfo.title}</h2>
            <p>{welcomeInfo.description}</p>
        </div>
    )
}
export default WelcomePage
