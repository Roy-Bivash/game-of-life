import { useEffect, useRef, useState } from 'react';
import { IRefPhaserGame, PhaserGame } from './game/PhaserGame';
import './css/global.css';
import { EventBus } from './game/EventBus';

function App()
{
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    const [message, setMessage] = useState<string>("");

    function setPauseGame(){
        phaserRef.current?.pauseGame();
    }

    function resumeGame(){
        phaserRef.current?.resumeGame();
    }
    function resetGame(){
        phaserRef.current?.resetGame();
    }
    
    function randomizeGame(){
        phaserRef.current?.randomizeGame();
    }

    useEffect(() => {
        EventBus.on('game-message', handleMessage);
        return () => {
            EventBus.off('game-message', handleMessage);
        }
    })

    function handleMessage(text:string){
        setMessage(text)
    }

    return (
        <div id="app">
            <h1 className='title'>Game of Life</h1>
            <div className='game'>
                <PhaserGame ref={phaserRef} />
                <div className='btn-group-ui'>
                    <button className="button" onClick={resumeGame}>Run</button>
                    <button className="button" onClick={setPauseGame}>Pause</button>
                    <button className="button" onClick={resetGame}>Reset</button>
                    <button className="button" onClick={randomizeGame}>Random</button>
                </div>
            </div>
            <p className='message'>{ message }</p>

        </div>
    )
}

export default App
