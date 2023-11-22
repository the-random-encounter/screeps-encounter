const roleRemoteGuard = {

	/** @param {Creep} creep **/
	run: function (creep) {

		if (creep.memory.disableAI === undefined) creep.memory.disableAI = false;
		if (creep.memory.outpostRoom === undefined) creep.memory.outpostRoom = Game.rooms[creep.memory.homeRoom].memory.outposts.roomList[HEAP_MEMORY.outpostCounter];
		if (creep.memory.rallyPoint === undefined) creep.memory.rallyPoint = 'none';

		const outpostRoom = creep.memory.outpostRoom;

		if (!creep.memory.disableAI) {
			if (creep.ticksToLive <= 2) {
				creep.drop(RESOURCE_ENERGY);
				creep.say('☠️');
			}
			
			if (creep.memory.rallyPoint == 'none') {
				
				if (creep.room.name !== outpostRoom) {
					creep.moveTo(Game.flags[outpostRoom], { visualizePathStyle: { stroke: '#ff0000', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });

				} else {

					if (creep.pos.x == 49) creep.move(7);
					else if (creep.pos.x == 0) creep.move(3);
					if (creep.pos.y == 0) creep.move(5);
					else if (creep.pos.y == 49) creep.move(1)
					
					const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
		
					if (hostiles.length > 0) {
						const target = creep.pos.findClosestByRange(hostiles);
				
						if (creep.attack(target) == ERR_NOT_IN_RANGE)
							creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.3, lineStyle: 'undefined', ignoreCreeps: true } });
					}
				}
			} else { // I HAVE A RALLY POINT, LET'S BOOGY!
				const rally = Game.flags[creep.memory.rallyPoint];
				if (creep.pos.isNearTo(rally))
					creep.memory.rallyPoint = 'none';
				else
					creep.moveTo(rally, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
			}
		}
		else {
			console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
		}
	}
}

module.exports = roleRemoteGuard;