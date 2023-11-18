const roleUpgrader = {

			/** @param {Creep} creep **/
		run: function(creep) {
		
		if (creep.memory.disableAI === undefined)
			creep.memory.disableAI = false;

		if (creep.memory.upgradeRoom === undefined)
			creep.memory.upgradeRoom = creep.room.name;

		if (creep.memory.canSeekEnergy === undefined) {
			if (creep.room.memory.settings.flags.upgradersSeekEnergy !== undefined)
				creep.memory.canSeekEnergy = creep.room.memory.settings.flags.upgradersSeekEnergy;
			else
				creep.memory.canSeekEnergy = true;
		}

		if (!creep.memory.mainBucket) {
			if (creep.room.memory.data.linkRegistry && creep.room.memory.data.linkRegistry.destination !== undefined)
				creep.memory.mainBucket = creep.room.memory.data.linkRegistry.destination;
			else if (creep.room.memory.settings.containerSettings.inboxes !== undefined)
				creep.memory.mainBucket = creep.room.memory.settings.containerSettings.inboxes[0];
			else {
				const nearbyBuckets = creep.room.controller.pos.findInRange(FIND_STRUCTURES, 1, { filter: (i) => i.structureType == STRUCTURE_LINK || i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_STORAGE });
				const closestBucket = creep.room.controller.pos.findClosestByRange(nearbyBuckets);
				if (closestBucket)
					creep.memory.mainBucket = closestBucket.id;
				else
					creep.memory.mainBucket = 'none';
			}
		}
				
		if (!creep.memory.disableAI) {

			if (creep.room.name == 'E58S51' && Game.shard.name == 'shard3') { // AM I IN A SPECIFIC ROOM ON SHARD 3? IF SO, STAND IN THE RIGHT SPOT
				const badPosC = new RoomPosition(39, 9, 'E58S51');
				const badPosSW = new RoomPosition(38, 9, 'E58S51');
				const badPosW = new RoomPosition(38, 8, 'E58S51');
				const badPosSE = new RoomPosition(40, 9, 'E58S51');

				if (creep.pos.x == badPosC.x && creep.pos.y == badPosC.y) {
					if (creep.move(8) !== 0)
						creep.move(1);
				} else if ((creep.pos.x == badPosSW.x || creep.pos.x == badPosSE.x) && creep.pos.y == badPosSW.y) {
					creep.move(1);
				} else if (creep.pos.x == badPosW.x && creep.pos.y == badPosW.y)
					creep.move(1);
			}

			const upgradeRoom = creep.memory.upgradeRoom;

			if (creep.ticksToLive <= 2) {
				creep.say('☠️');
			}

			if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
				creep.memory.working = false;
				creep.say('🔼');
			}

			if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
				creep.memory.working = true;
				creep.say('⚡');
			}
			
			// IF STANDING ON ROOM EXIT, STEP OFF
			if (creep.pos.x == 49)
				creep.move(7);
			else if (creep.pos.x == 0)
				creep.move(3);
			if (creep.pos.y == 0)
				creep.move(5);
			else if (creep.pos.y == 49)
				creep.move(1)

			if (creep.store.getUsedCapacity() == 0) { // I HAVE NO ENERGY, SO...
				
				if (!creep.memory.mainBucket) { // I HAVE NO MAIN BUCKET IN MEMORY, SO...

					const adjacentBucket = creep.pos.findInRange(FIND_STRUCTURES, 1, { filter: (i) => i.structureType == STRUCTURE_LINK || i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_STORAGE} );
					
					if (adjacentBucket.length > 1) { // MULTIPLE BUCKETS! WINNOW IT DOWN...
						creep.memory.mainBucket = adjacentBucket.pos.findClosestByRange(FIND_STRUCTURES, { filter: (i) => i.structureType == STRUCTURE_LINK || i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_STORAGE} ).id;
					} else if (adjacentBucket.length <= 1) // IF THERE'S ONE NEXT TO ME, THAT'S MY MAIN BUCKET.
						creep.memory.mainBucket = adjacentBucket.id;
				} // end of (if there is no mainBucket in memory)
				const mainBucket = Game.getObjectById(creep.memory.mainBucket);
				if (mainBucket) { // MY MAIN BUCKET IS HERE AND ISN'T EMPTY, SO...
					if (creep.withdraw(mainBucket, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) // WITHDRAW FROM IT
						creep.moveTo(mainBucket, { visualizePathStyle: { stroke: '#ffff00', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });	
				} // end of (if main bucket is present & not empty)
				else if (creep.memory.canSeekEnergy) { // MY MAIN BUCKET EITHER ISN'T HERE OR IT'S EMPTY, LET'S FIND ENERGY ELSEWHERE...

					const containersWithEnergy = creep.room.find(FIND_STRUCTURES, {
						filter: (i) => (i.structureType == STRUCTURE_LINK || i.structureType == STRUCTURE_STORAGE || i.structureType == STRUCTURE_CONTAINER) && i.store[RESOURCE_ENERGY] > 0
					});
					const piles = creep.room.find(FIND_DROPPED_RESOURCES);
					//let controllerContainers = creep.room.controller.pos.findInRange(FIND_STRUCTURES, 5, { filter: { strucutreType: STRUCTURE_CONTAINER } });
				
					const all = containersWithEnergy.concat(piles);
					//all = all.concat(controllerContainers);
					const target = creep.pos.findClosestByRange(all);
			
					if (target) { // I FOUND SOME ENERGY SOMEWHERE, LET'S GET IT
						if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE || creep.pickup(target) == ERR_NOT_IN_RANGE)
							creep.moveTo(target, { visualizePathStyle: { stroke: '#ffff00', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
					}
				} // end of (no bucket or bucket energy, find other source)
			} // end of (find energy if empty)	
			else { // I HAVE ENERGY, LET'S UPGRADE THE CONTROLLER, IF MY BUCKET DOESN'T NEED FIXING FIRST...
            
			/*if (creep.room.name !== upgradeRoom) { // AM I IN THE ROOM I'M TOLD TO UPGRADE? IF NOT, GO THERE
				creep.moveTo(Game.flags.ClaimFlag);
			} else { // CHECK MY BUCKET DOESN'T HAVE A LEAK...*/
				if (!creep.memory.mainBucket) {
					const containers = creep.room.controller.pos.findInRange(FIND_STRUCTURES, 5, { filter: (i) => i.structureType == STRUCTURE_LINK || i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_STORAGE});
					const closestContainer = creep.pos.findClosestByRange(containers);
					creep.memory.mainBucket = closestContainer.id;
				}
				const mainBucket = Game.getObjectById(creep.memory.mainBucket);
				if (mainBucket && mainBucket.structureType == STRUCTURE_CONTAINER) {
					if (mainBucket.hits < mainBucket.hitsMax) // I FOUND A LEAK, FIX IT
						creep.repair(mainBucket);
					else {
						if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
							creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffff00', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
							//console.log('got energy');
						}
					}
				}
			
			} 
			if (creep.store.getUsedCapacity() !== 0) {
		        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
					creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffff00', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
	        }
	    
			} // end of (fix bucket/upgrade controller)
		} // end of (disableAI is disabled)
		else {
			console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
		} // end of (disableAI is enabled)
	} // end of (run function)
};// end of (role)

module.exports = roleUpgrader;