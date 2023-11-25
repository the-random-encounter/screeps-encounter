
// BEGIN: Creep role definition
const roleRemoteLogistician = {

	run: function (creep) {
		
		const room = creep.room;
		const cMem = creep.memory;
		const rMem = room.memory;
		const pos = creep.pos;
		const targetWorkRoom = rMem.data.remoteWorkRoom;
		const remoteLogs = rMem.data.remoteLogistics[targetWorkRoom];

		if (cMem.disableAI === undefined) cMem.disableAI = false;
		if (cMem.rallyPoint === undefined) cMem.rallyPoint = 'none';
		if (cMem.destPos === undefined) cMem.destPos = remoteLogs.logisticsTarget;
		if (cMem.destRoom === undefined) cMem.destRoom = remoteLogs.roomName;
		if (cMem.storage === undefined) Memory.rooms[cMem.homeRoom].objects.storage[0];
		if (remoteLogs.waypoints !== undefined) cMem.remoteWaypoints = remoteLogs.waypoints;

		if (!cMem.disableAI) {
			if (cMem.rallyPoint == 'none') {
				if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) { // I have no energy
					// Search local room for dropped resources, excluding any that the creep created
					let droppedPiles = room.find(FIND_DROPPED_RESOURCES);
					if (droppedPiles.length > 0) {
						const index = droppedPiles.findIndex((i) => { return i.id === cMem.ignorePile });
						droppedPiles.splice(index, 1);
						droppedPiles = droppedPiles.sort((a, b) => b.amount - a.amount);
						if (creep.pickup(droppedPiles[0]) === ERR_NOT_IN_RANGE)
							creep.moveTo(droppedPiles[0], { visualizePathStyle: { stroke: '#ffffff', opacity: 0.5, lineStyle: 'dotted', ignoreCreeps: true } });
					} else {
						// No dropped resources, if we're at home room just fill from storage (typically at spawn time)
						if (creep.room.name === cMem.homeRoom) {
							const homeStorage = Game.getObjectById(cMem.storage);
							if (homeStorage) {
								if (creep.withdraw(homeStorage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE)
									creep.moveTo(homeStorage, { visualizePathStyle: { stroke: '#ffffff', opacity: 0.5, lineStyle: 'dotted', ignoreCreeps: true } });
							}
						}
					}
				} else { // I have energy
					// Go to target room position from memory
					const targetPosition = new RoomPosition(cMem.destPos[0], cMem.destPos[1], cMem.destRoom); 
					if (pos.isEqualTo(targetPosition)) {
						// When there, transfer energy (to creeps, or to container, or just dump it on the ground)
						const workerCreeps = pos.findInRange(FIND_MY_CREEPS, 3, { filter: (i) => i.getActiveBodyparts(WORK) > 0 });
						if (workerCreeps.length > 0) {
							const result = creep.transfer(workerCreeps[0], RESOURCE_ENERGY);
							console.log(result);
							if (result == ERR_NOT_IN_RANGE) {
								creep.moveTo(workerCreeps[0]);
								const result2 = creep.transfer(workerCreeps[0], RESOURCE_ENERGY);
								console.log(result2);
								if (result2 == ERR_NOT_IN_RANGE) {
								
									const containers = pos.findInRange(FIND_STRUCTURES, 3, { filter: { structureType: STRUCTURE_CONTAINER } });
									if (containers.length > 0)
										creep.transfer(containers[0], RESOURCE_ENERGY);
									else {
										creep.drop(RESOURCE_ENERGY);
										const myPile = targetPosition.pos.findInRange(FIND_DROPPED_RESOURCES, 1);
										cMem.ignorePile = myPile[0].id;
									}
								}
							}
						}
					} else // If the creep is not at the target position, move towards it
						creep.moveTo(targetPosition, { visualizePathStyle: { stroke: '#ffffff', opacity: 0.5, lineStyle: 'dotted', ignoreCreeps: true } });
				} // end of primary logic
			} else { // I HAVE A RALLY POINT, LET'S BOOGY!
				const rally = Game.flags[cMem.rallyPoint];
				if (pos.isNearTo(rally)) cMem.rallyPoint = 'none';
				else creep.moveTo(rally, { visualizePathStyle: { stroke: '#ffffff', opacity: 0.5, lineStyle: 'dotted', ignoreCreeps: true } });
			}
		} else { // MY AI IS DISABLED, DURRRRR..... *drools*
			if (!Memory.globalSettings.alertDisabled)
				console.log('[' + room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
    }
	}
};

module.exports = roleRemoteLogistician;
// END: Creep role definition