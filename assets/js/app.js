
// Application Variables //

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var window_width = canvas.width;
var window_height = canvas.height; 

// /////////// ///////// //


// Models //

var background_80s = "assets/img/background.png";
var background_desert = "assets/img/background_desert.png";
var delorean_car_image = "assets/img/delorean_car.png";
var delorean_plane_image = "assets/img/delorean_plane.png";

// ////// //


// Environment //

var background = new Image();
background.src = background_80s;

var delorean = new Image();
delorean.src = delorean_car_image;

// /////////// //


// Game Variables //

var time = "80s";

var player_posX = 200;
var player_posY = 304;
var car_speed = 0;

var background_posX = 0;
var world_speed = 1;

var speed_count = document.getElementById("speed_count");
var engine_ready = document.getElementById("engine_ready");

var block_size = 2;

var isCar = true;
var isReadyTeleport = false;

// //// ///////// //


// "Power On" //

delorean.onload = draw;
addEventListener("keydown", move);
setInterval(world_animation, 50);

// ////////// //


// Functions //

function draw() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	console.log(player_posX + ";" + player_posY);
	context.drawImage(background, background_posX, 0);
	context.drawImage(background, background_posX + background.width, 0);
	context.drawImage(delorean, player_posX, player_posY); // TODO
	speed_count.textContent = "Speed: " + car_speed;
	if (background_posX < background.width * -1) {
		background_posX = 0;
	}
}

function move(e) {

	switch (e.keyCode) {
		case 37:
			if (player_posX - block_size >= 0 && car_speed >= 0) {
				player_posX -= block_size;
				car_speed -= 1;
				world_speed -= 0.5;
			}
			break;
		case 38:
			if (player_posY - block_size >= 0) {
				player_posY -= block_size;
				if (isCar) {
					delorean.src = delorean_plane_image;
					isCar = false;
				}
			}
			break;
		case 39:
			if (player_posX + block_size <= window_width - delorean.width && car_speed <= 143) {
				player_posX += block_size;
				car_speed += 1;
				world_speed += 0.5;
			}
			break;
		case 40:
			if (player_posY + block_size <= window_height - delorean.height) {
				player_posY += block_size;
				if (!isCar && player_posY == 304) {
					delorean.src = delorean_car_image;
					isCar = true;
				}
			}
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
	draw();
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
	if (time == "80s") {
		background.src = background_desert;
		time = "Desert"
	} else {
		background.src = background_80s;
		time = "80s"
	}
	
	isReadyTeleport = false;
	car_speed = 0;
	world_speed = 1;
	player_posX = 200;

	checkIsEngineReady();
}

// ///////// //


/*pancake_posX = Math.random() * (window_width - 0) + 0;
	pancake_posY = Math.random() * (window_height - 0) + 0;
	console.log("Cake: " + pancake_posX + ";" + pancake_posY);
	context.drawImage(pancake, pancake_posX, pancake_posY);*/