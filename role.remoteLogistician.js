
// BEGIN: Creep role definition
const roleRemoteLogistician = {

	run: function (creep) {
		
		const room = creep.room;
		const cMem = creep.memory;
		const rMem = room.memory;
		const pos = creep.pos;

		if (cMem.disableAI === undefined) cMem.disableAI = false;
		if (cMem.rallyPoint === undefined) cMem.rallyPoint = 'none';
		if (cMem.destPos === undefined) cMem.destPos = [25, 25];
		if (cMem.destRoom === undefined) cMem.destRoom = 'none';

		if (!cMem.disableAI) {
			if (cMem.rallyPoint == 'none') {
				if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
					// If the creep has free capacity, go to the home storage and gather energy
					const homeStorage = room.storage;
					if (homeStorage) {
						if (creep.withdraw(homeStorage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
							creep.moveTo(homeStorage, { visualizePathStyle: { stroke: '#ffffff', opacity: 0.5, lineStyle: 'dotted', ignoreCreeps: true } });
						}
					}
				} else {
					// If the creep is full, go to the specified room position and transfer energy
					const targetPosition = new RoomPosition(cMem.destPos[0], cMem.destPos[1], cMem.destRoom); // Replace with your desired room position
					if (pos.isEqualTo(targetPosition)) {
						// Look for any worker creeps nearby
						const target = pos.findInRange(FIND_MY_CREEPS, 2, { filter: (i) => i.getActiveBodyparts(WORK) > 0 });
						if (target.length > 0) {
							creep.transfer(target[0], RESOURCE_ENERGY);
						} else {
							const containers = pos.findInRange(FIND_STRUCTURES, 2, { filter: { structureType: STRUCTURE_CONTAINER } });
							if (containers.length > 0) {
								creep.transfer(containers[0], RESOURCE_ENERGY);
							} else {
								creep.drop(RESOURCE_ENERGY);
							}
						}
					} else {
						// If the creep is not at the target position, move towards it
						creep.moveTo(targetPosition, { visualizePathStyle: { stroke: '#ffffff', opacity: 0.5, lineStyle: 'dotted', ignoreCreeps: true } });
					}
				}
			} else { // I HAVE A RALLY POINT, LET'S BOOGY!
				const rally = Game.flags[cMem.rallyPoint];
				if (pos.isNearTo(rally)) cMem.rallyPoint = 'none';
				else creep.moveTo(rally, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
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