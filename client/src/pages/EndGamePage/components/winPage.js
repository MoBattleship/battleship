import React from 'react'
import { Button } from 'react-bootstrap'
import {useHistory} from 'react-router-dom'

function WinPage({name}) {
    const history = useHistory()
    return(
        <div className="container border rounded-lg shadow-sm justify-content-center m-5" style={{backgroundColor: '#ffffff'}}>
            <div className="column" style={{backgroundColor: '#ffffff'}}>
    <h2 style={{backgroundColor: 'transparent'}}>Congratulations {name}</h2>
                <img src={require("../../../assets/trophy.gif")} alt="trophy" />
                <div style={{backgroundColor: 'transparent'}} className="row justify-content-center">
                    <Button onClick={() => history.push("/")} className="btn btn-info">Play Again ?</Button>
                </div>
            </div>
        </div>
    )
}

export default WinPage