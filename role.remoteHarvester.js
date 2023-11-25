const roleRemoteHarvester = {

	run: function (creep) {

		const room = creep.room;
		const cMem = creep.memory;
		const rMem = room.memory;
		const pos = creep.pos;

		if (cMem.disableAI === undefined) cMem.disableAI = false;
		if (cMem.rallyPoint === undefined) cMem.rallyPoint = 'none';
		
		if (!cMem.disableAI) {

			if (cMem.rallyPoint == 'none') {
				
				if (creep.ticksToLive <= 2) creep.say('☠️');
				else {

					if (creep.pos.x == 49) creep.move(LEFT);
					else if (creep.pos.x == 0) creep.move(RIGHT);
					else if (creep.pos.y == 49) creep.move(TOP);
					else if (creep.pos.y == 0) creep.move(BOTTOM);
					
					if (creep.store.getFreeCapacity() == 0 || creep.store.getFreeCapacity() < (creep.getActiveBodyparts(WORK) * 2)) {
						const containers = pos.findInRange(FIND_STRUCTURES, 3, { filter: (i) => (i.structureType == STRUCTURE_CONTAINER)});
						
						if (containers.length > 0) {
							const target = pos.findClosestByRange(containers);

							if (!pos.isNearTo(target)) creep.moveTo(target, { visualizePathStyle: { stroke: '#00ff00', opacity: 0.5, lineStyle: 'dashed' } });
							else {
								if (target.hits < target.hitsMax) creep.repair(target);
								else {
									creep.unloadEnergy();
									creep.harvestEnergy();
								}
							}
						} else {
							if (creep.room.memory.outpostOfRoom) {
								const nearbySites = pos.findInRange(FIND_CONSTRUCTION_SITES, 2);
								if (nearbySites.length == 0) room.createConstructionSite(pos.x, pos.y, STRUCTURE_CONTAINER);
								else {
									const buildersNearby = room.find(FIND_MY_CREEPS, { filter: (i) => i.memory.role = 'remotebuilder' });
									if (buildersNearby.length > 0) {
										creep.unloadEnergy();
										creep.harvestEnergy();
									}
									else
										creep.build(nearbySites[0]);
								}
							}
							else {
								creep.unloadEnergy();
								creep.harvestEnergy();
							}
						}
					} else creep.harvestEnergy();
				}
			} else {
				const rally = Game.flags[cMem.rallyPoint];
				if (pos.isNearTo(rally)) cMem.rallyPoint = 'none';
				else creep.moveTo(rally, { visualizePathStyle: { stroke: '#00ff00', opacity: 0.5, lineStyle: 'dashed' } });
			}
		} else {
			if (!Memory.globalSettings.alertDisabled)
				console.log('[' + room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
		}
	}
}

module.exports = roleRemoteHarvester;