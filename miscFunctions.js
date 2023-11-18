"use strict";
// Tick length calculation by Kamots 17 januari 2019
// Provides global.tickTime as seconds
global.calcTickTime = function(tickSamples = 1000) { // Call this from 1st line of main loop. Can adjust samples used for calculation from there.
    let millis = Date.now();

    // Set some sane defaults
    if (typeof Memory.lastTickMillis == "undefined") Memory.lastTickMillis = millis - 1010;
    if (typeof Memory.lastTickTime == "undefined") Memory.lastTickTime = 1.01;
    if (typeof Memory.tickTimeCount == "undefined") Memory.tickTimeCount = 0;
    if (typeof Memory.tickTimeTotal == "undefined") Memory.tickTimeTotal = 0;
    
    let lastTickMillis = Number(Memory.lastTickMillis);
    let tickTimeCount = Number(Memory.tickTimeCount);
    let tickTimeTotal = Number(Memory.tickTimeTotal);

    if (tickTimeCount >= (tickSamples-1)) {
        tickTimeTotal += millis - lastTickMillis;
        tickTimeCount++;
        global.tickTime = (tickTimeTotal / tickTimeCount) / 1000;
        console.log("Calculated tickTime as", global.tickTime, "from", tickTimeCount, "samples.");
        Memory.lastTickTime = global.tickTime;
        Memory.tickTimeTotal = millis - lastTickMillis;
        Memory.tickTimeCount = 1;
        Memory.lastTickMillis = millis;
    } else { 
        global.tickTime = Number(Memory.lastTickTime);
        tickTimeTotal += millis - lastTickMillis;
        Memory.tickTimeTotal = tickTimeTotal;
        tickTimeCount++;
        Memory.tickTimeCount = tickTimeCount;
        Memory.lastTickMillis = millis;
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

global.GOBI = function (ID) {
	return Game.getObjectById(ID);
}

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
		case 'TOP':
		case 'T':
			dir = 1;
			break;
		case 'NE':
		case 'TOP_RIGHT':
		case 'TR':
			dir = 2;
			break;
		case 'E':
		case 'RIGHT':
		case 'R':
			dir = 3;
			break;
		case 'SE':
		case 'BOTTOM_RIGHT':
		case 'BR':
			dir = 4;
			break;
		case 'S':
		case 'BOTTOM':
		case 'B':
			dir = 5;
			break;
		case 'SW':
		case 'BOTTOM_LEFT':
		case 'BL':
			dir = 6;
			break;
		case 'W':
		case 'LEFT':
		case 'L':
			dir = 7;
			break;
		case 'NW':
		case 'TOP_LEFT':
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
			lvlColor = '#005500';
			break;
		case 2:
			lvlColor = '#00ffff';
			break;
		case 3:
			lvlColor = '#22dddd';
			break;
		case 4:
			lvlColor = '#44ccaa';
			break;
		case 5:
			lvlColor = '#6600ff';
			break;
		case 6:
			lvlColor = '#99ff00';
			break;
		case 7:
			lvlColor = '#cc00ff';
			break;
		case 8:
			lvlColor = '#aa0000';
			break;
		
	}
	let cont; 
	
	if (typeof controllerID == 'string')
		cont = GOBI(controllerID);
	else
		cont = controllerID;

	cont.room.visual.text('L' + cont.level + ' - ' + cont.progress + '/' + cont.progressTotal, cont.pos.x + 1, cont.pos.y - 1, { align: 'left', opacity: 0.5, color: lvlColor, font: 0.4 });

	cont.room.visual.text('          ' + ((cont.progress / cont.progressTotal) * 100).toFixed(2) + '%', cont.pos.x + 1, cont.pos.y, { align: 'left', opacity: 0.5, color: lvlColor, font: 0.4 });
		
}

global.queue = function (command) {
	manualCmdQueue.push(command);
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