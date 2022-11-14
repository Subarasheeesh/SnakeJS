const canvas = document.getElementById('game'); //recuperation de la balise canvas HTML
const ctx = canvas.getContext('2d'); //definition du canvas en 2D

// ------ REJOUER ------
var e = document.getElementById("boutonRejouer")

// ------ CASES ------
let tileCount = 20; //nombre de cases en longueur (20x20)
let tileSize = 18; //taille des cases

// ------ SERPENT ------
let headX = 10; //position X de la tete du serpent
let headY = 10; //position Y de la tete du serpent
let tailLength = 2; //taille de la queue du serpent
const snakeParts = [];

class snakePart { //objet element queue du serpent qui va etre dupliquer a chaque fois que le serpent mange une pomme
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

}

// ------ VELOCITÉ ------
let xvelocity = 0; //vitesse du serpent en X
let yvelocity = 0; //vitesse du serpent en Y

// ------ POMME ------
let appleX = 5;//position X de la pomme
let appleY = 5;//position Y de la pomme

// ------ SCORE ------
let score = 0;

// ------ CONTROLE ------
document.body.addEventListener('keydown', keyDown); //EventListener sur les fleches de direction

function keyDown(event) { //le nombre est egal a la reference de la touche ("keycode")
    if (event.keyCode == 38) {//Fleche haut
        if (yvelocity !== 1) {
            yvelocity = -1;
            xvelocity = 0;
        }
    }
    if (event.keyCode == 40) {//Fleche bas
        if (yvelocity !== -1) {
            yvelocity = 1;
            xvelocity = 0;
        }
    }
    if (event.keyCode == 37) {//Fleche gauche
        if (xvelocity !== 1) {
            yvelocity = 0;
            xvelocity = -1;
        }
    }
    if (event.keyCode == 39) {//Fleche droite
        if (xvelocity !== -1) {
            yvelocity = 0;
            xvelocity = 1;
        }
    }
}

// ------ DIRECTION DU SERPENT ------
function changeSnakePosition() {//fonction qui fais bouger le serpent (appelé a chaque mise a jour du canvas et qui applique la velocité sur le serpent)
    headX = headX + xvelocity;
    headY = headY + yvelocity;
}

// ------ DESSINER LE SERPENT ------
function drawSnake() {
    ctx.fillStyle = "rgb(95, 95, 95)";//style de remplissage de la queue du serpent
    for (let i = 0; i < snakeParts.length; i++) {//boucle qui dessine tout les objets "snakePart" de la liste "snakeParts" (chaque element est un objet qui contient ses coordonnées x et y utiliser dans la boucle)
        let part = snakeParts[i];
        ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize)//remplissage de chaque case du serpent serpent (x et y sont des variable contenu dans l'objet)
    }

    snakeParts.push(new snakePart(headX, headY));//ajout l'element "snakePart" dans la liste "snakeParts"
    if (snakeParts.length > tailLength) { //si le tableau contien plus d'element que "tailLength" alors...
        snakeParts.shift();//on supprime l'element le plus vieux du tableau
    }

    ctx.fillStyle = "rgb(211, 211, 211)";//style de remplissage de la tete du  serpent
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize)//position de la tete
}

// ------ DESSINER LA POMME ------
function drawApple() {
    ctx.fillStyle = "red";//couleur de la pomme
    ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize)//position de la pomme
}

// ------ COLORIER LE FOND ------
function clearScreen() {
    ctx.fillStyle = 'black';//style de remplissage du fond
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);//debut du remplissage à 0px a gauche et 0px en haut, jusqu'à tout en bas et tout a droite du canvas
}

// ------ COLLISION AVEC LA POMME ------
function checkCollision() {
    if (appleX == headX && appleY == headY) { //si les coordonnées de la pomme son egales au coordonnées de la tete du serpent alors...
        appleX = Math.floor(Math.random() * tileCount);//changement de la coordonnée X de la pomme (math.random compris entre 0 et 1 multiplier par tileCount (donc 20) et arrondi a l'entier le plus bas donne un chiffre entre 0 et 20)
        appleY = Math.floor(Math.random() * tileCount);//changement de la coordonnée Y de la pomme
        tailLength++;//allongement du serpent
        score++;
    }
}

// ------ GAME OVER ------
function isGameOver() {
    let gameOver = false;
    if (yvelocity === 0 && xvelocity === 0) {
        return false;
    }
    if (headX < 0) {//si le serpent touche le bord gauche
        gameOver = true;
    }
    else if (headX === tileCount) {//si le serpent touche le bord droit
        gameOver = true;
    }
    else if (headY < 0) {//si le serpent touche le bord haut
        gameOver = true;
    }
    else if (headY === tileCount) {//si le serpent touche le bord bas
        gameOver = true;
    }

    //arret du jeu si le serpent se touche lui même
    for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];//pour chaque element de queue du serpent...
        if (part.x === headX && part.y === headY) {//... on regarde si il a les mêmes coordonnées que la tête du serpent
            gameOver = true;//si oui alors on declenche le game over
            break;
        }
    }

    //Game over Warning
    if (gameOver) {
        ctx.fillStyle = "white";//couleur du texte "game over"
        ctx.font = "31px pixeled";//taille de police et font du "game over"
        ctx.fillText("Game Over! ", canvas.clientWidth / 6.5, canvas.clientHeight / 2);//position du "game over"
    }
    return gameOver;
}

function drawScore() {
    ctx.fillStyle = "white"//couleur du texte score
    ctx.font = "10px pixeled"//taille de police et font du texte score
    ctx.fillText("Score: " + score, 10, 20);//position du texte score
}

// ------ MAIN ------
function game() {
    changeSnakePosition();
    let result = isGameOver();
    if (result == true) {// stopper le programme si game over est à "true"
        e.style.display = 'block';
        return;
    }
    clearScreen();
    drawSnake();
    checkCollision();
    drawApple();
    drawScore();
    setTimeout(game, 150);//update du canvas (rappel de la fonction main avec 150ms de pause)
}


game();
