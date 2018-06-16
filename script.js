var resetButton = document.getElementById("reset-button");
resetButton.addEventListener('click', clearGame);
var colors = [];
for (var i = 0; i < 10; i++) {
	colors.push('square-' + i);
}
var gameSquares = [];
var firstSquare = null;
var animating = false;

window.onload = function() {
	setupGame();
}

function setupGame() {
	var array = document.getElementsByClassName("game-square");
	var randomColors = getRandomColors();
	for (var i = 0; i < array.length; i++) {
		var color = randomColors.splice(random(randomColors.length), 1)[0];
		gameSquares.push(new GameSquare(array[i], color));
	}
}

function GameSquare(el, color) {
	this.el = el;
	this.isOpen = false;
	this.isLocked = false;
	this.el.addEventListener('click', this, false);
	this.setColor(color);
}

GameSquare.prototype.handleEvent = function(e){
	switch(e.type){
		case 'click':
			if (this.isOpen || this.isLocked || animating){
				return
			}
			this.isOpen = true;
			this.el.classList.add('flip');
			checkGame(this);
	}
}

GameSquare.prototype.reset = function() {
	this.isOpen = false;
	this.isLocked = false;
	this.el.classList.remove('flip');
}

GameSquare.prototype.lock = function() {
	this.isLocked = true;
	this.isOpen = true;
}

GameSquare.prototype.setColor = function(color){
	this.el.children[0].children[1].classList.remove(this.color);
	this.color = color;
	this.el.children[0].children[1].classList.add(color);
}

function getRandomColors() {
	var colorscopy = colors.slice();
	var randomColors = [];
	for (var i = 0; i < 8; i++) {
		var index = random(colorscopy.length);
		randomColors.push(colorscopy.splice(index, 1)[0]);
	}
	return randomColors.concat(randomColors.slice());
}

function random(n) {
	return Math.floor(Math.random() * n);
}

function checkGame(gameSquare){
	if (firstSquare === null) {
		firstSquare = gameSquare;
		return;
	}
	if (firstSquare.color === gameSquare.color) {
		firstSquare.lock();
		gameSquare.lock();
	} else {
		var a = firstSquare;
		var b = gameSquare;
		animating = true;
		setTimeout(function() {
			a.reset();
			b.reset();
			firstSquare = null;
			animating = false;
		}, 400);
	}
	firstSquare = null;
}

function randomizeColors() {
	var randomColors = getRandomColors();
	gameSquares.forEach(function(gameSquare){
		var color = randomColors.splice(random(randomColors.length), 1)[0];
		gameSquare.setColor(color);
	});
}

function clearGame() {
	gameSquares.forEach(function(gameSquare){
		gameSquare.reset();
	});
	setTimeout(function(){
		randomizeColors();
	}, 500);
}