const roleHarvester = {

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
        
        if (creep.ticksToLive <= 2) {
          creep.unloadEnergy();
          creep.say('☠️');
        } 

          if (creep.store.getFreeCapacity() == 0 || creep.store.getFreeCapacity() < (creep.getActiveBodyparts(WORK) * 2)) {
            if (!cMem.bucket) {

              const outboxes = rMem.settings.containerSettings.outboxes;

              if (outboxes && outboxes.length > 0 && cMem.source) {

                const sourceTarget = Game.getObjectById(cMem.source);
                let possibleBuckets = [];
                
                for (entry in outboxes) possibleBuckets.push(entry);

                const chosenBucket = sourceTarget.pos.findClosestByRange(possibleBuckets);
							
                if (chosenBucket) cMem.bucket = chosenBucket.id;
                else {
                  creep.unloadEnergy();
                  creep.harvestEnergy();
                }
              } else {
                creep.unloadEnergy();
                creep.harvestEnergy();
              }
            } else {
              const dropBucket = Game.getObjectById(cMem.bucket);
              if (dropBucket) {
                if (pos.isNearTo(dropBucket)) {
                  creep.unloadEnergy();
                  creep.harvestEnergy();
                }
                else creep.moveTo(dropBucket, { visualizePathStyle: { stroke: '#00ff00', opacity: 0.5, lineStyle: 'dashed' } });
              } else {
                creep.unloadEnergy();
                creep.harvestEnergy();
              }
            }
          } else creep.harvestEnergy();
      } else { // I HAVE A RALLY POINT, LET'S BOOGY!
				const rally = Game.flags[cMem.rallyPoint];
				if (pos.isNearTo(rally)) cMem.rallyPoint = 'none';
				else creep.moveTo(rally, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
			}
    } else {
      if (!Memory.globalSettings.alertDisabled)
        console.log('[' + room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
      creep.say('AI Disabled');
    }
  }
}

module.exports = roleHarvester;