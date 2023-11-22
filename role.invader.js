const roleInvader = {

	run: function (creep) {

		const mem = creep.memory;

		if (mem.disableAI === undefined)
			mem.disableAI = false;

		if (mem.targetRoom === undefined) {
			if (creep.room.memory.data.invaderTarget === undefined)
				creep.room.memory.data.invaderTarget === 'none';
			else
				mem.targetRoom = creep.room.memory.data.invaderTarget;
		}

		if (mem.rallyPoint === undefined) {
			if (creep.room.memory.data.invaderRallyPoint === undefined)
				creep.room.memory.data.invaderRallyPoint = new RoomPosition(25, 25, creep.room.name);
			else
				mem.rallyPoint = creep.room.memory.data.invaderRallyPoint;
		}

		if (mem.groupSize === undefined) {
			if (creep.room.memory.data.invaderGroupSize === undefined)
				creep.room.memory.data.invaderGroupSize = 3;
			else
				mem.groupSize = creep.room.memory.data.invaderGroupSize;
		}
		
		if (!mem.disableAI) {
			if (mem.combatRole === undefined) {
				if (creep.getActiveBodyparts(ATTACK) > 0)
					mem.combatRole = 'melee';
				else if (creep.getActiveBodyparts(RANGED_ATTACK) > 0)
					mem.combatRole = 'ranged';
				else if (creep.getActiveBodyparts(HEAL) > 0)
					mem.combatRole = 'healer';
				else if (creep.getActiveBodyparts(WORK) > 0)
					mem.combatRole = 'engineer';
				else
					mem.combatRole = 'unknown';
			}

			switch (mem.combatRole) {

				case 'melee':

					if (creep.room.name == mem.targetRoom) {
						let hostilesInRoom = creep.room.find(FIND_HOSTILE_CREEPS);
						_.filter(hostilesInRoom, (hostile) => hostile.getActiveBodyparts(ATTACK) > 0 || hostile.getActiveBodyparts(RANGED_ATTACK) > 0 || hostile.getActiveBodyparts(HEAL) > 0);

						if (hostilesInRoom.length > 0) {
							const nearestHostileCombatant = creep.pos.findClosestByRange(hostilesInRoom);
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
							let hostileTowers = creep.room.find(FIND_HOSTILE_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });

							if (hostileTowers.length > 0) {
								const closestHostileTowerByPath = creep.pos.findClosestByPath(hostileTowers);
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
								let enemyCivilians = creep.room.find(FIND_HOSTILE_CREEPS);

								if (enemyCivilians.length > 0) {
									const closestEnemyCivilian = creep.pos.findClosestByRange(enemyCivilians);
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
				
				case 'ranged':

					if (creep.room.name == mem.targetRoom) {
						let hostilesInRoom = creep.room.find(FIND_HOSTILE_CREEPS);
						_.filter(hostilesInRoom, (hostile) => hostile.getActiveBodyparts(ATTACK) > 0 || hostile.getActiveBodyparts(RANGED_ATTACK) > 0 || hostile.getActiveBodyparts(HEAL) > 0);

						if (hostilesInRoom.length > 0) {
							const nearestHostileCombatant = creep.pos.findClosestByRange(hostilesInRoom);
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
							let hostileTowers = creep.room.find(FIND_HOSTILE_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });

							if (hostileTowers.length > 0) {
								const closestHostileTowerByPath = creep.pos.findClosestByPath(hostileTowers);
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
								let enemyCivilians = creep.room.find(FIND_HOSTILE_CREEPS);

								if (enemyCivilians.length > 0) {
									const closestEnemyCivilian = creep.pos.findClosestByRange(enemyCivilians);
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
				
				case 'healer':

					let buddies;
					if (creep.pos.isNearTo(mem.rallyPoint)) {
						buddies = creep.pos.findInRange(FIND_MY_CREEPS, 10, { filter: (crp) => crp.memory.role == 'invader' });
					}

					const closest = creep.pos.findClosestByRange(buddies);
					if (closest) {
						creep.moveTo(closest);
						const healTarget = creep.pos.findClosestByRange(buddies, { filter: function (crp) { return crp.hits < crp.hitsMax } });
						if (creep.isNearTo(healTarget)) {
							creep.heal(healTarget);
						} else {
							creep.rangedHeal(target);
						}
					}

					break;
				
				case 'engineer':
					
					if (creep.room.name == mem.targetRoom) {
						const enemySpawns = creep.room.find(FIND_HOSTILE_STRUCTURES, { filter: { structureType: STRUCTURE_SPAWN } });

						const closestEnemySpawn = creep.pos.findClosestByRange(enemySpawns);

						if (closestEnemySpawn) {
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
							const enemyStructures = creep.room.find(FIND_HOSTILE_STRUCTURES);

							const closestEnemyStructure = creep.pos.findClosestByRange(enemyStructures);

							if (closestEnemyStructure) {
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
								const enemyConSites = creep.room.find(FIND_HOSTILE_CONSTRUCTION_SITES);

								const closestEnemyConSite = creep.pos.findClosestByRange(enemyConSites);

								if (closestEnemyConSite) {

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
				
				case 'unknown':
					creep.say('My role is unknown!');
					break;
			}

		} else {
			creep.say("AI Disabled");
		}
	}
}

module.exports = roleInvader;