import { useState, useEffect } from "react";
import { Route, useLocation, Switch } from "react-router-dom";

import 'tawian-frontend';
import 'typeface-cousine';
import './App.css';

import SingleGame from "./Components/SingleGame";
import Header from "./Components/Header/Header";
import ListOfGames from "./Components/ListOfGames";
import WelcomePage from "./Components/WelcomePage";

const API_IP = 'http://127.0.0.1:5000'

function App() {
    // localstorages
    const localStorageLanguage = JSON.parse(localStorage.getItem('lang'))
    const localStorageGameIds = JSON.parse(localStorage.getItem('game_ids'))
    const localStorageGameProperties = JSON.parse(localStorage.getItem('game_properties'))

    const location = useLocation(); 
    const [ apiError, setApiError ] = useState(false);

    const [ welcomeInfo, setWelcomeInfo ] = useState([]);
    const [ gameIds, setGameIds ] = useState(localStorageGameIds || []);
    const [ gameIdsReady, setGameIdsReady ] = useState(false);

    const [ games, setGames ] = useState(localStorageGameProperties || []);
    const [ gamesReady, setGamesReady ] = useState(false);

    const [ loading, setLoading ] = useState(0);
    const [ input, setInput ] = useState('');
    const [ language, setLanguage ] = useState(localStorageLanguage || 'en-us');

    useEffect(() => {
        fetchGameIds(); 
    }, [language]);   
    
    const fetchGameIds = async () => { 
        const response = await fetch(`${API_IP}/api/games/list/${language}`)
        if(response.status === 200){
            const items = await response.json()
            const gameIdsArray = []
            items.map(game => 
                game.title ?
                    setWelcomeInfo(game) : 
                    gameIdsArray.push(game.id)
            ) 
            
            // check if localstore has the same data as a new 'game IDs' array
            function arraysEqual(a, b) {
                // https://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript/16430730
                if (a === b) return true;
                if (a == null || b == null) return false;
                if (a.length !== b.length) return false;
                for (let i = 0; i < a.length; ++i) {
                  if (a[i] !== b[i]) return false;
                }
                return true;
            }

            if(arraysEqual(gameIdsArray, localStorageGameIds)){
                // localstorage has exactly the same content
                setGamesReady(true);
            }else{
                // localstorage has a different content:
                setGameIds(gameIdsArray);   
                localStorage.setItem('game_ids', JSON.stringify(gameIdsArray)); // set new game ids
                localStorage.removeItem('game_properties'); // clear game_properties
                setGames([]);
                setGameIdsReady(true);
            }            
        }else{
            setApiError('error while downloading list of games');
        }
    }

    useEffect(() => {
        if(gameIdsReady){
            (async () => {
                const slices = Math.ceil(gameIds.length / 20);
                // fetch 20 games properties at once
                for(let i = 0; i < slices; i++){
                    const slicedPercent = Math.ceil(100 / (slices - 1) * i);
                    const slicedArray = gameIds.slice(i * 20, i * 20 + 20); // 0, 20; 20, 40 etc.
                    await fetchGameProperties(slicedArray, slicedPercent);                    
                }                 
                setGamesReady(true);
            })();
        }
    },[gameIdsReady]);

    const fetchGameProperties = async (slicedArray, slicedPercent) => {
        const method = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(slicedArray)
        };            
        const response = await fetch(`${API_IP}/api/games/info/${language}`, method)
        if(response.status === 200){
            const oldItems = JSON.parse(localStorage.getItem('game_properties')) || [];
            const freshItems = await response.json()
            freshItems.map(game => oldItems.push(game) )
            localStorage.setItem('game_properties', JSON.stringify(oldItems));
            setGames(oldItems);
            setLoading(slicedPercent);
        }else{
            setApiError('error while downloading games data');
        }
    }

    function handleLanguageSelect(e){
        setLanguage(e.target.value);
        localStorage.setItem('lang', JSON.stringify(e.target.value));
        // fresh start:
        localStorage.removeItem('game_properties');
        localStorage.removeItem('game_ids');
        setLoading(0);
        setGameIds([]);
        setGameIdsReady(false);
        setGames([]);
        setGamesReady(false);            
    }

    return (
    <div className="container">
        {apiError ? 
            <p className="alert alert-error">API error: {apiError}</p> :
            <>
            <Header handleType={(e) => setInput(e.target.value.toLowerCase())} handleLanguageSelect={handleLanguageSelect} input={input} language={language} />
            <div className="grid">
                <ListOfGames loading={loading} games={games} gamesReady={gamesReady} input={input} />
                <div className="cell">
                    <Switch>
                        <Route path="/" exact>
                            <WelcomePage welcomeInfo={welcomeInfo} />
                        </Route>
                        <Route path="/:game_id"> 
                        {gamesReady && (
                            <div>
                                {games
                                    .filter(game => game.game_id.includes(location.pathname.slice(1)))
                                    .map((game, idx) => <SingleGame key={idx} game={game} /> )}
                            </div>
                        )}
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
