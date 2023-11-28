const roleRunner = {

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
		
				if (!cMem.pickup && !cMem.dropoff) creep.assignLogisticalPair();

				if (cMem.cargo === undefined) cMem.cargo = 'energy';
				if (cMem.dropoff == 'none') if (room.storage) cMem.dropoff = room.storage.id;

				if (creep.store.getUsedCapacity() == 0) {
					if (cMem.pickup == 'none') {
						let piles = creep.room.find(FIND_DROPPED_RESOURCES);
						piles = piles.sort((a, b) => b.amount - a.amount);

						if (piles.length > 0) {
							if (creep.pickup(piles[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
								creep.moveTo(piles[0], { visualizePathStyle: { stroke: '#880088', opacity: 0.3, lineStyle: 'dotted' } });
						}
					} else {
						const target = Game.getObjectById(cMem.pickup);
						if (target) {
							if (pos.isNearTo(target)) {
								const lootTypes = Object.keys(target.store);
								if (creep.store.getFreeCapacity() > 0 && target.store.getUsedCapacity() > 0) {
									creep.withdraw(target, lootTypes[i]);
									return;
								}
							} else {
								creep.moveTo(target, { visualizePathStyle: { stroke: '#880088', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
							}
						}
					}
				} else {
					const target = Game.getObjectById(cMem.dropoff);
					if (target) {
						if (pos.isNearTo(target)) {
							const lootTypes = Object.keys(creep.store);
							creep.transfer(target, lootTypes[0]);
							return;
						}
						else {
							if (creep.getActiveBodyparts(WORK) > 0) {
								const roadUnderCreep = room.find(FIND_STRUCTURES, { filter: (i) => (i.structureType == STRUCTURE_ROAD && i.pos.x == pos.x && i.pos.y == pos.y && i.hits !== i.hitsMax) })
								const roadTarget = pos.findClosestByRange(roadUnderCreep);
								if (roadUnderCreep.length > 0) creep.repair(roadUnderCreep[0]);
								else creep.moveTo(target, { visualizePathStyle: { stroke: '#880088', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
							}
							creep.moveTo(target, { visualizePathStyle: { stroke: '#880088', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
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
		}	else {
			if (!Memory.globalSettings.alertDisabled)
				console.log('[' + room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('💤');
		}
	}
}

module.exports = roleRunner;