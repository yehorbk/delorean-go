
// Application Variables //

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const window_width = canvas.width;
const window_height = canvas.height; 

let animation = null;

// /////////// ///////// //


// Models //

const background_80s = "assets/img/background_80s.png";
const background_desert = "assets/img/background_desert.png";
const background_future = "assets/img/background_future.png";

const delorean_car_image = "assets/img/delorean_car.png";
const delorean_plane_image = "assets/img/delorean_plane.png";
const delorean_car_teleport_image = "assets/img/delorean_car_teleport.png"

const wheels_fire_image = "assets/img/wheels_fire_image.png"

const soundtrack_80s = "assets/audio/soundtrack_80s.mp3";
const soundtrack_desert = "assets/audio/soundtrack_desert.mp3";
const soundtrack_future = "assets/audio/soundtrack_future.mp3";
const engine_sound = "assets/audio/engine_sound.wav";

// ////// //


// Environment //

const background = new Image();
background.src = background_80s;

const delorean = new Image();
delorean.src = delorean_car_image;

const wheels_fire = new Image();
wheels_fire.src = wheels_fire_image;

const soundtrack = new Audio();
soundtrack.src = soundtrack_80s;

const car_sound = new Audio();
car_sound.src = engine_sound;

// /////////// //


// Data Variables //

const time_background_array = [
	{ time: "80s", src: background_80s},
	{ time: "Desert", src: background_desert},
	{ time: "Future", src: background_future}
];

// //// ///////// //


// Game Variables //

const block_size = 2;
const ground = 304
const ws_incrementor = 0.04;

let time = "80s";

let player_posX = 200;
let player_posY = ground;
let car_speed = 0;
let score = 0;
let score_dv = 0;

let background_posX = 0;
let world_speed = 0;

const speed_count = document.getElementById("speed_count");
const engine_ready = document.getElementById("engine_ready");
const score_count = document.getElementById("score_count");
const time_location = document.getElementById("time_location");

let isCar = true;
let isReadyTeleport = false;

// //// ///////// //


// "Power On" //

delorean.onload = draw;
addEventListener("keydown", isKeyboardKeyPressed);
beginAnimation();
soundtrack.play();

car_sound.loop = true;
car_sound.playbackRate = 1;
// car_sound.play();


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
	let car_teleport_animation = null;
	setTimeout(function() {
		world_speed = 0;
		car_teleport_animation = setInterval(function() {
			player_posX += 10;
		}, 1);
	}, 500)
	setTimeout(function() {
		clearInterval(car_teleport_animation);
		stopAnimation();
		context.drawImage(background, background_posX + background.width, 0);
		context.drawImage(wheels_fire, player_posX, 345);
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
		}, 1500);
	}, 650);
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
	let randomTimeValue = 0;
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
