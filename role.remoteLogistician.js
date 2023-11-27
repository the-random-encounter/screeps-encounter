
// BEGIN: Creep role definition
const roleRemoteLogistician = {

	run: function (creep) {
		
		const room = creep.room;
		const cMem = creep.memory;
		const rMem = room.memory;
		const pos = creep.pos;
		const workRoom = rMem.data.remoteWorkRoom;
		const remoteLogs = Memory.rooms[cMem.homeRoom].data.remoteLogistics[workRoom];

		if (cMem.disableAI === undefined) cMem.disableAI = false;
		if (cMem.rallyPoint === undefined) cMem.rallyPoint = remoteLogs.waypoints;
		if (cMem.destPos === undefined) cMem.destPos = remoteLogs.logisticsTarget;
		if (cMem.destRoom === undefined) cMem.destRoom = rMem.data.remoteWorkRoom;
		if (cMem.homeStorage === undefined) cMem.homeStorage = room.storage.id;
		if (cMem.intialEnergy === undefined) cMem.intialEnergy = false;

		if (!cMem.disableAI) {

			if (cMem.intialEnergy == false) {
				const homeStorage = Game.getObjectById(cMem.homeStorage);
				if (homeStorage) {
					const result = creep.withdraw(homeStorage, RESOURCE_ENERGY)
					switch (result) {
						case ERR_NOT_IN_RANGE:
							creep.moveTo(homeStorage, { visualizePathStyle: { stroke: '#ffffff', opacity: 0.5, lineStyle: 'dotted', ignoreCreeps: true } });
							break;
						case OK:
							cMem.initialEnergy = true;
							break;
					}
				}
			} else {
				if (cMem.rallyPoint == 'none') {
					if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) { // I have no energy
						// Search local room for dropped resources, excluding any that the creep created
						if (cMem.customTarget) {
							const cTarget = Game.getObjectById(cMem.customTarget);

							if (creep.withdraw(cTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
								creep.moveTo(cTarget, { visualizePathStyle: { stroke: '#ffffff', opacity: 0.5, lineStyle: 'dotted', ignoreCreeps: true } });
						} else {
							let droppedPiles = room.find(FIND_DROPPED_RESOURCES);
							if (droppedPiles.length > 0) {
								if (cMem.ignorePile) {
									const index = droppedPiles.findIndex((i) => { return i.id === cMem.ignorePile });
									droppedPiles.splice(index, 1);
								}
								droppedPiles = droppedPiles.sort((a, b) => b.amount - a.amount);
								if (creep.pickup(droppedPiles[0]) === ERR_NOT_IN_RANGE)
									creep.moveTo(droppedPiles[0], { visualizePathStyle: { stroke: '#ffffff', opacity: 0.5, lineStyle: 'dotted', ignoreCreeps: true } });
							} else {
								// No dropped resources, if we're at home room just fill from storage (typically at spawn time)
								if (creep.room.name === cMem.homeRoom) {
									const homeStorage = Game.getObjectById(cMem.homeStorage);
									if (homeStorage) {
										if (creep.withdraw(homeStorage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE)
											creep.moveTo(homeStorage, { visualizePathStyle: { stroke: '#ffffff', opacity: 0.5, lineStyle: 'dotted', ignoreCreeps: true } });
									}
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
								if (result == ERR_NOT_IN_RANGE) {
									creep.moveTo(workerCreeps[0], { visualizePathStyle: { stroke: '#ffffff', opacity: 0.5, lineStyle: 'dotted' } });
									creep.transfer(workerCreeps[0], RESOURCE_ENERGY);
								}
							} else {
								const containers = pos.findInRange(FIND_STRUCTURES, 3, { filter: { structureType: STRUCTURE_CONTAINER } });
								if (containers.length > 0) {
									if (creep.transfer(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
										creep.moveTo(containers[0], { visualizePathStyle: { stroke: '#ffffff', opacity: 0.5, lineStyle: 'dotted', ignoreCreeps: true } })
									else {
										creep.drop(RESOURCE_ENERGY);
										const myPile = pos.findInRange(FIND_DROPPED_RESOURCES, 2);
										cMem.ignorePile = myPile[0].id;
									}
								}
							}
						} else // If the creep is not at the target position, move towards it
							creep.moveTo(targetPosition, { visualizePathStyle: { stroke: '#ffffff', opacity: 0.5, lineStyle: 'dotted', ignoreCreeps: true } });
					} // end of primary logic				
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
			}
		} else { // MY AI IS DISABLED, DURRRRR..... *drools*
			if (!Memory.globalSettings.alertDisabled)
				console.log('[' + room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('💤');
    }
	}
};

module.exports = roleRemoteLogistician;
// END: Creep role definition