const roleClaimer = {

	run: function (creep) {

		const room = creep.room;
		const cMem = creep.memory;
		const rMem = room.memory;
		const pos = creep.pos;
		

		if (cMem.disableAI === undefined) cMem.disableAI = false;
		if (cMem.rallyPoint === undefined) cMem.rallyPoint = 'none';
		if (cMem.claimRoom === undefined) {
			if (rMem.data.claimRoom)
				cMem.claimRoom = rMem.data.claimRoom;
		}
		const workRoom = rMem.data.remoteWorkRoom;
		

		if (cMem.workRoom === undefined) cMem.workRoom = workRoom;
			
		const remoteLogs = Memory.rooms[cMem.homeRoom].data.remoteLogistics[cMem.workRoom];

		//const waypoints = remoteLogs.waypoints;
		if (cMem.remoteWaypoints === undefined) {
			if (remoteLogs.waypoints.length > 0)
				cMem.remoteWaypoints = remoteLogs.waypoints;
			else cMem.remoteWaypoints = 'none';
		}

		if (!cMem.disableAI) {

			if (cMem.rallyPoint == 'none') {

				if (creep.getActiveBodyparts(CARRY) > 0) {
					const storage = Game.rooms[cMem.homeRoom].storage;
					if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.moveTo(storage);
				} else {
					
					if (cMem.remoteWaypoints !== 'none') {
						if (cMem.remoteWaypoints.length == 0) cMem.remoteWaypoints = 'none';
						else if (!pos.isNearTo(Game.flags[cMem.remoteWaypoints[0]])) creep.moveTo(Game.flags[cMem.remoteWaypoints[0]], { visualizePathStyle: { stroke: '#00ff00', opacity: 0.3, lineStyle: 'undefined' } });
						else {
							if (cMem.remoteWaypoints.length > 1)
								creep.moveTo(Game.flags[cMem.remoteWaypoints[1]], { visualizePathStyle: { stroke: '#00ff00', opacity: 0.3, lineStyle: 'undefined' } });
							console.log(creep.name + ': Reached waypoint \'' + cMem.remoteWaypoints[0] + '\'');
							const nextWaypoint = cMem.remoteWaypoints.shift();
							console.log(nextWaypoint);
							if (nextWaypoint === 'undefined') {
								delete cMem.remoteWaypoints;
								cMem.remoteWaypoints = 'none';
							}
						}
					} else {

						if (pos.x == 49) creep.move(LEFT);
						else if (pos.x == 0) creep.move(RIGHT);
						else if (pos.y == 49) creep.move(TOP);
						else if (pos.y == 0) creep.move(BOTTOM);

						const claimRoom = cMem.claimRoom;

						if (room.name !== claimRoom) {							
								if (!pos.isNearTo(Game.flags[claimRoom])) creep.moveTo(Game.flags[claimRoom], { visualizePathStyle: { stroke: '#00ff00', opacity: 0.3, lineStyle: 'undefined' } });				
						} else {
							if (creep.claimController(room.controller) == ERR_NOT_IN_RANGE)
								creep.moveTo(room.controller, { visualizePathStyle: { stroke: '#00ff00', opacity: 0.3, lineStyle: 'undefined' } });
							if (!room.controller.sign || room.controller.sign.username !== 'randomencounter')
								creep.signController(room.controller, 'There\'s no place like 127.0.0.1');
						}
					}
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

module.exports = roleClaimer;