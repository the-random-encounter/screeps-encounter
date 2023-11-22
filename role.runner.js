//, { visualizePathStyle: { stroke: '#880088', opacity: 0.3, lineStyle: 'dotted' } }

const roleRunner = {

	run: function (creep) {

		if (creep.memory.disableAI === undefined) creep.memory.disableAI = false;
		if (creep.memory.rallyPoint === undefined) creep.memory.rallyPoint = 'none';

		if (!creep.memory.disableAI) {
			if (creep.memory.rallyPoint == 'none') {

				if (creep.ticksToLive <= 2) creep.say('☠️');
		
				if (!creep.memory.pickup && !creep.memory.dropoff)
					creep.assignLogisticalPair();

				if (creep.store[creep.memory.cargo] == 0) {
					let target = Game.getObjectById(creep.memory.pickup);
					if (target) {
						if (creep.withdraw(target, creep.memory.cargo) == ERR_NOT_IN_RANGE)
							creep.moveTo(target, { visualizePathStyle: { stroke: '#880088', opacity: 0.3, lineStyle: 'dotted' } });
					}
				} else {
					let target = Game.getObjectById(creep.memory.dropoff);
					if (target) {
						if (creep.transfer(target, creep.memory.cargo) == ERR_NOT_IN_RANGE)
							creep.moveTo(target, { visualizePathStyle: { stroke: '#880088', opacity: 0.3, lineStyle: 'dotted' } });
					}
				}
			} // end of (no rally point to go to)
			else { // I HAVE A RALLY POINT, LET'S BOOGY!
				const rally = Game.flags[creep.memory.rallyPoint];
				if (creep.pos.isNearTo(rally))
					creep.memory.rallyPoint = 'none';
				else
					creep.moveTo(rally, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
			}
		}	else {
			if (Memory.globalSettings.alertDisabled)
				console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
		}
	}
}

module.exports = roleRunner;