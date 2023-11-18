const roleHealer = {

	/** @param {Creep} creep **/
	run: function (creep) {
		
		if (creep.memory.disableAI === undefined)
			creep.memory.disableAI = false;
		
		if (!creep.memory.disableAI) {

			if (creep.ticksToLive <= 2) {
				creep.drop(RESOURCE_ENERGY);
				creep.say('☠️');
			}
			
			const target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
				filter: function (object) {
					return object.hits < object.hitsMax;
				}
			});
		
			if (target) {
				creep.moveTo(target);
				if (creep.pos.isNearTo(target)) {
					creep.heal(target);
				}
				else {
					creep.rangedHeal(target);
				}
			}
		}
		else {
			console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
		}
	}
}

module.exports = roleHealer;