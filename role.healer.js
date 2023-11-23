const roleHealer = {

	/** @param {Creep} creep **/
	run: function (creep) {
		
		const room = creep.room;
		const cMem = creep.memory;
		const rMem = room.memory;
		const pos = creep.pos;

		if (cMem.disableAI === undefined) cMem.disableAI = false;
		if (cMem.attackRoom === undefined) cMem.attackRoom = room.name;
		if (cMem.rallyPoint === undefined) cMem.rallyPoint = 'none';
		if (cMem.customAttackTarget === undefined) cMem.customAttackTarget = 'none';
		
		if (!cMem.disableAI) {

			if (cMem.rallyPoint == 'none') {
			
				if (creep.pos.x == 49) creep.move(LEFT);
				else if (creep.pos.x == 0) creep.move(RIGHT);
				else if (creep.pos.y == 49) creep.move(TOP);
				else if (creep.pos.y == 0) creep.move(BOTTOM);
				
				if (creep.ticksToLive <= 2) creep.say('☠️');
				
				const target = pos.findClosestByRange(FIND_MY_CREEPS, { filter: function (object) { return object.memory.role == 'warrior' || object.memory.role == 'ranger' } });
				
				if (target) {
					creep.moveTo(target, { visualizePathStyle: { stroke: '#00ff00', opacity: 0.5, lineStyle: 'undefined', ignoreCreeps: true } });
					if (pos.isNearTo(target))	creep.heal(target);
					else creep.rangedHeal(target);
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

module.exports = roleHealer;