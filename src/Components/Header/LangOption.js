import React from 'react'

function LangOption({ language }) {
    if(language[0]){
        return <option value={language[0]}>{language[1]}</option>
    }else {
        return <option disabled>{language[1]}</option>
    }
}

export default LangOption
