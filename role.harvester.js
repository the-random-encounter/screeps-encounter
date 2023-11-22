const roleHarvester = {

  /** @param {Creep} creep **/
  run: function (creep) {
  
    if (creep.memory.disableAI === undefined) creep.memory.disableAI = false;
    if (creep.memory.rallyPoint === undefined) creep.memory.rallyPoint = 'none';
    
    if (!creep.memory.disableAI) {

      if (creep.memory.rallyPoint == 'none') {
        if (creep.ticksToLive <= 2) {
          creep.unloadEnergy();
          creep.say('☠️');
        } else {
          // deposit energy into container, storage, or link when close to full
          if (creep.store.getFreeCapacity() == 0 || creep.store.getFreeCapacity() < (creep.getActiveBodyparts(WORK) * 2)) {
            if (!creep.memory.bucket) {
              const outboxes = creep.room.memory.settings.containerSettings.outboxes;
              if (outboxes && outboxes.length > 0 && creep.memory.source) {
                const sourceTarget = Game.getObjectById(creep.memory.source);
                //const outboxBucketIDs = creep.room.memory.settings.containerSettings.outboxes;
                let possibleBuckets = [];
                for (entry in outboxes)
                  possibleBuckets.push(entry);
                const chosenBucket = sourceTarget.pos.findClosestByRange(possibleBuckets);
							
                if (chosenBucket) creep.memory.bucket = chosenBucket.id;
                else creep.unloadEnergy();
              } else
                creep.unloadEnergy();
            } else {
              const dropBucket = Game.getObjectById(creep.memory.bucket);
              if (dropBucket) {
                if (creep.pos.isNearTo(dropBucket)) creep.unloadEnergy();
                else creep.moveTo(dropBucket, { visualizePathStyle: { stroke: '#00ff00', opacity: 0.5, lineStyle: 'dashed' } });
              } else creep.unloadEnergy();
            }
          } else creep.harvestEnergy();
        }
      } else { // I HAVE A RALLY POINT, LET'S BOOGY!
				const rally = Game.flags[creep.memory.rallyPoint];
				if (creep.pos.isNearTo(rally))
					creep.memory.rallyPoint = 'none';
				else
					creep.moveTo(rally, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
			}
    } else {
      console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
      creep.say('AI Disabled');
    }
  }
}

module.exports = roleHarvester;