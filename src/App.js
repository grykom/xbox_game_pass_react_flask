import { useContext } from "react";
import { Route, Switch } from "react-router-dom";

import 'tawian-frontend';
import 'typeface-cousine';
import './App.css';

import GamePage from "./Components/GamePage";
import Header from "./Components/Header/Header";
import ListOfGames from "./Components/ListOfGames";
import WelcomePage from "./Components/WelcomePage";
import { GamesContext } from "./Context"

function App() {
    const { apiError } = useContext(GamesContext)

    return (
    <div className="container">
        {apiError ? 
            <p className="alert alert-error">API error: {apiError}</p> :
            <>
            <Header />
            <div className="grid">
                <div className="cell">
                    <ListOfGames />
                </div>
                <div className="cell">
                    <Switch>
                        <Route path="/" exact>
                            <WelcomePage />
                        </Route>
                        <Route path="/:game_id"> 
                            <GamePage />
                        </Route> 
                    </Switch>
                </div>
            </div>
            <div className="footer"><a href="https://github.com/grykom/xbox_game_pass_react_flask">github</a></div>
            </>
        }
    </div>
    );
}

export default App;
