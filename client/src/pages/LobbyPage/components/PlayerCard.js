import React, { useState, useEffect } from 'react'
import { Card, Button } from 'react-bootstrap'


function PlayerCard(props) {
    const [playerColour, setPlayerColour] = useState('white')
    const player = props.playerData
    const colours = ["#f9ca24", "#e84118", "#3742fa", "#4834d4", "#f5f6fa", "#fff200", "#f8a5c2"]


    function playerColourGenerator(selectedColour) {
        setPlayerColour(selectedColour)
        console.log(playerColour, 'ini playercolour')
    }

    return (
        <div>
            <div className="col ml-5 mr-5 mt-3 mb-3">
                <Card style={{ width: '18rem'}}>
                    <h5 style={{backgroundColor: playerColour}}>Ready</h5>
                    <div className="justify-content-center">
                        <Card.Img style={styles.image} variant="top" src="https://i.pinimg.com/originals/0e/ba/2b/0eba2bf62d74ed3b0e7aafec0ce4d1cc.jpg" />
                    </div>
                        <Card.Body>
                            <Card.Title>{player.name}</Card.Title>
                            <div className="row justify-content-left">
                                <Card.Text>
                                    Select Color:
                                </Card.Text>
                            </div>
                            <div className="row justify-content-left">
                                {colours.map((colour, index) => {
                                    return (
                                        <Button
                                            key={index}
                                            className="mr-1" 
                                            style={{background: colour, height: "5px", width: "5px"}}
                                            value={colour}
                                            onClick={() => playerColourGenerator(colour)}
                                        ></Button>
                                    )
                                })}
                            </div>
                        </Card.Body>
                </Card>
            </div>
        </div>
    )
}

const styles = {
    image: {
        height: "17rem",
        width: "17rem"
    }
}

export default PlayerCard