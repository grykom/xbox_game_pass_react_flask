import React, { useContext } from 'react';
import { useRouteMatch } from "react-router-dom";
import './GamePage.css';
import { GamesContext } from "../Context"


function GamePage() {
    const match = useRouteMatch();
    const { gamesReady, games } = useContext(GamesContext);

    return (
        <div>
            {gamesReady && (
                <div>
                    {games
                        .filter(game => game.game_id.includes(match.params.game_id))
                        .map((game, idx) => <SingleGame key={idx} game={game} /> )}
                </div>
            )}
        </div>
    )
}

function SingleGame({ game }) {
    return (
        <div className="cell-game">
            <img className="full-width" src={game.game_cover} alt={game.game_name}></img>
            <table className="table-fixed">
            <caption>{game.game_name}</caption>
                <thead>
                    <tr>
                        <th>developer</th>
                        <th>publisher</th>
                        <th>{game.rating_system}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{game.developer}</td>
                        <td>{game.publisher}</td>
                        <td className="text-center">
                            <img className="width-90" src={game.rating_image} alt={game.game_name} />
                        </td>
                    </tr>
                </tbody>                    
            </table>
            <div className="text-center m-b-1">
                {game.categories
                    .map((category, idx) => ( <span key={idx} className="tag">{ category }</span> ))}
            </div>                
            <details className="card">
                <summary className="card-header">Game description</summary>
                <div className="card-body">
                    {game.description}  
                </div>
            </details>               
        </div>
    )
}
export default GamePage
