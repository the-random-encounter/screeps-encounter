const roleRemoteHarvester = {

	run: function (creep) {
		const mem = creep.memory;
		
		if (mem.disableAI === undefined)
			mem.disableAI = false;
		if (mem.rallyPoint === undefined)
			mem.rallyPoint = 'none';
		
		if (!mem.disableAI) {
			if (mem.rallyPoint == 'none') {
				if (creep.ticksToLive <= 2)
					creep.say('☠️');
				else {

					if (!mem.working && creep.store[RESOURCE_ENERGY] > 0) {
						mem.working = true;
						creep.say('⛏️');
					}
			
					if (mem.working && creep.store.getFreeCapacity() < (creep.getActiveBodyparts(WORK) * 2))
						mem.working = false;

					if (creep.store.getFreeCapacity() == 0 || creep.store.getFreeCapacity() < (creep.getActiveBodyparts(WORK) * 2)) {
						const containers = creep.room.find(FIND_STRUCTURES, { filter: (i) => (i.structureType == STRUCTURE_CONTAINER && (i.hits < i.hitsMax)) });
						const target = creep.pos.findClosestByRange(containers);
						if (target) {
							if (!creep.pos.isNearTo(target))
								creep.moveTo(target, { visualizePathStyle: { stroke: '#00ff00', opacity: 0.5, lineStyle: 'dashed' } });
							else {
								if (target.hits < target.hitsMax)
									creep.repair(target);
								else creep.unloadEnergy();
							}
						} else {
							const nearbySites = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 1);
							if (nearbySites.length > 0)
								creep.build(nearbySites[0]);
							else
								creep.room.createConstructionSite(creep.pos.x, creep.pos.y, STRUCTURE_CONTAINER);
						}
					} else 
						creep.harvestEnergy();
				}
			} else {
				const rally = Game.flags[mem.rallyPoint];
				if (creep.pos.isNearTo(rally)) mem.rallyPoint = 'none';
				else creep.moveTo(rally, {visualizePathStyle: { stroke: '#00ff00', opacity: 0.5, lineStyle: 'dashed' } } );
			}
		} else {
			console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
		}
	}
}

module.exports = roleRemoteHarvester;