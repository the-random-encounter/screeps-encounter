const roleReserver = {

	run: function (creep) {
	
		const room = creep.room;
		const cMem = creep.memory;
		const rMem = room.memory;
		const pos = creep.pos;

		if (cMem.disableAI === undefined) cMem.disableAI = false;
		if (cMem.homeRoom === undefined) cMem.homeRoom = room.name;
		if (cMem.rallyPoint === undefined) cMem.rallyPoint = 'none';
		if (cMem.targetRoom === undefined) {
			cMem.targetRoom = Game.rooms[cMem.homeRoom].memory.outposts.roomList[HEAP_MEMORY.outpostCounter];
			HEAP_MEMORY.outpostCounter++;
			if (HEAP_MEMORY.outpostCounter >= Game.rooms[cMem.homeRoom].memory.outposts.roomList.length) HEAP_MEMORY.outpostCounter = 0;
		}
		
		if (!cMem.disableAI) {

			if (cMem.rallyPoint == 'none') {

				if (creep.pos.x == 49) creep.move(LEFT);
				else if (creep.pos.x == 0) creep.move(RIGHT);
				else if (creep.pos.y == 49) creep.move(TOP);
				else if (creep.pos.y == 0) creep.move(BOTTOM);
				
				if (room.name == cMem.targetRoom) {
					if (!rMem.objects) room.cacheObjects();
					if (creep.reserveController(room.controller) == ERR_NOT_IN_RANGE) creep.moveTo(room.controller, { visualizePathStyle: { stroke: '#ffffff', opacity: 0.3 } });

				} else {
					if (Game.flags[cMem.targetRoom]) creep.moveTo(Game.flags[cMem.targetRoom], { visualizePathStyle: { stroke: '#ffffff', opacity: 0.3 } });
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

module.exports = roleReserver;