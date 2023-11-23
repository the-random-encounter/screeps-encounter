const roleMiner = {

	run: function (creep) {
    
		const room = creep.room;
		const cMem = creep.memory;
		const rMem = room.memory;
		const pos = creep.pos;

		if (cMem.disableAI === undefined) cMem.disableAI = false;
		if (cMem.rallyPoint === undefined) cMem.rallyPoint = 'none';
		
		if (!cMem.disableAI) {

			if (cMem.rallyPoint === 'none') {

				if (creep.pos.x == 49) creep.move(LEFT);
				else if (creep.pos.x == 0) creep.move(RIGHT);
				else if (creep.pos.y == 49) creep.move(TOP);
				else if (creep.pos.y == 0) creep.move(BOTTOM);
				
				if (creep.ticksToLive <= 2) {
					creep.unloadMineral();
					creep.say('☠️');
				}
					
				if (!cMem.working && creep.store[RESOURCE_ENERGY] > 0) {
					cMem.working = true;
					creep.say('⛏️');
				}

				if (cMem.working && creep.store.getFreeCapacity() < (creep.getActiveBodyparts(WORK) * 2))
					cMem.working = false;

				if (creep.store.getFreeCapacity() == 0 || creep.store.getFreeCapacity() < (creep.getActiveBodyparts(WORK) * 2))
					creep.unloadMineral();
					
				else {
					if (Game.getObjectById(room.memory.objects.extractor[0]).cooldown == 0) creep.harvestMineral();
				}
			}	else { // I HAVE A RALLY POINT, LET'S BOOGY!
				const rally = Game.flags[cMem.rallyPoint];
				if (pos.isNearTo(rally)) cMem.rallyPoint = 'none';
				else creep.moveTo(rally, { visualizePathStyle: { stroke: '#00ff00', opacity: 0.5, lineStyle: 'undefined', ignoreCreeps: true } });
			}
		}	else {
			if (!Memory.globalSettings.alertDisabled)
				console.log('[' + room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
		}
	}
}

module.exports = roleMiner;