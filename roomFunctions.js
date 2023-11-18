Room.prototype.calcPath 									= function(pathName, start, end, walkOnCreeps = true, serializeData = false, maxOps) {

	PathFinder.use(true);
	
	if (typeof start === 'string' || start instanceof String)
		start = Game.getObjectById(start);

	if (typeof end === 'string' || end instanceof String)
		end = Game.getObjectById(end);

	let path;
	if (maxOps)
		path = this.findPath(start, end, { ignoreCreeps: walkOnCreeps, serialize: serializeData, maxOps: maxOps });

	if (!maxOps)
		path = this.findPath(start, end, { ignoreCreeps: walkOnCreeps, serialize: serializeData });

	if (path) {
		this.memory.paths[pathName] = path;
		return path;
	} else if (!path){
		console.log('Could not generate path.');
		return null;
	}	
}
Room.prototype.cacheObjects 							= function() {

	// declare storage array for objects to cache
	let storageArray = [];

	// search room for each object type
	const sources 			= this.find(FIND_SOURCES	);
	const minerals 			= this.find(FIND_MINERALS	);
	const deposits 			= this.find(FIND_DEPOSITS	);
	const allStructures = this.find(FIND_STRUCTURES, { filter: (i) => 								i.structureType == STRUCTURE_CONTROLLER ||	i.structureType == STRUCTURE_SPAWN 	||	i.structureType == STRUCTURE_EXTENSION 	|| i.structureType == STRUCTURE_TOWER 	|| i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_STORAGE || 	i.structureType == STRUCTURE_RAMPART 		|| i.structureType == STRUCTURE_LINK 		|| i.structureType == STRUCTURE_EXTRACTOR || i.structureType == STRUCTURE_LAB 		|| 	i.structureType == STRUCTURE_TERMINAL 	|| i.structureType == STRUCTURE_FACTORY || i.structureType == STRUCTURE_OBSERVER 	|| i.structureType == STRUCTURE_NUKER 	|| 	i.structureType == STRUCTURE_POWER_SPAWN });
	
	const controller 	= _.filter(allStructures, { structureType: STRUCTURE_CONTROLLER }	);
	const spawns 			= _.filter(allStructures, { structureType: STRUCTURE_SPAWN 			} );
	const extensions 	= _.filter(allStructures, { structureType: STRUCTURE_EXTENSION 	} );
	const towers 			= _.filter(allStructures, { structureType: STRUCTURE_TOWER 			} );
	const containers 	= _.filter(allStructures, { structureType: STRUCTURE_CONTAINER 	} );
	const storage 		= _.filter(allStructures, { structureType: STRUCTURE_STORAGE 		} );
	const ramparts 		= _.filter(allStructures, { structureType: STRUCTURE_RAMPART 		} );
  const links 			= _.filter(allStructures, { structureType: STRUCTURE_LINK				} );
	const extractor 	= _.filter(allStructures, { structureType: STRUCTURE_EXTRACTOR 	} );
	const labs 				= _.filter(allStructures, { structureType: STRUCTURE_LAB 				} );
	const terminal 		= _.filter(allStructures, { structureType: STRUCTURE_TERMINAL 	} );
	const factory 		= _.filter(allStructures, { structureType: STRUCTURE_FACTORY 		} );
	const observer 		= _.filter(allStructures, { structureType: STRUCTURE_OBSERVER 	} );
	const powerspawn 	= _.filter(allStructures, { structureType: STRUCTURE_POWER_SPAWN} );
	const nuker 			= _.filter(allStructures, { structureType: STRUCTURE_NUKER 			} );

	// check if the 'objects' object exists in room memory & create it if not
	if (!this.memory.objects) {
		this.memory.objects = {};
	}
	// if sources are found, add their IDs to array and add array to room's 'objects' memory
	if (sources) {
		for (i = 0; i < sources.length; i++)
			storageArray.push(sources[i].id);
		if (storageArray.length) {
			this.memory.objects.sources = storageArray;
			if (storageArray.length > 1)
				console.log('Cached ' + storageArray.length + ' sources.');
			else
				console.log('Cached 1 source.');
		}
		storageArray = [];
	}
	// if minerals are found, add their IDs to array and add array to room's 'objects' memory
	if (minerals) {
		for (i = 0; i < minerals.length; i++)
			storageArray.push(minerals[i].id);
		if (storageArray.length) {
			this.memory.objects.minerals = storageArray;
			if (storageArray.length > 1)
				console.log('Cached ' + storageArray.length + ' minerals.');
			else
				console.log('Cached 1 mineral.');
		}
		storageArray = [];
	}
	// if deposits are found, add their IDs to array and add array to room's 'objects' memory
	if (deposits) {
		for (i = 0; i < deposits.length; i++)
			storageArray.push(deposits[i].id);
		if (storageArray.length) {
			this.memory.objects.deposits = storageArray;
			if (storageArray.length > 1)
				console.log('Cached ' + storageArray.length + ' deposits.');
			else
				console.log('Cached 1 deposit.');
		}
		storageArray = [];
	}
	// if a controller is found, add its ID to array and add array to room's 'objects' memory
	if (controller) {
		for (i = 0; i < controller.length; i++)
			storageArray.push(controller[i].id);
		if (storageArray.length) {
			this.memory.objects.controller = storageArray;
			if (storageArray.length > 1)
				console.log('Cached ' + storageArray.length + '  controllers.');
			else
				console.log('Cached 1 controller.');
		}
		storageArray = [];
	}
	// if a spawn is found, add its ID to array and add array to room's 'objects' memory
	if (spawns) {
		for (i = 0; i < spawns.length; i++)
			storageArray.push(spawns[i].id);
		if (storageArray.length) {
			this.memory.objects.spawns = storageArray;
			if (storageArray.length > 1) 
				console.log('Cached ' + storageArray.length + ' spawns.');
			else 
				console.log('Cached 1 spawn.');
		}
		storageArray = [];
	}	
	// if an extension is found, add its ID to array and add array to room's 'objects' memory
	if (extensions) {
		for (i = 0; i < extensions.length; i++)
			storageArray.push(extensions[i].id);
		if (storageArray.length) {
			this.memory.objects.extensions = storageArray;
			if (storageArray.length > 1) 
				console.log('Cached ' + storageArray.length + ' extensions.');
			else 
				console.log('Cached 1 extebsion.');
		}
		storageArray = [];
	}	
	// if towers are found, add their IDs to array and add array to room's 'objects' memory
	if (towers) {
		for (i = 0; i < towers.length; i++)
			storageArray.push(towers[i].id);
		if (storageArray.length) {
			this.memory.objects.towers = storageArray;
			if (storageArray.length > 1)
				console.log('Cached ' + storageArray.length + ' towers.');
			else
				console.log('Cached 1 tower.');
		}
		storageArray = [];
	}
	// if containers are found, add their IDs to array and add array to room's 'objects' memory
	if (containers) {
		for (i = 0; i < containers.length; i++)
			storageArray.push(containers[i].id);
		if (storageArray.length) {
			this.memory.objects.containers = storageArray;
			if (storageArray.length > 1)
				console.log('Cached ' + storageArray.length + ' containers.');
			else
				console.log('Cached 1 container.');
		}
		storageArray = [];
	}
	// if storage is found, add its ID to array and add array to room's 'objects' memory
	if (storage) {
		for (i = 0; i < storage.length; i++)
			storageArray.push(storage[i].id);
		if (storageArray.length) {
			this.memory.objects.storage = storageArray;
			if (storageArray.length > 1)
				console.log('Cached ' + storageArray.length + ' storages.');
			else
				console.log('Cached 1 storage.');
		}
		storageArray = [];
	}
	// if ramparts are found, add their IDs to array and add array to room's 'objects' memory
	if (ramparts) {
		for (i = 0; i < ramparts.length; i++)
			storageArray.push(ramparts[i].id);
		if (storageArray.length) {
			this.memory.objects.ramparts = storageArray;
			if (storageArray.length > 1)
				console.log('Cached ' + storageArray.length + ' ramparts.');
			else
				console.log('Cached 1 rampart.');
		}
		storageArray = [];
	}
	// if links are found, add their IDs to array and add array to room's 'objects' memory
	if (links) {
		for (i = 0; i < links.length; i++)
			storageArray.push(links[i].id);
		if (storageArray.length) {
			this.memory.objects.links = storageArray;
			if (storageArray.length > 1)
				console.log('Cached ' + storageArray.length + ' links.');
			else
				console.log('Cached 1 link.');
		}
		storageArray = [];
	}
	// if extractors are found, add their IDs to array and add array to room's 'objects' memory
	if (extractor) {
		for (i = 0; i < extractor.length; i++)
			storageArray.push(extractor[i].id);
		if (storageArray.length) {
			this.memory.objects.extractor = storageArray;
			if (storageArray.length > 1)
				console.log('Cached ' + storageArray.length + ' extractors.');
			else
				console.log('Cached 1 extractor.');
		}
		storageArray = [];
	}
	// if labs are found, add their IDs to array and add array to room's 'objects' memory
	if (labs) {
		for (i = 0; i < labs.length; i++)
			storageArray.push(labs[i].id);
		if (storageArray.length) {
			this.memory.objects.labs = storageArray;
			if (storageArray.length > 1)
				console.log('Cached ' + storageArray.length + ' labs.');
			else
				console.log('Cached 1 lab.');
		}
		storageArray = [];
	}
	// if terminals are found, add their IDs to array and add array to room's 'objects' memory
	if (terminal) {
		for (i = 0; i < terminal.length; i++)
			storageArray.push(terminal[i].id);
		if (storageArray.length) {
			this.memory.objects.terminal = storageArray;
			if (storageArray.length >= 1)
				console.log('Cached 1 terminal.');
		}
		storageArray = [];
	}
	// if factory are found, add their IDs to array and add array to room's 'objects' memory
	if (factory) {
		for (i = 0; i < factory.length; i++)
			storageArray.push(factory[i].id);
		if (storageArray.length) {
			this.memory.objects.factory = storageArray;
			if (storageArray.length >= 1)
				console.log('Cached 1 factory.');
		}
		storageArray = [];
	}
	// if observers are found, add their IDs to array and add array to room's 'objects' memory
	if (observer) {
		for (i = 0; i < observer.length; i++)
			storageArray.push(observer[i].id);
		if (storageArray.length) {
			this.memory.objects.observer = storageArray;
			if (storageArray.length >= 1)
				console.log('Cached 1 observer.');
		}
		storageArray = [];
	}
	// if power spawns are found, add their IDs to array and add array to room's 'objects' memory
	if (powerspawn) {
		for (i = 0; i < powerspawn.length; i++)
			storageArray.push(powerspawn[i].id);
		if (storageArray.length) {
			this.memory.objects.powerspawn = storageArray;
			if (storageArray.length >= 1)
				console.log('Cached 1 power spawn.');
		}
		storageArray = [];
	}
	// if nukers are found, add their IDs to array and add array to room's 'objects' memory
	if (nuker) {
		for (i = 0; i < nuker.length; i++)
			storageArray.push(nuker[i].id);
		if (storageArray.length) {
			this.memory.objects.nuker = storageArray;
			if (storageArray.length >= 1)
				console.log('Cached 1 nuker.');
		}
		storageArray = [];
	}

	return 'Caching objects for room ' + this.name + ' completed.';
}
Room.prototype.initTargets 								= function(array) {

	const targetArray = array || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

	this.memory.targets = {};
}
Room.prototype.setQuota 									= function(roleTarget, newTarget) {
	this.setTarget(roleTarget, newTarget);
}
Room.prototype.setTarget 									= function(roleTarget, newTarget) {

	const oldTarget = this.memory.targets[roleTarget];

	console.log(oldTarget);
	this.memory.targets[roleTarget] = newTarget;

	return ('[' + this.name + ']: Set role \'' + roleTarget + '\' target to ' + newTarget + ' (was ' + oldTarget + ').');
}
Room.prototype.sendEnergy 								= function() {

	const linkToLocal = this.memory.objects.links[0];
	const linkFromLocal = this.memory.objects.links[1];

	if (linkFromLocal.cooldown === 0) {
		linkFromLocal.transferEnergy(linkToLocal)
		return '[' + this.name + ']: Transferring energy.';
	} else {
		return '[' + this.name + ']: On cooldown, ' + linkFromLocal.cooldown + ' ticks remaining.';
	}
}
Room.prototype.initRoom 									= function() {
	this.initRoomData();
}
Room.prototype.initRoomData 							= function() {

	if (!this.memory.objects)
		this.memory.objects = {};
	if (!this.memory.settings)
		this.memory.settings = {};
	if (!this.memory.settings.flags)
		this.memory.settings.flags = {};
	if (!this.memory.paths)
		this.memory.paths = {};
	if (this.memory.objects.lastAssigned === undefined)
		this.memory.objects.lastAssigned = 0;
	if (!this.memory.data)
		this.memory.data = {};
		
	this.cacheObjects();
	this.initRoomFlags();
	this.initRoomSettings();
	this.initTargets();
}
Room.prototype.initTargets 								= function(targetArray = false) {

	if (!targetArray) {
		if (!this.memory.targets)
			this.memory.targets = {};

		this.memory.targets.harvester = 2;
		this.memory.targets.collector = 2;
		this.memory.targets.runner = 0;
		this.memory.targets.builder = 2;
		this.memory.targets.upgrader = 1;
		this.memory.targets.repairer = 0;
		this.memory.targets.ranger = 0;
		this.memory.targets.warrior = 0;
		this.memory.targets.healer = 0;
		this.memory.targets.rebooter = 0;
		this.memory.targets.reserver = 0;
		this.memory.targets.remoteharvester = 0;
		this.memory.targets.remoterunner = 0;
		this.memory.targets.remotebuilder = 0;
		this.memory.targets.remoteguard = 0;
		this.memory.targets.crane = 0;
		this.memory.targets.miner = 0;
		this.memory.targets.scientist = 0;

	} else {
		if (targetArray.length < 18)
			return 'Not enough array indices provided.'

		this.memory.targets.harvester = targetArray[0];
		this.memory.targets.collector = targetArray[1];
		this.memory.targets.runner = targetArray[2];
		this.memory.targets.builder = targetArray[3];
		this.memory.targets.upgrader = targetArray[4];
		this.memory.targets.repairer = targetArray[5];
		this.memory.targets.ranger = targetArray[6];
		this.memory.targets.warrior = targetArray[7];
		this.memory.targets.healer = targetArray[8];
		this.memory.targets.rebooter = targetArray[9];
		this.memory.targets.reserver = targetArray[10];
		this.memory.targets.remoteharvester = targetArray[11];
		this.memory.targets.remoterunner = targetArray[12];
		this.memory.targets.remotebuilder = targetArray[13];
		this.memory.targets.remoteguard = targetArray[14];
		this.memory.targets.crane = targetArray[15];
		this.memory.targets.miner = targetArray[16];
		this.memory.targets.scientist = targetArray[17];
	}
}
Room.prototype.initFlags									= function() {
	this.initRoomFlags();
}
Room.prototype.initRoomFlags 							= function() {

	if (!this.memory.settings.flags)
		this.memory.settings.flags = {};

	if (this.memory.settings.flags.craneUpgrades 			=== undefined)
		this.memory.settings.flags.craneUpgrades 				= false;

	if (this.memory.settings.flags.repairRamparts 			=== undefined)
		this.memory.settings.flags.repairRamparts 				= false;
	
	if (this.memory.settings.flags.repairWalls 				=== undefined)
		this.memory.settings.flags.repairWalls 					= false;

	if (this.memory.settings.flags.centralStorageLogic 				=== undefined)
		this.memory.settings.flags.centralStorageLogic 					= false;

	if (this.memory.settings.flags.runnersDoMinerals 	=== undefined)
		this.memory.settings.flags.runnersDoMinerals 		= false;

	if (this.memory.settings.flags.towerRepairBasic 		=== undefined)
		this.memory.settings.flags.towerRepairBasic 			= false;

	if (this.memory.settings.flags.towerRepairDefenses === undefined)
		this.memory.settings.flags.towerRepairDefenses = false;
	
	if (this.memory.settings.flags.runnersDoPiles === undefined)
		this.memory.settings.flags.runnersDoPiles = false;

	if (this.memory.settings.flags.harvestersFixAdjacent === undefined)
		this.memory.settings.flags.harvestersFixAdjacent = false;

	if (this.memory.settings.flags.repairBasics === undefined)
		this.memory.settings.flags.repairBasics = false;

	if (this.memory.settings.flags.upgradersSeekEnergy === undefined)
		this.memory.settings.flags.upgradersSeekEnergy = false;

	if (this.memory.settings.flags.sortConSites === undefined)
		this.memory.settings.flags.sortConSites = false;

	return '[' + this.name + ']: Room flags initialized: craneUpgrades(' + this.memory.settings.flags.craneUpgrades + ') centralStorageLogic(' + this.memory.settings.flags.centralStorageLogic + ') repairRamparts(' + this.memory.settings.flags.repairRamparts + ') repairWalls(' + this.memory.settings.flags.repairWalls + ') runnersDoMinerals(' + this.memory.settings.flags.runnersDoMinerals + ') towerRepairBasic(' + this.memory.settings.flags.towerRepairBasic + ') towerRepairDefenses(' + this.memory.settings.flags.towerRepairDefenses + ') runnersDoPiles(' + this.memory.settings.flags.runnersDoPiles + ') harvestersFixAdjacent(' + this.memory.settings.flags.harvestersFixAdjacent + ') repairBasics(' + this.memory.settings.flags.repairBasics + ') upgradersSeekEnergy(' + this.memory.settings.flags.upgradersSeekEnergy + ')';
}
Room.prototype.setRoomFlags 							= function([flags]) {

	const flag1 = flags[0];
	const flag2 = flags[1];
	const flag3 = flags[2];
	const flag4 = flags[3];
	const flag5 = flags[4];
	const flag6 = flags[5];
	const flag7 = flags[6];
	const flag8 = flags[7];
	const flag9 = flags[8];
	const flag10 = flags[9];
	const flag11 = flags[10];

	if (flag1)
		this.memory.settings.flags.craneUpgrades 				= flag1;

	if (flag2)
		this.memory.settings.flags.repairRamparts 				= flag2;
	
	if (flag3)
		this.memory.settings.flags.repairWalls 					= flag3;

	if (flag4)
		this.memory.settings.flags.centralStorageLogic 					= flag4;

	if (flag5)
		this.memory.settings.flags.runnersDoMinerals 		= flag5;

	if (flag6)
		this.memory.settings.flags.towerRepair 					= flag6;

	if (flag7)
		this.memory.settings.flags.towerRepairDefenses 	= flag7;

	if (flag8)
		this.memory.settings.flags.runnersDoPiles 				= flag8;
	
	if (flag9)
		this.memory.settings.flags.harvestersFixAdjacent = flag9;

	if (flag10)
		this.memory.settings.flags.repairBasics 					= flag10;
	
	if (flag11)
		this.memory.settings.flags.upgradersSeekEnergy 	= flag11;

	return '[' + this.name + ']: Room flags set: centralStorageLogic(' + this.memory.settings.flags.centralStorageLogic + ') repairRamparts(' + this.memory.settings.flags.repairRamparts + ') repairWalls(' + this.memory.settings.flags.repairWalls + ') runnersDoMinerals(' + this.memory.settings.flags.runnersDoMinerals + ') towerRepairBasic(' + this.memory.settings.flags.towerRepairBasic + ') towerRepairDefenses(' + this.memory.settings.flags.towerRepairDefenses + ') runnersDoPiles(' + this.memory.settings.flags.runnersDoPiles + ') harvestersFixAdjacent(' + this.memory.settings.flags.harvestersFixAdjacent + ') repairBasics(' + this.memory.settings.flags.repairBasics + ') upgradersSeekEnergy(' + this.memory.settings.flags.upgradersSeekEnergy + ')';
}
Room.prototype.initSettings 							= function() {
	this.initRoomSettings();
}
Room.prototype.initRoomSettings 					= function() {

	if (!this.memory.settings)
		this.memory.settings = {};

	if (!this.memory.data)
		this.memory.data = {};

	if (!this.memory.settings.repairSettings)
		this.memory.settings.repairSettings = {};
	
	if (!this.memory.settings.labSettings)
		this.memory.settings.labSettings = {};

	if (!this.memory.settings.visualSettings)
		this.memory.settings.visualSettings = {};

	if (!this.memory.settings.containerSettings)
		this.memory.settings.containerSettings = {};

	if (!this.memory.settings.visualSettings.spawnInfo)
		this.memory.settings.visualSettings.spawnInfo = {};

	if (!this.memory.settings.visualSettings.roomFlags)
		this.memory.settings.visualSettings.roomFlags = {};

	if (this.memory.settings.repairSettings.repairRampartsTo === undefined)
		this.memory.settings.repairSettings.repairRampartsTo = 1;

	if (this.memory.settings.repairSettings.repairWallsTo === undefined)
		this.memory.settings.repairSettings.repairWallsTo = 1;

	if (!this.memory.settings.visualSettings.spawnInfo.alignment)
		this.memory.settings.visualSettings.spawnInfo.alignment = 'right';

	if (!this.memory.settings.visualSettings.spawnInfo.color)
		this.memory.settings.visualSettings.spawnInfo.color = '#ffffff';
	
	if (!this.memory.settings.visualSettings.spawnInfo.fontSize)
		this.memory.settings.visualSettings.spawnInfo.fontSize = 0.4;

	if (!this.memory.settings.visualSettings.roomFlags.displayCoords)
		this.memory.settings.visualSettings.roomFlags.displayCoords = [0, 49];
		
	if (!this.memory.settings.visualSettings.roomFlags.color)
		this.memory.settings.visualSettings.roomFlags.color = '#ff0033';

	if (!this.memory.settings.visualSettings.roomFlags.fontSize)
		this.memory.settings.visualSettings.roomFlags.fontSize = 0.4;

	if (!this.memory.settings.labSettings.reagentOne)
		this.memory.settings.labSettings.reagentOne = 'none';

	if (!this.memory.settings.labSettings.reagentTwo)
		this.memory.settings.labSettings.reagentTwo = 'none';

	if (!this.memory.settings.containerSettings.inboxes)
		this.memory.settings.containerSettings.inboxes = [];
	
	if (!this.memory.settings.containerSettings.outboxes)
		this.memory.settings.containerSettings.outboxes = [];

	if (this.memory.settings.containerSettings.lastInbox === undefined)
		this.memory.settings.containerSettings.lastInbox = 0;

	if (this.memory.settings.containerSettings.lastOutbox === undefined)
		this.memory.settings.containerSettings.lastOutbox = 0;
	
	if (this.memory.data.logisticalPairs === undefined)
		this.memory.data.logisticalPairs = [];

	if (this.memory.data.pairCounter === undefined)
		this.memory.data.pairCounter = 0;
	
	return '[' + this.name + ']: Room settings initialized.';
}
Room.prototype.registerLogisticalPairs 		= function() {
	let energyOutboxes = [];
	let sources = this.find(FIND_SOURCES);
	let logisticalPairs = [];
	let minerals = this.find(FIND_MINERALS);
	let mineralOutbox;
	if (minerals) {
		mineralOutbox = minerals[0].pos.findClosestByRange(FIND_STRUCTURES, 5, { filter: { structureType: STRUCTURE_CONTAINER } });
		if (mineralOutbox) {
			mineralOutbox = mineralOutbox.id;
			//console.log('RegisterLogisticalPairs: mineralOutbox: ' + mineralOutbox);
		}
	}
	
	let energyInbox = this.controller.pos.findInRange(FIND_STRUCTURES, 5, { filter: { structureType: STRUCTURE_CONTAINER } });
	if (energyInbox.length > 0) {
		energyInbox = energyInbox[0].id;
		//console.log('RegisterLogisticalPairs: energyInbox: ' + energyInbox);
	}
	
	let storage = this.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_STORAGE } });
	if (storage.length > 0) {
		storage = storage[0].id;
		//console.log('RegisterLogisticalPairs: storage: ' + storage);
	}
	
	let roomOutboxes = this.memory.settings.containerSettings.outboxes || [];
	let roomInboxes = this.memory.settings.containerSettings.inboxes || [];

	for (let i = 0; i < sources.length; i++) {
		let sourceBox = sources[i].pos.findInRange(FIND_STRUCTURES, 3, { filter: { structureType: STRUCTURE_CONTAINER } });
		if (sourceBox.length > 0) {
			//console.log('RegisterLogisticalPairs: sourceBox: ' + sourceBox[0].id);
			energyOutboxes.push(sourceBox[0].id);
		}
	}

	//if (energyOutboxes.length > 0)
	//	console.log('RegisterLogisticalPairs: energyOutboxes: ' + energyOutboxes);

	if (energyOutboxes.length == 0 && !energyInbox)
		this.memory.data.noPairs = true;
	else {
		if (this.memory.data.noPairs)
			delete this.memory.data.noPairs;
	}

	for (let i = 0; i < energyOutboxes.length; i++) {
		if (!roomOutboxes.includes(energyOutboxes[i]))
			roomOutboxes.push(energyOutboxes[i]);
		this.setOutbox(energyOutboxes[i]);
	}

	if (!roomInboxes.includes(energyInbox))
		roomInboxes.push(energyInbox);


	//this.memory.settings.containerSettings.outboxes = roomOutboxes;


	this.memory.settings.containerSettings.inboxes = roomInboxes;

	if (this.controller.level > 3 && storage) {
		for (let i = 0; i < energyOutboxes.length; i++) {
			const onePair = [energyOutboxes[i], storage, 'energy', 'source to storage  '];
			if (onePair[0] && onePair[1])
				logisticalPairs.push(onePair);
			else
				console.log('Malformed Pair: ' + onePair);
		}

		const onePairStoU = [storage, energyInbox, 'energy', 'storage to upgrader'];
		if (onePairStoU[0].length && onePairStoU[1].length)
			logisticalPairs.push(onePairStoU);
		else
			console.log('Malformed Pair: ' + onePairStoU);
		
		if (mineralOutbox) {
			console.log('mineralOutbox: ' + mineralOutbox);
			console.log('storage: ' + storage);
			const minType = minerals[0].mineralType;
			const onePair = [mineralOutbox, storage, minType, 'extractor to storage'];
			//if (onePair[0].length && onePair[1].length)
			logisticalPairs.push(onePair);
			//else
				//console.log('Malformed Pair: ' + onePair);
		}
	} else {
		console.log('RCL below 3');
		for (let i = 0; i < energyOutboxes.length; i++) {
			const onePair = [energyOutboxes[i], energyInbox, 'energy', 'source to upgrader '];
			if (onePair[0] && onePair[1])
				logisticalPairs.push(onePair);
			else
				console.log('Malformed Pair: ' + onePair);
		}
	}

	let pairReport = '';
	if (!this.memory.data)
		this.memory.data = {};
	if (!this.memory.data.logisticalPairs)
		this.memory.data.logisticalPairs = [];
	if (!this.memory.data.pairCounter)
		this.memory.data.pairCounter = 0;
	if (logisticalPairs.length > 1) {
		pairReport = '-----REGISTERED LOGISTICAL PAIRS-----\n';
		for (let i = 0; i < logisticalPairs.length; i++)
			pairReport += 'PAIR #' + (i+1) + ': OUTBOX> ' + logisticalPairs[i][0] + ' | INBOX> ' + logisticalPairs[i][1] + ' | TYPE> ' + logisticalPairs[i][3] + ' | CARGO> ' + logisticalPairs[i][2] + '\n';
	} else
		pairReport = 'No pairs available to register properly.';

	this.memory.data.logisticalPairs = logisticalPairs;

	/*if (this.memory.settings.flags.centralStorageLogic) {
		this.memory.targets.collector = 2;
		this.memory.targets.runner = logisticalPairs * 2;
	} else {
		let interimValue = 1;
		if (logisticalPairs.length > 0)
			interimValue = logisticalPairs
		
		this.memory.targets.collector = 2 + (interimValue * 2);
	}*/

	return pairReport;
}
Room.prototype.setRepairRampartsTo 				= function(percentMax) {

	if (percentMax === undefined || percentMax < 0 || percentMax > 100)
		return 'Requires a value 0-100.';

	this.memory.settings.repairRampartsTo = percentMax;
	return 'Ramparts will now repair to ' + this.memory.settings.repairRampartsTo + '% max.';
}
Room.prototype.setRepairWallsTo 					= function(percentMax) {

	if (percentMax === undefined || percentMax < 0 || percentMax > 100)
		return 'Requires a value 0-100.';

	this.memory.settings.repairWallsTo = percentMax;
	return 'Walls will now repair to ' + this.memory.settings.repairWallsTo + '% max.';
}
Room.prototype.setRoomSettings 						= function(repairToArray, labSettingsArray) {
	
	const rampartsPercent = repairToArray[0];
	const wallsPercent 		= repairToArray[1];

	if (rampartsPercent)
		this.memory.settings.repairRampartsTo = rampartsPercent;

	if (wallsPercent)
		this.memory.settings.repairWallsTo = wallsPercent;

	return '[' + this.name + ']: Room settings set: repairRampartsTo(' + this.memory.settings.	repairRampartsTo + ') repairWallsTo(' + this.memory.settings.repairWallsTo + ')';
}
Room.prototype.setInbox 									= function(boxID) {
	let inboxMem = [];
	let outboxes = this.memory.settings.containerSettings.outboxes;
	if (this.memory.settings.containerSettings.inboxes !== undefined)
		inboxMem = inboxMem.concat(this.memory.settings.containerSettings.inboxes);
	if (inboxMem.includes(boxID))
		return 'This container ID is already in the inbox list.';
	else if (ooutboxes.includes(boxID))
		return 'This container ID is already set as an outbox.';
	else {
		inboxMem.push(boxID);
		this.memory.settings.containerSettings.inboxes = inboxMem;
		return true;
	}
}
Room.prototype.setOutbox 									= function(boxID) {
	let outboxMem = [];
	let inboxes = this.memory.settings.containerSettings.inboxes;
	outboxMem = outboxMem.concat(this.memory.settings.containerSettings.outboxes);
	if (outboxMem.includes(boxID))
		return 'This container ID is already in the outbox list.';
	else if (inboxes.includes(boxID))
		return 'This container ID is already set as an inbox.';
	else {
		outboxMem.push(boxID);
		this.memory.settings.containerSettings.outboxes = outboxMem;
		return true;
	}
}
Room.prototype.checkInbox 								= function(boxID) {
	const inboxes = this.getInboxes();

	if (inboxes.includes(boxID))
		return true;
	else
		return false;
}
Room.prototype.checkOutbox 								= function(boxID) {
	const outboxes = this.getOutboxes();

	if (outboxes.length > 0 && outboxes.includes(boxID))
		return true;
	else
		return false;
}
Room.prototype.getInboxes 								= function() {
	return this.memory.settings.containerSettings.inboxes;
}
Room.prototype.getOutboxes 								= function() {
	return this.memory.settings.containerSettings.outboxes;
}
Room.prototype.enableFlag 								= function(flag, initIfNull = false) {
	if (this.memory.settings.flags[flag] === undefined && initIfNull === false)
		return 'The specified flag does not exist: ' + flag;
	if (initIfNull) {
		this.memory.settings.flags[flag] = true;
		return true;
	}
}
Room.prototype.disableFlag 								= function(flag, initIfNull = false) {
	if (this.memory.settings.flags[flag] === undefined && initIfNull === false)
		return 'The specified flag does not exist: ' + flag;
	if (initIfNull) {
		this.memory.settings.flags[flag] = false;
		return false;
	}	
}
Room.prototype.toggleFlag 								= function(flag, initIfNull = false, defaultValue) {
	if (this.memory.settings.flags[flag] !== undefined) {
		const logicState = this.memory.settings.flags[flag];
		if (logicState) {
			this.memory.settings.flags[flag] = false;
			return false;
		}
		if (!logicState) {
			this.memory.settings.flags[flag] = true;
			return true;
		}
	} else {
		if (initIfNull) {
			this.memory.settings.flags[flag] = defaultValue || false;
			return this.memory.settings.flags[flag];
		} else {
			return 'The specified flag does not exist: ' + flag;
		}
	}
}
Room.prototype.enableCentralStorageLogic 	= function() {
	this.memory.settings.flags.centralStorageLogic = true;
	return true;
}
Room.prototype.disableCentralStorageLogic = function() {
	this.memory.settings.flags.centralStorageLogic = false;
	return false;
}
Room.prototype.toggleCentralStorageLogic 	= function() {
	const logicState = this.memory.settings.flags.centralStorageLogic;
	if (logicState) {
		this.memory.settings.flags.centralStorageLogic = false;
		return false;
	}
	if (!logicState) {
		this.memory.settings.flags.centralStorageLogic = true;
		return true;
	}
}
Room.prototype.enableCraneUpgrades 				= function() {
	this.memory.settings.flags.craneUpgrades = true;
	return true;
}
Room.prototype.disableCraneUpgrades 			= function() {
	this.memory.settings.flags.craneUpgrades = false;
	return false;
}
Room.prototype.toggleCraneUpgrades 				= function() {
	const logicState = this.memory.settings.flags.craneUpgrades;
	if (logicState) {
		this.memory.settings.flags.craneUpgrades = false;
		return false;
	}
	if (!logicState) {
		this.memory.settings.flags.craneUpgrades = true;
		return true;
	}
}
Room.prototype.enableBoostCreeps 					= function(dontScience = false) {
	if (this.memory.settings.flags.doScience && !dontScience)
		return 'Cannot enable \'boostCreeps\' flag when \'doScience\' is set to true. (Provide boolean arg "true" in parameters to allow disabling of this flag.';

	if (!this.memory.settings.flags.doScience || dontScience) {
		this.memory.settings.flags.boostCreeps = true;
		return true;
	}
}
Room.prototype.disableBoostCreeps 				= function() {
	this.memory.settings.flags.boostCreeps = false;
	return false;
}
Room.prototype.toggleBoostCreeps 					= function(dontScience = false) {
	const logicState = this.memory.settings.flags.boostCreeps;
	const doScienceState = this.memory.settings.flags.doScience;
	
	if (!logicState && doScienceState && !dontScience)
		return 'Cannot enable \'boostCreeps\' flag when \'doScience\' is set to true. (Provide boolean arg "true" in parameters to allow disabling of this flag.';
		
	if (logicState) {
		this.memory.settings.flags.boostCreeps = false;
		return false;
	}
	if (!logicState) {
		if ((doScienceState || !doScienceState) && dontScience)
			this.memory.settings.flags.doScience = false;
		this.memory.settings.flags.boostCreeps = true;
		return true;
	}
}
Room.prototype.enableDoScience 						= function() {
	this.memory.settings.flags.doScience = true;
	return true;
}
Room.prototype.disableDoScience 					= function() {
	this.memory.settings.flags.doScience = false;
	return false;
}
Room.prototype.toggleDoScience 						= function() {
	const logicState = this.memory.settings.flags.doScience;
	if (logicState) {
		this.memory.settings.flags.doScience = false;
		return false;
	}
	if (!logicState) {
		this.memory.settings.flags.doScience = true;
		return true;
	}
}
Room.prototype.enableTowerRepairBasic 		= function() {
	this.memory.settings.flags.towerRepairBasic = true;
	return true;
}
Room.prototype.disableTowerRepairBasic 		= function() {
	this.memory.settings.flags.towerRepairBasic = false;
	return false;
}
Room.prototype.toggleTowerRepairBasic 		= function() {
	const logicState = this.memory.settings.flags.towerRepairBasic;
	if (logicState) {
		this.memory.settings.flags.towerRepairBasic = false;
		return false;
	}
	if (!logicState) {
		this.memory.settings.flags.towerRepairBasic = true;
		return true;
	}
}
Room.prototype.enableTowerRepairDefenses 	= function() {
	this.memory.settings.flags.towerRepairDefenses = true;
	return true;
}
Room.prototype.disableTowerRepairDefenses = function() {
	this.memory.settings.flags.towerRepairDefenses = false;
	return false;
}
Room.prototype.toggleTowerRepairDefenses 	= function() {
	const logicState = this.memory.settings.flags.towerRepairDefenses;
	if (logicState) {
		this.memory.settings.flags.towerRepairDefenses = false;
		return false;
	}
	if (!logicState) {
		this.memory.settings.flags.towerRepairDefenses = true;
		return true;
	}
}
Room.prototype.enableRunnersDoMinerals 		= function() {
	this.memory.settings.flags.runnersDoMinerals = true;
	return true;
}
Room.prototype.disableRunnersDoMinerals 	= function() {
	this.memory.settings.flags.runnersDoMinerals = false;
	return false;
}
Room.prototype.toggleRunnersDoMinerals 		= function() {
	const logicState = this.memory.settings.flags.runnersDoMinerals;
	if (logicState) {
		this.memory.settings.flags.runnersDoMinerals = false;
		return false;
	}
	if (!logicState) {
		this.memory.settings.flags.runnersDoMinerals = true;
		return true;
	}
}
Room.prototype.enableRepairWalls 					= function() {
	this.memory.settings.flags.repairWalls = true;
	return true;
}
Room.prototype.disableRepairWalls 				= function() {
	this.memory.settings.flags.repairWalls = false;
	return false;
}
Room.prototype.toggleRepairWalls 					= function() {
	const logicState = this.memory.settings.flags.repairWalls;
	if (logicState) {
		this.memory.settings.flags.repairWalls = false;
		return false;
	}
	if (!logicState) {
		this.memory.settings.flags.repairWalls = true;
		return true;
	}
}
Room.prototype.enableRepairRamparts 			= function() {
	this.memory.settings.flags.repairRamparts = true;
	return true;
}
Room.prototype.disableRepairRamparts 			= function() {
	this.memory.settings.flags.repairRamparts = false;
	return false;
}
Room.prototype.toggleRepairRamparts 			= function() {
	const logicState = this.memory.settings.flags.repairRamparts;
	if (logicState) {
		this.memory.settings.flags.repairRamparts = false;
		return false;
	}
	if (!logicState) {
		this.memory.settings.flags.repairRamparts = true;
		return true;
	}
}
Room.prototype.enableRepairBasics 				= function() {
	this.memory.settings.flags.repairBasics = true;
	return true;
}
Room.prototype.disableRepairBasics 				= function() {
	this.memory.settings.flags.repairBasics = false;
	return false;
}
Room.prototype.toggleRepairBasics 				= function() {
	const logicState = this.memory.settings.flags.repairBasics;
	if (logicState) {
		this.memory.settings.flags.repairBasics = false;
		return false;
	}
	if (!logicState) {
		this.memory.settings.flags.repairBasics = true;
		return true;
	}
}
Room.prototype.enableSortConSites 				= function() {
	this.memory.settings.flags.sortConSites = true;
	return true;
}
Room.prototype.disableSortConSites 				= function() {
	this.memory.settings.flags.sortConSites = false;
	return false;
}
Room.prototype.toggleSortConSites 				= function() {
	const logicState = this.memory.settings.flags.sortConSites;
	if (logicState) {
		this.memory.settings.flags.sortConSites = false;
		return false;
	}
	if (!logicState) {
		this.memory.settings.flags.sortConSites = true;
		return true;
	}
}
Room.prototype.calcLabReaction 						= function() {

	const baseReg1 = this.memory.settings.labSettings.reagentOne;
	const baseReg2 = this.memory.settings.labSettings.reagentTwo;
	let outputChem;

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
	} else if (baseReg1 === RESOURCE_UTRIUM || baseReg2 === RESOURCE_UTRIUM) {
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
Room.prototype.registerOutpost 						= function(roomName) {
	if (!this.memory.outposts)
		this.memory.outposts = {};
	if (!this.memory.outposts.roomList)
		this.memory.outposts.roomList = [];
	if (!this.memory.outposts.registry)
		this.memory.outposts.registry = {};
	if (!this.memory.outposts.aggregateSourceList)
		this.memory.outposts.aggregateSourceList = [];
	if (!this.memory.outposts.aggLastAssigned)
		this.memory.outposts.aggLastAssigned = 0;

	let currentOutpostList = this.memory.outposts.roomList;
	let exits;
	let outpostRoomName;
	let outpostDirection;

	if (typeof roomName === 'number') {
		exits = Game.map.describeExits(this.name);
		outpostRoomName = exits[roomName.toString()];

		switch (roomName) {
			case 1:
				outpostDirection = TOP;
				break;
			case 3:
				outpostDirection = RIGHT;
				break;
			case 5:
				outpostDirection = BOTTOM;
				break;
			case 7:
				outpostDirection = LEFT;
				break;
			default:
				return '[' + this.name + ']: You did not specify a valid room name or direction (numeric or string).';
		}
	} else if (typeof roomName === 'string') {
		exits = Game.map.describeExits()
		switch (roomName) {
			case 'north':
				outpostDirection = TOP;
				break;
			case 'east':
				outpostDirection = RIGHT;
				break;
			case 'south':
				outpostDirection = BOTTOM;
				break;
			case 'west':
				outpostDirection = LEFT;
				break;
			default:
				if (Game.map.describeExits(roomName) === null)
					return '[' + this.name + ']: You did not specify a valid room name or direction (numeric or string).'
			}
	} else
		return '[' + this.name + ']: You must provide a valid room name or direction (numeric or string). Other data types are not supported.';

	if (currentOutpostList.includes(outpostRoomName))
		return '[' + this.name + ']: This outpost is already registered.';

	const homeRoomName = this.name;
		
	const newOutpost = {
		name: outpostRoomName,
		homeRoom: homeRoomName,
		sources: Game.rooms[outpostRoomName].memory.objects.sources || null,
		lastAssigned: 0,
		direction: outpostDirection,
		rallyPoint: createRoomFlag(outpostRoomName)
	}
	this.memory.outposts.aggregateSourceList = this.memory.outposts.aggregateSourceList.concat(newOutpost.sources);
	this.memory.outposts.registry[outpostRoomName] = newOutpost;
	
	currentOutpostList.push(outpostRoomName);
	this.memory.outposts.roomList = currentOutpostList;

	return '[' + this.name + ']: Outpost at ' + outpostRoomName + ' successfully registered.';
}
Room.prototype.calcOutpostPotential 			= function() {
	const exitDirections = Object.keys(Game.map.describeExits(this.name));
	const adjacentRoomNames = Object.values(Game.map.describeExits(this.name));

	const Outpost = {
		numSources: 1
	}
}
Room.prototype.registerLinks 							= function() {

	if (this.memory.data === undefined) this.memory.data = {};
	if (this.memory.objects.links === undefined) this.cacheObjects();
	if (this.memory.data.linkRegistry === undefined) this.memory.data.linkRegistry = {};
	if (this.memory.data.linkRegistry.sourceOne === undefined) this.memory.data.linkRegistry.sourceOne = '';
	if (this.memory.data.linkRegistry.sourceTwo === undefined) this.memory.data.linkRegistry.sourceTwo = '';
	if (this.memory.data.linkRegistry.central === undefined) this.memory.data.linkRegistry.central = '';
	if (this.memory.data.linkRegistry.destination === undefined) this.memory.data.linkRegistry.destination = '';

	if (this.memory.objects.links) {

		if (this.memory.data.linkRegistry !== undefined) this.memory.data.linkRegistry = {};

		const numLinks = this.memory.objects.links.length;

		let linkCentral;
		let linkSource1;
		let linkSource2;
		let linkDestination;
		let linkReport = '';

		const storage 		= Game.getObjectById(this.memory.objects.storage[0]);
		const source1 		= Game.getObjectById(this.memory.objects.sources[0]);
		const source2 		= Game.getObjectById(this.memory.objects.sources[1]);
		const controller 	= Game.getObjectById(this.memory.objects.controller[0]);

		if (numLinks >= 1) linkCentral 			= storage		.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_LINK } });
		if (numLinks >= 2) linkSource1 			= source1		.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_LINK } });
		if (numLinks >= 3) linkSource2 			= source2		.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_LINK } });
		if (numLinks >= 4) linkDestination 	= controller.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_LINK } });

		if (numLinks > 0) {
			this.memory.data.linkRegistry.sourceOne = linkSource1.id;
			linkReport += 'SOURCE #1: ' + linkSource1.id + "\n";
		}
		if (numLinks > 1) {
			this.memory.data.linkRegistry.central = linkCentral.id;
			linkReport += 'CENTRAL: ' + linkCentral.id + "\n";
		}
		if (numLinks > 2) {
			if (linkSource2) {
				this.memory.data.linkRegistry.sourceTwo = linkSource2.id;
				linkReport += 'SOURCE #2: ' + linkSource2.id + "\n";
			}
			if (linkDestination) {
				this.memory.data.linkRegistry.destination = linkDestination.id;
				linkReport += 'DESTINATION: ' + linkDestination.id + "\n";
			}
		}
		
		this.registerLogisticalPairs();

		return linkReport;
	}
	
}