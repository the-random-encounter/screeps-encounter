"use strict";
global.calcTickTime = function(tickSamples = 1000) { // Call this from 1st line of main loop. Can adjust samples used for calculation from there.
    let millis = Date.now();

	// Set some sane defaults
		if (typeof Memory.time == "undefined") Memory.time = {};
    if (typeof Memory.time.lastTickMillis == "undefined") Memory.time.lastTickMillis = millis - 1010;
    if (typeof Memory.time.lastTickTime == "undefined") Memory.time.lastTickTime = 1.01;
    if (typeof Memory.time.tickTimeCount == "undefined") Memory.time.tickTimeCount = 0;
    if (typeof Memory.time.tickTimeTotal == "undefined") Memory.time.tickTimeTotal = 0;
    
    let lastTickMillis = Number(Memory.time.lastTickMillis);
    let tickTimeCount = Number(Memory.time.tickTimeCount);
    let tickTimeTotal = Number(Memory.time.tickTimeTotal);

    if (tickTimeCount >= (tickSamples-1)) {
        tickTimeTotal += millis - lastTickMillis;
        tickTimeCount++;
        global.tickTime = (tickTimeTotal / tickTimeCount) / 1000;
        console.log("Calculated tickTime as", global.tickTime, "from", tickTimeCount, "samples.");
        Memory.time.lastTickTime = global.tickTime;
        Memory.time.tickTimeTotal = millis - lastTickMillis;
        Memory.time.tickTimeCount = 1;
        Memory.time.lastTickMillis = millis;
    } else { 
        global.tickTime = Number(Memory.time.lastTickTime);
        tickTimeTotal += millis - lastTickMillis;
        Memory.time.tickTimeTotal = tickTimeTotal;
        tickTimeCount++;
        Memory.time.tickTimeCount = tickTimeCount;
        Memory.time.lastTickMillis = millis;
    }
    return 'Done';
}

global.randomName = function() {

	const nameArray = ['Olivia', 'Emma', 'Charlotte', 'Amelia', 'Sophia', 'Isabella', 'Ava', 'Mia', 'Evelyn', 'Luna', 'Harper', 'Camila', 'Sofia', 'Scarlett', 'Elizabeth', 'Eleanor', 'Emily', 'Chloe', 'Mila', 'Violet', 'Penelope', 'Gianna', 'Aria', 'Abigail', 'Ella', 'Avery', 'Hazel', 'Nora', 'Layla', 'Lily', 'Aurora', 'Nova', 'Ellie', 'Madison', 'Grace', 'Isla', 'Willow', 'Zoe', 'Riley', 'Stella', 'Eliana', 'Ivy', 'Victoria', 'Emilia', 'Zoey', 'Naomi', 'Hannah', 'Lucy', 'Elena', 'Lillian', 'Maya', 'Leah', 'Paisley', 'Addison', 'Natalie', 'Valentina', 'Everly', 'Delilah', 'Leilani', 'Madelyn', 'Kinsley', 'Ruby', 'Sophie', 'Alice', 'Genesis', 'Claire', 'Audrey', 'Sadie', 'Aaliyah', 'Josephine', 'Autumn', 'Brooklyn', 'Quinn', 'Kennedy', 'Cora', 'Savannah', 'Caroline', 'Athena', 'Natalia', 'Hailey', 'Aubrey', 'Emery', 'Anna', 'Iris', 'Bella', 'Eloise', 'Skylar', 'Jade', 'Gabriella', 'Ariana', 'Maria', 'Adeline', 'Lydia', 'Sarah', 'Nevaeh', 'Serenity', 'Liliana', 'Ayla', 'Everleigh', 'Raelynn', 'Liam', 'Noah', 'Oliver', 'James', 'Elijah', 'William', 'Henry', 'Lucas', 'Benjamin', 'Theodore', 'Mateo', 'Levi', 'Sebastian', 'Daniel', 'Jack', 'Michael', 'Alexander', 'Owen', 'Asher', 'Samuel', 'Ethan', 'Leo', 'Jackson', 'Mason', 'Ezra', 'John', 'Hudson', 'Luca', 'Aiden', 'Joseph', 'David', 'Jacob', 'Logan', 'Luke', 'Julian', 'Gabriel', 'Grayson', 'Wyatt', 'Matthew', 'Maverick', 'Dylan', 'Isaac', 'Elias', 'Anthony', 'Thomas', 'Jayden', 'Carter', 'Santiago', 'Ezekiel', 'Charles', 'Josiah', 'Caleb', 'Cooper', 'Lincoln', 'Miles', 'Christopher', 'Nathan', 'Isaiah', 'Kai', 'Joshua', 'Andrew', 'Angel', 'Adrian', 'Cameron', 'Nolan', 'Waylon', 'Jaxon', 'Roman', 'Eli', 'Wesley', 'Aaron', 'Ian', 'Christian', 'Ryan', 'Leonardo', 'Brooks', 'Axel', 'Walker', 'Jonathan', 'Easton', 'Everett', 'Weston', 'Bennett', 'Robert', 'Jameson', 'Landon', 'Silas', 'Jose', 'Beau', 'Micah', 'Colton', 'Jordan', 'Jeremiah', 'Parker', 'Greyson', 'Rowan', 'Adam', 'Nicholas', 'Theo', 'Xavier'];

	const randIndex = Math.floor(Math.random() * (nameArray.length + 1));

	console.log('Random Index: ' + randIndex);
	console.log('Random Name: ' + nameArray[randIndex]);

	return nameArray[randIndex];

};

global.partCost = function (array) {
	
	let runningTotal = 0;

	for (i = 0; i < array.length; i++) {
		switch (array[i]) {
			case WORK:
				runningTotal += 100;
				break;
			case CARRY:
				runningTotal += 50;
				break;
			case MOVE:
				runningTotal += 50;
				break;
			case ATTACK:
				runningTotal += 80;
				break;
			case RANGED_ATTACK:
				runningTotal += 150;
				break;
			case HEAL:
				runningTotal += 250;
				break;				
			case TOUGH:
				runningTotal += 10;
				break;
			case CLAIM:
				runningTotal += 600;
				break;
			default:
				return 'Invalid part in array';
		}
	}

	return runningTotal;
}

global.GOBI = function (ID) {	return Game.getObjectById(ID); }

global.MC = function (name, dir) {
	
	switch (dir) {
		case 1:
		case 2:
		case 3:
		case 4:
		case 5:
		case 6:
		case 7:
		case 8:
			break;
		case 'N':
		case TOP:
		case 'T':
			dir = 1;
			break;
		case 'NE':
		case TOP_RIGHT:
		case 'TR':
			dir = 2;
			break;
		case 'E':
		case RIGHT:
		case 'R':
			dir = 3;
			break;
		case 'SE':
		case BOTTOM_RIGHT:
		case 'BR':
			dir = 4;
			break;
		case 'S':
		case BOTTOM:
		case 'B':
			dir = 5;
			break;
		case 'SW':
		case BOTTOM_LEFT:
		case 'BL':
			dir = 6;
			break;
		case 'W':
		case LEFT:
		case 'L':
			dir = 7;
			break;
		case 'NW':
		case TOP_LEFT:
		case 'TL':
			dir = 8;
			break;
	}
	
	return Game.creeps[name].move(dir)
}

global.visualRCProgress = function (controllerID) {

	let lvlColor;

	switch (controllerID.level) {
		case 1:
			lvlColor = '#00a000';
			break;
		case 2:
			lvlColor = '#40ff00';
			break;
		case 3:
			lvlColor = '#22dddd';
			break;
		case 4:
			lvlColor = '#00ffaa';
			break;
		case 5:
			lvlColor = '#8000ff';
			break;
		case 6:
			lvlColor = '#dd00bb';
			break;
		case 7:
			lvlColor = '#dd7700';
			break;
		case 8:
			lvlColor = '#dd0000';
			break;
		
	}
	let cont; 
	
	if (typeof controllerID == 'string') cont = GOBI(controllerID);
	else cont = controllerID;

	if (HEAP_MEMORY.rooms[cont.room.name] === undefined)
		HEAP_MEMORY.rooms[cont.room.name] = {};
	if (HEAP_MEMORY.rooms[cont.room.name].controllerPPTArray === undefined)
		HEAP_MEMORY.rooms[cont.room.name].controllerPPTArray = [];
	if (HEAP_MEMORY.rooms[cont.room.name].controllerProgress === undefined)
		HEAP_MEMORY.rooms[cont.room.name].controllerProgress = 0;
	if (HEAP_MEMORY.rooms[cont.room.name].controllerPPTArray.length > 20) {
		const array = HEAP_MEMORY.rooms[cont.room.name].controllerPPTArray;
		let sum = array.reduce(add, 0);
		let arrayLen = array.length;

		function add(accumulator, a) { return accumulator + a; }
		const avg = parseInt((sum / arrayLen).toFixed(2));
		HEAP_MEMORY.rooms[cont.room.name].controllerPPTArray = [];
		HEAP_MEMORY.rooms[cont.room.name].controllerPPTArray.push(avg);
	}
	
	const progress = cont.progress;

	let progressLastTick;
	if (HEAP_MEMORY.rooms[cont.room.name].controllerProgress !== 0)
		progressLastTick = progress - HEAP_MEMORY.rooms[cont.room.name].controllerProgress;
	else
		progressLastTick = 0;

	if (!(progressLastTick == 0 && HEAP_MEMORY.rooms[cont.room.name].controllerPPTArray.length == 0))
		HEAP_MEMORY.rooms[cont.room.name].controllerPPTArray.push(progressLastTick);

	HEAP_MEMORY.rooms[cont.room.name].controllerProgress = progress;


	let sum = HEAP_MEMORY.rooms[cont.room.name].controllerPPTArray.reduce(add, 0);
	let arrayLen = HEAP_MEMORY.rooms[cont.room.name].controllerPPTArray.length;

	function add(accumulator, a) { return accumulator + a; }
	
	const avgProgressPerTick = (sum / arrayLen).toFixed(2);
	
	const progressRemaining = cont.progressTotal - cont.progress;

	const ticksRemaining = (progressRemaining / avgProgressPerTick).toFixed(0);

	const currentTickDuration = Memory.time.lastTickTime.toFixed(2);
	const secondsRemaining = ticksRemaining * currentTickDuration;
	let days = Math.floor(secondsRemaining / (3600 * 24));
	let hours = Math.floor(secondsRemaining % (3600 * 24) / 3600);
	let minutes = Math.floor(secondsRemaining % 3600 / 60);
	let seconds = Math.floor(secondsRemaining % 60);

	if (!cont.room.memory.settings.visualSettings.progressInfo) cont.room.initSettings();
	const alignment = cont.room.memory.settings.visualSettings.progressInfo.alignment;
	const fontSize = cont.room.memory.settings.visualSettings.progressInfo.fontSize;
	const stroke = cont.room.memory.settings.visualSettings.progressInfo.stroke;
	const xOffset = cont.room.memory.settings.visualSettings.progressInfo.xOffset;
	const yOffsetFactor = cont.room.memory.settings.visualSettings.progressInfo.yOffsetFactor;

	cont.room.visual.text(('L' + cont.level + ' - ' + ((cont.progress / cont.progressTotal) * 100).toFixed(2)) + '%', cont.pos.x + xOffset, cont.pos.y - (yOffsetFactor * 2), { align: alignment, opacity: 0.8, color: lvlColor, font: fontSize, stroke: stroke });

	cont.room.visual.text((cont.progress + '/' + cont.progressTotal) + ' - Avg: +' + avgProgressPerTick, cont.pos.x + xOffset, cont.pos.y - yOffsetFactor, { align: alignment, opacity: 0.8, color: lvlColor, font: fontSize-.1, stroke: stroke });

	cont.room.visual.text(days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's (' + ticksRemaining + ' ticks)', cont.pos.x + xOffset, cont.pos.y, { align: alignment, opacity: 0.8, color: lvlColor, font: fontSize-.1, stroke: stroke });
}

global.secondsToDhms = function(seconds) {
seconds = Number(seconds);
var d = Math.floor(seconds / (3600*24));
var h = Math.floor(seconds % (3600*24) / 3600);
var m = Math.floor(seconds % 3600 / 60);
var s = Math.floor(seconds % 60);

var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
return dDisplay + hDisplay + mDisplay + sDisplay;
}

Object.assign(exports, {

	POLYBLUEDOTTED3: {
		stroke: '#0000ff',
		strokeWidth: 0.1,
		lineStyle: 'dashed'
	}
})

global.fireLink1 = function() {
    
    const linkTo    = Game.getObjectById('65348e6c42580f28c7f68e55');
    const linkFrom  = Game.getObjectById('65334b1a8ff0f85732868edc');
    
    if (linkTo.cooldown === 0) {
        linkTo.transferEnergy(linkFrom);
        return 'Fired link 1 manually.'
    } else {
        return 'Link is on cooldown.'
    }
}

global.fireLink2 = function() {
    
    const linkTo    = Game.getObjectById('653840abc40f9da7b4ebe67a');
    const linkFrom  = Game.getObjectById('65334b1a8ff0f85732868edc');
    
    if (linkTo.cooldown === 0) {
        linkTo.transferEnergy(linkFrom);
        return 'Fired link 2 manually.'
    } else {
        return 'Link is on cooldown.'
    }
}

global.fireLink = function (link1, link2) {
	
	const link1Obj = Game.getObjectById(link1);
	const link2Obj = Game.getObjectById(link2);

	link1Obj.transferEnergy(link2Obj);

	return;
}

global.calcLabReaction = function (baseReg1, baseReg2) {
		
	// DETERMINE OUTPUT COMPOUND BASED ON INPUT COMPOUNDS
	if (baseReg1 === RESOURCE_OXYGEN || baseReg2 === RESOURCE_OXYGEN) {
		if (baseReg1 === RESOURCE_HYDROGEN || baseReg2 === RESOURCE_HYDROGEN)
			outputChem = RESOURCE_HYDROXIDE;
		else if (baseReg1 === RESOURCE_UTRIUM || baseReg2 === RESOURCE_UTRIUM)
			outputChem = RESOURCE_UTRIUM_OXIDE;
		else if (baseReg1 === RESOURCE_KEANIUM || baseReg2 === RESOURCE_KEANIUM)
			outputChem = RESOURCE_KEANIUM_OXIDE;
		else if (baseReg1 === RESOURCE_LEMERGIUM || baseReg2 === RESOURCE_LEMERGIUM)
			outputChem = RESOURCE_LEMERGIUM_OXIDE;
		else if (baseReg1 === RESOURCE_ZYNTHIUM || baseReg2 === RESOURCE_ZYNTHIUM)
			outputChem = RESOURCE_ZYNTHIUM_OXIDE;
		else if (baseReg1 === RESOURCE_GHODIUM || baseReg2 === RESOURCE_GHODIUM)
			outputChem = RESOURCE_GHODIUM_OXIDE;
	} else if (baseReg1 === RESOURCE_HYDROGEN || baseReg2 === RESOURCE_HYDROGEN) {
		if (baseReg1 === RESOURCE_UTRIUM || baseReg2 === RESOURCE_UTRIUM)
			outputChem = RESOURCE_UTRIUM_HYDRIDE;
		else if (baseReg1 === RESOURCE_KEANIUM || baseReg2 === RESOURCE_KEANIUM)
			outputChem = RESOURCE_KEANIUM_HYDRIDE;
		else if (baseReg1 === RESOURCE_LEMERGIUM || baseReg2 === RESOURCE_LEMERGIUM)
			outputChem = RESOURCE_LEMERGIUM_HYDRIDE;
		else if (baseReg1 === RESOURCE_ZYNTHIUM || baseReg2 === RESOURCE_ZYNTHIUM)
			outputChem = RESOURCE_ZYNTHIUM_HYDRIDE;
		else if (baseReg1 === RESOURCE_GHODIUM || baseReg2 === RESOURCE_GHODIUM)
			outputChem = RESOURCE_GHODIUM_HYDRIDE;
	} else if (baseReg1 === RESOURCE_ZYNTHIUM || baseReg2 === RESOURCE_ZYNTHIUM) {
		if (baseReg1 === RESOURCE_KEANIUM || baseReg2 === RESOURCE_KEANIUM)
			outputChem = RESOURCE_ZYNTHIUM_KEANITE;
	} else if (baseReg1 === RESOURE_UTRIUM || baseReg2 === RESOURCE_UTRIUM) {
		if (baseReg1 === RESOURCE_LEMERGIUM || baseReg2 === RESOURCE_LEMERGIUM)
			outputChem = RESOURCE_UTRIUM_LEMERGITE;
	} else if (baseReg1 === RESOURCE_ZYNTHIUM_KEANITE || baseReg2 === RESOURCE_ZYNTHIUM_KEANITE) {
		if (baseReg1 === RESOURCE_UTRIUM_LEMERGITE || baseReg2 === RESOURCE_UTRIUM_LEMERGITE)
			outputChem = RESOURCE_GHODIUM;
	} else if (baseReg1 === RESOURCE_HYDROXIDE || baseReg2 === RESOURCE_HYDROXIDE) {
		if (baseReg1 === RESOURCE_UTRIUM_HYDRIDE || baseReg2 === RESOURCE_UTRIUM_HYDRIDE)
			outputChem = RESOURCE_UTRIUM_ACID;
		if (baseReg1 === RESOURCE_UTRIUM_OXIDE || baseReg2 === RESOURCE_UTRIUM_OXIDE)
			outputChem = RESOURCE_UTRIUM_ALKALIDE;
		if (baseReg1 === RESOURCE_KEANIUM_HYDRIDE || baseReg2 === RESOURCE_KEANIUM_HYDRIDE)
			outputChem = RESOURCE_KEANIUM_ACID;
		if (baseReg1 === RESOURCE_KEANIUM_OXIDE || baseReg2 === RESOURCE_KEANIUM_OXIDE)
			outputChem = RESOURCE_KEANIUM_ALKALIDE;
		if (baseReg1 === RESOURCE_LEMERGIUM_HYDRIDE || baseReg2 === RESOURCE_LEMERGIUM_HYDRIDE)
			outputChem = RESOURCE_LEMERGIUM_ACID;
		if (baseReg1 === RESOURCE_LEMERGIUM_OXIDE || baseReg2 === RESOURCE_LEMERGIUM_OXIDE)
			outputChem = RESOURCE_LEMERGIUM_ALKALIDE;
		if (baseReg1 === RESOURCE_ZYNTHIUM_HYDRIDE || baseReg2 === RESOURCE_ZYNTHIUM_HYDRIDE)
			outputChem = RESOURCE_ZYNTHIUM_ACID;
		if (baseReg1 === RESOURCE_ZYNTHIUM_OXIDE || baseReg2 === RESOURCE_ZYNTHIUM_OXIDE)
			outputChem = RESOURCE_ZYNTHIUM_ALKALIDE;
		if (baseReg1 === RESOURCE_GHODIUM_HYDRIDE || baseReg2 === RESOURCE_GHODIUM_HYDRIDE)
			outputChem = RESOURCE_GHODIUM_ACID;
		if (baseReg1 === RESOURCE_GHODIUM_OXIDE || baseReg2 === RESOURCE_GHODIUM_OXIDE)
			outputChem = RESOURCE_GHODIUM_ALKALIDE;
	} else if (baseReg1 === RESOURCE_CATALYST || baseReg2 === RESOURCE_CATALYST) {
		if (baseReg1 === RESOURCE_UTRIUM_ACID || baseReg2 == RESOURCE_UTRIUM_ACID)
			outputChem = RESOURCE_CATALYZED_UTRIUM_ACID;
		if (baseReg1 === RESOURCE_UTRIUM_ALKALIDE || baseReg2 == RESOURCE_UTRIUM_ALKALIDE)
			outputChem = RESOURCE_CATALYZED_UTRIUM_ALKALIDE;
		if (baseReg1 === RESOURCE_KEANIUM_ACID || baseReg2 == RESOURCE_KEANIUM_ACID)
			outputChem = RESOURCE_CATALYZED_KEANIUM_ACID;
		if (baseReg1 === RESOURCE_KEANIUM_ALKALIDE || baseReg2 == RESOURCE_KEANIUM_ALKALIDE)
			outputChem = RESOURCE_CATALYZED_KEANIUM_ALKALIDE;
		if (baseReg1 === RESOURCE_LEMERGIUM_ACID || baseReg2 == RESOURCE_LEMERGIUM_ACID)
			outputChem = RESOURCE_CATALYZED_LEMERGIUM_ACID;
		if (baseReg1 === RESOURCE_LEMERGIUM_ALKALIDE || baseReg2 == RESOURCE_LEMERGIUM_ALKALIDE)
			outputChem = RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE;
		if (baseReg1 === RESOURCE_ZYNTHIUM_ACID || baseReg2 == RESOURCE_ZYNTHIUM_ACID)
			outputChem = RESOURCE_CATALYZED_ZYNTHIUM_ACID;
		if (baseReg1 === RESOURCE_ZYNTHIUM_ALKALIDE || baseReg2 == RESOURCE_ZYNTHIUM_ALKALIDE)
			outputChem = RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE;
		if (baseReg1 === RESOURCE_GHODIUM_ACID || baseReg2 == RESOURCE_GHODIUM_ACID)
			outputChem = RESOURCE_CATALYZED_GHODIUM_ACID;
		if (baseReg1 === RESOURCE_GHODIUM_ALKALIDE || baseReg2 == RESOURCE_GHODIUM_ALKALIDE)
			outputChem = RESOURCE_CATALYZED_GHODIUM_ALKALIDE;
	}

	return outputChem;
}

global.createRoomFlag = function (room) { // creates a flag named after room at room's center, or at controller if present

	let flagX;
	let flagY;

	if (Game.rooms[room] !== undefined && Game.rooms[room].controller !== undefined) {
		flagX = Game.rooms[room].controller.pos.x;
		flagY = Game.rooms[room].controller.pos.y;
	} else {
		flagX = 25;
		flagY = 25;
	}
	
	const flag = Game.rooms[room].createFlag(flagX, flagY, Game.rooms[room].name, randomColor(), randomColor());
	switch (flag) {
		default:
			console.log('Flag succesfully created.');
			return flag;
		case ERR_NAME_EXISTS:
			console.log('Error: Name exists.');
			return null;
		case ERR_FULL:
			console.log('Error: At flag limit of 10,000 already.');
			return null;
		case ERR_INVALID_ARGS:
			console.log('Error: The location or the name is incorrect.');
			return null;
	}
}

global.randomInt = function (min = 1, max = 100) { // Random integer between min & max, inclusive
  return Math.floor(Math.random() * (max - min + 1) + min)
}

global.randomColor = function () { // Random color returned as CONSTANT
	const colorInt = randomInt(1, 10);

	switch (colorInt) {
		case 1:
			return COLOR_RED;
		case 2:
			return COLOR_PURPLE;
		case 3:
			return COLOR_BLUE;
		case 4:
			return COLOR_CYAN;
		case 5:
			return COLOR_GREEN;
		case 6:
			return COLOR_YELLOW;
		case 7:
			return COLOR_ORANGE;
		case 8:
			return COLOR_BROWN;
		case 9:
			return COLOR_GREY;
		case 10:
			return COLOR_WHITE;
	}
}

global.randomColorAsInt = function () { // Random color returned as INTEGER
	return randomInt(1, 10);
}

global.spawnClaimerForCarry = function () {
	return Game.spawns.Spawn1.spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], 'CarryClaimer', { memory: { role: 'claimer', homeRoom: 'E58S51', claimRoom: 'E59S48' } });
}

global.col = function (colNum) {
	const roomName = Memory.colonyList[colNum - 1];
	return Game.rooms[roomName];
}

global.isArray = function(value) { return value instanceof Array; }

global.exists = function(value) {
	try {
		if (typeof value === 'object' && value !== null)
			return true;
		else if (typeof value !== 'undefined')
			return true;
		else
			return false;
	} catch (e) { return false; }
}

global.validateRoomName = function(roomName) {
    // Scca			reeps room names are in the format E##N##, W##N##, E##S##, or W##S##.
    // ## represents a single or two digit number within the range 1-60
		// This range excludes leading zeroes such as 01
    let pattern = /^[EW]([1-9]|[1-5]\d|60)[NS]([1-9]|[1-5]\d|60)$/;
    return pattern.test(roomName);
};

global.roomNameToXY = function(name) {
    let xx = parseInt(name.substr(1), 10);
    let verticalPos = 2;
    if (xx >= 100) {
        verticalPos = 4;
    } else if (xx >= 10) {
        verticalPos = 3;
    }
    let yy = parseInt(name.substr(verticalPos + 1), 10);
    let horizontalDir = name.charAt(0);
    let verticalDir = name.charAt(verticalPos);
    if (horizontalDir === 'W' || horizontalDir === 'w') {
        xx = -xx - 1;
    }
    if (verticalDir === 'N' || verticalDir === 'n') {
        yy = -yy - 1;
    }
    return [xx, yy];
};

global.validateFlagName = function (input) {

	const gameFlags = Object.keys(Game.flags);
	const numFlags = gameFlags.length;
	let noMatch = false;

	if (input instanceof Array) {
		for (let i = 0; i < input.length; i++) {
			let matched = validateFlagName(input[i]);
			if (matched)
				continue;
			else {
				console.log('Provided flag name of \'' + input[i] + '\' at index ' + i + ' is not an existent flag.');
				return false;
			}
		}		
	} else if (typeof input === 'string') {
		for (let i = 0; i <= numFlags; i++) {
			if (input == gameFlags[i])
				return true;
			else {
				noMatch = true;
				continue;
			}
		}
		if (noMatch) return false;
	} else {
		console.log('Input parameter to validate must be an array of flag names, or a single flag name.');
		return null;
	}
}

global.calcPath = function (startPos, endPos, returnLength = false) {
	
	if (!startPos instanceof RoomPosition && !endPos instanceof RoomPosition)
		return 'Neither of the provided parameters are valid RoomPosition objects.';
	else if (!startPos instanceof RoomPosition)
		return 'The first parameter provided is not a valid RoomPosition object.';
	else if (!endPos instanceof RoomPosition)
		return 'The second parameter provided is not a valid RoomPosition object.';

	let goal = { pos: endPos, range: 1 };
	
	 let ret = PathFinder.search(
    startPos, goal,
    {
      // We need to set the defaults costs higher so that we
      // can set the road cost lower in `roomCallback`
      plainCost: 2,
      swampCost: 10,

      roomCallback: function(roomName) {

        let room = Game.rooms[roomName];
        // In this example `room` will always exist, but since 
        // PathFinder supports searches which span multiple rooms 
        // you should be careful!
        if (!room) return;
				if (Memory.matrices && Memory.matrices.general !== 'undefined') {
					let costs = PathFinder.CostMatrix.deserialize(Memory.matrices.general);
					return costs;
				} else {
					let costs = new PathFinder.CostMatrix;
				

					room.find(FIND_STRUCTURES).forEach(function (struct) {
						if (struct.structureType === STRUCTURE_ROAD) {
							// Favor roads over plain tiles
							costs.set(struct.pos.x, struct.pos.y, 1);
						} else if (struct.structureType !== STRUCTURE_CONTAINER &&
							(struct.structureType !== STRUCTURE_RAMPART ||
								!struct.my)) {
							// Can't walk through non-walkable buildings
							costs.set(struct.pos.x, struct.pos.y, 255);
						}
					});

					// Avoid creeps in the room
					//room.find(FIND_CREEPS).forEach(function(creep) {
					//  costs.set(creep.pos.x, creep.pos.y, 0xff);
					//});
					if (!Memory.matrices) Memory.matrices = {};
					Memory.matrices[general] = costs.serialize();
					return costs;
				}
      },
    }
	);
	
	if (returnLength)
		return [ret.path, ret.path.length];
	else
		return ret.path;
}

global.getBody = function(segment, room) {
	let body = [];

	// How much each segment costs
	let segmentCost = _.sum(segment, s => BODYPART_COST[s]);

	// how much energy we can use total
	let energyAvailable = room.energyCapacityAvailable;

	// how many times we can include the segment with room energy
	let maxSegments = Math.floor(energyAvailable / segmentCost);

	// push the segment multiple times
	_.times(maxSegments, function () {
		_.forEach(segment, s => body.push(s));
	});

	return body;
}

global.pushWaypoints = function (creepName, waypoints) {
	
	const creep = Memory.creeps[creepName];

	if (waypoints instanceof Array) {
		if (creep.memory.rallyPoint == 'none') {
			delete creep.memory.rallyPoint;
			creep.memory.rallyPoint = waypoints;
			return waypoints;
		} else if (creep.memory.rallyPoint instanceof Array) {
			let oldRallyPoints = creep.memory.rallyPoint;
			const newRallyPoints = oldRallyPoints.concat(waypoints);
			creep.memory.rallyPoint = newRallyPoints;
			return newRallyPoints;
		} else if (creep.memory.rallyPoint !== 'none' && typeof creep.memory.rallyPoint === 'string') {
			const oldRallyPoint = [creep.memory.rallyPoint];
			const newRallyPoints = oldRallyPoints.concat(waypoints);
			creep.memory.rallyPoint = newRallyPoints;
			return newRallyPoints;
		}
	} else if (typeof waypoints === 'string') {
		if (creep.memory.rallyPoint == 'none') {
			delete creep.memory.rallyPoint;
			creep.memory.rallyPoint = waypoints;
			return waypoints;
		} else if (creep.memory.rallyPoint instanceof Array) {
			let currentRallyPoints = creep.memory.rallyPoint;
			currentRallyPoints.push(waypoints);
			creep.memory.rallyPoint.push(waypoints);
			return currentRallyPoints;
		} else if (creep.memory.rallyPoint !== 'none' && typeof creep.memory.rallyPoint === 'string') {
			const currentRallyPoint = creep.memory.rallyPoint;
			const newRallyPoints = [currentRallyPoint, waypoints];
			creep.memory.rallyPoint = newRallyPoints;
			return newRallyPoints
		}
	}
}

global.setTickTimer = function (numTicks) {
	

}