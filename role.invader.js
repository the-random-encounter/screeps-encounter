const roleInvader = {

	run: function (creep) {

		const room = creep.room;
		const cMem = creep.memory;
		const rMem = room.memory;
		const pos = creep.pos;

		if (cMem.disableAI === undefined) cMem.disableAI = false;
		if (cMem.rallyPoint === undefined) cMem.rallyPoint = 'none';

		if (cMem.targetRoom === undefined) {
			if (rMem.data.attackRoomTarget === undefined) rMem.data.invaderTarget === 'none';
			else cMem.targetRoom = rMem.data.attackRoomTarget;
		}

		if (cMem.invaderGroupRallyPoint === undefined) {
			if (rMem.data.invaderGroupRallyPoint === undefined) rMem.data.invaderGroupRallyPoint = new RoomPosition(25, 25, room.name);
			else cMem.rallyPoint = rMem.data.invaderRallyPoint;
		}

		if (cMem.groupSize === undefined) {
			if (rMem.data.invaderGroupSize === undefined) {
				rMem.data.invaderGroupSize = 3;
				cMem.groupSize = 3;
			} else cMem.groupSize = rMem.data.invaderGroupSize;
		}	
		
		if (!cMem.disableAI) {

			if (cMem.rallyPoint === 'none') {

				if (creep.pos.x == 49) creep.move(LEFT);
				else if (creep.pos.x == 0) creep.move(RIGHT);
				else if (creep.pos.y == 49) creep.move(TOP);
				else if (creep.pos.y == 0) creep.move(BOTTOM);
				
				if (cMem.combatRole === undefined) {
					if (creep.getActiveBodyparts(ATTACK) > 0) cMem.combatRole = 'melee';
					else if (creep.getActiveBodyparts(RANGED_ATTACK) > 0) cMem.combatRole = 'ranged';
					else if (creep.getActiveBodyparts(HEAL) > 0) cMem.combatRole = 'healer';
					else if (creep.getActiveBodyparts(WORK) > 0) cMem.combatRole = 'engineer';
					else cMem.combatRole = 'unknown';
				}

				switch (cMem.combatRole) {

					case 'melee': {

						if (room.name == cMem.targetRoom) {
							let hostilesInRoom = room.find(FIND_HOSTILE_CREEPS);
							_.filter(hostilesInRoom, (hostile) => hostile.getActiveBodyparts(ATTACK) > 0 || hostile.getActiveBodyparts(RANGED_ATTACK) > 0 || hostile.getActiveBodyparts(HEAL) > 0);

							if (hostilesInRoom.length > 0) {
								const nearestHostileCombatant = pos.findClosestByRange(hostilesInRoom);
								const attackResult = creep.attack(nearestHostileCombatant);

								switch (attackResult) {

									case ERR_NOT_IN_RANGE:
										creep.say('Moving to engage enemy combatant!');
										creep.moveTo(nearestHostileCombatant, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.5, lineStyle: 'undefined', ignoreCreeps: true } });
										break;
									case OK:
										creep.say('Attacking enemy combatant!');
										break;
								}
								
							} else {
								let hostileTowers = room.find(FIND_HOSTILE_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });

								if (hostileTowers.length > 0) {

									const closestHostileTowerByPath = pos.findClosestByPath(hostileTowers);
									const attackResult = creep.attack(closestHostileTowerByPath);

									switch (attackResult) {
										case ERR_NOT_IN_RANGE:
											creep.say('Moving to engage tower!');
											creep.moveTo(closestHostileTowerByPath, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.5, lineStyle: 'undefined' } });
											break;
										case OK:
											creep.say('Attacking enemy tower!');
											break;
									}
								} else {

									let enemyCivilians = room.find(FIND_HOSTILE_CREEPS);

									if (enemyCivilians.length > 0) {
										const closestEnemyCivilian = pos.findClosestByRange(enemyCivilians);
										const attackResult = creep.attack(closestEnemyCivilian);
										switch (attackResult) {
											case ERR_NOT_IN_RANGE:
												creep.say('Moving to engage enemy civilian!');
												creep.moveTo(closestEnemyCivilian, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.5, lineStyle: 'undefined' } });
												break;
											case OK:
												creep.say('Attacking enemy civilian!');
												break;
										}
									}
								}
							}
						}
						break;
					}
					case 'ranged': {

						if (room.name == cMem.targetRoom) {

							let hostilesInRoom = room.find(FIND_HOSTILE_CREEPS);

							_.filter(hostilesInRoom, (hostile) => hostile.getActiveBodyparts(ATTACK) > 0 || hostile.getActiveBodyparts(RANGED_ATTACK) > 0 || hostile.getActiveBodyparts(HEAL) > 0);

							if (hostilesInRoom.length > 0) {
								const nearestHostileCombatant = pos.findClosestByRange(hostilesInRoom);
								const attackResult = creep.rangedAttack(nearestHostileCombatant);

								switch (attackResult) {
									case ERR_NOT_IN_RANGE:
										creep.say('Moving to engage enemy combatant!');
										creep.moveTo(nearestHostileCombatant, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.5, lineStyle: 'undefined', ignoreCreeps: true } });
										break;
									case OK:
										creep.say('Attacking enemy combatant!');
										break;
								}
								
							} else {

								let hostileTowers = room.find(FIND_HOSTILE_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });

								if (hostileTowers.length > 0) {
									const closestHostileTowerByPath = pos.findClosestByPath(hostileTowers);
									const attackResult = creep.rangedAttack(closestHostileTowerByPath);

									switch (attackResult) {
										case ERR_NOT_IN_RANGE:
											creep.say('Moving to engage tower!');
											creep.moveTo(closestHostileTowerByPath, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.5, lineStyle: 'undefined' } });
											break;
										case OK:
											creep.say('Attacking enemy tower!');
											break;
									}
								} else {

									let enemyCivilians = room.find(FIND_HOSTILE_CREEPS);

									if (enemyCivilians.length > 0) {
										const closestEnemyCivilian = pos.findClosestByRange(enemyCivilians);
										const attackResult = creep.rangedAttack(closestEnemyCivilian);

										switch (attackResult) {
											case ERR_NOT_IN_RANGE:
												creep.say('Moving to engage enemy civilian!');
												creep.moveTo(closestEnemyCivilian, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.5, lineStyle: 'undefined' } });
												break;
											case OK:
												creep.say('Attacking enemy civilian!');
												break;
										}
									}
								}
							}
						}
						break;
					}
					case 'healer': {

						let buddies;

						if (pos.isNearTo(cMem.rallyPoint)) buddies = pos.findInRange(FIND_MY_CREEPS, 10, { filter: (crp) => crp.memory.role == 'invader' });

						const closest = pos.findClosestByRange(buddies);

						if (closest) {
							creep.moveTo(closest);
							const healTarget = pos.findClosestByRange(buddies, { filter: function (crp) { return crp.hits < crp.hitsMax } });
							if (creep.isNearTo(healTarget)) creep.heal(healTarget);
							else creep.rangedHeal(target);
						}
						break;
					}
					case 'engineer': {
					
						if (room.name == cMem.targetRoom) {
							const enemySpawns = room.find(FIND_HOSTILE_STRUCTURES, { filter: { structureType: STRUCTURE_SPAWN } });

							if (enemySpawns.length > 0) {
								const closestEnemySpawn = pos.findClosestByRange(enemySpawns);
								const dismantleResult = creep.dismantle(closestEnemySpawn);

								switch (dismantleResult) {
									case ERR_NOT_IN_RANGE:
										creep.say('Moving to dismantle enemy spawn!');
										creep.moveTo(closestEnemySpawn, { visualizePathStyle: { stroke: '#ff0099', opacity: 0.8, lineStyle: 'undefined' } });
										break;
									case OK:
										creep.say('Dismantling enemy spawn!');
										break;
								}
							} else {
								const enemyStructures = room.find(FIND_HOSTILE_STRUCTURES);

								if (enemyStructures.length > 0) {
									const closestEnemyStructure = pos.findClosestByRange(enemyStructures);
									const dismantleResult = creep.dismantle(closestEnemyStructure);

									switch (dismantleResult) {
										case ERR_NOT_IN_RANGE:
											creep.say('Moving to dismantle enemy structure!');
											creep.moveTo(closestEnemySpawn, { visualizePathStyle: { stroke: '#ff0099', opacity: 0.8, lineStyle: 'undefined' } });
											break;
										case OK:
											creep.say('Dismantling enemy structure!');
											break;
									}
								} else {
									const enemyConSites = room.find(FIND_HOSTILE_CONSTRUCTION_SITES);
									
									if (enemyConSites.length > 0) {
										const closestEnemyConSite = pos.findClosestByRange(enemyConSites);
										const dismantleResult = creep.dismantle(closestEnemyConSite);

										switch (dismantleResult) {
											case ERR_NOT_IN_RANGE:
												creep.say('Moving to dismantle construction site!');
												creep.moveTo(closestEnemySpawn, { visualizePathStyle: { stroke: '#ff0099', opacity: 0.8, lineStyle: 'undefined' } });
												break;
											case OK:
												creep.say('Dismantling construction site!');
												break;
										}
									}
								}
							}
						}
						break;
					}
					case 'unknown': {
						creep.say('My role is unknown!');
						break;
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

module.exports = roleInvader;