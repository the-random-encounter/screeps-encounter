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
					if (typeof Game.rooms[room.name].controller.owner === 'undefined') {
						if (creep.reserveController(room.controller) == ERR_NOT_IN_RANGE) creep.moveTo(room.controller, { visualizePathStyle: { stroke: '#ffffff', opacity: 0.3 } });
					} else if (typeof Game.rooms[room.name].controller.owner === 'object') {
						if (Game.rooms[room.name].controller.owner.username !== 'randomencounter') {
							if (creep.attackController(room.controller) == ERR_NOT_IN_RANGE) creep.moveTo(room.controller, { visualizePathStyle: { stroke: '#ffffff', opacity: 0.3 } });
						}
					}
					if (!room.controller.sign)
						creep.signController(room.controller, 'There\'s no place like 127.0.0.1');
				} else {
					if (Game.flags[cMem.targetRoom]) creep.moveTo(Game.flags[cMem.targetRoom], { visualizePathStyle: { stroke: '#ffffff', opacity: 0.3 } });
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

module.exports = roleReserver;