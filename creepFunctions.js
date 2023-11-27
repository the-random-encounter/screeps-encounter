Creep.prototype.findEnergySource = function() {
	
	let sources = this.room.find(FIND_SOURCES);
			
	if (sources.length) {
		
		let source = _.find(sources, function (s) {
			return s.pos.getOpenPositions().length == 1 || s.pos.getOpenPositions().length > 0 && !s.room.lookForAtArea(LOOK_CREEPS, s.pos.y - 1, s.pos.x - 1, s.pos.y + 1, s.pos.x + 1, true).length
		});
		
		if (source) {
			this.memory.source = source.id;
		
			return source;
		} else {
		    source = _.find(sources, function (s) {
			return s.pos.getOpenPositions().length == 1 || s.pos.getOpenPositions().length > 0 
		});
			this.memory.source = source.id
			return source;
		}
	}
}

Creep.prototype.assignHarvestSource = function(noIncrement) {

	const room = this.room;
	const creep = this;
	const role = this.memory.role;

	// Confirm the room has had its sources cached
	if (room.memory.objects === undefined)	room.cacheObjects();

	// if assignee is a miner, assign mineral instead of source
	if (role == 'miner') {
		const assignedMineral = room.memory.objects.minerals[0];
		console.log('Assigned miner ' + this.name + ' to mineral ID ' + assignedMineral);
		this.memory.mineral = assignedMineral;
		return assignedMineral;
	}

	// get array of sources available
	let roomSources;
	if (role == 'harvester') roomSources = room.memory.objects.sources;
	else if (role == 'remoteharvester') roomSources = room.memory.outposts.aggregateSourceList;

	// in case there is no lastAssigned counter, create it
	if (role == 'harvester') {
		if (room.memory.objects.lastAssigned === undefined) {
			room.memory.objects.lastAssigned = 0;
			console.log('Creating \'lastAssigned\' memory object.')
		}
	} else if (role == 'remoteharvester') {
		if (room.memory.outposts.aggLastAssigned === undefined) {
			room.memory.outposts.aggLastAssigned = 0;
			console.log('Creating \'aggLastAssigned\' memory object.');
		}
	}
	
	// separate last assigned value for contingency condition
	let LA;
	if (role == 'harvester') LA = room.memory.objects.lastAssigned;
	else if (role == 'remoteharvester') LA = room.memory.outposts.aggLastAssigned;
	
	// set nextAssigned to the increment of lastAssigned
	let nextAssigned;
	if (role == 'harvester') nextAssigned = room.memory.objects.lastAssigned + 1;
	else if (role == 'remoteharvester') nextAssigned = room.memory.outposts.aggLastAssigned + 1;
	
	// set nextAssigned to 0 if it has reached the end of sources list
	if (nextAssigned >= roomSources.length)
		nextAssigned = 0;

	// set assigned source to the next assigned room source
	let assignedSource = roomSources[nextAssigned];

	// set creep memory to match
	this.memory.source = assignedSource;

	if (role == 'harvester') room.memory.objects.lastAssigned++;
	else if (role == 'remoteharvester') room.memory.outposts.aggLastAssigned++;

	if (role == 'harvester') {
		if (room.memory.objects.lastAssigned >= roomSources.length)
			room.memory.objects.lastAssigned = 0;
	} else if (role == 'remoteharvester') {
		if (room.memory.outposts.aggLastAssigned >= roomSources.length)
			room.memory.outposts.aggLastAssigned = 0;
	}

	console.log('Assigned harvester ' + this.name + ' to source #' + (LA + 1) + ' (ID: ' + assignedSource + ') in room ' + this.room.name)

	if (noIncrement) {
		if (role == 'harvester') room.memory.objects.lastAssigned = LA;
		else if (role == 'remoteharvester') room.memory.outposts.aggLastAssigned = LA;
	}

	return assignedSource;
}

Creep.prototype.assignRemoteHarvestSource = function(noIncrement = false) {
	
	const homeOutposts = Game.rooms[this.memory.homeRoom].memory.outposts;
	const roomSources = homeOutposts.aggregateSourceList;
		
	if (homeOutposts.aggLastAssigned === undefined)	homeOutposts.aggLastAssigned = 0;
	
	let lastAss = homeOutposts.aggLastAssigned;
	let nextAss = lastAss + 1;
	
	if (nextAss >= roomSources.length) nextAss = 0;

	let assignedSource = roomSources[nextAss];
	this.memory.source = assignedSource;
	
	homeOutposts.aggLastAssigned = nextAss;

	if (noIncrement) homeOutposts.aggLastAssigned = lastAss;

	console.log('Assigned remote harvester ' + this.name + ' to remote source #' + (nextAss + 1) + ' (ID: ' + assignedSource + ')');

	return assignedSource;
}

Creep.prototype.unloadEnergy = function() {

	if (this.spawning) return;
	
	if (this.memory.bucket) {
		const target = Game.getObjectById(this.memory.bucket);

		if (target.hits == target.hitsMax) {
			this.say('⛏️');
			this.transfer(target, RESOURCE_ENERGY);
		}
		else {
			this.say('🔧');
			this.repair(target);
		}
		return;
	} else {
		const sourceTarget = Game.getObjectById(this.memory.source);
		const sourceContainers = sourceTarget.pos.findInRange(FIND_STRUCTURES, 3, { filter: (obj) => (obj.structureType == STRUCTURE_LINK || obj.structureType == STRUCTURE_STORAGE || obj.structureType == STRUCTURE_CONTAINER)/* && obj.pos.isNearTo(this)*/ });
		const nearbyObj = sourceContainers[0];
	
		if (nearbyObj && nearbyObj.structureType == STRUCTURE_CONTAINER) {
			if (!this.room.checkOutbox(nearbyObj.id))
				this.room.setOutbox(nearbyObj.id);
		}

		if (!nearbyObj) {
			if (this.drop(RESOURCE_ENERGY) == 0) {
				this.say('🗑️');
				console.log(this.name + ' dropped.');
			}
			return;
		} else {
			//const target = nearbyObj[0];
			this.memory.bucket = nearbyObj.id;
			if (nearbyObj.hits == nearbyObj.hitsMax) {
				if (this.pos.isNearTo(nearbyObj)) {
					this.say('⛏️');
					this.transfer(nearbyObj, RESOURCE_ENERGY);
				} else
					this.moveTo(nearbyObj);
			}
			else {
				this.say('🔧');
				this.repair(nearbyObj);
			}
			return;
		}
	}
}

Creep.prototype.harvestEnergy = function() {
	let storedSource = Game.getObjectById(this.memory.source);
	if (!storedSource) {
		delete this.memory.source;
		//if (this.memory.role == 'harvester' || this.memory.role == 'rebooter' || this.memory.role == 'miner')
		storedSource = this.assignHarvestSource(false);
		//else if (this.memory.role == 'remoteharvester') {
		//	console.log('calling assignRemoteHarvestSource');
		//	storedSource = this.assignRemoteHarvestSource(false);
		//}
	}
	
	if (storedSource) {
		if (this.pos.isNearTo(storedSource)) {
			if (storedSource.energy == 0) {
				if (this.store.getUsedCapacity() > 0) {
					this.unloadEnergy();
					this.harvest(storedSource);
				} else {
					this.say('🚬');
				}
			} else {
				this.harvest(storedSource);
			}
		} else
			this.moveTo(storedSource, { visualizePathStyle: { stroke: '#ffaa00', ignoreCreeps: true } });
	}
}

Creep.prototype.getDroppedResource = function(pileID) {

	if (pileID === undefined)
		pileID = this.pos.findClosestByRange(FIND_DROPPED_RESOURCES).id;

	if (pileID) {
		const target = Game.getObjectById(pileID);
		if (target) {
			if (this.pickup(target) == ERR_NOT_IN_RANGE)
				this.moveTo(target);
		}
	}
}

Creep.prototype.pickupClosestEnergy = function() {
	
	const containersWithEnergy = this.room.find(FIND_STRUCTURES, {
		filter: (obj) => (obj.structureType == STRUCTURE_CONTAINER || obj.structureType == STRUCTURE_STORAGE) && obj.store[RESOURCE_ENERGY] > 0
	});

	const droppedPiles = this.room.find(FIND_DROPPED_RESOURCES);
	const resourceList = containersWithEnergy.concat(droppedPiles);
	const target = this.pos.findClosestByRange(resourceList);

	if (target) {
			if (this.pickup(target) == ERR_NOT_IN_RANGE || this.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					this.moveTo(target);
			}
	}
}

Creep.prototype.unloadMineral = function() {

	const mineral = Object.keys(this.store).toString();
	
	if (this.memory.bucket) {
		const target = Game.getObjectById(this.memory.bucket);
		this.transfer(target, mineral);
		return;
	} else {
		const nearbyObj = this.room.find(FIND_STRUCTURES, { filter: (obj) => (obj.structureType == STRUCTURE_STORAGE || obj.structureType == STRUCTURE_CONTAINER || obj.structureType == STRUCTURE_LINK) && obj.pos.isNearTo(this) });
	
		if (!nearbyObj.length) {
			if (this.drop(mineral) == 0)
				console.log(this.name + ' dropped ' + mineral + '.');
			return;
		} else {
			const target = nearbyObj[0];
			this.memory.bucket = target.id;
			this.transfer(target, mineral);
			return;
		}
	}
}

Creep.prototype.harvestMineral = function() {
	
	let storedMineral = Game.getObjectById(this.memory.mineral);

	if (!storedMineral) {
		delete this.memory.mineral;
		if (this.memory.role == 'miner')
			storedMineral = this.assignHarvestSource(false)
	}
	
	if (storedMineral) {
		if (this.pos.isNearTo(storedMineral)) {
			if (storedMineral.mineralAmount == 0 && this.store.getUsedCapacity() > 0) {
				this.unloadMineral();
			}
			this.harvest(storedMineral);
		} else {
			this.moveTo(storedMineral, { visualizePathStyle: { stroke: '#ff00ff', ignoreCreeps: true } });
		}
	}
}

Creep.prototype.moveBySerializedPath = function(serializedPath) {

	const path = Room.deserializePath(serializedPath);
	this.moveByPath(path);
}

Creep.prototype.recursivePathMove = function(serializedPath, stepNum = 0) {

	const path = Room.deserializePath(serializedPath);

	if (this.move(path[stepNum].direction) == OK)
		stepNum++;

	if (stepNum < serializedPath.length)
		return recursivePathMove(serializedPath, stepNum);
}

Creep.prototype.disable = function() {
	this.memory.disableAI = true;
	return true;
}

Creep.prototype.enable = function() {
	this.memory.disableAI = false;
	return false;
}

Creep.prototype.getBoost = function(compound = false, sourceLab = false, numParts = 1) {
	if (compound) {
		if (sourceLab) {
			if (typeof sourceLab === 'string')
				sourceLab = Game.getObjectById(sourceLab);
			sourceLab.boostCreep()
		}
		
		if (sourceLab.boostCreep(this,numParts) == ERR_NOT_IN_RANGE) {
			this.moveTo(sourceLab, { visualizePathStyle: { stroke: '#ffffff', opacity: 0.5, lineStyle: 'undefined' } });
		}
	}
}

Creep.prototype.assignOutbox = function(noIncrement) {

	const room = this.room;
	const LA = room.memory.settings.containerSettings.lastOutbox;

	if (!room.memory.settings)
		room.initSettings();

	if (!room.memory.objects)
		room.cacheObjects();

	const roomOutboxes = room.memory.settings.containerSettings.outboxes;

	if (room.memory.settings.containerSettings.lastOutbox == undefined) {
		room.memory.settings.containerSettings.lastOutbox = 0;
		console.log('Creating \'lastOutbox\' memory setting.')
	}
	
	let nextOutbox = room.memory.settings.containerSettings.lastOutbox + 1;
	
	if (nextOutbox >= roomOutboxes.length)
		nextAssigned = 0;

	let assignedOutbox = roomOutboxes[nextOutbox];

	this.memory.pickup = assignedOutbox;

	room.memory.settings.containerSettings.lastOutbox += 1;

	if (room.memory.settings.containerSettings.lastOutbox >= roomOutboxes.length)
		room.memory.settings.containerSettings.lastOutbox = 0;

	console.log('Assigned ' + this.memory.role + ' ' + this.name + ' to outbox ID ' + assignedOutbox)

	if (noIncrement)
		room.memory.settings.containerSettings.lastOutbox = LA;

	return assignedOutbox;

}

Creep.prototype.assignInbox = function(noIncrement) {

	const room = this.room;
	const LA = room.memory.settings.containerSettings.lastInbox;

	if (!room.memory.settings)
		room.initSettings();

	if (!room.memory.objects)
		room.cacheObjects();

	const roomInboxes = room.memory.settings.containerSettings.inboxes;

	if (room.memory.settings.containerSettings.lastInbox == undefined) {
		room.memory.settings.containerSettings.lastInbox = 0;
		console.log('Creating \'lastInbox\' memory setting.')
	}
	
	let nextInbox = room.memory.settings.containerSettings.lastInbox + 1;
	
	if (nextInbox >= roomInboxes.length)
		nextAssigned = 0;

	let assignedInbox = roomInboxes[nextInbox];

	this.memory.dropoff = assignedInbox;

	room.memory.settings.containerSettings.lastInbox += 1;

	if (room.memory.settings.containerSettings.lastInbox >= roomInboxes.length)
		room.memory.settings.containerSettings.lastInbox = 0;

	console.log('Assigned ' + this.memory.role + ' ' + this.name + ' to inbox ID ' + assignedInbox)

	if (noIncrement)
		room.memory.settings.containerSettings.lastInbox = LA;

	return assignedInbox;

}

Creep.prototype.assignLogisticalPair = function (logParam) {
	
	let source, destination;

	if (logParam instanceof Array) {
		source = logParam[0];
		destination = logParam[1];
	} else if (typeof logParam === 'number') {
		const chosenPair = this.room.memory.data.logisticalPairs[logParam];

		if (!chosenPair) {
			return 'You supplied a logistical pair index value that does not exist. Recheck available options.';
		} else {
			source = chosenPair[0];
			destination = chosenPair[1];
		}
	}

	if ((source && !destination) || (!source && destination))
		return 'If including parameters, you must specify both the source AND destination, as an array.';

	if (source && destination) {
		if (typeof source === 'string')
			this.memory.pickup = source;
		else if (source instanceof OwnedStructure)
			this.memory.pickup = source.id;

		if (typeof destination === 'string')
			this.memory.dropoff = destination;
		else if (destination instanceof OwnedStructure)
			this.memory.dropoff = destination.id;
	} else {

		if (!this.room.memory.data)
			this.room.initSettings();
		if (this.room.memory.data.logisticalPairs === undefined)
			this.room.memory.data.logisticalPairs = [];
			
			this.room.registerLogisticalPairs();

		if (this.room.memory.data.noPairs) {
			this.memory.pickup = 'none';
			this.memory.dropoff = 'none';
			return;
		}
		if (this.room.memory.data.pairCounter === undefined)
			this.room.memory.data.pairCounter = 0;

		const assignedPair = this.room.memory.data.logisticalPairs[this.room.memory.data.pairCounter];

		this.room.memory.data.pairCounter += 1;

		if (this.room.memory.data.pairCounter >= this.room.memory.data.logisticalPairs.length)
			this.room.memory.data.pairCounter = 0;

		if (this.room.memory.data.logisticalPairs.length == 0) {
			this.memory.pickup = 'none';
			this.memory.dropoff = 'none';
			return 'No pairs available to assign. Set \'none\'.';
		} else if (assignedPair && assignedPair.length < 3) {
			console.log('No pairs to assign.');
			return;
		}
			
		else if (assignedPair && assignedPair.length >= 3) {
			this.memory.pickup = assignedPair[0];
			this.memory.dropoff = assignedPair[1];
			this.memory.cargo = assignedPair[2];
			this.memory.pathLength = assignedPair[5];
			console.log('[' + this.room.name + ']: Assigned pair (PICKUP: ' + assignedPair[0] + ') | (DROPOFF: ' + assignedPair[1] + ') | (CARGO: ' + assignedPair[2] + ') | (LOCALITY: ' + assignedPair[3] + ')');
			return;
		} else {
			console.log('[' + this.room.name + ']: Unable to assign pair for creep \'' + this.name + '\'.');
			return; 
		}
	}
}

Creep.prototype.navigateWaypoints = function (waypoints) {
	if (waypoints instanceof Array !== true)
		return 'The passed parameter was not an array. Pass an array containing the list of waypoints (flag names) sorted in navigation order.'
	else {
		if (!validateFlagName(waypoints))
			return 'Input waypoints contained an invalid room name';
	}
}