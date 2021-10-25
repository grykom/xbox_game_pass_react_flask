import React from 'react'
import { NavLink } from "react-router-dom";
import './ListOfGames.css';

function ListOfGames({ loading, games, gamesReady, input }) {
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
