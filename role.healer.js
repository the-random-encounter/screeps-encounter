const roleHealer = {

	/** @param {Creep} creep **/
	run: function (creep) {
		
		const mem = creep.memory;

		if (mem.disableAI === undefined)
			mem.disableAI = false;
		
		if (mem.attackRoom === undefined)
			mem.attackRoom = creep.room.name;

		if (mem.rallyPoint === undefined)
			mem.rallyPoint = 'none';

		if (mem.customAttackTarget === undefined)
			mem.customAttackTarget = 'none';
		
		if (!mem.disableAI) {

			if (mem.rallyPoint == 'none') {
			
				if (creep.ticksToLive <= 2) creep.say('☠️');
				
				const target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
					filter: function (object) {
						return object.memory.role == 'warrior' || object.memory.role == 'ranger'
					}
				});
				if (target) {
					creep.moveTo(target, { visualizePathStyle: { stroke: '#00ff00', opacity: 0.5, lineStyle: 'undefined', ignoreCreeps: true } });
					if (creep.pos.isNearTo(target))	creep.heal(target);
					else creep.rangedHeal(target);
				}
			}
			else { // I HAVE A RALLY POINT, LET'S BOOGY!
				const rally = Game.flags[mem.rallyPoint];
				if (creep.pos.isNearTo(rally)) mem.rallyPoint = 'none';
				else creep.moveTo(rally, { visualizePathStyle: { stroke: '#00ff00', opacity: 0.5, lineStyle: 'undefined', ignoreCreeps: true } });
			}
		}
		else {
			console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
		}
	}
}

module.exports = roleHealer;