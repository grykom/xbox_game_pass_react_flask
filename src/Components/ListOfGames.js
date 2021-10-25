import React, { useContext } from 'react';
import { NavLink } from "react-router-dom";
import './ListOfGames.css';
import { GamesContext } from "../Context"


function ListOfGames() {
    const { loading, games, gamesReady, input } = useContext(GamesContext);
    const loadingStyle = {
        width: `${ loading }%`
    };

    return (
        <div className="list-group list-striped cell-list">
            {gamesReady ? 
                games
                .filter(game => input === '' || game.game_name.toLowerCase().includes(input))
                .map((game, idx) => <NavLink key={idx} to={`/${game.game_id}`} activeClassName="active">{game.game_name}</NavLink>)
                : 
                <div className="text-center">loading games from microsoft database<span className="loading"></span>
                    <div className="progress-bar progress-success">
                        <div style={loadingStyle}>{ loading }%</div>
                    </div>
                </div>}
        </div>
    )
}
export default ListOfGames
