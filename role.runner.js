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

				if (creep.store[RESOURCE_ENERGY] == 0 || creep.store[cMem.cargo] == 0) {
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
							if (creep.withdraw(target, cMem.cargo) == ERR_NOT_IN_RANGE) creep.moveTo(target, { visualizePathStyle: { stroke: '#880088', opacity: 0.3, lineStyle: 'dotted' } });
						}
					}
				} else {
					const target = Game.getObjectById(cMem.dropoff);
					if (target) {
						if (pos.isNearTo(target)) {
							if (target.store.getFreeCapacity(RESOURCE_ENERGY) > 0) creep.transfer(target, RESOURCE_ENERGY);
						}
						else {
							if (creep.getActiveBodyparts(WORK) > 0) {
								const roadUnderCreep = room.find(FIND_STRUCTURES, { filter: (i) => (i.structureType == STRUCTURE_ROAD && i.pos.x == pos.x && i.pos.y == pos.y && i.hits !== i.hitsMax) })
								const roadTarget = pos.findClosestByRange(roadUnderCreep);
								if (roadUnderCreep.length > 0) creep.repair(roadUnderCreep[0]);
								else creep.moveTo(target, { visualizePathStyle: { stroke: '#880088', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
							}
							else creep.moveTo(target, { visualizePathStyle: { stroke: '#880088', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
						}
					}
				}
			} else { // I HAVE A RALLY POINT, LET'S BOOGY!
				const rally = Game.flags[cMem.rallyPoint];
				if (pos.isNearTo(rally)) cMem.rallyPoint = 'none';
				else creep.moveTo(rally, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
			}
		}	else {
			if (!Memory.globalSettings.alertDisabled)
				console.log('[' + room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
		}
	}
}

module.exports = roleRunner;