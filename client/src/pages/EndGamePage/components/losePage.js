import React from 'react'
import { Button } from 'react-bootstrap'

function LosePage() {
    return(
        <div className="container border rounded-lg shadow-sm justify-content-center m-5" style={{backgroundColor: '#000'}}>
            <div className="column" style={{backgroundColor: '#000'}}>
                <h2 style={{backgroundColor: 'transparent'}} className="text-white">Loser</h2>
                <img src={require("../../../assets/skull.gif")} alt="trophy" />
                <div style={{backgroundColor: 'transparent'}} className="row justify-content-center">
                    <Button type="button" className="btn btn-info">Play Again ?</Button>
                </div>
            </div>
        </div>
    )
}

export default LosePage