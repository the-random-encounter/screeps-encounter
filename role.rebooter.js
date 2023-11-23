const roleRebooter = {

    /** @param {Creep} creep **/
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
            
                if (creep.store.getFreeCapacity() > 0) creep.harvestEnergy();
                else {
                    var targets = room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN) &&
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                        }
                    });
                    if (targets.length > 0) {
                        if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                }
            } else { // I HAVE A RALLY POINT, LET'S BOOGY!
				const rally = Game.flags[cMem.rallyPoint];
				if (pos.isNearTo(rally)) cMem.rallyPoint = 'none';
				else creep.moveTo(rally, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.5, lineStyle: 'undefined', ignoreCreeps: true } });
			}
		} else {
			if (!Memory.globalSettings.alertDisabled)
				console.log('[' + room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
		}
    }
}

module.exports = roleRebooter;