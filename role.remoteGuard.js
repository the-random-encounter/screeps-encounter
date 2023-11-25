const roleRemoteGuard = {

	/** @param {Creep} creep **/
	run: function (creep) {

		const room = creep.room;
		const cMem = creep.memory;
		const rMem = room.memory;
		const pos = creep.pos;

		if (cMem.disableAI === undefined) cMem.disableAI = false;
		if (cMem.outpostRoom === undefined) cMem.outpostRoom = Game.rooms[cMem.homeRoom].memory.outposts.roomList[HEAP_MEMORY.outpostCounter];
		if (cMem.rallyPoint === undefined) cMem.rallyPoint = 'none';

		const outpostRoom = cMem.outpostRoom;

		if (!cMem.disableAI) {
			if (creep.ticksToLive <= 2)	creep.say('☠️');
			
			if (cMem.rallyPoint == 'none') {
				
				if (pos.x == 49) creep.move(LEFT);
				else if (pos.x == 0) creep.move(RIGHT);
				else if (pos.y == 49) creep.move(TOP);
				else if (pos.y == 0) creep.move(BOTTOM);

				if (room.name !== outpostRoom) {
					creep.moveTo(Game.flags[outpostRoom], { visualizePathStyle: { stroke: '#ff0000', opacity: 0.3, lineStyle: 'undefined', ignoreCreeps: true } });
				} else {
					const hostiles = room.find(FIND_HOSTILE_CREEPS);
					if (hostiles.length > 0) {
						const target = pos.findClosestByRange(hostiles);
						if (creep.attack(target) == ERR_NOT_IN_RANGE)
							creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.3, lineStyle: 'undefined', ignoreCreeps: true } });
					} else {
						if (!pos.isNearTo(Game.flags[outpostRoom]))
							creep.moveTo(Game.flags[outpostRoom], { visualizePathStyle: { stroke: '#ff0000', opacity: 0.3, lineStyle: 'undefined', ignoreCreeps: true } });
					}
				}
			} else { // I HAVE A RALLY POINT, LET'S BOOGY!
				const rally = Game.flags[cMem.rallyPoint];
				if (pos.isNearTo(rally)) cMem.rallyPoint = 'none';
				else creep.moveTo(rally, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.3, lineStyle: 'undefined', ignoreCreeps: true } });
			}
		} else {
			if (!Memory.globalSettings.alertDisabled)
				console.log('[' + room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
		}
	}
}

module.exports = roleRemoteGuard;