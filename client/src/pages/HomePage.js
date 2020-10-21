import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import microphone from '../assets/microphone.png'


const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;
mic.lang = "id-ID";

function HomePage() {
  const [name, setName] = useState("");
  const [isListening, setIsListening] = useState(false);
  const history = useHistory();
  const [code, setCode] = useState("");
  const [showGuide, setShowGuide] = useState(false)
  const handleClose = () => setShow(false);
  const handleShow = () => {
    name && setShow(true);
  };
  const [show, setShow] = useState(false);

  const handleJoin = (e) => {
    history.push("/lobby", { code, name, status: "member" })
  };

  const handleShowGuide = () => {
    setShowGuide(true)
  }

  const handleInputCode = (event) => {
    setCode(event.target.value);
  };

  const handleInputName = (event) => {
    setName(event.target.value);
  };
  
  const handleHost = () => {
   name && history.push('/lobby', { name, status: "host" })
  };


  useEffect(() => {
    handleListen();
  }, [isListening]);

  function handleListen() {
    if (isListening) {
      mic.start();
      mic.onend = () => {
        console.log("continue..");
        mic.start();
      };
    } else {
      mic.stop();
      mic.onend = () => {
        console.log("Stopped Mic on Click");
      };
    }
    mic.onstart = () => {
      console.log("Mics on");
    };

    mic.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");
      console.log(transcript);
      setName(transcript);
      mic.onerror = (event) => {
        console.log(event.error);
      };
    };
  }

  function handleOnListening() {
    setIsListening((prevState) => !prevState);
  }

  return (
    <div>
      <div className="splash-container">
        <div className="row justify-content-center">
          <img src="./images/mo-battleship.png" style={{ height: "30rem" }} alt="logo" />
        </div>
        <div className="splash-form">
          <div className="row justify-content-center">
            <h2>Input Your Name</h2>
          </div>
          <div className="row justify-content-center align-items-center">
            <input
              type="text"
              className="input-form"
              onChange={handleInputName}
              value={name}
            />
            <Button 
              onClick={handleShowGuide} 
              className="btn-sm btn-info m-1"
            >?</Button>
            <button 
            onClick={handleOnListening}
            className="btn-sm p-0 btn-info"
            style={{padding: 0,
              height: '30px',
              width: '25px',
              backgroundImage: `url(${microphone})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'}}
            >
            </button>
            {isListening && <a>Listening</a>}
          </div>
        </div>
        <div>
          <div className="row justify-content-center mt-3">
            <button className="button splash-btn" onClick={handleHost}>
              HOST
            </button>
            <button className="button splash-btn" onClick={handleShow}>JOIN</button>

            <Modal style={{ fontFamily: 'Piedra'}} className="modal" show={show} onHide={handleClose} animation={true}>
              <Modal.Header closeButton>
                <Modal.Title>Input Room Code</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <input
                  type="text"
                  className="input-form"
                  onChange={handleInputCode}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  CANCEL
                </Button>
                <Button variant="primary" onClick={handleJoin}>
                  JOIN
                </Button>
              </Modal.Footer>
            </Modal>

            <Modal
              style={{fontFamily: 'Piedra'}}
              className="border border-info rounded-lg shadow-sm"
              size="lg"
              show={showGuide}
              onHide={() => setShowGuide(false)}
              aria-labelledby="example-modal-sizes-title-lg"
            >
              <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-lg">
                  How To Play
                </Modal.Title>
              </Modal.Header>
              <Modal.Body style={{ fontSize: "30px" }}>
                <p>- Place all of your ships by dragging it from the port on the left side of the screen to the grid according to its size. </p>
                <p>- Fire to your opponents' board and hit their ship or Specials as follows:</p>
                <p>- 💣  You will attack twice!</p>
                <p>- 💥 Your fire power will be increased!</p>
                <p>- 🔱  Careful on this on. You hit it, you anger Poseidon~</p>
                <p>- Be the last one standing and be the Marine King!</p>
              </Modal.Body>
          </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
