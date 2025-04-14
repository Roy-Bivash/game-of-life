import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import { StartGame } from './main';
import { EventBus } from './EventBus';
import { Game } from './scenes/Game';

export interface IRefPhaserGame
{
    game: Phaser.Game | null;
    scene: Phaser.Scene | null;
    pauseGame: () => void;
    resumeGame: () => void;
    resetGame: () => void;
    randomizeGame: () => void;
}

interface IProps
{
    currentActiveScene?: (scene_instance: Phaser.Scene) => void
}

export const PhaserGame = forwardRef<IRefPhaserGame, IProps>(function PhaserGame({ currentActiveScene }, ref)
{
    const game = useRef<Phaser.Game | null>(null!);

    useLayoutEffect(() =>
    {
        if (game.current === null)
        {

            game.current = StartGame("game-container");

            if (typeof ref === 'function')
            {
                ref({ game: game.current, scene: null, pauseGame: () => {}, resumeGame: () => {}, resetGame: () => {}, randomizeGame: () => {} });
            } else if (ref)
            {
                ref.current = { game: game.current, scene: null, pauseGame: () => {}, resumeGame: () => {}, resetGame: () => {}, randomizeGame: () => {} };
            }

        }

        return () =>
        {
            if (game.current)
            {
                game.current.destroy(true);
                if (game.current !== null)
                {
                    game.current = null;
                }
            }
        }
    }, [ref]);

    useEffect(() =>
    {
        EventBus.on('current-scene-ready', (scene_instance: Phaser.Scene) =>
        {
            if (currentActiveScene && typeof currentActiveScene === 'function')
            {

                currentActiveScene(scene_instance);

            }

            if (typeof ref === 'function')
            {
                ref({ 
                    game: game.current, 
                    scene: scene_instance,
                    pauseGame: () => {
                        if (scene_instance instanceof Game) {
                            scene_instance.pauseGame();
                        }
                    },
                    resumeGame: () => {
                        if (scene_instance instanceof Game) {
                            scene_instance.resumeGame();
                        }
                    },
                    resetGame: () => {
                        if (scene_instance instanceof Game) {
                            scene_instance.resetGame();
                        }
                    },
                    randomizeGame: () => {
                        if (scene_instance instanceof Game) {
                            scene_instance.randomizeGame();
                        }
                    }
                });
            } else if (ref)
            {
                ref.current = { 
                    game: game.current, 
                    scene: scene_instance,
                    pauseGame: () => {
                        if (scene_instance instanceof Game) {
                            scene_instance.pauseGame();
                        }
                    },
                    resumeGame: () => {
                        if (scene_instance instanceof Game) {
                            scene_instance.resumeGame();
                        }
                    },
                    resetGame: () => {
                        if (scene_instance instanceof Game) {
                            scene_instance.resetGame();
                        }
                    },
                    randomizeGame: () => {
                        if (scene_instance instanceof Game) {
                            scene_instance.randomizeGame();
                        }
                    }
                
                };
            }
            
        });
        return () =>
        {
            EventBus.removeListener('current-scene-ready');
        }
    }, [currentActiveScene, ref]);

    return (
        <div id="game-container"></div>
    );

});
