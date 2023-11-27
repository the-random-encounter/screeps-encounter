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
            
                if (creep.store.getFreeCapacity() !== 0)
                    creep.harvestEnergy()                     
                else {
                    var targets = room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN) &&
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                        }
                    });
                    if (targets.length > 0) {
                        const target = creep.pos.findClosestByRange(targets);
                        if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
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

module.exports = roleRebooter;