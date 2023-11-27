const roleRemoteBuilder = {

	/** @param {Creep} creep **/
	run: function(creep) {

		const room = creep.room;
		const cMem = creep.memory;
		const rMem = room.memory;
		const pos = creep.pos;
		const workRoom = rMem.data.remoteWorkRoom;
		const remoteLogs = Memory.rooms[cMem.homeRoom].data.remoteLogistics[workRoom];

		if (cMem.initialTravelDone === undefined) cMem.initialTravelDone = false;
		if (cMem.disableAI === undefined) cMem.disableAI = false;
		if (cMem.workRoom === undefined) cMem.workRoom = workRoom;
		if (cMem.rallyPoint === undefined) cMem.rallyPoint = remoteLogs.waypoints;	
	
		if (!cMem.disableAI) {

			if (cMem.rallyPoint == 'none') {

				if (creep.ticksToLive <= 2) creep.say('☠️');
				
				if (pos.x == 49) creep.move(LEFT);
				else if (pos.x == 0) creep.move(RIGHT);
				else if (pos.y == 49) creep.move(TOP);
				else if (pos.y == 0) creep.move(BOTTOM);

				// create RoomPosition of remote target for travel
				const workPosX = Memory.rooms[cMem.homeRoom].data.remoteLogistics[cMem.workRoom].logisticsTarget[0];
				const workPosY = Memory.rooms[cMem.homeRoom].data.remoteLogistics[cMem.workRoom].logisticsTarget[1];
				const workPos = new RoomPosition(workPosX, workPosY, cMem.workRoom);
				
				// if not in workRoom, travel to workRoom RoomPosition
				if (room.name !== cMem.workRoom) creep.moveTo(workPos, { visualizePathStyle: { stroke: '#ffff00', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
				else {
					if (creep.store[RESOURCE_ENERGY] == 0) creep.say('🔼');
					if (creep.store.getFreeCapacity() == 0) creep.say('🏗️');

					if (creep.store.getUsedCapacity() == 0) {

						const tombstones = room.find(FIND_TOMBSTONES, { filter: (i) => i.store[RESOURCE_ENERGY] > 0 });
						const containersWithEnergy = room.find(FIND_STRUCTURES, {
							filter: (i) => (i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_STORAGE) && i.store[RESOURCE_ENERGY] > 0
						});
						const droppedPiles = room.find(FIND_DROPPED_RESOURCES);
						let resourceList = droppedPiles.concat(containersWithEnergy);
						resourceList = tombstones.concat(resourceList);

						const target = pos.findClosestByRange(resourceList);
					
						if (target) {
							if (creep.pickup(target) == ERR_NOT_IN_RANGE || creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
								creep.moveTo(target, { visualizePathStyle: { stroke: '#ffff00', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
						}

					} else if (creep.store.getUsedCapacity() > 0) {
						let targets = room.find(FIND_MY_CONSTRUCTION_SITES);
						if (targets.length) {
							//targets = pos.findClosestByRange(targets);
							if (creep.build(targets[0]) == ERR_NOT_IN_RANGE)
								creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffff00', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
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
};

module.exports = roleRemoteBuilder;