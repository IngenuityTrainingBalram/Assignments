import { Paddle } from "./Paddle.js";
import { Ball } from "./Ball.js";
export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }
    start() {
        this.paddle = new Paddle({
            x: this.canvas.width / 2,
            y: this.canvas.height - 50,
            width: 100,
            height: 20,
            maxXBound: this.canvas.width
        });
        this.ball = new Ball({
            x: this.canvas.width / 2,
            y: this.canvas.height - 70,
            radius: 10,
            bounds: {
                left: 0,
                top: 0,
                right: this.canvas.width,
                bottom: this.canvas.height
            }
        });
    }
    onKeyDown(kev) {
        console.log('key', kev.key, 'code', kev.code);
        switch (kev.code) {
            case 'ArrowLeft':
                this.paddle.move('left');
                break;
            case 'ArrowRight':
                this.paddle.move('right');
                break;
        }
    }
    onKeyUp(kev) {
        switch (kev.code) {
            case 'ArrowLeft':
            case 'ArrowRight':
                this.paddle.stop();
                break;
            case 'Space':
            case 'KeyS':
                this.ball.bounce();
                break;
        }
    }
    update() {
        this.paddle.update();
        this.ball.update();
        if (this.paddle.hitTest(this.ball)) {
            this.ball.bounceUp();
        }
    }
    draw() {
        let canvas = this.canvas;
        let canvasH = canvas.height;
        let canvasW = canvas.width;
        let ctx = this.ctx;
        ctx.clearRect(0, 0, canvasW, canvasH);
        //background
        ctx.fillStyle = 'green';
        ctx.fillRect(0, 0, canvasW, canvasH);

        this.paddle.draw(ctx);
        this.ball.draw(ctx);
    }
}