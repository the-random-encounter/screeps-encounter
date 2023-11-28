const roleCollector = {

	run: function (creep) {

		const room = creep.room;
		const cMem = creep.memory;
		const rMem = room.memory;
		const pos = creep.pos;

		if (cMem.disableAI === undefined) cMem.disableAI = false;
		if (cMem.rallyPoint === undefined) cMem.rallyPoint = 'none';
		
		if (!cMem.disableAI) { // MY AI ISN'T DISABLED, SO...

			if (cMem.rallyPoint == 'none') { // I HAVE NO RALLY POINT, SO...

				if (creep.pos.x == 49) creep.move(LEFT);
				else if (creep.pos.x == 0) creep.move(RIGHT);
				else if (creep.pos.y == 49) creep.move(TOP);
				else if (creep.pos.y == 0) creep.move(BOTTOM);
				
				if (creep.ticksToLive <= 2) creep.say('☠️');

				if (cMem.invaderLooter && room.storage) { // THERE ARE INVADERS TO LOOT AND STORAGE TO PUT IT IN!
					const tombstones = room.find(FIND_TOMBSTONES, { filter: (i) => i.store.getUsedCapacity() > 0 && !i.creep.my });
					if (tombstones.length > 0) {
						const target = pos.findClosestByRange(tombstones);
						const lootTypes = Object.keys(creep.store);
						if (target.store.getUsedCapacity() == 0 && (lootTypes.length <= 1 && lootTypes[0] == 'energy')) {
							if (cMem.xferGoods !== undefined) delete cMem.xferGoods;
							delete cMem.invaderLooter;
						}
					} else {
						delete cMem.xferGoods;
						delete cMem.invaderLooter;
					}

					if (cMem.xferGoods === true && creep.store.getFreeCapacity() > 0) {
						if (!pos.isNearTo(room.storage))
							creep.moveTo(room.storage, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.5, lineStyle: 'undefined', ignoreCreeps: true } });
						else {
							const creepLootTypes = Object.keys(creep.store);
							creep.transfer(room.storage, creepLootTypes[creepLootTypes.length - 1]);

							if (creep.store.getUsedCapacity() == 0) delete cMem.xferGoods;
						}
					} else {
						/*
						if (target) { // I FOUND THE CLOSEST ENEMY TOMBSTONE
							const lootTypes = Object.keys(target.store);
							console.log(lootTypes);

							if (lootTypes.length == 1 && lootTypes[0] == 'energy' && target.store[RESOURCE_ENERGY] < 25) cMem.invaderLooter = false;
							
							else {*/ // THERE'S WORTHWHILE LOOT
						if (creep.store.getFreeCapacity() !== 0) { // AND I HAVE FREE SPACE
							const tombstones = room.find(FIND_TOMBSTONES, { filter: (i) => i.store.getUsedCapacity() > 0 && !i.creep.my });
							if (tombstones.length > 0) {
								const target = pos.findClosestByRange(tombstones);

								if (pos.isNearTo(target)) {
									creep.withdraw(target, lootTypes[lootTypes.length - 1]);
								
								}
								else creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.5, lineStyle: 'undefined', ignoreCreeps: true } });
							
							} else { // I NEED TO UNLOAD MY INVENTORY

								const storage = room.storage || pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_STORAGE } });

								if (pos.isNearTo(storage)) { // SINCE I'M BY STORAGE,

									const creepLootTypes = Object.keys(creep.store);
									creep.transfer(storage, creepLootTypes[creepLootTypes.length - 1]);
									cMem.xferGoods = false;

								}

								else creep.moveTo(storage, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.5, lineStyle: 'undefined', ignoreCreeps: true } });

							}

							const creepGonnaDie = creep.ticksToLive;
							const tombsWithStuff = room.find(FIND_TOMBSTONES, { filter: (i) => i.store.getUsedCapacity() > 0 }).length;
												
							if (tombsWithStuff.length == 0 || creepGonnaDie < 100) delete cMem.invaderLooter;
						}
					}
				} else { // NO INVADERS TO LOOT, SO...
					if (creep.store[RESOURCE_ENERGY] == 0) { // NO ENERGY, SO...
						if (cMem.tombXfer) delete cMem.tombXfer;
						if (cMem.tombItem) delete cMem.tombItem;

						let droppedPiles = room.find(FIND_DROPPED_RESOURCES);
						let tombstones = room.find(FIND_TOMBSTONES, { filter: (i) => i.store.getUsedCapacity() > 0 && i.creep.my });
						droppedPiles = droppedPiles.sort((a, b) => b.amount - a.amount);

						if (droppedPiles.length > 0) {

							if (creep.pickup(droppedPiles[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
								creep.moveTo(droppedPiles[0], { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });

						} else if (tombstones.length > 0) {
							cMem.tombXfer = true;
							const tombstoneItem = Object.keys(tombstones[0].store);
							cMem.tombItem = tombstoneItem[0];
							if (creep.withdraw(tombstones[0], cMem.tombItem) == ERR_NOT_IN_RANGE)
								creep.moveTo(tombstones[0], { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
							

						} else { // NO DROPPED PILES, NEED TO FIND OTHER SOURCES OF ENERGY...
							if (cMem.tombXfer) delete cMem.tombXfer;
							if (cMem.tombItem) delete cMem.tombItem;

							if (room.storage) { // IF RCL IS OVER 3 AND WE HAVE A STORAGE
								if (!cMem.pickup) cMem.pickup = room.storage.id;
								const storage = room.storage;
								if (room.storage.store[RESOURCE_ENERGY] >= creep.store.getCapacity()) {
									if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
										creep.moveTo(storage, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
								} else {
									let piles = creep.room.find(FIND_DROPPED_RESOURCES);
									piles = piles.sort((a, b) => b.amount - a.amount);

									if (piles.length > 0) {
										if (creep.pickup(piles[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
											creep.moveTo(piles[0], { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
									}
								}
							} else { // IF RCL IS 3 OR LESS (AND THUS NO STORAGE)
								
								if (!cMem.pickup) {// IF NO PICKUP TARGET IS SET, REQUEST A LOGISTICAL PAIR
									
									const outboxIDs = rMem.settings.containerSettings.outboxes;
									let outboxes = [];

									for (let i = 0; i < outboxIDs.length; i++) {
										const outboxObj = Game.getObjectById(outboxIDs[i]);
										outboxes.push(outboxObj);
									}

									outboxes = outboxes.sort((a, b) => b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY]);
									cMem.pickup = outboxes[0].id;
								}
								
								const target = Game.getObjectById(cMem.pickup)

								if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE)
									creep.moveTo(target, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
							}
						}
					} else { // IF MY STORE IS FULL OF ENERGY...
						
						const targets = room.find(FIND_STRUCTURES, { filter: (i) => ((i.structureType == STRUCTURE_SPAWN || i.structureType == STRUCTURE_EXTENSION) && i.store.getFreeCapacity(RESOURCE_ENERGY) > 0) });

						if (targets.length > 0) { // FIND SPAWNS & EXTENSIONS THAT NEED TO  BE FILLED

							const target = pos.findClosestByRange(targets);
						
							if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
								creep.moveTo(target, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
						} else { // NO SPAWNS/EXTENSIONS NEED FILLING, WHAT ABOUT TOWERS...?
						
							let towers = room.find(FIND_MY_STRUCTURES, { filter: (i) => i.structureType == STRUCTURE_TOWER && (i.store.getFreeCapacity() !== 0) })
						
							if (towers.length > 1) towers = towers.sort((a, b) => a.store[RESOURCE_ENERGY] - b.store[RESOURCE_ENERGY]);
							
							if (towers.length > 0) { // HEAD TO CLOSEST NON-FULL TOWER AND FILL IT
								if (creep.transfer(towers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
									creep.moveTo(towers[0], { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
							}
						}
					}
				}
			} else { // I HAVE A RALLY POINT, LET'S BOOGY!
        if (cMem.rallyPoint instanceof Array) {
          if (cMem.rallyPoint.length == 1 && pos.isNearTo(Game.flags[cMem.rallyPoint[0]])) cMem.rallyPoint = 'none';
					else if (!pos.isNearTo(Game.flags[cMem.rallyPoint[0]]))
						creep.moveTo(Game.flags[cMem.rallyPoint[0]], { visualizePathStyle: { stroke: '#00ff00', opacity: 0.3, lineStyle: 'undefined' } });
          else {
            if (cMem.rallyPoint.length > 1)
              creep.moveTo(Game.flags[cMem.rallyPoint[1]], { visualizePathStyle: { stroke: '#00ff00', opacity: 0.3, lineStyle: 'undefined' } });
            console.log(creep.name + ': Reached rally point \'' + cMem.rallyPoint[0] + '\'');
            const nextWaypoint = cMem.rallyPoint.shift();
            if (nextWaypoint === 'undefined') {
              delete cMem.rallyPoint;
              cMem.rallyPoint = 'none';
            }
          }
        } else {
					const rally = Game.flags[cMem.rallyPoint];
					if (pos.isNearTo(rally)) {
						console.log(creep.name + ': Reached rally point \'' + cMem.rallyPoint + '\'');
						cMem.rallyPoint = 'none';
					}
					else creep.moveTo(rally, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
				}
			}
		} else { // MY AI IS DISABLED, DURRRRR..... *drools*
			if (!Memory.globalSettings.alertDisabled)
				console.log('[' + room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('💤');
    }
	}
}

module.exports = roleCollector;