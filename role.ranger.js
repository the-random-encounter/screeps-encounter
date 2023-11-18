const roleRanger = {

	/** @param {Creep} creep **/
	run: function (creep) {

		if (creep.memory.disableAI === undefined)
			creep.memory.disableAI = false;

		if (creep.memory.attackRoom === undefined)
			creep.memory.attackRoom = creep.room.name;
		
		if (!creep.memory.disableAI) {

			if (creep.ticksToLive <= 2) {
				creep.drop(RESOURCE_ENERGY);
				creep.say('☠️');
			}
			
			if (creep.room.name !== creep.memory.attackRoom) {
				creep.moveTo(Game.flags.Attack);
			}

			if (creep.pos.x == 49) {
				if (creep.memory.moveLast == 7)
					creep.move(7);
				creep.memory.moveLast = 3;
			} else if (creep.pos.x == 0) {
				if (creep.memory.moveLast = 3) 
					creep.move(3);
				creep.memory.moveLast = 7;
			} else if (creep.pos.y == 49) {
				if (creep.memory.moveLast == 1)
					creep.move(1);
				creep.memory.moveLast = 5;
			} else if (creep.pos.y == 0) {
				if (creep.memory.moveLast == 5)
					creep.move(5);
				creep.memory.moveLast = 1;
			}

			const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
			
			const target = creep.pos.findClosestByRange(hostiles);
			
			if (target) {
				if (creep.rangedAttack(target) == ERR_NOT_IN_RANGE)
					creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.5, lineStyle: 'undefined' } });
			} else {

				let structures = creep.room.find(FIND_HOSTILE_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });

				if (!structures) {
					structures = creep.room.find(FIND_HOSTILE_STRUCTURES);
				}

				const target = creep.pos.findClosestByRange(structures);

				if (target) {
					if (creep.rangedAttack(target) == ERR_NOT_IN_RANGE)
						creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.5, lineStyle: 'undefined' } });
				}
			}
		}
		else {
			console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
		}
	}
}

module.exports = roleRanger;