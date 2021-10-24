import React from 'react'
import { LANGS } from "../../Data/langs";
import LangOption from "./LangOption";

function Header({handleType, handleLanguageSelect, input, language}) {
    return (
        <div className="grid-inline m-b-1">
            <input className="cell" type="text" value={input} onChange={handleType} placeholder="game title" />
            <select
                value={language}
                onChange={handleLanguageSelect}
                name="language"
            >
                {LANGS.map((lang, idx) => <LangOption key={idx} language={lang} /> )}
            </select>
        </div>
    )
}

export default Header
