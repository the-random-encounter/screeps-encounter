const roleScout = {

	run: function (creep) {
		
		if (creep.memory.disableAI === undefined)
			creep.memory.disableAI = false;
		if (creep.memory.homeRoom === undefined)
			creep.memory.homeRoom = creep.room.name;
		if (creep.memory.scoutList === undefined)
			creep.memory.scoutList = [];
		if (creep.memory.compiledList === undefined)
			creep.memory.compiledList = false;
		
		if (!creep.memory.disableAI) {
			let scoutArray = [];
			
			for (let i = 0; i < Memory.colonies[creep.memory.homeRoom].exitRooms.length; i++) {
				const theRoom = Memory.colonies[creep.memory.homeRoom].exitRooms[i];
				//console.log('theRoom: ' + theRoom);
				scoutArray.push(theRoom);
				//console.log(scoutArray);
				//createRoomFlag(theRoom);
			}
			creep.memory.scoutList = scoutArray;
			creep.memory.compiledList = true;
			//console.log('scoutList: ' + creep.memory.scoutList);

			if (creep.memory.compiledList) {
				if (creep.memory.targetRoom === undefined)
					creep.memory.targetRoom = creep.memory.scoutList[0];
				
				if (creep.pos.x == 49)
					creep.move(7);
				else if (creep.pos.x == 0)
					creep.move(3);
				else if (creep.pos.y == 49)
					creep.move(1);
				else if (creep.pos.y == 0)
					creep.move(5);

				let goToPos = new RoomPosition(25, 25, creep.memory.targetRoom);
				if (creep.memory.scoutList.length > 0 && creep.room.name == creep.memory.targetRoom) {
					if (!creep.room.memory.objects) {
						console.log('SCOUT REPORT: Room [' + creep.room.name + '], caching objects...');
						creep.room.cacheObjects();
					}
					creep.memory.scoutList.shift();
					delete creep.memory.targetRoom;
					delete creep.memory._move;
				}
				else if (creep.room.name !== creep.memory.targetRoom)
					creep.moveTo(goToPos, { visualizePathStyle: { stroke: '#ff00ff', opacity: 0.5, lineStyle: 'undefined', ignoreCreeps: true } });
			}
		}
		else {
			console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
		}
	}
};

module.exports = roleScout;