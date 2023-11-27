const roleRemoteRunner = {

	run: function (creep) {

		const room = creep.room;
		const cMem = creep.memory;
		const rMem = room.memory;
		const pos = creep.pos;

		if (cMem.disableAI === undefined) cMem.disableAI = false;
		if (cMem.rallyPoint === undefined) cMem.rallyPoint = 'none';
		if (cMem.outpostRoom === undefined) cMem.outpostRoom = Game.rooms[cMem.homeRoom].memory.outposts.roomList[HEAP_MEMORY.outpostCounter];
		
		const homeRoom = Game.rooms[cMem.homeRoom];

		if (!cMem.disableAI) {
		
			if (cMem.rallyPoint == 'none') {

				if (creep.pos.x == 49) creep.move(LEFT);
				else if (creep.pos.x == 0) creep.move(RIGHT);
				else if (creep.pos.y == 49) creep.move(TOP);
				else if (creep.pos.y == 0) creep.move(BOTTOM);

				if (creep.ticksToLive <= 2)
					creep.say('☠️');

				if (!cMem.container) {
					cMem.container = rMem.outposts.aggContainerList[rMem.outposts.aggContainerAssigned];
					rMem.outposts.aggContainerAssigned++;
					if (rMem.outposts.aggContainerAssigned >= rMem.outposts.aggContainerList.length) rMem.outposts.aggContainerAssigned = 0;
				}
				if (!cMem.dropOff) cMem.dropOff = homeRoom.storage.id;

				if (creep.store[RESOURCE_ENERGY] == 0) {
					const target = Game.getObjectById(cMem.container);
				
					if (target) {
						if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.moveTo(target, { visualizePathStyle: { stroke: '#880088', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
					} else {
						if (creep.room.name !== cMem.outpostRoom)
							creep.moveTo(Game.flags[cMem.outpostRoom], { visualizePathStyle: { stroke: '#880088', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
					}
				}
			
				if (creep.store.getUsedCapacity() !== 0) {
					const target = Game.getObjectById(cMem.dropOff);
					if (target) {
						if (pos.isNearTo(target)) {
							if (target.store.getFreeCapacity(RESOURCE_ENERGY) > 0) creep.transfer(target, RESOURCE_ENERGY);
						}
						else {
							const roadUnderCreep = room.find(FIND_STRUCTURES, { filter: (i) => (i.structureType == STRUCTURE_ROAD && i.pos.x == pos.x && i.pos.y == pos.y && i.hits !== i.hitsMax) })
							if (roadUnderCreep.length > 0) creep.repair(roadUnderCreep[0]);
							else creep.moveTo(target, { visualizePathStyle: { stroke: '#880088', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
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
    } else {
      if (!Memory.globalSettings.alertDisabled)
        console.log('[' + room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
      creep.say('💤');
    }
	}
}

module.exports = roleRemoteRunner;