const roleScout = {

	run: function (creep) {
		
		if (creep.memory.disableAI === undefined) creep.memory.disableAI = false;
		if (creep.memory.homeRoom === undefined) creep.memory.homeRoom = creep.room.name;
		if (creep.memory.scoutList === undefined) creep.memory.scoutList = [];
		if (creep.memory.compiledList === undefined) creep.memory.compiledList = false;
		if (creep.memory.rallyPoint === undefined) creep.memory.rallyPoint = 'none';
		
		if (!creep.memory.disableAI) {

			if (creep.memory.rallyPoint == 'none') {

				if (creep.pos.x == 49) creep.move(LEFT);
				else if (creep.pos.x == 0) creep.move(RIGHT);
				else if (creep.pos.y == 49) creep.move(TOP);
				else if (creep.pos.y == 0) creep.move(BOTTOM);
				
				let scoutArray = [];
			
				for (let i = 0; i < Memory.colonies[creep.memory.homeRoom].exitRooms.length; i++) {
					const theRoom = Memory.colonies[creep.memory.homeRoom].exitRooms[i];
					scoutArray.push(theRoom);
				}
				creep.memory.scoutList = scoutArray;
				creep.memory.compiledList = true;

				if (creep.memory.compiledList) {
					if (creep.memory.targetRoom === undefined) creep.memory.targetRoom = creep.memory.scoutList[0];
				
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
			} else { // I HAVE A RALLY POINT, LET'S BOOGY!
				const rally = Game.flags[cMem.rallyPoint];
				if (pos.isNearTo(rally)) cMem.rallyPoint = 'none';
				else creep.moveTo(rally, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
			}
		}	else {
			if (!Memory.globalSettings.alertDisabled)
				console.log('[' + room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
		}
	}
};

module.exports = roleScout;