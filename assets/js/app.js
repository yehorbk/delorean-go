
// Application Variables //

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var window_width = canvas.width;
var window_height = canvas.height; 

var animation = null;

// /////////// ///////// //


// Models //

var background_80s = "assets/img/background_80s.png";
var background_desert = "assets/img/background_desert.png";
var background_future = "assets/img/background_future.png";

var delorean_car_image = "assets/img/delorean_car.png";
var delorean_plane_image = "assets/img/delorean_plane.png";
var delorean_car_teleport_image = "assets/img/delorean_car_teleport.png"

var wheels_fire_image = "assets/img/wheels_fire_image.png"

var soundtrack_80s = "assets/audio/soundtrack_80s.mp3";
var soundtrack_desert = "assets/audio/soundtrack_desert.mp3";
var soundtrack_future = "assets/audio/soundtrack_future.mp3";

// ////// //


// Environment //

var background = new Image();
background.src = background_80s;

var delorean = new Image();
delorean.src = delorean_car_image;

var wheels_fire = new Image();
wheels_fire.src = wheels_fire_image;

var soundtrack = new Audio();
soundtrack.src = soundtrack_80s;

// /////////// //


// Data Variables //

var time_background_array = [
	{ time: "80s", src: background_80s},
	{ time: "Desert", src: background_desert},
	{ time: "Future", src: background_future}
];

// //// ///////// //


// Game Variables //

var block_size = 2;
var ground = 304
var ws_incrementor = 0.04;

var time = "80s";

var player_posX = 200;
var player_posY = ground;
var car_speed = 0;
var score = 0;
var score_dv = 0;

var background_posX = 0;
var world_speed = 0;

var speed_count = document.getElementById("speed_count");
var engine_ready = document.getElementById("engine_ready");
var score_count = document.getElementById("score_count");
var time_location = document.getElementById("time_location");

var isCar = true;
var isReadyTeleport = false;

// //// ///////// //


// "Power On" //

delorean.onload = draw;
addEventListener("keydown", isKeyboardKeyPressed);
beginAnimation();
soundtrack.play();

// ////////// //


// Functions //

function isKeyboardKeyPressed(e) {

	switch (e.keyCode) {
		case 37:
			changeSpeed(false);
			break;
		case 38:
			delorean_move(true);
			break;
		case 39:
			changeSpeed(true);
			break;
		case 40:
			delorean_move(false);
			break;
		case 32:
			if (isReadyTeleport) {
				changeTime();
			}			
		default:
			// Default 
			break;
	}

	checkIsEngineReady();
	//draw();
}

function draw() {

	addScore(0);

	context.clearRect(0, 0, canvas.width, canvas.height);
	context.drawImage(background, background_posX, 0);
	context.drawImage(background, background_posX + background.width, 0);
	context.drawImage(delorean, player_posX, player_posY);

	speed_count.textContent = "Speed: " + car_speed;
	score_count.textContent = "Score: " + score;

	if (background_posX < background.width * -1) {
		background_posX = 0;
	}

	// Debugging // 
	//console.log(player_posX + ";" + player_posY);
}

function beginAnimation() {
	animation = setInterval(world_animation, 1);
}

function stopAnimation() {
	clearInterval(animation);
}

function world_animation() {
	background_posX -= world_speed;
	draw();
}

function checkIsEngineReady() {
	if (car_speed >= 88) {
		speed_count.style.color = "red";
		isReadyTeleport = true;
		engine_ready.style.display = 'block';
	} else if (car_speed < 88) {
		isReadyTeleport = false;
		speed_count.style.color = "green";
		engine_ready.style.display = 'none';
	}
}

function changeTime() {

	delorean.src = delorean_car_teleport_image;
	setTimeout(function() {
		context.drawImage(background, background_posX + background.width, 0);
		context.drawImage(wheels_fire, player_posX, 345);
		stopAnimation();
		setTimeout(function() {
			beginAnimation();

			background.src = getRandomLocation();
			delorean.src = delorean_car_image;

			isReadyTeleport = false;
			car_speed = 2;
			world_speed = ws_incrementor * 2;
			player_posX = 200;

			checkIsEngineReady();
			addScore(1000);
		}, 1000);
	}, 1000);
	
}

function delorean_move(direction) {
	if (direction) {
		if (player_posY - block_size >= 0) {
			player_posY -= block_size;
			if (isCar) {
				delorean.src = delorean_plane_image;
				isCar = false;
			}
		}
	} else {
		if (player_posY + block_size <= ground) {
			player_posY += block_size;
			if (!isCar && player_posY == ground) {
				delorean.src = delorean_car_image;
				isCar = true;
			}
		}
	}
}

function changeSpeed(increase) {
	if (increase) {
		if (player_posX + block_size <= window_width - delorean.width && car_speed <= 109) {
			player_posX += block_size;
			car_speed += 1;
			world_speed += ws_incrementor;
		}
	} else {
		if (player_posX - block_size >= 0 && car_speed > 0) {
			player_posX -= block_size;
			car_speed -= 1;
			if (world_speed != 0) {
				world_speed -= ws_incrementor;
			}
		}
	}
}

function getRandomLocation() {
	var randomTimeValue = 0;
	do {
		randomTimeValue = Math.floor(Math.random() * (time_background_array.length - 0) + 0);
	} while (time == time_background_array[randomTimeValue].time);
	time = time_background_array[randomTimeValue].time;
	time_location.textContent = "Location: " + time;
	return time_background_array[randomTimeValue].src;
}

function addScore(count) {

	if (count == 0) {
		score_dv += car_speed / 1000;
	} else {
		score += count;
	}

	if (score_dv > 1) {
		score += Math.floor(score_dv);
		score_dv = 0;
	}
}

function getAllAchievements() {
	alert("No, you can't.");
}


// ///////// //

	/*if (time == "80s") {
		background.src = background_desert;
		time = "Desert"
	} else {
		background.src = background_80s;
		time = "80s"
	}*/

//time = time_background_array.keys(randomTimeValue);

//alert(randomTimeValue + ": " + background.src + " " + time_background_array[randomTimeValue]);
/*pancake_posX = Math.random() * (window_width - 0) + 0;
	pancake_posY = Math.random() * (window_height - 0) + 0;
	console.log("Cake: " + pancake_posX + ";" + pancake_posY);
	context.drawImage(pancake, pancake_posX, pancake_posY);*/

	/*var time_background_array = [
	background_80s,
	background_desert,
	background_future
];*/


/*
 Previous Version
 FPS: 50ms
 world_speed: 0.5
*/