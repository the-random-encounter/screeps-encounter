const roleClaimer = {

	run: function (creep) {

		const room = creep.room;
		const cMem = creep.memory;
		const rMem = room.memory;
		const pos = creep.pos;

		if (cMem.disableAI === undefined) cMem.disableAI = false;
		if (cMem.rallyPoint === undefined) cMem.rallyPoint = 'none';
		if (cMem.claimRoomName === undefined)	cMem.claimRoomName = 'define me';

		if (!cMem.disableAI) {

			if (cMem.rallyPoint == 'none') {

				if (pos.x == 49) creep.move(LEFT);
				else if (pos.x == 0) creep.move(RIGHT);
				else if (pos.y == 49) creep.move(TOP);
				else if (pos.y == 0) creep.move(BOTTOM);

				if (cMem.claimFlag === undefined) cMem.claimFlag = 'none';

				const claimRoom = cMem.claimRoomName;

				if (room.name !== claimRoom) {
					if (creep.store.getUsedCapacity() == 0 && creep.getActiveBodyparts(CARRY) > 0) {
						const storage = Game.rooms[cMem.homeRoom].storage;
						if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.moveTo(storage);						
					} else {
						if (!pos.isNearTo(Game.flags.ClaimPoint1)) creep.moveTo(Game.flags.ClaimPoint1, { visualizePathStyle: { stroke: '#00ff00', opacity: 0.3, lineStyle: 'undefined' } });
						else cMem.waypointOneReached = true;
					}
				} else {
					if (creep.claimController(room.controller) == ERR_NOT_IN_RANGE)
						creep.moveTo(room.controller, { visualizePathStyle: { stroke: '#00ff00', opacity: 0.3, lineStyle: 'undefined' } });
				}
			} else { // I HAVE A RALLY POINT, LET'S BOOGY!
				const rally = Game.flags[cMem.rallyPoint];
				if (pos.isNearTo(rally)) cMem.rallyPoint = 'none';
				else creep.moveTo(rally, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
			}
		}	else {
			if (!Memory.globalSettings.alertDisabled)
				console.log('[' + room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
		}
	}
}

module.exports = roleClaimer;