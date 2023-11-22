const roleWarrior = {

	/** @param {Creep} creep **/
	run: function(creep) {

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

				if (creep.ticksToLive <= 2) {
					creep.drop(RESOURCE_ENERGY);
					creep.say('☠️');
				}

				if (creep.pos.x == 49) creep.move(LEFT);
				else if (creep.pos.x == 0) creep.move(RIGHT);
				else if (creep.pos.y == 49) creep.move(TOP);
				else if (creep.pos.y == 0) creep.move(BOTTOM);

				if (creep.room.name !== mem.attackRoom) {
					creep.moveTo(Game.flags.Attack, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.5, lineStyle: 'undefined' } });
				} else {

					if (mem.customAttackTarget !== 'none') {
						const cAT = Game.getObjectById(mem.customAttackTarget)
						if (creep.getActiveBodyparts(WORK) > 0) {
							if (creep.dismantle(cAT) == ERR_NOT_IN_RANGE)
								creep.moveTo(cAT, { visualizePathStyle: { stroke: '#ff0000', oapcity: 0.5, lineStyle: 'undefined' } });
						} else {
							if (creep.attack(cAT) == ERR_NOT_IN_RANGE)
								creep.moveTo(cAT, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.5, lineStyle: 'undefined' } });
						}
					} else {
						const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
						const target = creep.pos.findClosestByRange(hostiles);
				
						if (target) {
							if (creep.attack(target) == ERR_NOT_IN_RANGE)
								creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.5, lineStyle: 'undefined' } });
						} else {
							const towers = creep.room.find(FIND_HOSTILE_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
							const target = creep.pos.findClosestByRange(towers);

							if (target) {
								if (creep.getActiveBodyparts(WORK) > 0) {
									if (creep.dismantle(target) == ERR_NOT_IN_RANGE)
										creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000', oapcity: 0.5, lineStyle: 'undefined' } });
								} else {
									if (creep.attack(target) == ERR_NOT_IN_RANGE)
										creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.5, lineStyle: 'undefined' } });
								}
							} else {
								const spawns = creep.room.find(FIND_HOSTILE_STRUCTURES, { filter: { structureType: STRUCTURE_SPAWN } });
								const target = creep.pos.findClosestByRange(spawns);

								if (target) {
									if (creep.getActiveBodyparts(WORK) > 0) {
										if (creep.dismantle(target) == ERR_NOT_IN_RANGE)
											creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000', oapcity: 0.5, lineStyle: 'undefined' } });
									} else {
										if (creep.attack(target) == ERR_NOT_IN_RANGE)
											creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.5, lineStyle: 'undefined' } });
									}
								} else {
									const structures = creep.room.find(FIND_HOSTILE_STRUCTURES);
									const target = creep.pos.findClosestByRange(structures);
									if (target) {
										if (creep.getActiveBodyparts(WORK) > 0) {
											if (creep.dismantle(target) == ERR_NOT_IN_RANGE)
												creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000', oapcity: 0.5, lineStyle: 'undefined' } });
										} else {
											if (creep.attack(target) == ERR_NOT_IN_RANGE)
												creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.5, lineStyle: 'undefined' } });
										}
									} else if (creep.getActiveBodyparts(CLAIM) > 0) {
										const controller = creep.room.controller;

										if (creep.attackController(controller) == ERR_NOT_IN_RANGE)
											creep.moveTo(controller, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.5, lineStyle: 'undefined' } });
									}
								}
							}
						}
					}
				}
			} // end of (no rally point to go to)
			else { // I HAVE A RALLY POINT, LET'S BOOGY!
				const rally = Game.flags[mem.rallyPoint];
				if (creep.pos.isNearTo(rally))
					mem.rallyPoint = 'none';
				else
					creep.moveTo(rally, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.5, lineStyle: 'undefined', ignoreCreeps: true } });
			}
		}
		else {
			console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
		}
	}
}

module.exports = roleWarrior;