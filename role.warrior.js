const roleWarrior = {

	/** @param {Creep} creep **/
	run: function(creep) {

		if (creep.memory.disableAI === undefined)
			creep.memory.disableAI = false;
		
		if (creep.memory.attackRoom === undefined)
			creep.memory.attackRoom = creep.room.name;

		if (!creep.memory.disableAI) {
			if (creep.ticksToLive <= 2) {
				creep.drop(RESOURCE_ENERGY);
				creep.say('☠️');
			}
		
			if (!creep.memory.room) {
				creep.memory.room = 'E57S51';
			}

			const targetRoom = creep.memory.room;

			if (creep.pos.x == 49) {
				creep.move(7);
			} else if (creep.pos.x == 0) {
				creep.move(3);
			} else if (creep.pos.y == 0) {
				creep.move(5);
			} else if (creep.pos.y == 49) {
				creep.move(1)
			}

			if (creep.room.name !== creep.memory.attackRoom) {
				creep.moveTo(Game.flags.Attack, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.5, lineStyle: 'undefined' } });
			}

			const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
			const target = creep.pos.findClosestByRange(hostiles);
			
			if (target) {
				if (creep.attack(target) == ERR_NOT_IN_RANGE)
					creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.5, lineStyle: 'undefined' } });
			} else {

				let structures = creep.room.find(FIND_HOSTILE_STRUCTURES);

				if (structures) {
					
					const target = creep.pos.findClosestByRange(structures);

					if (target) {
						if (creep.attack(target) == ERR_NOT_IN_RANGE)
							creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.5, lineStyle: 'undefined' } });
					}
				}
			}
		}
		else {
			console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
		}
	}
}

module.exports = roleWarrior;