const roleUpgrader = {

			/** @param {Creep} creep **/
		run: function(creep) {
		
		const room = creep.room;
		const cMem = creep.memory;
		const rMem = room.memory;
		const pos = creep.pos;

		if (cMem.disableAI === undefined) cMem.disableAI = false;
		if (cMem.rallyPoint === undefined) cMem.rallyPoint = 'none';
		if (cMem.upgradeRoom === undefined) cMem.upgradeRoom = room.name;
		if (cMem.canSeekEnergy === undefined) {
			if (rMem.settings.flags.upgradersSeekEnergy !== undefined) cMem.canSeekEnergy = rMem.settings.flags.upgradersSeekEnergy;
			else cMem.canSeekEnergy = true;
		}

		if (!cMem.mainBucket) {

			if (rMem.data.linkRegistry && rMem.data.linkRegistry.destination !== undefined)	cMem.mainBucket = rMem.data.linkRegistry.destination;	
			else if (rMem.settings.containerSettings.inboxes !== undefined) cMem.mainBucket = rMem.settings.containerSettings.inboxes[0];
				
			else {

				const nearbyBuckets = room.controller.pos.findInRange(FIND_STRUCTURES, 1, { filter: (i) => i.structureType == STRUCTURE_LINK || i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_STORAGE });
				const closestBucket = room.controller.pos.findClosestByRange(nearbyBuckets);

				if (closestBucket) cMem.mainBucket = closestBucket.id;
				else cMem.mainBucket = 'none';
			}
		}
				
		if (!cMem.disableAI) {

			if (cMem.rallyPoint == 'none') { // I HAVE NO RALLY POINT, SO...

				const upgradeRoom = cMem.upgradeRoom;

				if (creep.ticksToLive <= 3) {
					creep.say('☠️');
					if (creep.store.getUsedCapacity() > 0)
						if (creep.transfer(Game.getObjectById(cMem.mainBucket), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
							creep.moveTo(Game.getObjectById(cMem.mainBucket));
				}

				if (cMem.working && creep.store[RESOURCE_ENERGY] == 0) {
					cMem.working = false;
					creep.say('🔼');
				}

				if (!cMem.working && creep.store.getFreeCapacity() == 0) {
					cMem.working = true;
					creep.say('⚡');
				}
			
				// IF STANDING ON ROOM EXIT, STEP OFF
				if (pos.x == 49) creep.move(7);
				else if (pos.x == 0) creep.move(3);
				if (pos.y == 0) creep.move(5);
				else if (pos.y == 49) creep.move(1)

				if (creep.store.getUsedCapacity() == 0) { // I HAVE NO ENERGY, SO...
				
					if (!cMem.mainBucket) { // I HAVE NO MAIN BUCKET IN MEMORY, SO...

						const adjacentBucket = pos.findInRange(FIND_STRUCTURES, 1, { filter: (i) => i.structureType == STRUCTURE_LINK || i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_STORAGE });
					
						if (adjacentBucket.length > 1) { // MULTIPLE BUCKETS! WINNOW IT DOWN...

							cMem.mainBucket = adjacentBucket.pos.findClosestByRange(FIND_STRUCTURES, { filter: (i) => i.structureType == STRUCTURE_LINK || i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_STORAGE }).id;
						
						} else if (adjacentBucket.length <= 1) cMem.mainBucket = adjacentBucket.id;
					}
				
					const mainBucket = Game.getObjectById(cMem.mainBucket);
				
					if (mainBucket) { // MY MAIN BUCKET IS HERE AND ISN'T EMPTY, SO...

						if (pos.findInRange(FIND_STRUCTURES, 2, { filter: { structureType: STRUCTURE_CONTROLLER } }).length == 0) creep.moveTo(room.controller);
					
						if (creep.withdraw(mainBucket, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.moveTo(mainBucket, { visualizePathStyle: { stroke: '#ffff00', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
					}

					else if (cMem.canSeekEnergy) { // MY MAIN BUCKET EITHER ISN'T HERE OR IT'S EMPTY, LET'S FIND ENERGY ELSEWHERE...

						const containersWithEnergy = room.find(FIND_STRUCTURES, {
							filter: (i) => (i.structureType == STRUCTURE_LINK || i.structureType == STRUCTURE_STORAGE || i.structureType == STRUCTURE_CONTAINER) && i.store[RESOURCE_ENERGY] > 0
						});
						const piles = room.find(FIND_DROPPED_RESOURCES);
						const all = containersWithEnergy.concat(piles);
						const target = pos.findClosestByRange(all);
			
						if (target) { // I FOUND SOME ENERGY SOMEWHERE, LET'S GET IT

							if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE || creep.pickup(target) == ERR_NOT_IN_RANGE)
								creep.moveTo(target, { visualizePathStyle: { stroke: '#ffff00', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
						}
					}
				}	else { // I HAVE ENERGY, LET'S UPGRADE THE CONTROLLER, IF MY BUCKET DOESN'T NEED FIXING FIRST...

					if (!cMem.mainBucket) {
						const containers = room.controller.pos.findInRange(FIND_STRUCTURES, 5, { filter: (i) => i.structureType == STRUCTURE_LINK || i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_STORAGE });
						if (containers.length > 0)
							cMem.mainBucket = containers[0].id;
					}

					if (cMem.mainBucket) {
						const mainBucket = Game.getObjectById(cMem.mainBucket);

						if (mainBucket && mainBucket.structureType == STRUCTURE_CONTAINER) {

							if (mainBucket.hits < mainBucket.hitsMax) creep.repair(mainBucket);
							else {

								if (creep.upgradeController(room.controller) == ERR_NOT_IN_RANGE) creep.moveTo(room.controller, { visualizePathStyle: { stroke: '#ffff00', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
							}
						}
					} else {
						if (creep.upgradeController(room.controller) == ERR_NOT_IN_RANGE) creep.moveTo(room.controller, { visualizePathStyle: { stroke: '#ffff00', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
					}
				}
			
				if (creep.store.getUsedCapacity() !== 0) {
					if (creep.upgradeController(room.controller) == ERR_NOT_IN_RANGE) creep.moveTo(room.controller, { visualizePathStyle: { stroke: '#ffff00', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
				}

			} else { // I HAVE A RALLY POINT, LET'S BOOGY!
        if (cMem.rallyPoint instanceof Array) {
          if (cMem.rallyPoint.length == 1 && pos.isNearTo(Game.flags[cMem.rallyPoint[0]])) cMem.rallyPoint = 'none';
          else if (!pos.isNearTo(Game.flags[cMem.rallyPoint[0]])) creep.moveTo(Game.flags[cMem.rallyPoint[0]], { visualizePathStyle: { stroke: '#00ff00', opacity: 0.3, lineStyle: 'undefined' } });
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
		}	else { // AI IS DISABLED
			if (!Memory.globalSettings.alertDisabled)
				console.log('[' + room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('💤');
		}
	}
}

module.exports = roleUpgrader;