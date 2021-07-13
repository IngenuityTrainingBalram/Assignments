onload = () => {
    const canvas = document.querySelector('#myGame');
    const context = canvas.getContext('2d');

    const car = new Image();
    const road = new Image();
    const midroad = new Image();
    const midroad2 = new Image();
    let x = 220;
    let y = 800;
    const carH = 54;
    const carW = 50;
    let speed = 5;
    let dirY = 0;
    let dirX = 0;
    car.addEventListener('load', () => {
        draw();
        // added animate
        animate()
        window.addEventListener('keydown', keyHandler)
        window.addEventListener('keyup', keyHandler)


    });
    car.src = "https://th.bing.com/th/id/R.88c98c018232cabc0a11ab22d2fc9814?rik=v7jmjd2g6%2bPYCg&riu=http%3a%2f%2fwww.clker.com%2fcliparts%2fK%2fj%2fE%2f5%2fW%2fB%2fblue-car-top-view-90-md.png&ehk=SHEXKfUWx%2fezhfiyfmZuI9j9weiiK2rsSjNlaFabRwY%3d&risl=&pid=ImgRaw";
    road.src = "https://3.bp.blogspot.com/-2Df83Vxtmiw/V5tL6ruTb0I/AAAAAAAAAYw/6O7FrcwPht8_ukd42jtiJN-ieu7l2tUyQCLcB/s1600/background-1.png";
    midroad.src = "https://st3.depositphotos.com/1017411/13077/i/450/depositphotos_130775508-stock-photo-seamless-texture-highway-asphalt.jpg";

    // midroad added
    midroad2.src = "https://st3.depositphotos.com/1017411/13077/i/450/depositphotos_130775508-stock-photo-seamless-texture-highway-asphalt.jpg";


    function draw() {
        x += speed * dirX;

        y += speed * dirY;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(road, 0, 0, 600, 900);
        // context.drawImage(midroad, 100, 0, 403, 900);
        // context.drawImage(car, x, y, carW, carH);
        requestAnimationFrame(draw);

        if (x + carW < 145 || x + carW > 510) {
            alert("Game Over");


        }
        if (y == 850) {
            alert("you hit the lower boundary")
            window.location.reload()
        }

    }

    let b = 0;
    function animate() {

        b++;
        context.drawImage(midroad, 100, b, 403, 900);
        context.drawImage(midroad2, 100, -900 + b, 403, 900);
        context.drawImage(car, x, y, carW, carH);

        requestAnimationFrame(animate);
    }
    animate();



    function keyHandler(e) {
        // console.log("Event ", e);
        switch (e.type) {
            case 'keydown':
                switch (e.code) {
                    case 'KeyW':
                    case 'ArrowUp':
                        dirY = -1;
                        break;
                    case 'KeyS':
                    case 'ArrowDown':
                        dirY = 1;
                        break;
                    case 'KeyA':
                    case 'ArrowLeft':
                        dirX = -1;
                        break;
                    case 'KeyD':
                    case 'ArrowRight':
                        dirX = 1;
                        break;
                }
                break;
            case 'keyup':
                switch (e.code) {
                    case 'KeyW':
                    case 'ArrowUp':
                    case 'KeyS':
                    case 'ArrowDown':
                        dirY = 0;
                        break;
                    case 'KeyA':
                    case 'ArrowLeft':
                    case 'KeyD':
                    case 'ArrowRight':
                        dirX = 0;
                        break;
                }
                break;

        }
    }
}