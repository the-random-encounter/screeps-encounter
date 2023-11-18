const roleRemoteHarvester = {

	run: function (creep) {
		
		if (creep.memory.disableAI === undefined)
			creep.memory.disableAI = false;
		
		if (!creep.memory.disableAI) {

			if (creep.ticksToLive <= 2) {
				creep.unloadEnergy();
				creep.say('☠️');
			} else {

				// a specific fix for a remote harvesting source, to ensure position near container
				if (creep.room.name == 'E57S51') {
					if (creep.pos.x == 11 && creep.pos.y == 6)
						creep.move(1);
					else if (creep.pos.x == 11 && creep.pos.y == 7)
						creep.move(1);
				}

				if (!creep.memory.working && creep.store[RESOURCE_ENERGY] > 0) {
					creep.memory.working = true;
					creep.say('⛏️');
				}
			
				if (creep.memory.working && creep.store.getFreeCapacity() < (creep.getActiveBodyparts(WORK) * 2))
					creep.memory.working = false;

				if (creep.store.getFreeCapacity() == 0 || creep.store.getFreeCapacity() < (creep.getActiveBodyparts(WORK) * 2)) {
					const containers = creep.room.find(FIND_STRUCTURES, { filter: (i) => (i.structureType == STRUCTURE_CONTAINER && (i.hits < i.hitsMax)) });
					const target = creep.pos.findClosestByRange(containers);
					if (!creep.pos.isNearTo(target))
						creep.moveTo(target);
					else {
						if (target.hits < target.hitsMax)
							creep.repair(target);
						else
							creep.unloadEnergy();
					}
				} else {
					creep.harvestEnergy();
				}
			}
		}
		else {
			console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
		}
	}
}

module.exports = roleRemoteHarvester;