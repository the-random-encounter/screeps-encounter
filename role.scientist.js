const roleScientist = {

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
				
				if (!rMem.objects.labs) room.cacheObjects();
				if (!rMem.settings.labSettings) rMem.settings.labSettings = {};
				if (!rMem.settings.labSettings.reagantOne) rMem.settings.labSettings.reagantOne = 'none';
				if (!rMem.settings.labSettings.reagantTwo)	rMem.settings.labSettings.reagantTwo = 'none';
				if (!rMem.settings.labSettings.boostingCompound)	rMem.settings.labSettings.boostingCompound = 'none';

				if (creep) {
					if (rMem.objects && rMem.objects.labs) {
						const reagentLab1 = Game.getObjectById(rMem.objects.labs[0]);
						const reagentLab2 = Game.getObjectById(rMem.objects.labs[1]);
						const reactionLab1 = Game.getObjectById(rMem.objects.labs[2]);
						const storage = Game.getObjectById(rMem.objects.storage[0]);

						const baseReg1 = rMem.settings.labSettings.reagantOne;
						const baseReg2 = rMem.settings.labSettings.reagantTwo;
						const boostChem = rMem.settings.labSettings.boostingCompound;
						const outputChem = room.calcLabReaction();
				
						if (rMem.objects.labs[2]) outputLab = Game.getObjectById(rMem.objects.labs[2]);

						if (reagentLab1.store[RESOURCE_ENERGY] < 2000) {
							if (creep.store[RESOURCE_ENERGY] == 0) {
								if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
									creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffffff', opacity: 0.8, lineStyle: 'undefined' } });
							}
						} else if (reagentLab2.store[RESOURCE_ENERGY] < 2000) {
							if (creep.store[RESOURCE_ENERGY] == 0) {
								if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
									creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffffff', opacity: 0.8, lineStyle: 'undefined' } });
							}
						} else if (rMem.settings.flags.doScience) {
							if (reagentLab1.store[baseReg1] < 3000) {
								if (creep.store[baseReg1] == 0) {
									if (creep.withdraw(storage, baseReg1) == ERR_NOT_IN_RANGE)
										creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffffff', opacity: 0.8, lineStyle: 'undefined' } });
								}
							} else if (reagentLab2.store[baseReg2] < 3000) {
								if (creep.store[baseReg2] == 0) {
									if (creep.withdraw(storage, baseReg2) == ERR_NOT_IN_RANGE)
										creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffffff', opacity: 0.8, lineStyle: 'undefined' } });
								}
							} else reactionLab1.runReaction(reagentLab1, reagentLab2);
		
							if (reactionLab1.store[outputChem] > 0) {
								if (creep.withdraw(reactionLab1, outputChem) == ERR_NOT_IN_RANGE)
									creep.moveTo(reactionLab1, { visualizePathStyle: { stroke: '#ffffff', opacity: 0.8, lineStyle: 'undefined' } });
							} else {
								if (creep.transfer(storage, outputChem) == ERR_NOT_IN_RANGE)
									creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffffff', opacity: 0.8, lineStyle: 'undefined' } });
							}
						}
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
};

module.exports = roleScientist;