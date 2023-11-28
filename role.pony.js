const rolePony = {

	run: function (creep) {
		
		const room = creep.room;
		const cMem = creep.memory;
		const rMem = room.memory;
		const pos = creep.pos;

		if (cMem.disableAI === undefined) cMem.disableAI = false;
		if (cMem.rallyPoint === undefined) cMem.rallyPoint = 'none';
		if (cMem.passengerName === undefined) cMem.passengerName = 'none';
		if (cMem.waypoints === undefined) cMem.waypoints = 'none;'
		if (cMem.reachedPassenger === undefined) cMem.reachedPassenger = false;

		if (!cMem.disableAI) {

			if (cMem.rallyPoint == 'none') {

				if (cMem.passengerName !== 'none') {
					
					const passenger = Game.creeps[passengerName];

					if (cMem.reachedPassenger == false) {
						if (!pos.isNearTo(passenger)) {
							creep.moveTo(passenger, { visualizePathStyle: { stroke: '#00ff00', opacity: 0.3, lineStyle: 'undefined' } });
						} else cMem.reachedPassenger = true;
					}

					if (pos.isNearTo(passenger)) {
						if (cMem.waypoints instanceof Array) {
							if (cMem.waypoints.length == 1 && pos.isNearTo(Game.flags[cMem.waypoints[0]])) cMem.waypoints = 'none';
							else if (!pos.isNearTo(Game.flags[cMem.waypoints[0]])) creep.moveTo(Game.flags[cMem.waypoints[0]], { visualizePathStyle: { stroke: '#00ff00', opacity: 0.3, lineStyle: 'undefined' } });
							else {
								if (cMem.waypoints.length > 1)
									creep.moveTo(Game.flags[cMem.waypoints[1]], { visualizePathStyle: { stroke: '#00ff00', opacity: 0.3, lineStyle: 'undefined' } });
								console.log(creep.name + ': Reached waypoint \'' + cMem.waypoints[0] + '\'');
								const nextWaypoint = cMem.waypoints.shift();
								if (nextWaypoint === 'undefined') {
									delete cMem.waypoints;
									cMem.waypoints = 'none';
								}
							}
						} else {
							const rally = Game.flags[cMem.waypoints];
							if (pos.isNearTo(rally)) {
								console.log(creep.name + ': Reached rally point \'' + cMem.waypoints + '\'');
								cMem.waypoints = 'none';
							}
							else creep.moveTo(rally, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
						}
					} else {
						creep.pull(passenger);
						const randFace = Math.floor(Math.random * 10) + 1;
						switch (randFace) {
							case 1:
								creep.say('😖');
								break;
							case 2:
								creep.say('🥴');
								break;
							case 3:
								creep.say('😭');
								break;
							case 4:
								creep.say('😓');
								break;
							case 5:
								creep.say('🥵');
								break;
							case 6:
								creep.say('💦');
								break;
							case 7:
								creep.say('😰');
								break;
							case 8:
								creep.say('😬');
								break;
							case 9:
								creep.say('😳');
								break;
							case 10:
								creep.say('🤬');
								break;
							default:
								creep.say('🔣');
								break;
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

module.exports = rolePony;