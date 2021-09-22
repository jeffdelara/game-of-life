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