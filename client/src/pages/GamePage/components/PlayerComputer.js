import React, {useState} from 'react'

function PlayerComputer() {
  const [carrier, setCarrier] = useState({
    front: ''
  })
  const [divId, setDivId] = useState(0)
  const [position, setPosition] = useState('row')
  const [display, setDisplay] = useState('')
  const [displayName, setDisplayName] = useState('horizontal')

  const onDragStart = (e, size, name) => {
    e.dataTransfer.setData("size", size)
    e.dataTransfer.setData("name", name)
    e.dataTransfer.setData("divId", divId)
    e.dataTransfer.setData("position", displayName)
  }

  const handlePositionX = () => {
    setPosition('row')
    setDisplay('')
    setDisplayName('horizontal')
  }
  
  const handlePositionY = () => {
    setPosition('column')
    setDisplay('row justify-content-left')
    setDisplayName('vertical')
  }
  
  const onMouseEnter = (e, id) => {
    setDivId(id)
  }

  return (
    <div>
      <button className="btn btn-info m-1" onClick={handlePositionY}>Vertical</button>
      <button className="btn btn-info m-1" onClick={handlePositionX}>Horizontal</button>
      <div className={`container ${display}`}>
        {/* Carrier */} 
        <div className="row m-1 p-1">
          <div className={`${position}`} draggable onDragStart={(e) => onDragStart(e, 5, "carrier")}>
            <div onMouseEnter={e => onMouseEnter(e, 1)} className="border border-white" style={{backgroundColor: "#4b5320 ", width: "40px", height: "40px"}}></div>
            <div onMouseEnter={e => onMouseEnter(e, 2)} className="border border-white" style={{backgroundColor: "#4b5320 ", width: "40px", height: "40px"}}></div>
            <div onMouseEnter={e => onMouseEnter(e, 3)} className="border border-white" style={{backgroundColor: "#4b5320 ", width: "40px", height: "40px"}}></div>
            <div onMouseEnter={e => onMouseEnter(e, 4)} className="border border-white" style={{backgroundColor: "#4b5320 ", width: "40px", height: "40px"}}></div>
            <div onMouseEnter={e => onMouseEnter(e, 5)} className="border border-white" style={{backgroundColor: "#4b5320 ", width: "40px", height: "40px"}}></div>
          </div>
        </div>

        {/* BattleShip */}
        <div className="row m-1 p-1">
          <div className={`${position}`} draggable onDragStart={(e) => onDragStart(e, 4, "battleship")}>
            <div onMouseEnter={e => onMouseEnter(e, 1)} className="border border-white" style={{backgroundColor: "#4b5320 ", width: "40px", height: "40px"}}></div>
            <div onMouseEnter={e => onMouseEnter(e, 2)} className="border border-white" style={{backgroundColor: "#4b5320 ", width: "40px", height: "40px"}}></div>
            <div onMouseEnter={e => onMouseEnter(e, 3)} className="border border-white" style={{backgroundColor: "#4b5320 ", width: "40px", height: "40px"}}></div>
            <div onMouseEnter={e => onMouseEnter(e, 4)} className="border border-white" style={{backgroundColor: "#4b5320 ", width: "40px", height: "40px"}}></div>
          </div>
        </div>

        {/* Cruiser */}
        <div className="row m-1 p-1">
          <div className={`${position}`} draggable onDragStart={(e) => onDragStart(e, 3, "cruiser")}>
            <div onMouseEnter={e => onMouseEnter(e, 1)} className="border border-white" style={{backgroundColor: "#4b5320 ", width: "40px", height: "40px"}}></div>
            <div onMouseEnter={e => onMouseEnter(e, 2)} className="border border-white" style={{backgroundColor: "#4b5320 ", width: "40px", height: "40px"}}></div>
            <div onMouseEnter={e => onMouseEnter(e, 3)} className="border border-white" style={{backgroundColor: "#4b5320 ", width: "40px", height: "40px"}}></div>
          </div>
        </div>

        {/* Submarine */}
        <div className="row m-1 p-1">
          <div className={`${position}`} draggable onDragStart={(e) => onDragStart(e, 3, "submarine")}>
            <div onMouseEnter={e => onMouseEnter(e, 1)} className="border border-white" style={{backgroundColor: "#4b5320 ", width: "40px", height: "40px"}}></div>
            <div onMouseEnter={e => onMouseEnter(e, 2)} className="border border-white" style={{backgroundColor: "#4b5320 ", width: "40px", height: "40px"}}></div>
            <div onMouseEnter={e => onMouseEnter(e, 3)} className="border border-white" style={{backgroundColor: "#4b5320 ", width: "40px", height: "40px"}}></div>
          </div>
        </div>

        {/* Destroyer */}
        <div className="row m-1 p-1">
          <div className={`${position}`} draggable onDragStart={(e) => onDragStart(e, 2, "destroyer")}>
            <div onMouseEnter={e => onMouseEnter(e, 1)} className="border border-white" style={{backgroundColor: "#4b5320 ", width: "40px", height: "40px"}}></div>
            <div onMouseEnter={e => onMouseEnter(e, 2)} className="border border-white" style={{backgroundColor: "#4b5320 ", width: "40px", height: "40px"}}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerComputer
