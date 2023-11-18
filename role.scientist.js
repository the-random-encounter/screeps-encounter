const roleScientist = {

	run: function (creep) {

		if (creep.memory.disableAI === undefined)
			creep.memory.disableAI = false;

		if (!creep.memory.disableAI) {
			if (!creep.room.memory.objects.labs)
				creep.room.cacheObjects();
			if (!creep.room.memory.settings.labSettings)
				creep.room.memory.settings.labSettings = {};
			if (!creep.room.memory.settings.labSettings.reagantOne)
				creep.room.memory.settings.labSettings.reagantOne = 'none';
			if (!creep.room.memory.settings.labSettings.reagantTwo)
				creep.room.memory.settings.labSettings.reagantTwo = 'none';
			if (!creep.room.memory.settings.labSettings.boostingCompound)
				creep.room.memory.settings.labSettings.boostingCompound = 'none';

			if (creep) {
				//if (Game.rooms[creep.memory.homeRoom].memory.objects && Game.rooms[creep.memory.homeRoom].memory.objects.labs) {
				if (creep.room.memory.objects && creep.room.memory.objects.labs) {
					const reagentLab1 = Game.getObjectById(creep.room.memory.objects.labs[0]);
					const reagentLab2 = Game.getObjectById(creep.room.memory.objects.labs[1]);
					const reactionLab1 = Game.getObjectById(creep.room.memory.objects.labs[2]);
					const storage = Game.getObjectById(creep.room.memory.objects.storage[0]);

					const baseReg1 = creep.room.memory.settings.labSettings.reagantOne;
					const baseReg2 = creep.room.memory.settings.labSettings.reagantTwo;
					const boostChem = creep.room.memory.settings.labSettings.boostingCompound;
					const outputChem = creep.room.calcLabReaction();
				
				
				if (creep.room.memory.objects.labs[2])
					outputLab = Game.getObjectById(creep.room.memory.objects.labs[2]);

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
					} else if (creep.room.memory.settings.flags.doScience) {
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
						} else {
							reactionLab1.runReaction(reagentLab1, reagentLab2);
						}
		
						if (reactionLab1.store[outputChem] > 0) {
							if (creep.withdraw(reactionLab1, outputChem) == ERR_NOT_IN_RANGE) {
								creep.moveTo(reactionLab1, { visualizePathStyle: { stroke: '#ffffff', opacity: 0.8, lineStyle: 'undefined' } });
							}
						} else {
							if (creep.transfer(storage, outputChem) == ERR_NOT_IN_RANGE) {
								creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffffff', opacity: 0.8, lineStyle: 'undefined' } });
							}
						}
					}
				}
			}
		}	
	}
};

module.exports = roleScientist;