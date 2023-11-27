const roleRepairer = {

	run: function (creep) {
		
		const room = creep.room;
		const cMem = creep.memory;
		const rMem = room.memory;
		const pos = creep.pos;

		if (cMem.disableAI === undefined) cMem.disableAI = false;
		if (cMem.rallyPoint === undefined) cMem.rallyPoint = 'none';

		if (!cMem.disableAI) {

			if (cMem.rallyPoint == 'none') {

			if (creep.pos.x == 49) creep.move(LEFT);
			else if (creep.pos.x == 0) creep.move(RIGHT);
			else if (creep.pos.y == 49) creep.move(TOP);
			else if (creep.pos.y == 0) creep.move(BOTTOM);
				
			if (creep.ticksToLive <= 2) creep.say('☠️');
		
				if (creep.store.getUsedCapacity() == 0) {

					switch (rMem.settings.flags.centralStorageLogic) {
						case true: {
							const target = pos.findClosestByRange(FIND_MY_STRUCTURES, {
								filter: (i) => i.structureType == STRUCTURE_STORAGE &&
									i.store[RESOURCE_ENERGY] > 0
							});
							if (target) {
								if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
									creep.moveTo(target, { visualizePathStyle: { stroke: '#ff6600', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
							}
							break;
						}
						case false:
						default: {

							const containersWithEnergy = room.find(FIND_STRUCTURES, {
								filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
									i.store[RESOURCE_ENERGY] > 0
							});
							const droppedPiles = room.find(FIND_DROPPED_RESOURCES);
							const resourceList = containersWithEnergy.concat(droppedPiles);

							const target = pos.findClosestByRange(resourceList);
							if (target) {
								if (creep.pickup(target) == ERR_NOT_IN_RANGE || creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
									creep.moveTo(target, { visualizePathStyle: { stroke: '#ff6600', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
							}
							break;
						}
					}

					// now that we have some energy on hand, let's find something to fix (or towers to juice up)
				} else {

					const tower = pos.findClosestByRange(FIND_STRUCTURES, { filter: (i) => i.structureType == STRUCTURE_TOWER && (i.store[RESOURCE_ENERGY] <= 800) });
					if (tower) {
						// transfer energy
						if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
							creep.moveTo(tower, { visualizePathStyle: { stroke: '#ff6600', opacity: 0.3, lineStyle: 'undefined', ignoreCreeps: true } });
					} else {
						// towers are stocked up, look for fix'er'uppers
						let basics = [];
						let ramparts = [];
						let walls = [];
						let validTargets = [];
						const rampartsMax = Memory.rooms[cMem.homeRoom].settings.repairSettings.repairRampartsTo;
						const wallsMax = Memory.rooms[cMem.homeRoom].settings.repairSettings.repairWallsTo;
					
						// search for basically everything that's not a wall or a rampart
						if (Memory.rooms[cMem.homeRoom].settings.flags.repairBasics) {
							basics = room.find(FIND_STRUCTURES, {
								filter: (i) => (i.hits < i.hitsMax) && (i.structureType ==
									STRUCTURE_TOWER || i.structureType == STRUCTURE_SPAWN || i.structureType == STRUCTURE_EXTENSION || i.structureType == STRUCTURE_ROAD || i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_EXTRACTOR || i.structureType == STRUCTURE_LAB || i.structureType == STRUCTURE_LINK || i.structureType == STRUCTURE_STORAGE || i.structureType == STRUCTURE_TERMINAL)
							});
							validTargets = validTargets.concat(basics);
						}
					
						// add ramparts to the repair list, based on room flag & room max repair limit
						if (Memory.rooms[cMem.homeRoom].settings.flags.repairRamparts) {
							ramparts = room.find(FIND_STRUCTURES, { filter: (i) => ((i.structureType == STRUCTURE_RAMPART) && ((i.hits / i.hitsMax * 100) <= rampartsMax)) });
							validTargets = validTargets.concat(ramparts);
						}
						// add walls to the repair list, based on room flag & room max repair limit
						if (Memory.rooms[cMem.homeRoom].settings.flags.repairWalls) {
							walls = room.find(FIND_STRUCTURES, { filter: (i) => ((i.structureType == STRUCTURE_WALL) && ((i.hits / i.hitsMax * 100) <= wallsMax)) })
							validTargets = validTargets.concat(walls);
						}

						const target = pos.findClosestByRange(validTargets);
						
						// travel to closest object within repair criteria and start repairing!
						if (target) {
							if (creep.repair(target) == ERR_NOT_IN_RANGE)
								creep.moveTo(target, { visualizePathStyle: { stroke: '#ff6600', lineStyle: 'dashed', opacity: 0.3, ignoreCreeps: true } });
						}
					}
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
    } else {
      if (!Memory.globalSettings.alertDisabled)
        console.log('[' + room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
      creep.say('💤');
    }
	}
}

module.exports = roleRepairer;