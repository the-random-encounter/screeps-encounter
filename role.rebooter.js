const roleRebooter = {

    /** @param {Creep} creep **/
    run: function (creep) {
       
        if (creep.memory.disableAI === undefined)
			creep.memory.disableAI = false;
		
        if (!creep.memory.disableAI) {

            if (creep.ticksToLive <= 2) {
                creep.drop(RESOURCE_ENERGY);
                creep.say('☠️');
            }
            
            if (creep.store.getFreeCapacity() > 0)
                creep.harvestEnergy();
            
            else {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
                if (targets.length > 0) {
                    if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        }
		else {
			console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
		}
    }
}

module.exports = roleRebooter;