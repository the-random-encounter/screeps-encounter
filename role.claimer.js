const roleClaimer = {

	run: function (creep) {

		if (creep.memory.disableAI === undefined) {
			creep.memory.disableAI = false;
		}

		if (creep.memory.claimRoomName === undefined) {
			creep.memory.claimRoomName = 'define me';
		}

		if (!creep.memory.disableAI) {

			if (creep.memory.claimFlag === undefined) {
				creep.memory.claimFlag = 'none';
			}

			const claimRoom = creep.memory.claimRoomName;

			if (creep.room.name !== claimRoom) {
				/*if (creep.memory.claimFlag !== 'none' && !creep.memory.claimFlag !== undefined) {
					let to = new RoomPosition(25, 25, 'E59S48');
					let from = new RoomPosition(creep.pos.x, creep.pos.y, creep.pos.roomName);

					// Use `findRoute` to calculate a high-level plan for this path,
					// prioritizing highways and owned rooms
					let allowedRooms = { [ from.roomName ]: true };
					const route = Game.map.findRoute(from.roomName, to.roomName, {
							routeCallback(roomName) {
									let parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
									let isHighway = (parsed[1] % 10 === 0) || 
																	(parsed[2] % 10 === 0);
									let isMyRoom = Game.rooms[roomName] &&
											Game.rooms[roomName].controller &&
											Game.rooms[roomName].controller.my;
									if (isHighway || isMyRoom) {
											return 1;
									} else {
											return 2.5;
									}
							}
					}).forEach(function(info) {
							allowedRooms[info.room] = true;
					});

					// Invoke PathFinder, allowing access only to rooms from `findRoute`
					let ret = PathFinder.search(from, to, {
							roomCallback(roomName) {
									if (allowedRooms[roomName] === undefined) {
											return false;
									}
							}
					});
					if (creep.room.name = creep.memory.homeRoom) {
						creep.moveTo(new RoomPosition(25, 25, 'E59S48'), {visualizePathStyle: {stroke: '#00ff00', opacity: 0.3, lineStyle: 'undefined'}});
					} else {
						console.log(ret.path);
						if (ret.length > 0) {
							console.log('Now heading to room ' + route[0].room);
							const exit = creep.pos.findClosestByPath(route[0].exit);
							creep.moveTo(exit, {visualizePathStyle: {stroke: '#00ff00', opacity: 0.3, lineStyle: 'undefined'}});
						}
					}
				}*/

				if (creep.memory.waypointTwoReached !== undefined) {
					creep.moveTo(Game.flags.ClaimFlag, {visualizePathStyle: {stroke: '#00ff00', opacity: 0.3, lineStyle: 'undefined'}});
				} else {
					if (creep.memory.waypointOneReached !== undefined) {
						if (!creep.pos.isNearTo(Game.flags.ClaimPoint2))
							creep.moveTo(Game.flags.ClaimPoint2, {visualizePathStyle: {stroke: '#00ff00', opacity: 0.3, lineStyle: 'undefined'}});
						else
							creep.memory.waypointTwoReached = true;
					} else {
						if (creep.store.getUsedCapacity() == 0 && creep.getActiveBodyparts(CARRY) > 0) {
							if (creep.memory.gotBoosted === undefined) {
								const lab = Game.getObjectById('653943a3ab148e155d563b71')
								if (!creep.pos.isNearTo(lab))
									creep.moveTo(lab)
								else {
									lab.boostCreep(creep, 25)
									creep.memory.gotBoosted = true;
								}
							} else {
								const storage = Game.getObjectById('6530e110fb12195485fc0a2a');

								if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
									creep.moveTo(storage);
							}
						} else {
							if (!creep.pos.isNearTo(Game.flags.ClaimPoint1))
								creep.moveTo(Game.flags.ClaimPoint1, { visualizePathStyle: { stroke: '#00ff00', opacity: 0.3, lineStyle: 'undefined' } });
							else {
								creep.memory.waypointOneReached = true;
							}
						}
					}
				}
			} else {

				if (creep.pos.x == 49)
					creep.move(7);
				else if (creep.pos.x == 0)
					creep.move(3);
				else if (creep.pos.y == 49)
					creep.move(1);
				else if (creep.pos.y == 0)
					creep.move(5);
				else {
					if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
						creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#00ff00', opacity: 0.3, lineStyle: 'undefined'}});
					}
				}
			}
		} else {
			creep.say('AI Disabled');
		}
	}
}

module.exports = roleClaimer;