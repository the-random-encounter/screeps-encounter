// ##################################################################################################################################
// ##################################################################################################################################
// ----------------------------------------------------------------------------------------------------------------------------------
// %-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%- SCREEPS ENCOUNTER, A SCREEPS BOT BY RANDOM ENCOUNTER %-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-
// ----------------------------------------------------------------------------------------------------------------------------------
// ##################################################################################################################################
// ##################################################################################################################################



// require creep role modules
const roleHarvester				= require('role.harvester'	);
const roleUpgrader 				= require('role.upgrader'	);
const roleBuilder 				= require('role.builder'	);
const roleCollector				= require('role.collector'	);
const roleRepairer				= require('role.repairer'	);
const roleRunner				= require('role.runner'		);
const roleCrane					= require('role.crane'		);
const roleMiner					= require('role.miner'		);
const roleScientist				= require('role.scientist'	);

const roleRanger				= require('role.ranger'		);
const roleWarrior				= require('role.warrior'	);
const roleHealer				= require('role.healer'		);

const roleProvider				= require('role.provider'	);
const roleRebooter				= require('role.rebooter'	);

const roleRemoteLogistician 			= require('role.remoteLogistician');
const roleRemoteHarvester			= require('role.remoteHarvester');
const roleRemoteBuilder				= require('role.remoteBuilder'	);
const roleRemoteRunner				= require('role.remoteRunner'	);
const roleRemoteGuard				= require('role.remoteGuard'	);
const roleReserver				= require('role.reserver'	);
const roleClaimer				= require('role.claimer'	);
const roleScout					= require('role.scout'		);

// require other modules
require('roomDefense'			);
require('miscFunctions'		);
require('marketFunctions'	);

// require prototype extension modules
require('creepFunctions'				);
require('roomFunctions'					);
require('roomPositionFunctions');
require('spawnFunctions');

// define heap memory for use on various things and stuff
global.HEAP_MEMORY = {
	'containerCounter': 0,
	'outpostRoomCounter': 0,
	'outpostSourceCounter': 0,
	'outpostCounter': 0,
	'towerLRT': "",
	'rooms': {
		'W13N34': {}
	}
};

// define pre-configured creep bodypart arrays as key/value pairs in an object
const spawnVariants = {
	'harvester200':	[ CARRY, MOVE, WORK ],
	'harvester300':	[ CARRY, MOVE, WORK, WORK ],
	'harvester400':	[ CARRY, MOVE, WORK, WORK, WORK ],
	'harvester500': [ CARRY, CARRY, MOVE, MOVE, WORK, WORK, WORK ],
	'harvester600': [ CARRY, MOVE, WORK, WORK, WORK, WORK, WORK ],
	'harvester750':	[ CARRY, MOVE, WORK, WORK, WORK, WORK, WORK, WORK ],
	'harvester950':	[ CARRY, CARRY, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK ],
	'collector100':	[ CARRY, MOVE ],
	'collector300':	[ CARRY, CARRY, CARRY, MOVE, MOVE, MOVE ],
	'collector500':	[ CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE ],
	'collector800': [ CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE ],
	'collector1000':[ CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE,MOVE, MOVE, MOVE ],
	'upgrader300':	[ CARRY, MOVE, WORK, WORK ],
	'upgrader400':	[ CARRY, CARRY, CARRY, MOVE, MOVE, WORK, WORK ],
	'upgrader500':	[ CARRY, MOVE, WORK, WORK, WORK, WORK ],
	'upgrader550':	[ CARRY, MOVE, MOVE, WORK, WORK, WORK, WORK ],
	'upgrader700':	[ CARRY, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK ],
	'upgrader900':	[ CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK ],
	'builder300':	[ CARRY, CARRY, MOVE, MOVE, WORK, ],
	'builder350':	[ CARRY, CARRY, MOVE, MOVE, MOVE, WORK ],
	'builder500':	[ CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, WORK, WORK ],
	'builder800':	[ CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK ],
	'builder1000':	[ CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK ],
	'builder1100':	[ CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK ],
	'builder1600':	[ CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK ],
	'repairer300':	[ CARRY, MOVE, WORK, WORK],
	'repairer500':	[ CARRY, CARRY, MOVE, MOVE, WORK, WORK, WORK ],
	'repairer800':	[ CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK ],
	'repairer1000':	[ CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK ],
	'repairer1400':	[ CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK ],
	'runner300':	[ CARRY, CARRY, CARRY, CARRY, MOVE, MOVE ],
	'runner500':	[ CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE ],
	'runner800':	[ CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE ],
	'crane300':	[ CARRY, CARRY, CARRY, CARRY, MOVE, MOVE ],
	'crane500':	[ CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE ],
	'crane800':	[ CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE ],
	'warrior520':	[ TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK ],
	'remoteGuard700':	[ TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK ],
	'remoteLogistician1200': [ CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE ],
	'remoteLogistician1500': [ CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE ]
}

// define working variant set for use in the main loop, assigned based on current energy capacity limits
let availableVariants = {
	'harvester': 		[],
	'collector': 		[],
	'upgrader': 		[],
	'builder': 			[],
	'repairer': 		[],
	'runner': 			[],
	'warrior': 			[],
	'crane': 				[],
	'remoteGuard': 	[]
}

// declare creep counting integers for spawning purposes
let builderCount	 = 1;
let claimerCount = 1;
let collectorCount 	= 1;
let craneCount 		= 1;
let harvesterCount 	= 1;
let healerCount = 1;
let invaderCount = 1;
let minerCount = 1;
let providerCount = 1;
let rangerCount = 1;
let rebooterCount = 1;
let repairerCount = 1;
let reserverCount 	= 1;
let runnerCount = 1;
let scientistCount 	= 1;
let scoutCount = 1;
let upgraderCount = 1;
let warriorCount 	= 1;

let remoteBuilderCount 		= 1;
let remoteGuardCount 		= 1;
let remoteHarvesterCount = 1;
let remoteLogisticianCount = 1;
let remoteRunnerCount 		= 1;



// declare other global variables
let tickCount = 0;
let newName 	= '';
let spawnAnnounced 				= false;
let harvesterDying 				= false;
let runnerDying 					= false;
let reserverDying 				= false;
let collectorDying 				= false;
let remoteHarvesterDying 	= false;
let remoteGuardDying 			= false;

module.exports.loop = function () {
	// This is code to run in the main loop, just once each tick

	if (Memory.colonies === undefined) Memory.colonies = {};
	if (Memory.colonies.colonyList === undefined) Memory.colonies.colonyList = [];
	if (Memory.globalSettings === undefined) {
		Memory.globalSettings = {};
		Memory.globalSettings.consoleSpawnInterval = 10;
	}

	calcTickTime();
	
	// Generate pixels with extra CPU time
	if (Game.shard.name === 'shard3') {
		if (Game.cpu.bucket == 10000) {
			Game.cpu.generatePixel()
			console.log('CPU Bucket at limit, generating pixel...');
		}
	}

	for (let name in Memory.creeps) {
		if (!Game.creeps[name]) {
			const role = Memory.creeps[name].role;
			delete Memory.creeps[name];
			console.log('Clearing nonexistent creep memory: ', name);
			// reset naming counter for type of creep that died
			switch (role) {
				case 'builder':
					builderCount = 1;
					break;
				case 'claimer':
					claimerCount = 1;
					break;
				case 'collector':
					collectorCount = 1;
					break;
				case 'crane':
					craneCount = 1;
					break;
				case 'harvester':
					harvesterCount = 1;
					break;
				case 'healer':
					healerCount = 1;
					break;
				case 'invader':
					invaderCount = 1;
					break;
				case 'miner':
					minerCount = 1;
					break;
				case 'provider':
					providerCount = 1;
					break;
				case 'ranger':
					rangerCount = 1;
					break;
				case 'rebooter':
					rebooterCount = 1;
					break;
				case 'repairer':
					repairerCount = 1;
					break;
				case 'reserver':
					reserverCount = 1;
					break;
				case 'runner':
					runnerCount = 1;
					break;
				case 'scientist':
					scientistCount = 1;
					break;
				case 'scout':
					scoutCount = 1;
					break;
				case 'upgrader':
					upgraderCount = 1;
					break;
				case 'warrior':
					warriorCount = 1;
					break;
				case 'remotebuilder':
					remoteBuilderCount = 1;
					break;
				case 'remoteguard':
					remoteGuardCount = 1;
					break;
				case 'remoteharvester':
					remoteHarvesterCount = 1;
					break;
				case 'remotelogistician':
					remoteLogisticianCount = 1;
					break;
				case 'remoterunner':
					remoteRunnerCount = 1;
					break;
			}
		}
	}
	
	// main code loop to run inside each room containing our units/structures
	_.forEach(Game.rooms, function (room) {
		
		if (!room.memory.objects) {
			console.log('[' + room.name + ']: No room objects in memory. Caching.')
			room.cacheObjects();
		}

		if (!room.memory.settings) {
			room.initSettings();
			room.initFlags();
		}
		
		if (HEAP_MEMORY.rooms[room.name] === undefined)
			HEAP_MEMORY.rooms[room.name] = {};

		const cSites = room.find(FIND_CONSTRUCTION_SITES, { filter: (i) => i.structureType !== STRUCTURE_ROAD})
		const numCSitesPrevious = room.memory.data.numCSites || 0;
		room.memory.data.numCSites = cSites.length;
		const numCSites = room.memory.data.numCSites;

		if (numCSites < numCSitesPrevious) room.cacheObjects();
		
		// code to run if room contains a controller owned by us
		if (room && room.controller && room.controller.my) {
			
			const data = room.memory.data;
			const objects = room.memory.objects;
			const settings = room.memory.settings;
			const flags = room.memory.settings.flags;
			const colonies = Memory.colonies;

			if (tickCount > 0 && tickCount % 1000 == 0) {
				console.log('MAIN LOOP, CACHING OBJECTS EVERY 1000 TICKS --- Tick#: ' + tickCount);
				room.cacheObjects();
				tickCount = 0;
			}

			if (Memory.colonies[room.name] === undefined) {
				Memory.colonies[room.name] = {};
				colonyListArray = Memory.colonies.colonyList || [];
				console.log(colonyListArray);
				colonyListArray.push(room.name);
				Memory.colonies.colonyList = colonyListArray;
				Memory.colonies[room.name].id = Memory.colonies.colonyList.length;
				Memory.colonies[room.name].level = room.controller.level;
				Memory.colonies[room.name].spawns = [];
				Memory.colonies[room.name].exitDirs = Object.keys(Game.map.describeExits(room.name));
				Memory.colonies[room.name].exitRooms = Object.values(Game.map.describeExits(room.name));
				Memory.colonies[room.name].outposts = {};
			}

			if (room.controller.level !== Memory.colonies[room.name].level)
				Memory.colonies[room.name].level = room.controller.level;

			const roomSpawns = room.find(FIND_MY_SPAWNS);
			let roomSpawnsNames = [];
			for (let i = 0; i < roomSpawns.length; i++)
				roomSpawnsNames.push(roomSpawns[i].name);
			if (Memory.colonies[room.name].spawns.length < roomSpawnsNames.length)
				Memory.colonies[room.name].spawns = roomSpawnsNames;

			const upgraderBucket = room.controller.pos.findInRange(FIND_STRUCTURES, 5, { filter: (i) => i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_STORAGE });

			if (!room.memory.data)
				room.memory.data = {};
			if (!room.memory.data.upgraderBucket && upgraderBucket.length > 0)
				room.memory.data.upgraderBucket = upgraderBucket[0].id;

			const roomName = room.name;

			if (room.memory.objects === undefined) room.cacheObjects();
			if (!room.memory.settings) room.initSettings();
			if (!room.memory.settings.flags) room.initFlags();
			if (!room.memory.targets) room.initTargets();

			const spawn = Game.getObjectById(room.memory.objects.spawns[0]);
			
			// tower logic function
			roomDefense(room);

			/* #region ROOM LINK LOGIC */
			if (room.memory.objects.links) {

				if (room.memory.data.linkRegistry === undefined) room.registerLinks();

				if (room.memory.objects.links.length < 4) {
					let counter = 0;
					if (room.memory.data.linkRegistry.sourceOne) counter++;
					if (room.memory.data.linkRegistry.central) counter++;
					if (room.memory.data.linkRegistry.sourceTwo) counter++;
					if (room.memory.data.linkRegistry.destination) counter++;
					if (room.memory.objects.links.length !== counter)	room.registerLinks();
				}

				let linkOne, linkTwo, linkCentral, linkDest;
				if (room.memory.data.linkRegistry.sourceOne) linkOne = Game.getObjectById(room.memory.data.linkRegistry.sourceOne);
				if (room.memory.data.linkRegistry.sourceTwo) linkTwo = Game.getObjectById(room.memory.data.linkRegistry.sourceTwo);
				if (room.memory.data.linkRegistry.destination) linkDest = Game.getObjectById(room.memory.data.linkRegistry.destination);
				if (room.memory.data.linkRegistry.central) linkCentral = Game.getObjectById(room.memory.data.linkRegistry.central);

				if (linkCentral && linkOne) {
					if ((linkOne.store.getFreeCapacity() < 100) && linkOne.cooldown == 0 && (linkCentral.store.getFreeCapacity() >= linkOne.store.getUsedCapacity()))
						linkOne.transferEnergy(linkCentral);
				}
				if (linkCentral && linkTwo) {
					if ((linkTwo.store.getFreeCapacity() < 100) && linkTwo.cooldown == 0 && (linkCentral.store.getFreeCapacity() >= linkTwo.store.getUsedCapacity()))
						linkTwo.transferEnergy(linkCentral);
				}
				if (linkCentral && linkDest) {
					if ((linkCentral.store[RESOURCE_ENERGY] > 99) && linkCentral.cooldown == 0 && linkDest.store[RESOURCE_ENERGY] < 401)
						linkCentral.transferEnergy(linkDest);
				}
			}

			// ___________________________________________________________________________________________________________________________
			// #################################### SPAWNING QUOTA & CURRENT SPAWN COUNT DECLARATIONS ####################################
			// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

			// pull creep role caps from room memory, or set to default value if none are set
			let harvesterTarget = _.get(room.memory, ['targets', 'harvester'], 2);
			let collectorTarget = _.get(room.memory, ['targets', 'collector'], 2);
			let upgraderTarget 	= _.get(room.memory, ['targets', 'upgrader'	], 2);
			let builderTarget 	= _.get(room.memory, ['targets', 'builder'	], 2);
			let repairerTarget 	= _.get(room.memory, ['targets', 'repairer'	], 1);
			let runnerTarget 		= _.get(room.memory, ['targets', 'runner'		], 3);
			let rebooterTarget 	= _.get(room.memory, ['targets', 'rebooter'	], 0);
			let reserverTarget 	= _.get(room.memory, ['targets', 'reserver'	], 0);
			let rangerTarget 		= _.get(room.memory, ['targets', 'ranger'		], 0);
			let warriorTarget 	= _.get(room.memory, ['targets', 'warrior'	], 0);
			let healerTarget 		= _.get(room.memory, ['targets', 'healer'		], 0);
			let craneTarget 		= _.get(room.memory, ['targets', 'crane'		], 0);
			let minerTarget 		= _.get(room.memory, ['targets', 'miner'		], 0);
			let scientistTarget = _.get(room.memory, ['targets', 'scientist'], 0);
			let scoutTarget 		= _.get(room.memory, ['targets', 'scout'		], 0);

			
			let remoteHarvesterTarget;
			if (room.memory.outposts) remoteHarvesterTarget = room.memory.outposts.aggregateSourceList.length;
			else remoteHarvesterTarget 	= _.get(room.memory, ['targets', 'remoteharvester'], 1);
			let remoteRunnerTarget 			= _.get(room.memory, ['targets', 'remoterunner'		], 1);
			let remoteBuilderTarget 		= _.get(room.memory, ['targets', 'remotebuilder'	], 1);
			let remoteGuardTarget 			= _.get(room.memory, ['targets', 'remoteguard'		], 1);
			let remoteLogisticianTarget = _.get(room.memory, ['targets', 'remotelogistician'], 1);

			// pull current amount of creeps alive by roleForQuota
			let harvesters 	= _.filter(Game.creeps, (creep) => creep.memory.roleForQuota == 'harvester' && creep.memory.homeRoom == roomName);
			let collectors 	= _.filter(Game.creeps, (creep) => creep.memory.roleForQuota == 'collector' && creep.memory.homeRoom == roomName);
			let upgraders 	= _.filter(Game.creeps, (creep) => creep.memory.roleForQuota == 'upgrader' 	&& creep.memory.homeRoom == roomName);
			let builders 		= _.filter(Game.creeps, (creep) => creep.memory.roleForQuota == 'builder' 	&& creep.memory.homeRoom == roomName);
			let repairers 	= _.filter(Game.creeps, (creep) => creep.memory.roleForQuota == 'repairer' 	&& creep.memory.homeRoom == roomName);
			let runners 		= _.filter(Game.creeps, (creep) => creep.memory.roleForQuota == 'runner' 		&& creep.memory.homeRoom == roomName);
			let rebooters 	= _.filter(Game.creeps, (creep) => creep.memory.roleForQuota == 'rebooter' 	&& creep.memory.homeRoom == roomName);
			let reservers 	= _.filter(Game.creeps, (creep) => creep.memory.roleForQuota == 'reserver' 	&& creep.memory.homeRoom == roomName);
			let rangers 		= _.filter(Game.creeps, (creep) => creep.memory.roleForQuota == 'ranger' 		&& creep.memory.homeRoom == roomName);
			let warriors 		= _.filter(Game.creeps, (creep) => creep.memory.roleForQuota == 'warrior' 	&& creep.memory.homeRoom == roomName);
			let healers 		= _.filter(Game.creeps, (creep) => creep.memory.roleForQuota == 'healer' 		&& creep.memory.homeRoom == roomName);
			let cranes 			= _.filter(Game.creeps, (creep) => creep.memory.roleForQuota == 'crane' 		&& creep.memory.homeRoom == roomName);
			let miners 			= _.filter(Game.creeps, (creep) => creep.memory.roleForQuota == 'miner' 		&& creep.memory.homeRoom == roomName);
			let scientists 	= _.filter(Game.creeps, (creep) => creep.memory.roleForQuota == 'scientist' && creep.memory.homeRoom == roomName);
			let scouts 			= _.filter(Game.creeps, (creep) => creep.memory.roleForQuota == 'scout' 		&& creep.memory.homeRoom == roomName);

			let remoteHarvesters 	= _.filter(Game.creeps, (creep) => creep.memory.roleForQuota == 'remoteharvester' && creep.memory.homeRoom == roomName);
			let remoteRunners 		= _.filter(Game.creeps, (creep) => creep.memory.roleForQuota == 'remoterunner' 		&& creep.memory.homeRoom == roomName);
			let remoteBuilders 		= _.filter(Game.creeps, (creep) => creep.memory.roleForQuota == 'remotebuilder' 	&& creep.memory.homeRoom == roomName);
			let remoteGuards 			= _.filter(Game.creeps, (creep) => creep.memory.roleForQuota == 'remoteguard' 		&& creep.memory.homeRoom == roomName);
			let remoteLogisticians = _.filter(Game.creeps, (creep) => creep.memory.roleForQuota == 'remotelogistician' && creep.memory.homeRoom == roomName);

			let sites = room.find(FIND_CONSTRUCTION_SITES);

			// Select a non-geriatric collector to loot compounds or energy from enemy corpses
			let invaderLooterAnnounced = false;
			if (invaderLooterAnnounced == false) {
				if (room.find(FIND_HOSTILE_CREEPS).length) {
					if (collectors.length) {
						for (let i = 0; i < collectors.length; i++) {
							if (collectors[i].ticksToLive > 300) {
								collectors[i].memory.invaderLooter = true;
								console.log(collectors[i] + ' is now the invader looter');
								invaderLooterAnnounced = true;
								break;
							}
						}
					}
				} else invaderLooterAnnounced = false;
			}
			
			// CONSOLE SPAWN INFO
			const tickInterval = Memory.globalSettings.consoleSpawnInterval;
			if (tickInterval !== 0 && tickCount % tickInterval) {
				console.log('H:' + harvesters.length + '(' + harvesterTarget + ') | C:' + collectors.length + '(' + collectorTarget + ') | U:' + upgraders.length + '(' + upgraderTarget + ')| B:' + builders.length + '(' + builderTarget + ') | Rn:' + runners.length + '(' + runnerTarget + ') | Rp:' + repairers.length + '(' + repairerTarget + ') | Cn:' + cranes.length + '(' + craneTarget + ') | Rb:' + rebooters.length + '(' + rebooterTarget + ') | Rv:' + reservers.length + '(' + reserverTarget + ') || Rng:' + rangers.length + '(' + rangerTarget + ') | War:' + warriors.length + '(' + warriorTarget + ') | Hlr:' + healers.length + '(' + healerTarget + ') || RH:' + remoteHarvesters.length + '(' + remoteHarvesterTarget + ') | RR:' + remoteRunners.length + '(' + remoteRunnerTarget + ') | RB:' + remoteBuilders.length + '(' + remoteBuilderTarget + ') | RG:' + remoteGuards.length + '(' + remoteGuardTarget + ') || Energy: ' + room.energyAvailable + '(' + room.energyCapacityAvailable + ')');
			}

			// ROOM VISUAL - SPAWN INFO
			if (room.memory.settings.visualSettings.spawnInfo === undefined)
				room.initSettings();
			const alignment = room.memory.settings.visualSettings.spawnInfo.alignment;
			const spawnColor = room.memory.settings.visualSettings.spawnInfo.color;
			const spawnFont = room.memory.settings.visualSettings.spawnInfo.fontSize || 0.5;
			let spawnX = 49;
			if (alignment == 'left')
				spawnX = 0;
			// BOTTOM RIGHT CORNER
			room.visual.rect(41.75, 44.5, 7.5, 4.75, { fill: '#555555', stroke: '#aaaaaa', opacity: 0.3, strokeWidth: 0.2 })
			// Harvesters, Collectors, Upgraders, Builders, Cranes
			room.visual.text('H:' + harvesters.length + '(' + harvesterTarget + ') | C:' + collectors.length + '(' + collectorTarget + ') | U:' + upgraders.length + '(' + upgraderTarget + ') | B:' + builders.length + '(' + builderTarget + ') | Cn:' + cranes.length + '(' + craneTarget + ')', spawnX, 49, { align: alignment, color: spawnColor, font: spawnFont });
			// Remote Harvesters, Remote Runners, Remote Builders, Remote Guards
			room.visual.text('RH:' + remoteHarvesters.length + '(' + remoteHarvesterTarget + ') | RR:' + remoteRunners.length + '(' + remoteRunnerTarget + ') | RB:' + remoteBuilders.length + '(' + remoteBuilderTarget + ') | RG:' + remoteGuards.length + '(' + remoteGuardTarget + ')', spawnX, 48, { align: alignment, color: spawnColor, font: spawnFont });
			// Runners, Repaireres, Rebooters, Reservers
			room.visual.text('Rn:' + runners.length + '(' + runnerTarget + ') | Rp:' + repairers.length + '(' + repairerTarget + ') | Rb:' + rebooters.length + '(' + rebooterTarget + ') | Rv:' + reservers.length + '(' + reserverTarget + ')', spawnX, 47, { align: alignment, color: spawnColor, font: spawnFont });
			// Rangers, Warriors, Healers
			room.visual.text('Rng:' + rangers.length + '(' + rangerTarget + ') | War:' + warriors.length + '(' + warriorTarget + ') | Hlr:' + healers.length + '(' + healerTarget + ')', spawnX, 46, { align: alignment, color: spawnColor, font: spawnFont });
			// Energy Available, Energy Capacity
			room.visual.text('Energy: ' + room.energyAvailable + '(' + room.energyCapacityAvailable + ')', spawnX, 45, { align: alignment, color: spawnColor, font: spawnFont });

			// TOP RIGHT CORNER
			room.visual.rect(41.75, 0, 7.5, 4.75, { fill: '#555555', stroke: '#aaaaaa', opacity: 0.3, strokeWidth: 0.2 })
			// Harvesters, Collectors, Upgraders, Builders, Cranes
			room.visual.text('H:' + harvesters.length + '(' + harvesterTarget + ') | C:' + collectors.length + '(' + collectorTarget + ') | U:' + upgraders.length + '(' + upgraderTarget + ') | B:' + builders.length + '(' + builderTarget + ') | Cn:' + cranes.length + '(' + craneTarget + ')', spawnX, 0.5, { align: alignment, color: spawnColor, font: spawnFont });
			// Remote Harvesters, Remote Runners, Remote Builders, Remote Guards
			room.visual.text('RH:' + remoteHarvesters.length + '(' + remoteHarvesterTarget + ') | RR:' + remoteRunners.length + '(' + remoteRunnerTarget + ') | RB:' + remoteBuilders.length + '(' + remoteBuilderTarget + ') | RG:' + remoteGuards.length + '(' + remoteGuardTarget + ')', spawnX, 1.5, { align: alignment, color: spawnColor, font: spawnFont });
			// Runners, Repaireres, Rebooters, Reservers
			room.visual.text('Rn:' + runners.length + '(' + runnerTarget + ') | Rp:' + repairers.length + '(' + repairerTarget + ') | Rb:' + rebooters.length + '(' + rebooterTarget + ') | Rv:' + reservers.length + '(' + reserverTarget + ')', spawnX, 2.5, { align: alignment, color: spawnColor, font: spawnFont });
			// Rangers, Warriors, Healers
			room.visual.text('Rng:' + rangers.length + '(' + rangerTarget + ') | War:' + warriors.length + '(' + warriorTarget + ') | Hlr:' + healers.length + '(' + healerTarget + ')', spawnX, 3.5, { align: alignment, color: spawnColor, font: spawnFont });
			// Energy Available, Energy Capacity
			room.visual.text('Energy: ' + room.energyAvailable + '(' + room.energyCapacityAvailable + ')', spawnX, 4.5, { align: alignment, color: spawnColor, font: spawnFont });

			// ROOM VISUAL - ROOM FLAGS
			const xCoord = room.memory.settings.visualSettings.roomFlags.displayCoords[0];
			const yCoord = room.memory.settings.visualSettings.roomFlags.displayCoords[1];
			const displayColor = room.memory.settings.visualSettings.roomFlags.color;
			const fontSize = room.memory.settings.visualSettings.roomFlags.fontSize || 0.4;
			room.visual.rect(xCoord - 0.15, yCoord - 1.2, 13, 1.35, { fill: '#770000', stroke: '#aa0000', opacity: 0.3, strokeWidth: 0.1 })
			room.visual.text('[' + room.name + ']:  CU(' + room.memory.settings.flags.craneUpgrades + ')  CSL(' + room.memory.settings.flags.centralStorageLogic + ')   RDM(' + room.memory.settings.flags.runnersDoMinerals + ')   RDP(' + room.memory.settings.flags.runnersDoPiles + ')   HFA(' + room.memory.settings.flags.harvestersFixAdjacent + ')', xCoord, (yCoord - 0.6), { align: 'left', font: fontSize, color: displayColor });
			room.visual.text('[' + room.name + ']:   RB(' + room.memory.settings.flags.repairBasics + ')   RR(' + room.memory.settings.flags.repairRamparts + ')    RW(' + room.memory.settings.flags.repairWalls + ')   TRB(' + room.memory.settings.flags.towerRepairBasic + ')   TRD(' + room.memory.settings.flags.towerRepairDefenses + ')', xCoord, yCoord - 0.1, { align: 'left', font: fontSize, color: displayColor });

			let creepCount = 0;

			if (Memory.creeps)
				creepCount = Object.keys(Memory.creeps).length;
			let capacity;
			if (creepCount.length < 2)
				capacity = room.energyAvailable;
			else
				capacity = room.energyCapacityAvailable;

			// ________________________________________________________________________________________________________________________
			// ############################################### SPAWN VARIANT ALLOCATION ###############################################
			// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

			if (room.energyCapacityAvailable == 300) {
				availableVariants.harvester 	= spawnVariants.harvester300;
				availableVariants.collector 	= spawnVariants.collector100;
				availableVariants.upgrader 		= spawnVariants.upgrader300;
				availableVariants.builder 		= spawnVariants.builder300;
				availableVariants.repairer 		= spawnVariants.repairer300;
				availableVariants.runner 			= spawnVariants.runner300;
				availableVariants.crane 			= spawnVariants.crane300;
			} else if (room.energyCapacityAvailable <= 400) {
				availableVariants.harvester 	= spawnVariants.harvester400;
				availableVariants.collector 	= spawnVariants.collector300;
				availableVariants.upgrader 		= spawnVariants.upgrader400;
				availableVariants.builder 		= spawnVariants.builder350;
				availableVariants.repairer 		= spawnVariants.repairer300;
				availableVariants.runner 			= spawnVariants.runner300;
				availableVariants.crane 			= spawnVariants.crane300;
			} else if (room.energyCapacityAvailable <= 500) {
				availableVariants.harvester 	= spawnVariants.harvester400;
				availableVariants.collector 	= spawnVariants.collector300;
				availableVariants.upgrader 		= spawnVariants.upgrader400;
				availableVariants.builder 		= spawnVariants.builder500;
				availableVariants.repairer 		= spawnVariants.repairer300;
				availableVariants.runner 			= spawnVariants.runner300;
				availableVariants.crane 			= spawnVariants.crane300;
			} else if (room.energyCapacityAvailable <= 800) {
				availableVariants.harvester 	= spawnVariants.harvester500;
				availableVariants.collector 	= spawnVariants.collector500;
				availableVariants.upgrader 	= spawnVariants.upgrader550;
				availableVariants.builder 	= spawnVariants.builder500;
				availableVariants.repairer 	= spawnVariants.repairer500;
				availableVariants.runner 	= spawnVariants.runner300;
				availableVariants.warrior 	= spawnVariants.warrior520;
				availableVariants.crane 	= spawnVariants.crane500;
			} else if (room.energyCapacityAvailable <= 1000) {
				availableVariants.harvester 	= spawnVariants.harvester600;
				availableVariants.collector 	= spawnVariants.collector500;
				availableVariants.upgrader 	= spawnVariants.upgrader700;
				availableVariants.builder 	= spawnVariants.builder800;
				availableVariants.repairer 	= spawnVariants.repairer800;
				availableVariants.runner 	= spawnVariants.runner300;
				availableVariants.crane 	= spawnVariants.crane500;
				availableVariants.remoteGuard 	= spawnVariants.remoteGuard700;
			} else if (room.energyCapacityAvailable <= 1300) {
				availableVariants.harvester 	= spawnVariants.harvester600;
				availableVariants.collector 	= spawnVariants.collector500;
				availableVariants.upgrader 	= spawnVariants.upgrader700;
				availableVariants.builder 	= spawnVariants.builder1000;
				availableVariants.repairer 	= spawnVariants.repairer1000;
				availableVariants.runner 	= spawnVariants.runner300;
				availableVariants.crane 	= spawnVariants.crane500;
				availableVariants.remoteGuard = spawnVariants.remoteGuard700;
				availableVariants.remoteLogistician = spawnVariants.remoteLogistician1200;
			} else if (room.energyCapacityAvailable > 1600) {
				availableVariants.harvester 	= spawnVariants.harvester600;
				availableVariants.collector 	= spawnVariants.collector500;
				availableVariants.upgrader 	= spawnVariants.upgrader900;
				availableVariants.builder 	= spawnVariants.builder1100;
				availableVariants.repairer 	= spawnVariants.repairer1000;
				availableVariants.runner 	= spawnVariants.runner300;
				availableVariants.crane 	= spawnVariants.crane500;
				availableVariants.remoteGuard = spawnVariants.remoteGuard700;
				availableVariants.remoteLogistician = spawnVariants.remoteLogistician1500;
			}

			if (room.memory.settings.flags.craneUpgrades == true) availableVariants.crane = spawnVariants.crane800;
			if (Game.shard.ptr) availableVariants.builder = spawnVariants.builder300;
			if (room.storage) {
				if (room.energyAvailable <= 300 && room.storage[RESOURCE_ENERGY] <= 1000 && creepCount <= 1) spawnVariants.harvester300;
			}
			// if we have no collectors, and our energy supply is not enough for a 500 energy spawn, do a 300.
			if (collectors.length == 0) {
				if (room.energyAvailable < 500)
					availableVariants.collector = spawnVariants.collector300;
			}

			// ensure that two harvesters never use the same source for harvesting, when spawning 6-work harvesters
			// if it happens, send the older one to the opposite source
			if (harvesters.length >= 2 && harvesters[0].getActiveBodyparts(WORK).length >= 6) {
				if (harvesters[0].memory.source == harvesters[1].memory.source) {
					if (harvesters[0].ticksToLive > harvesters[1].ticksToLive) {
						harvesters[1].assignHarvestSource(true);
						console.log('[' + room.name + ']: Reassigned ' + harvesters[1].name + '\'s source due to conflict.')
					}
					if (harvesters[1].ticksToLive > harvesters[0].ticksToLive) {
						harvesters[0].assignHarvestSource(true);
						console.log('[' + room.name + ']: Reassigned ' + harvesters[0].name + '\'s source due to conflict.')
					}
				}
			}

			// __________________________________________________________________________________________________________________________
			// ######################### LOGIC TO ALLOW FOR PRE-SPAWNING HARVESTERS/REMOTE HARVESTERS/RESERVERS #########################
			// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

			for (i = 0; i < harvesters.length; i++) {
				harvesterDying = false;
				if (harvesters[i].ticksToLive <= 50) {
					harvesterDying = true;
					break;
				}
			}
			for (i = 0; i < runners.length; i++) {
				runnerDying = false;
				if (runners[i].ticksToLive <= 20) {
					runnerDying = true;
					break;
				}
			}
			for (i = 0; i < reservers.length; i++) {
				reserverDying = false;
				if (reservers[i].ticksToLive <= 90) {
					reserverDying = true;
					break;
				}
			}
			for (i = 0; i < remoteHarvesters.length; i++) {
				remoteHarvesterDying = false;
				if (remoteHarvesters[i].ticksToLive <= 110) {
					remoteHarvesterDying = true;
					break;
				}
			}
			for (i = 0; i < collectors.length; i++) {
				collectorDying = false;
				if (collectors[i].ticksToLive <= 30) {
					collectorDying = true;
					break;
				}
			}
			for (i = 0; i < remoteGuards.length; i++) {
				remoteGuardDying = false;
				if (remoteGuards[i].ticksToLive <= 110) {
					remoteGuardDying = true;
					break;
				}
			}
			for (i = 0; i < miners.length; i++) {
				minerDying = false;
				if (miners[i].ticksToLive <= 60) {
					minerDying = true;
					break;
				}
			}

			// _____________________________________________________________________________________________________________________________
			// ################################################## SPAWN MANAGEMENT SYSTEM ##################################################
			// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

			let readySpawn = spawn;
			/*if (room.memory.objects.spawns && room.memory.objects.spawns.length > 0) {
				for (let i = 0; i < room.memory.objects.spawns.length; i++) {
					const thisSpawn = Game.getObjectById(room.memory.objects.spawns[i]);

					if (thisSpawn.spawning) continue;
					else readySpawn = thisSpawn;
				}
			}*/
			if (room.memory.objects.spawns.length > 0) {
				if (Game.creeps.length == 0 && room.energyAvailable <= 300 && (!room.memory.objects.storage || room.storage.store[RESOURCE_ENERGY] < 500)) {
					newName = 'Rb' + rebooterCount;
					while (readySpawn.spawnCreep([WORK, WORK, MOVE, CARRY], newName, { memory: { role: 'rebooter', roleForQuota: 'rebooter' } }) == ERR_NAME_EXISTS) {
						rebooterCount++;
						newName = 'Rb' + rebooterCount;
					}
				} else if (Game.creeps.length <= 1 && room.energyAvailable <= 300 && room.storage.store[RESOURCE_ENERGY] >= 500) {
					const result = readySpawn.spawnCreep([CARRY, MOVE], 'Collie the Emergency Collector Creep', { memory: { role: 'collector', homeRoom: roomName } });
					switch (result) {
						case OK:
						case ERR_BUSY:
						case ERR_NOT_ENOUGH_ENERGY:
						case ERR_INVALID_ARGS:
						case ERR_RCL_NOT_ENOUGH:
							break;
						case ERR_NAME_EXISTS:
							readySpawn.spawnCreep([CARRY, MOVE], 'Collie the Emergency Collector Back-up Creep', { memory: { role: 'collector', homeRoom: roomName } });
							break;
					}
				} else {
					if ((harvesters.length < harvesterTarget) || (harvesters.length <= harvesterTarget && harvesterDying && harvesterTarget !== 0)) {
						newName = 'H' + harvesterCount;
						while (readySpawn.spawnCreep(availableVariants.harvester, newName, { memory: { role: 'harvester', roleForQuota: 'harvester', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
							harvesterCount++;
							newName = 'H' + harvesterCount;
						}
					} else if ((collectors.length < collectorTarget) || (collectors.length <= collectorTarget && collectorDying && collectorTarget !== 0)) {
						newName = 'C' + collectorCount;
						while (readySpawn.spawnCreep(availableVariants.collector, newName, { memory: { role: 'collector', roleForQuota: 'collector', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
							collectorCount++;
							newName = 'C' + collectorCount;
						}
					} else {
						// REBOOTERS/COLLECTORS/HARVESTERS are at quota, move on to the rest:
						if ((runners.length < runnerTarget) || (runners.length <= runnerTarget && runnerDying && runnerTarget !== 0)) {
							newName = 'Rn' + runnerCount;
							while (readySpawn.spawnCreep(readySpawn.determineBodyparts('runner', room.energyAvailable), newName, { memory: { role: 'runner', roleForQuota: 'runner', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
								runnerCount++;
								newName = 'Rn' + runnerCount;
							}
						} else if (upgraders.length < upgraderTarget) {
							newName = 'U' + upgraderCount;
							while (readySpawn.spawnCreep(availableVariants.upgrader, newName, { memory: { role: 'upgrader', roleForQuota: 'upgrader', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
								upgraderCount++;
								newName = 'U' + upgraderCount;
							}
						} else if (sites.length > 0 && builders.length < builderTarget) {
							newName = 'B' + builderCount;
							while (readySpawn.spawnCreep(availableVariants.builder/*[WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]*/, newName, { memory: { role: 'builder', roleForQuota: 'builder', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
								builderCount++;
								newName = 'B' + builderCount;
							}
						} else if (repairers.length < repairerTarget) {
							newName = 'Rp' + repairerCount;
							while (readySpawn.spawnCreep(availableVariants.repairer, newName, { memory: { role: 'repairer', roleForQuota: 'repairer', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
								repairerCount++;
								newName = 'Rp' + repairerCount
							}
						} else if (cranes.length < craneTarget) {
							newName = 'Cn' + craneCount;
							while (readySpawn.spawnCreep(availableVariants.crane, newName, { memory: { role: 'crane', roleForQuota: 'crane', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
								craneCount++;
								newName = 'Cn' + craneCount;
							}
						} else if (miners.length < minerTarget && room.memory.objects.extractor) {
							newName = 'M' + minerCount;
							while (readySpawn.spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE], newName, { memory: { role: 'miner', roleForQuota: 'miner', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
								minerCount++;
								newName = 'M' + minerCount;
							}
						} else if ((scientists.length < scientistTarget && room.objects.labs) /*&& room.memory.settings.flags.doScience*/) {
							newName = 'S' + scientistCount;
							while (readySpawn.spawnCreep([MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY], newName, { memory: { role: 'scientist', roleForQuota: 'scientist', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
								scientistCount++;
								newName = 'S' + scientistCount;
							}
						} else if ((reservers.length < reserverTarget) || (reservers.length <= reserverTarget && reserverDying && reserverTarget !== 0)) {
							newName = 'Rv' + reserverCount;
							while (readySpawn.spawnCreep([MOVE, MOVE, CLAIM, CLAIM], newName, { memory: { role: 'reserver', roleForQuota: 'reserver', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
								reserverCount++;
								newName = 'Rv' + reserverCount;
							}
						} else if ((remoteHarvesters.length < remoteHarvesterTarget) || (remoteHarvesters.length <= remoteHarvesterTarget && remoteHarvesterDying && remoteHarvesterTarget !== 0)) {
							newName = 'RH' + remoteHarvesterCount;
							while (readySpawn.spawnCreep([CARRY, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK], newName, { memory: { role: 'remoteharvester', roleForQuota: 'remoteharvester', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
								remoteHarvesterCount++;
								newName = 'RH' + remoteHarvesterCount;
							}
						} else if (remoteRunners.length < remoteRunnerTarget) {
							newName = 'RR' + remoteRunnerCount;
							while (readySpawn.spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, WORK], newName, { memory: { role: 'remoterunner', roleForQuota: 'remoterunner', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
								remoteRunnerCount++;
								newName = 'RR' + remoteRunnerCount;
							}
						} else if (/*sites.length > 0 && */remoteBuilders.length < remoteBuilderTarget) {
							newName = 'RB' + remoteBuilderCount;
							while (readySpawn.spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], newName, { memory: { role: 'remotebuilder', roleForQuota: 'remotebuilder', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
								remoteBuilderCount++;
								newName = 'RB' + remoteBuilderCount;
							}
						} else if ((remoteGuards.length < remoteGuardTarget) || (remoteGuards.length <= remoteGuardTarget && remoteGuardDying && remoteGuardTarget !== 0)) {
							newName = 'RG' + remoteGuardCount;
							while (readySpawn.spawnCreep(availableVariants.remoteGuard, newName, { memory: { role: 'remoteguard', roleForQuota: 'remoteguard', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
								remoteGuardCount++;
								newName = 'RG' + remoteGuardCount;
							}
						} else if (remoteLogisticians.length < remoteLogisticianTarget) {
							newName = 'RL' + remoteLogisticianCount;
							while (readySpawn.spawnCreep(availableVariants.remoteLogistician, newName, { memory: { role: 'remotelogistician', roleForQuota: 'remotelogistician', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
								remoteLogisticianCount++;
								newName = 'RL' + remoteLogisticianCount;
							}
						} else {
							//RESERVERS/REMOTE RUNNERS/HARVESTERS/BUILDERS/GUARDS are at quota, move on to defensive creeps:
							if (rangers.length < rangerTarget) {
								newName = 'Rng' + rangerCount;
								while (readySpawn.spawnCreep([TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE], newName, { memory: { role: 'ranger', roleForQuota: 'ranger', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
									rangerCount++;
									newName = 'Rng' + rangerCount;
								}
							} else if (warriors.length < warriorTarget) {
								newName = 'War' + warriorCount;
								while (readySpawn.spawnCreep(availableVariants.warrior, newName, { memory: { role: 'warrior', roleForQuota: 'warrior', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
									warriorCount++;
									newName = 'War' + warriorCount;
								}
							} else if (healers.length < healerTarget) {
								newName = 'Hlr' + healerCount;
								while (readySpawn.spawnCreep([TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], newName, { memory: { role: 'healer', roleForQuota: 'healer', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
									healerCount++;
									newName = 'Hlr' + healerCount;
								}
							} else if (scouts.length < scoutTarget) {
								newName = 'Sct' + scoutCount;
								while (readySpawn.spawnCreep([MOVE, MOVE, MOVE, MOVE, MOVE], newName, { memory: { role: 'scout', roleForQuota: 'scout', homeRoom: roomName } }) == ERR_NAME_EXISTS) {
									scoutCount++;
									newName = 'Sct' + scoutCount;
								}
							}
						}
					}
				}

				// Display creep spawning information next to spawn
				for (let i = 0; i < room.memory.objects.spawns.length; i++) {
					let spawnObjects = [];
					for (let j = 0; j < room.memory.objects.spawns.length; j++)
						spawnObjects.push(Game.getObjectById(room.memory.objects.spawns[j]));
				
					if (spawnObjects[i].spawning) {
		
						let spawningCreep = Game.creeps[spawnObjects[i].spawning.name];
						if (!HEAP_MEMORY.rooms[room.name].spawnAnnounced) {
							console.log('[' + room.name + ' ' + spawnObjects[i].name + ']: Spawning new creep: ' + spawningCreep.memory.role + ' (' + spawningCreep.name + ')');
							HEAP_MEMORY.rooms[room.name].spawnAnnounced = true;
						}
						spawnObjects[i].room.visual.text(spawningCreep.memory.role + ' - ' + spawnObjects[i].spawning.remainingTime + '/' + spawnObjects[i].spawning.needTime, spawnObjects[i].pos.x, spawnObjects[i].pos.y + 1.25, { stroke: '#111111', color: '#ff00ff', align: 'center', opacity: 0.8, font: 0.4 });
					} else {
						HEAP_MEMORY.rooms[room.name].spawnAnnounced = false;
					}
				}

				if (room.controller.level >= 1)
					visualRCProgress(room.controller);
			
				room.visual.text('Energy: ' + room.energyAvailable
					+ '/' + room.energyCapacityAvailable,
					readySpawn.pos.x,
					readySpawn.pos.y - 1,
					{ align: 'center', opacity: 0.8, color: '#00dddd', stroke: '#000000', font: 0.4 });
			
				if (room.storage) {
					room.visual.text(' Storage: ' + room.storage.store[RESOURCE_ENERGY], room.storage.pos.x, room.storage.pos.y - 1, { align: 'center', opacity: 0.8, font: 0.4, stroke: '#000000', color: '#ffff00' })
				}
			}
		} // END OF (ROOMS CLAIMED BY BOT)

	}); // END OF (FOR EACH ROOM BOT HAS VISIBILITY)
	
	// __________________________________________________________________________________________________________________________________
	// ################################################### ROLE EXECUTION SWITCH CASE ###################################################
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	for(let name in Game.creeps) {
		let creep = Game.creeps[name];

		switch (creep.memory.role) {
			case 'reserver':
				roleReserver.run(creep);
				break;
			case 'rebooter':
				roleRebooter.run(creep);
				break;
			case 'harvester':
				roleHarvester.run(creep);
				break;
			case 'upgrader':
				roleUpgrader.run(creep);
				break;
			case 'builder':
				roleBuilder.run(creep);
				break;
			case 'collector':
				roleCollector.run(creep);
				break;
			case 'repairer':
				roleRepairer.run(creep);
				break;
			case 'ranger':
				roleRanger.run(creep);
				break;
			case 'warrior':
				roleWarrior.run(creep);
				break;
			case 'runner':
				roleRunner.run(creep);
				break;
			case 'healer':
				roleHealer.run(creep);
				break;
			case 'remotelogistician':
				roleRemoteLogistician.run(creep);
				break;
			case 'remoteharvester':
				roleRemoteHarvester.run(creep);
				break;
			case 'remoterunner':
				roleRemoteRunner.run(creep);
				break;
			case 'remotebuilder':
				roleRemoteBuilder.run(creep);
				break;
			case 'remoteguard':
				roleRemoteGuard.run(creep);
				break;
			case 'crane':
				roleCrane.run(creep);
				break;
			case 'miner':
				roleMiner.run(creep);
				break;
			case 'scientist':
				roleScientist.run(creep);
				break;
			case 'claimer':
				roleClaimer.run(creep);
				break;
			case 'provider':
				roleProvider.run(creep);
				break;
			case 'scout':
				roleScout.run(creep);
				break;
		}
	
		//Game.spawns['Spawn1'].room.controller.room.visual.text('L' + Game.spawns['Spawn1'].room.controller.level + ' - ' + Game.spawns['Spawn1'].room.controller.progress + '/' + Game.spawns['Spawn1'].room.controller.progressTotal, Game.spawns['Spawn1'].room.controller.pos.x + 1, Game.spawns['Spawn1'].room.controller.pos.y - 1, {align: 'left', opacity: 0.5, color: '#00ffff', font: 0.4} )
		
	}
	tickCount++;
	//console.log('Full main loop used ' + Game.cpu.getUsed().toFixed(3) + ' this tick.');
}

function determineCraneSpot(room) {
	//if (!room.memory.objects) room.cacheObjects();
	//if (!room.memory.objects.storage || !room.memory.objects.links || !room.memory.objects.terminal || !room.memory.objects.labs) room.cacheObjects();

	const storage 	= Game.getObjectById(room.memory.objects.storage[0]	);
	const terminal 	= Game.getObjectById(room.memory.objects.terminal[0]);
	const link 			= Game.getObjectById(room.memory.objects.links[0]		);
	const lab 			= Game.getObjectById(room.memory.objects.labs[0]		);
	
	const storagePos 	= [	storage		.pos.x, storage	.pos.y	];
	const terminalPos = [	terminal	.pos.x, terminal.pos.y	];
	const linkPos 		= [	link			.pos.x, link		.pos.y	];
	const labPos 			= [lab.pos.x, lab.pos.y];
	
	const storageAdjacent = room.lookAtArea(storage.pos.y)
}