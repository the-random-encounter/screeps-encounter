//, { visualizePathStyle: { stroke: '#880088', opacity: 0.3, lineStyle: 'dotted' } }

const roleRunner = {

	run: function (creep) {

		if (creep.memory.disableAI === undefined)
			creep.memory.disableAI = false;
		
		if (!creep.memory.disableAI) {
			
			if (creep.ticksToLive <= 2) {
				creep.drop(RESOURCE_ENERGY);
				creep.say('☠️');
			}
		
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
				/*const roadUnderCreep = creep.room.find(FIND_STRUCTURES, { filter: (i) => (i.structureType == STRUCTURE_ROAD && i.pos.x == creep.pos.x && i.pos.y == creep.pos.y && i.hits !== i.hitsMax) })
				const roadTarget = creep.pos.findClosestByRange(roadUnderCreep);
				if (roadTarget) {
					creep.repair(roadTarget);
				} else {
					let target = Game.getObjectById(creep.memory.dropoff);
					if (target) {
						if (creep.transfer(target, creep.memory.cargo) == ERR_NOT_IN_RANGE)
							creep.moveTo(target, { visualizePathStyle: { stroke: '#880088', opacity: 0.3, lineStyle: 'dotted' } });
					}
				}*/
			}

		}	else {
			if (Memory.globalSettings.alertDisabled)
				console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
		}
	}
}

module.exports = roleRunner;