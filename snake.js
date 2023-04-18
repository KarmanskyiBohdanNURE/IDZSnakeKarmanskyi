const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const scale = 20;
const rows = canvas.height / scale;
const cols = canvas.width / scale;

let snake;
let fruit;
let score = 0;
let maxScore = 0;
let gameLoop;

const directions = ['Up', 'Down', 'Left', 'Right'];

class Snake 
{
    constructor() 
    {
        this.x = (Math.floor(Math.random() * rows - 1) + 1) * scale;
        this.y = (Math.floor(Math.random() * cols - 1) + 1) * scale;
        this.xSpeed = scale;
        this.ySpeed = 0;
        this.tail = [];
        this.total = 2;

        const randomDirection = directions[Math.floor(Math.random() * directions.length)];
        this.changeDirection(randomDirection);
    }

    draw() 
    {
        ctx.fillStyle = 'green';
        for (let i = 0; i < this.tail.length; i++) 
        {
            ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
        }
        ctx.fillRect(this.x, this.y, scale, scale);
    }

    update() 
    {
        for (let i = 0; i < this.tail.length - 1; i++) 
        {
            this.tail[i] = this.tail[i + 1];
        }

        if (this.total > 0) 
        {
            this.tail[this.total - 1] = { x: this.x, y: this.y };
        }

        this.x += this.xSpeed;
        this.y += this.ySpeed;

        if (this.x < 0) 
        {
            this.x = canvas.width;
        } else if (this.x > canvas.width - scale) 
        {
            this.x = 0;
        }

        if (this.y < 0) 
        {
            this.y = canvas.height;
        } else if (this.y > canvas.height - scale) 
        {
            this.y = 0;
        }
    }

    changeDirection(direction) 
    {
        switch (direction) 
        {
            case 'Up':
                if (this.ySpeed === 0) 
                {
                    this.xSpeed = 0;
                    this.ySpeed = -scale;
                }
                break;
            case 'Down':
                if (this.ySpeed === 0) 
                {
                    this.xSpeed = 0;
                    this.ySpeed = scale;
                }
                break;
            case 'Left':
                if (this.xSpeed === 0) 
                {
                    this.xSpeed = -scale;
                    this.ySpeed = 0;
                }
                break;
            case 'Right':
                if (this.xSpeed === 0) 
                {
                    this.xSpeed = scale;
                    this.ySpeed = 0;
                }
                break;
        }
    }

    eat(fruit) 
    {
        if (this.x === fruit.x && this.y === fruit.y) 
        {
            this.total++;
            score++;
            document.getElementById("score").innerHTML = "Score: " + score;
            console.log(score);
            return true;
        }
        return false;
    }

    checkCollision() 
    {
        for (let i = 0; i < this.tail.length; i++) 
        {
            if (this.x === this.tail[i].x && this.y === this.tail[i].y) 
            {
                return true;
            }
        }
        return false;
    }
}

class Fruit {
    constructor() 
    {
        this.x;
        this.y;
    }

    pickLocation() 
    {
        this.x = (Math.floor(Math.random() * rows - 1) + 1) * scale;
        this.y = (Math.floor(Math.random() * cols - 1) + 1) * scale;
    }

    draw() 
    {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, scale, scale);
    }
}

function setup() 
{
    snake = new Snake();
    fruit = new Fruit();
    fruit.pickLocation();
    if(maxScore < score) 
    {
        maxScore = score;
        document.getElementById("maxScore").innerHTML = "Best score: " + score;
    }
    score = 0;
    document.getElementById("score").innerHTML = "Score: " + score;
    gameLoop = setInterval(draw, 100);
}

function draw() 
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snake.update();
    snake.draw();
    fruit.draw();
    if (snake.eat(fruit)) 
    {
        fruit.pickLocation();
    }

    if (snake.checkCollision()) 
    {
        clearInterval(gameLoop);
        alert(`Гру закінчено! Ваш рахунок: ${score}`);
        setup();
    }
}

function handleKeyPress(e) 
{
    const direction = e.key.replace('Arrow', '');
    snake.changeDirection(direction);
}

function pauseGame() 
{
    clearInterval(gameLoop);
}

function resumeGame() 
{
    clearInterval(gameLoop);
    gameLoop = setInterval(draw, 100);
}

window.addEventListener('keydown', handleKeyPress);
setup();

document.addEventListener('visibilitychange', function() 
{
    if (document.hidden) 
    {
        pauseGame();
    } 
    else 
    {
        resumeGame();
    }
});