const roleWarrior = {

	/** @param {Creep} creep **/
	run: function(creep) {

		const room = creep.room;
		const cMem = creep.memory;
		const rMem = room.memory;
		const pos = creep.pos;

		if (cMem.disableAI === undefined) cMem.disableAI = false;
		if (cMem.attackRoom === undefined) cMem.attackRoom = rMem.data.attackRoomTarget || room.name;
		if (cMem.rallyPoint === undefined) cMem.rallyPoint = 'none';
		if (cMem.customAttackTarget === undefined) cMem.customAttackTarget = rMem.data.customAttackTarget || 'none';

		if (!cMem.disableAI) {

			if (cMem.rallyPoint == 'none') {

				if (creep.ticksToLive <= 2) {
					creep.drop(RESOURCE_ENERGY);
					creep.say('☠️');
				}

				if (pos.x == 49) creep.move(LEFT);
				else if (pos.x == 0) creep.move(RIGHT);
				else if (pos.y == 49) creep.move(TOP);
				else if (pos.y == 0) creep.move(BOTTOM);

				if (cMem.customAttackTarget !== 'none') {
					const cAT = Game.getObjectById(cMem.customAttackTarget)
					if (creep.getActiveBodyparts(WORK) > 0) {
						if (creep.dismantle(cAT) == ERR_NOT_IN_RANGE)
							creep.moveTo(cAT, { visualizePathStyle: { stroke: '#ff0000', oapcity: 0.5, lineStyle: 'undefined' } });
					} else {
						if (creep.attack(cAT) == ERR_NOT_IN_RANGE)
							creep.moveTo(cAT, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.5, lineStyle: 'undefined' } });
					}
				} else {
					if (room.name !== cMem.attackRoom) {
						creep.moveTo(Game.flags[cMem.attackRoom], { visualizePathStyle: { stroke: '#ff0000', opacity: 0.5, lineStyle: 'undefined' } });
					} else {
						const hostiles = room.find(FIND_HOSTILE_CREEPS);
						const target = pos.findClosestByRange(hostiles);
				
						if (target) {
							if (creep.attack(target) == ERR_NOT_IN_RANGE)
								creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.5, lineStyle: 'undefined' } });
						} else {
							const towers = room.find(FIND_HOSTILE_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
							const target = pos.findClosestByRange(towers);

							if (target) {
								if (creep.getActiveBodyparts(WORK) > 0) {
									if (creep.dismantle(target) == ERR_NOT_IN_RANGE)
										creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000', oapcity: 0.5, lineStyle: 'undefined' } });
								} else {
									if (creep.attack(target) == ERR_NOT_IN_RANGE)
										creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.5, lineStyle: 'undefined' } });
								}
							} else {
								const spawns = room.find(FIND_HOSTILE_STRUCTURES, { filter: { structureType: STRUCTURE_SPAWN } });
								const target = pos.findClosestByRange(spawns);

								if (target) {
									if (creep.getActiveBodyparts(WORK) > 0) {
										if (creep.dismantle(target) == ERR_NOT_IN_RANGE)
											creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000', oapcity: 0.5, lineStyle: 'undefined' } });
									} else {
										if (creep.attack(target) == ERR_NOT_IN_RANGE)
											creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.5, lineStyle: 'undefined' } });
									}
								} else {
									const structures = room.find(FIND_HOSTILE_STRUCTURES);
									const target = pos.findClosestByRange(structures);
									if (target) {
										if (creep.getActiveBodyparts(WORK) > 0) {
											if (creep.dismantle(target) == ERR_NOT_IN_RANGE)
												creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000', oapcity: 0.5, lineStyle: 'undefined' } });
										} else {
											if (creep.attack(target) == ERR_NOT_IN_RANGE)
												creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.5, lineStyle: 'undefined' } });
										}
									} else if (creep.getActiveBodyparts(CLAIM) > 0) {
										const controller = room.controller;

										if (creep.attackController(controller) == ERR_NOT_IN_RANGE)
											creep.moveTo(controller, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.5, lineStyle: 'undefined' } });
									}
								}
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
		}	else {
			if (!Memory.globalSettings.alertDisabled)
				console.log('[' + room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('💤');
		}
	}
}

module.exports = roleWarrior;