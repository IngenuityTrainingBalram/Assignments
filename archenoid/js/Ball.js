export class Ball {
    constructor(props) {
        this._x = props.x;
        this._y = props.y;
        this._r = props.radius;
        this.bounds = props.bounds;
        this.speed = 0;
        this.maxSpeed = 5;
        this.vertSpeedFactor = 0;
        this.horizSpeedFactor = 0;
    }
    set x(value) {
        this._x = value;
    }
    get x() {
        return this._x
    }

    set y(value) {
        this._y = value;
    }
    get y() {
        return this._y;
    }

    get radius() {
        return this._r;
    }
    bounce() {
        this.speed = this.maxSpeed;
        this.vertSpeedFactor = -1;
        this.horizSpeedFactor = 1;
    }
    bounceUp() {
        this.vertSpeedFactor *= -1;
    }
    update() {
        if (this._x <= this.bounds.left || this._x >= this.bounds.right) {
            this.horizSpeedFactor *= -1;
        }
        if (this._y <= this.bounds.top) {
            this.vertSpeedFactor *= -1;
        }
        if (this._y > this.bounds.bottom) {
            this.speed = 0;
        }
        this._x += this.speed * this.horizSpeedFactor;
        this._y += this.speed * this.vertSpeedFactor;
    }
    draw(ctx) {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this._x, this._y, this._r, 0, Math.PI * 2);

        ctx.fill();
    }
}