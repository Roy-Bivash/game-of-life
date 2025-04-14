import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { GAME_SIZE, GRID_CONFIG } from '../main';

export class Game extends Scene
{
    private cols: number;
    private rows: number;
    private grid: number[][];
    private graphics!: Phaser.GameObjects.Graphics;
    private paused: boolean = true;

    constructor ()
    {
        super('Game');
        this.cols = 0;
        this.rows = 0;
        this.grid = [];
    }

    preload (){
        this.load.setPath('assets');
        
        // this.load.image('star', 'star.png');

    }

    create (){
        EventBus.emit('current-scene-ready', this);

        let game_width: number = parseInt(String(GAME_SIZE.width));
        let game_height: number = parseInt(String(GAME_SIZE.width));


        this.cols = Math.floor(game_width / GRID_CONFIG.CELL_SIZE);
        this.rows = Math.floor(game_height / GRID_CONFIG.CELL_SIZE);

        this.graphics = this.add.graphics();

        // Initialize the grid :
        this.grid = Array.from({ length: this.rows }, () =>
            // 0 is the the dead cells :
            Array.from({ length: this.cols }, () => 0)
            // Array.from({ length: this.cols }, () => (Math.random() > 0.8 ? 1 : 0)) // For random tests
        );

        this.drawGrid();
        this.input.on("pointerdown", this.handlePointerDown, this);
    }

    update(){
        if(this.paused) {            
            return;
        };

        this.grid = this.getNextGeneration(this.grid);
        this.drawGrid();

        if (this.countAliveCells() === 0) {
            this.paused = true;
            this.changeText("The grid is empty")
        }
    }
    
    public pauseGame(): void{
        this.changeText("Paused");
        this.paused = true;
    }

    public resumeGame(): void{
        this.changeText("Running")
        this.paused = false;
    }

    public resetGame(): void{
        this.grid = Array.from({ length: this.rows }, () =>
            Array.from({ length: this.cols }, () => 0)
        );
        
        this.drawGrid();
    }

    // Randomize the game grid with a 20% chance of being alive (1)
    public randomizeGame(): void{
        this.grid = Array.from({ length: this.rows }, () =>
            Array.from({ length: this.cols }, () => (Math.random() > 0.8 ? 1 : 0))
        );

        this.drawGrid();
    }

    private changeText(text:string) {
        EventBus.emit('game-message', text);
    }

    private getNextGeneration(grid: number[][]): number[][] {
        const nextGrid: number[][] = [];
    
        for (let y = 0; y < this.rows; y++) {
            nextGrid[y] = [];
            for (let x = 0; x < this.cols; x++) {
                const neighbors = this.countAliveNeighbors(grid, x, y);
                const cell = grid[y][x];
    
                if (cell === 1) {
                    // Cell is alive : 1
                    nextGrid[y][x] = neighbors === 2 || neighbors === 3 ? 1 : 0;
                } else {
                    // Cell is dead : 0
                    nextGrid[y][x] = neighbors === 3 ? 1 : 0;
                }
            }
        }
    
        return nextGrid;
    }
    
    private countAliveNeighbors(grid: number[][], x: number, y: number): number {
        let count = 0;
    
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;
    
                const nx = x + dx;
                const ny = y + dy;
    
                if (
                    nx >= 0 &&
                    nx < this.cols &&
                    ny >= 0 &&
                    ny < this.rows &&
                    grid[ny][nx] === 1
                ){
                    count++;
                }
            }
        }
    
        return count;
    }
    

    private drawGrid(): void {
        this.graphics.clear();

        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                const color = this.grid[y][x] === 1 ? GRID_CONFIG.ALIVE_COLOR : GRID_CONFIG.GRID_COLOR;
                
                this.graphics.fillStyle(color, 1.0);
                this.graphics.fillRect(
                    x * GRID_CONFIG.CELL_SIZE,
                    y * GRID_CONFIG.CELL_SIZE,
                    GRID_CONFIG.CELL_SIZE - 1,
                    GRID_CONFIG.CELL_SIZE - 1
                );
            }
        }
    }

    private handlePointerDown(pointer: Phaser.Input.Pointer): void {
        const cellX = Math.floor(pointer.x / GRID_CONFIG.CELL_SIZE);
        const cellY = Math.floor(pointer.y / GRID_CONFIG.CELL_SIZE);

        if (cellX >= 0 && cellX < this.cols && cellY >= 0 && cellY < this.rows) {
            // Toggle the cell
            this.grid[cellY][cellX] = this.grid[cellY][cellX] === 1 ? 0 : 1;
            this.drawGrid();
        }
    }
    
    private countAliveCells(): number {
        let count = 0;
        
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                if (this.grid[y][x] === 1) {
                    count++;
                }
            }
        }

        return count;
    }
}
