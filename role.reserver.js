const roleReserver = {

	run: function (creep) {
	
		if (creep.memory.disableAI === undefined)
			creep.memory.disableAI = false;
		if (creep.memory.homeRoom === undefined)
			creep.memory.homeRoom = creep.room.name;
		if (creep.memory.rallyFlag === undefined)
			creep.memory.rallyFlag = false;
		if (creep.memory.targetRoom === undefined) {
			creep.memory.targetRoom = Game.rooms[creep.memory.homeRoom].memory.outposts.roomList[HEAP_MEMORY.outpostCounter];
			
			HEAP_MEMORY.outpostCounter++;
			
			if (HEAP_MEMORY.outpostCounter >= Game.rooms[creep.memory.homeRoom].memory.outposts.roomList.length)
				HEAP_MEMORY.outpostCounter = 0;
		}
		
		
		if (!creep.memory.disableAI) {
			if (creep.room.name == creep.memory.targetRoom) {
			
				if (!creep.room.memory.objects) {
					creep.room.cacheObjects();
				}
				if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
					creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff', opacity: 0.3 } });
				}
			} else {
				if (Game.flags[creep.memory.targetRoom])
					creep.moveTo(Game.flags[creep.memory.targetRoom], { visualizePathStyle: { stroke: '#ffffff', opacity: 0.3 } });
			}
		}
		else {
			console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
		}
	}
}

module.exports = roleReserver;