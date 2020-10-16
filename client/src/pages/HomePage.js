import React from 'react'

function HomePage () {
    return (
        <div>
            <div className="splash-container">
                <img src="./images/sunset.svg" alt="logo" />
                <div>
                    <button className="button splash-btn">HOST</button>
                    <button className="button splash-btn">JOIN</button>
                </div>
            </div>
        </div>
    )
}

export default HomePage