const roleProvider = {

	run: function (creep) {

		const room = creep.room;
		const cMem = creep.memory;
		const rMem = room.memory;
		const pos = creep.pos;

		if (cMem.disableAI === undefined) cMem.disableAI = false;
		if (cMem.rallyPoint === undefined) cMem.rallyPoint = 'none';

		if (!cMem.disableAI) {
			
			if (cMem.rallyPoint == 'none') {
				
				if (pos.x == 49) creep.move(LEFT);
				else if (pos.x == 0) creep.move(RIGHT);
				else if (pos.y == 49) creep.move(TOP);
				else if (pos.y == 0) creep.move(BOTTOM);

				if (creep.store.getUsedCapacity() == 0) {

					const tombstones = room.find(FIND_DROPPED_RESOURCES);
					const closestTomb = pos.findClosestByRange(tombstones);

					if (creep.pickup(closestTomb, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
						creep.moveTo(closestTomb, { visualizePathStyle: { stroke: '#ff0033', opacity: 0.3, lineStyle: 'dotted' } });
			
					if (room.name !== 'E58S51')	creep.moveTo(Game.flags.NorthExit, { visualizePathStyle: { stroke: '#ff0033', opacity: 0.3, lineStyle: 'dotted' } });
					else {
						const storage = Game.getObjectById('6530e110fb12195485fc0a2a');
						if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)	creep.moveTo(storage, { visualizePathStyle: { stroke: '#ff0033', opacity: 0.3, lineStyle: 'dotted' } });
					}
			
				} else {
					if (room.name !== 'E5948') creep.moveTo(Game.flags.Attack, { visualizePathStyle: { stroke: '#ff0033', opacity: 0.3, lineStyle: 'dotted' } })
					else {
						if (pos.x !== 21 && pos.y !== 25)	creep.moveTo(Game.flags.Attack, { visualizePathStyle: { stroke: '#ff0033', opacity: 0.3, lineStyle: 'dotted' } });
						else creep.drop(RESOURCE_ENERGY);
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

module.exports = roleProvider;