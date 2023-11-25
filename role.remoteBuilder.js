const roleRemoteBuilder = {

	/** @param {Creep} creep **/
	run: function(creep) {

		const room = creep.room;
		const cMem = creep.memory;
		const rMem = room.memory;
		const pos = creep.pos;

		if (creep.memory.disableAI === undefined) creep.memory.disableAI = false;
		if (creep.memory.rallyPoint === undefined) creep.memory.rallyPoint = 'none';
		if (creep.memory.workRoom === undefined) {
			if (Memory.rooms[creep.memory.homeRoom].data.remoteWorkRoom !== undefined)
				creep.memory.workRoom = Memory.rooms[creep.memory.homeRoom].data.remoteWorkRoom;
			else
				creep.memory.workRoom = creep.memory.homeRoom;
		}

		if (!creep.memory.disableAI) {

			if (creep.memory.rallyPoint == 'none') {

				const workRoom = creep.memory.workRoom;

				if (creep.ticksToLive <= 2) creep.say('☠️');
				if (creep.store[RESOURCE_ENERGY] == 0) creep.say('🔼');
				if (creep.store.getFreeCapacity() == 0) creep.say('🏗️');

				if (creep.pos.x == 49) creep.move(LEFT);
				else if (creep.pos.x == 0) creep.move(RIGHT);
				else if (creep.pos.y == 49) creep.move(TOP);
				else if (creep.pos.y == 0) creep.move(BOTTOM);

				if (creep.store.getFreeCapacity() >= (creep.getActiveBodyparts(CARRY) * 50)) {

					const tombstones = creep.room.find(FIND_TOMBSTONES);
					const containersWithEnergy = creep.room.find(FIND_STRUCTURES, {
						filter: (i) => (i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_STORAGE) && i.store[RESOURCE_ENERGY] > 0
					});
					const droppedPiles = creep.room.find(FIND_DROPPED_RESOURCES);
					let resourceList = containersWithEnergy.concat(droppedPiles);
					resourceList = tombstones.concat(resourceList);

					const target = creep.pos.findClosestByRange(resourceList);
		
					if (target) {
						if (creep.pickup(target) == ERR_NOT_IN_RANGE || creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
							creep.moveTo(target, { visualizePathStyle: { stroke: '#ffff00', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
					}

				} else if (creep.store.getUsedCapacity() !== 0) {

					if (creep.room.name == workRoom) {
						let targets = room.find(FIND_MY_CONSTRUCTION_SITES);
						if (targets.length) {
							targets = creep.pos.findClosestByRange(targets);
							if (creep.build(targets) == ERR_NOT_IN_RANGE)
								creep.moveTo(targets, { visualizePathStyle: { stroke: '#ffff00', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
						}
					} else
						creep.moveTo(new RoomPosition(25, 25, workRoom), { visualizePathStyle: { stroke: '#ffff00', opaciy: 0.3, ignoreCreeps: true } });
				}
			}	else { // I HAVE A RALLY POINT, LET'S BOOGY!
				const rally = Game.flags[cMem.rallyPoint];
				if (pos.isNearTo(rally)) cMem.rallyPoint = 'none';
				else creep.moveTo(rally, { visualizePathStyle: { stroke: '#ffff00', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
			}
		}	else {
			if (!Memory.globalSettings.alertDisabled)
				console.log('[' + room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
		}
	}
};

module.exports = roleRemoteBuilder;