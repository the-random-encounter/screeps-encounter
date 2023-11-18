const roleRemoteBuilder = {

	/** @param {Creep} creep **/
	run: function(creep) {

		if (creep.memory.disableAI === undefined)
			creep.memory.disableAI = false;
		
		if (creep.memory.workRoom === undefined)
			creep.memory.workRoom = 'W8N2';

		if (!creep.memory.disableAI) {

			const workRoom = creep.memory.workRoom;

			if (creep.ticksToLive <= 2) {
				creep.drop(RESOURCE_ENERGY);
				creep.say('☠️');
			}

			if (creep.memory.working === undefined) {
				creep.memory.working = false;
			}
			
			if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
				creep.memory.working = false;
				creep.say('🔼');
			}
			if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
				creep.memory.working = true;
				creep.say('🏗️');
			}

			if (creep.pos.x == 49)
				creep.move(LEFT);
			if (creep.pos.x == 0)
				creep.move(RIGHT);
			if (creep.pos.y == 49)
				creep.move(TOP);
			if (creep.pos.y == 0)
				creep.move(BOTTOM);

			if (creep.store.getFreeCapacity() >= (creep.getActiveBodyparts(WORK) * 5) && creep.memory.working == false) {

						const tombstones = creep.room.find(FIND_TOMBSTONES);
						const containersWithEnergy = creep.room.find(FIND_STRUCTURES, {
							filter: (i) => (i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_STORAGE) && i.store[RESOURCE_ENERGY] > 0
						});
						const droppedPiles = creep.room.find(FIND_DROPPED_RESOURCES);
						let resourceList = containersWithEnergy.concat(droppedPiles);
						resourceList = tombstones.concat(resourceList);

						const target = creep.pos.findClosestByRange(resourceList);
		
						if (target) {
							if (creep.pickup(target) == ERR_NOT_IN_RANGE || creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
								creep.moveTo(target, { visualizePathStyle: { stroke: '#ffff00', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
							} else {
								switch (target.structureType) {
									case STRUCTURE_CONTAINER:
									case STRUCTURE_STORAGE:
										creep.withdraw(target, RESOURCE_ENERGY);
										break;
									default:
										creep.pickup(target);
										break;
								}
							}
						} else {
							creep.harvestEnergy();
						}
						creep.memory.working = true;
					
					
				
			} else if (creep.store.getUsedCapacity() !== 0 && creep.memory.working) {

				if (creep.room.name !== workRoom)
					creep.moveTo(Game.getObjectById(Game.rooms[workRoom].memory.objects.controller[0]), { visualizePathStyle: { stroke: '#ffff00', opaciy: 0.3, ignroeCreeps: true } });
				else {
					let targets = Game.rooms[workRoom].find(FIND_CONSTRUCTION_SITES);
					if (targets.length) {
						targets = creep.pos.findClosestByRange(targets);
						if (creep.build(targets) == ERR_NOT_IN_RANGE) {
							creep.moveTo(targets, { visualizePathStyle: { stroke: '#0000ff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
						}
					}
				}
			}
		}
		else {
			console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
		}
	}
};

module.exports = roleRemoteBuilder;