
/*--------------- CREEP ROLE: 'COLLECTOR' ----------------*/
//	when room memory flag 'centralStorageLogic' is set to 'true', //
//	collectors  will  transfer energy from room  storage	//
//	into any empty extensions and spawns as needed. when	//
//	centralStorageLogic is 'false', collectors instead will pick 	//
//	up energy from dropped piles and move to extensions, 	//
//	spawns,  towers,  storage and containers -  in  that	//
//	order.  They  will always prioritize  saving  energy	//
//	from  tombstones  and  will  secondarily  prioritize 	//
//	dropped    energy   when   in   centralStorageLogic    mode.	//
/*--------------------------------------------------------*/

// DEFAULT 'COLLECTOR' PATH VISUALIZER SETTINGS:
//,{ visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } }

const roleCollector = {

	run: function (creep) {
		if (creep.memory.disableAI === undefined)
			creep.memory.disableAI = false;
		if (creep.memory.rallyPoint === undefined)
			creep.memory.rallyPoint = 'none';
		
		if (!creep.memory.disableAI) { // MY AI ISN'T DISABLED, SO...

			if (creep.memory.rallyPoint == 'none') { // I HAVE NO RALLY POINT, SO...

				if (creep.ticksToLive <= 2) // I'M DYING!!!!
					creep.say('☠️');

				if (creep.memory.invaderLooter && creep.room.memory.objects.storage[0]) { // THERE ARE INVADERS TO LOOT AND STORAGE TO PUT IT IN!
					const tombstones = creep.room.find(FIND_TOMBSTONES, { filter: { creep: { my: false } } });
					const target = creep.pos.findClosestByRange(tombstones);
					
					if (target) { // I FOUND THE CLOSEST ENEMY TOMBSTONE
						const lootTypes = Object.keys(target.store);

						if (lootTypes.length == 1 && lootTypes[0] == 'energy' && target.store[RESOURCE_ENERGY] < 100) { // NOTHING BUT A TRIVIAL AMOUNT OF ENERGY, DON'T BOTHER
							creep.memory.invaderLooter = false;
						} else { // THERE'S WORTHWHILE LOOT
							if (creep.store.getFreeCapacity() !== 0) { // AND I HAVE FREE SPACE
								if (creep.pos.isNearTo(target)) { // IF I'M NEXT TO THE TOMBSTONE
									for (i = lootTypes.length - 1; i >= 0; i--) { // START LOOING FROM THE BOTTOM OF THE LIST
										creep.withdraw(target, lootTypes[i]);
										if (creep.store.getFreeCapacity() == 0) // NOW THAT I'M FULL, STOP
											break;
									}
								} else { // NOT NEXT TO THE STONE, GET MOVIN!
									creep.moveTo(target);
								}
							}
							else { // I NEED TO UNLOAD MY INVENTORY
								const storage = Game.getObjectById(creep.room.memory.objects.storage[0]) || creep.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_STORAGE } });

								const creepLootTypes = Object.keys(creep.store);
								if (creep.pos.isNearTo(storage)) { // SINCE I'M BY STORAGE,
									for (i = 0; i < creepLootTypes.length; i++) { // START TRANSFERRING EVERYTHING
										creep.transfer(storage, creepLootTypes[i]);
									}
								} else { // STORAGE IS TOO FAR, GET MOVIN!
									creep.moveTo(storage, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.5, lineStyle: 'undefined', ignoreCreeps: true } });
								}
							}
							const zeroLengthTomb = creep.room.find(FIND_TOMBSTONES, { filter: { creep: { my: false } } }).length;
							let nullTomb;
							let emptyTomb;

							if (creep.room.find(FIND_TOMBSTONES, { filter: { creep: { my: false } } }).length == undefined) {
								nullTomb = true;
							}

							if (creep.room.find(FIND_TOMBSTONES, { filter: (i) => { i.store.getUsedCapacity() == 0 } })) {
								emptyTomb = true;
							}
							const creepGonnaDie = creep.ticksToLive; //< 100
							console.log('zeroLengthTomb: ' + zeroLengthTomb + ', nullTomb: ' + nullTomb + ', emptyTomb: ' + emptyTomb + ', creepGonnaDie: ' + creepGonnaDie);

							if (zeroLengthTomb == 0 || nullTomb || emptyTomb || creepGonnaDie < 100) {
								creep.memory.invaderLooter = false;
							}
						} // end of (worthwhile to loot)
					} // end of (looting closest tombstone)
				} // end of (invaders available for looting logic)
				else { // NO INVADERS TO LOOT, SO...

					if (creep.store[RESOURCE_ENERGY] == 0) { // NO ENERGY, SO...
						let droppedPiles = creep.room.find(FIND_DROPPED_RESOURCES);
						droppedPiles = droppedPiles.sort((a, b) => b.amount - a.amount);
						if (droppedPiles.length > 0) {
							
							if (creep.pickup(droppedPiles[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
								creep.moveTo(droppedPiles[0], { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
						} // end of (if there are dropped piles)
						else { // NO DROPPED PILES, NEED TO FIND OTHER SOURCES OF ENERGY...
							if (creep.room.storage) { // IF RCL IS OVER 3 AND WE HAVE A STORAGE

								if (!creep.memory.pickup) // MAKE THE STORAGE MY PICKUP TARGET AND GET ENERGY
									creep.memory.pickup = creep.room.storage.id;

								const storage = creep.room.storage;

								if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
									creep.moveTo(storage, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
							} // end of (RCL > 3 & storage is built)
							else { // IF RCL IS 3 OR LESS (AND THUS NO STORAGE)
								
								if (!creep.memory.pickup) {// IF NO PICKUP TARGET IS SET, REQUEST A LOGISTICAL PAIR
									const outboxesIDs = creep.room.memory.settings.containerSettings.outboxes;
									let outboxes = [];
									for (let i = 0; i < outboxesIDs.length; i++) {
										const outboxObj = Game.getObjectById(outboxesIDs[i]);
										outboxes.push(outboxObj);
									}
									outboxes = outboxes.sort((a, b) => b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY]);
									creep.memory.pickup = outboxes[0].id;
								/*} else if (creep.memory.pickup == 'none') { // IF NO PAIRS ARE AVAILABLE, SEE IF THERE ARE SOURCE CONTAINERS BUILT
									const sources = creep.room.find(FIND_SOURCES);
									let sourceBoxes = [];
									for (let i = 0; i < sources.length; i++) {
										let box = sources[i].pos.findInRange(FIND_STRUCTURES, 3, { filter: { structureType: STRUCTURE_CONTAINER } });
										sourceBoxes.push(box);
									}
									sourceBoxes = sourceBoxes.sort((a, b) => b.store.getUsedCapacity() - a.store.getUsedCapacity());
									creep.memory.pickup = sourceBoxes[ROOM_HEAP.outboxCounter].id;
									creep.memory.cargo = 'energy';

									ROOM_HEAP.outboxCounter++;
									if (ROOM_HEAP.outboxCounter >= sourceBoxes.length)
										ROOM_HEAP.outboxCounter = 0;*/
								} //else {
								
								const target = Game.getObjectById(creep.memory.pickup)

								if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
									creep.moveTo(target, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
								}
								//}

								/*if (creep.memory.dropoff == 'none') { // IF NO PAIRS ARE AVAILABLE, SEE IF THERE IS A CONTROLLER UPGRADE BOX BUILT
									const controllerBox = creep.room.controller.pos.findInRange(FIND_STRUCTURES, 5, { filter: { structureType: STRUCTURE_CONTAINER } });
									if (controllerBox)
										creep.memory.dropoff = controllerBox[0].id;
								}

								if (creep.memory.pickup !== 'none' && creep.memory.pickup !== undefined) { // IF I HAVE A VALID PICKUP TARGET, GO GET ENERGY FROM IT
									const target = Game.getObjectById(creep.memory.pickup);
									if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
										creep.moveTo(target, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
								}	*/
							} // end of (energy directives when RCL < 4)
						} // end of (no piles, find main energy)
					} // end of (finding energy directives)
					else { // IF MY STORE IS FULL OF ENERGY...
						const targets = creep.room.find(FIND_STRUCTURES, { filter: (i) => ((i.structureType == STRUCTURE_SPAWN || i.structureType == STRUCTURE_EXTENSION) && i.store.getFreeCapacity(RESOURCE_ENERGY) > 0) });

						if (targets.length > 0) { // FIND SPAWNS & EXTENSIONS THAT NEED TO  BE FILLED

							const target = creep.pos.findClosestByRange(targets);
							
							if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) // HEAD TO CLOSEST NON-FULL TARGET AND FILL IT
								creep.moveTo(target, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
						} //end of (spawn/extension filling directives)
						else { // NO SPAWNS/EXTENSIONS NEED FILLING, WHAT ABOUT TOWERS...?
							//let towers = creep.room.find(FIND_STRUCTURES, { filter: (i) => (i.structureType == STRUCTURE_TOWER && i.store[RESOURCE_ENERGY] <= 800) });
							//towers.sort((a, b) => b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY]); 
							const tower = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: (i) => i.structureType == STRUCTURE_TOWER && (i.store[RESOURCE_ENERGY] <= 800)})
							//if (towers.length > 0) { // THERE ARE TOWERS TO FILL, SO...
							//const towerTarget = creep.pos.findClosestByRange(towers);
								
							if (tower) { // HEAD TO CLOSEST NON-FULL TOWER AND FILL IT
								if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
									creep.moveTo(tower, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
							}/* else { // TOWERS FULL UP
								if (creep.room.controller && creep.room.controller.level > 3 && creep.room.memory.objects.storage[0]) { // NOTHING LEFT, RETURN ENERGY TO STORAGE
									const storage = Game.getObjectById(creep.room.memory.objects.storage[0]);
									if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
										creep.moveTo(storage, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } })
								} else {
									if (!creep.memory.dropoff) {
										if (creep.room.memory.settings.containerSettings.inboxes !== undefined) {
											creep.memory.dropoff = creep.room.memory.settings.containerSettings.inboxes[0];
										} else {
											creep.memory.dropoff = creep.room.controller.pos.findClosestByRange(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_CONTAINER } });
										}
									
										const storage = Game.getObjectById(creep.memory.dropoff);
										if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
											creep.moveTo(storage, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } })
									}
								} // end of (no other directives, empty inventory)
							} // end of (refilling tower energy directive)*/

							
						} // end of (if no spawns/extensions to fill)
					} // end of (if creep's store is full)
				} // end of (no invaders to loot, main logic chain)
			} // end of (no rally point to go to)
			else { // I HAVE A RALLY POINT, LET'S BOOGY!
				const rally = Game.flags[creep.memory.rallyPoint];
				if (creep.pos.isNearTo(rally))
					creep.memory.rallyPoint = 'none';
				else
					creep.moveTo(rally, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
			}
		} // end of (if disableAI is false)
		else { // MY AI IS DISABLED, DURRRRR..... *drools*
			console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
    } // end of (if disableAI is true)
	} // end of (run function)
} // end of (module)

module.exports = roleCollector;