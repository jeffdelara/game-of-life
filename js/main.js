const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext('2d');

let game = new Game(ctx, canvas);
game.width = parseInt(window.innerWidth * .92);
game.init();

window.requestAnimationFrame(gameLoop);

canvas.addEventListener('mousemove', function(event){
    game.getMousePosition(event);
}.bind(game));

canvas.addEventListener('click', function(event){
    game.getMousePositionToMapCoor(event);
}.bind(game));

function gameLoop()
{
    const fps = 25;

    game.update();
    game.draw();

    setTimeout(function(){
        window.requestAnimationFrame(gameLoop);
    }, 1000/fps);
    
}

const play_btn = document.querySelector("#play");
const start_btn = document.querySelector("#start");
const refresh_btn = document.querySelector("#refresh");

function hideAll()
{
    play_btn.style.display = "none";
    start_btn.style.display = "none";
    refresh_btn.style.display = "none";
}

function init()
{
    hideAll();

    for(let i = 0; i < 60; i++)
    {
        const row = parseInt( Math.random() * 40 ) + 10;
        const col = parseInt( Math.random() * 80 ) + 10;
        game.createSpaceShip(row, col);
    }
    game.game_state = 1;

    start_btn.style.display = "inline-block";
}

function start()
{
    game.init();
    
    hideAll();
    play_btn.style.display = "inline-block";
}

function play()
{
    game.game_state = 1;

    hideAll();
    refresh_btn.style.display = "inline-block";
}

function refresh()
{
    start();
}