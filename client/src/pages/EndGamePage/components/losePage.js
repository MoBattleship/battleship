import React from 'react'
import { Button } from 'react-bootstrap'
import {useHistory} from 'react-router-dom'

function LosePage({name}) {
    const history = useHistory()
    return(
        <div className="container border rounded-lg shadow-sm justify-content-center m-5" style={{backgroundColor: '#000'}}>
            <div className="column" style={{backgroundColor: '#000'}}>
    <h2 style={{backgroundColor: 'transparent'}} className="text-white">Sorry {name}! you lose</h2>
                <img src={require("../../../assets/skull.gif")} alt="trophy" />
                <div style={{backgroundColor: 'transparent'}} className="row justify-content-center">
                    <Button onClick={() => history.push("/")} className="btn btn-info">Play Again ?</Button>
                </div>
            </div>
        </div>
    )
}

export default LosePage