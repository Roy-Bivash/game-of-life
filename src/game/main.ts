import { Game as MainGame } from './scenes/Game';
import { AUTO, Game, Types } from 'phaser';
import { getScreenWidth } from '../lib/screen';

type Game_size = {
    width: number | string;
    height: number | string;
}

const config: Types.Core.GameConfig = {
    type: AUTO,
    width: getScreenWidth(),
    height: 768,
    parent: 'game-container',
    backgroundColor: '#f5f5f5',
    scene: [
        MainGame
    ],
    fps: {
        limit: 16
    }
};

const StartGame = (parent:any) => {
    return new Game({ ...config, parent });
}

const GAME_SIZE:Game_size = {
    width: config.width || 1,
    height: config.height || 1
};

const GRID_CONFIG = {
    CELL_SIZE:10,
    ALIVE_COLOR: 0x4a4a4a,
    GRID_COLOR: 0xffffff,
}


export {
    StartGame,
    GAME_SIZE,
    GRID_CONFIG,
}
