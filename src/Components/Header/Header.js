import React, { useContext } from 'react';
import { LANGS } from "../../Data/langs";
import { GamesContext } from "../../Context";


function Header() {
    const { input, setInput,
            language, setLanguage,
            setLoading,
            setGameIds, setGameIdsReady,
            setGames, setGamesReady } = useContext(GamesContext);

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
        <div className="grid-inline m-b-1">
            <input className="cell" type="text" value={ input } onChange={(e) => setInput(e.target.value.toLowerCase())} placeholder="search for game title" />
            <select
                value={ language }
                onChange={ handleLanguageSelect }
                name="language"
            >
                {LANGS.map((lang, idx) => <LangOption key={idx} language={lang} /> )}
            </select>
        </div>
    )
}

function LangOption({ language }) {
    if(language[0]){
        return <option value={language[0]}>{language[1]}</option>
    }else {
        return <option disabled>{language[1]}</option>
    }
}
export default Header
