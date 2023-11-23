const roleRanger = {

	/** @param {Creep} creep **/
	run: function (creep) {

		const room = creep.room;
		const cMem = creep.memory;
		const rMem = room.memory;
		const pos = creep.pos;

		if (cMem.disableAI === undefined) cMem.disableAI = false;
		if (cMem.rallyPoint === undefined) cMem.rallyPoint = 'none';
		if (cMem.attackRoom === undefined) cMem.attackRoom = room.name;
		
		if (!cMem.disableAI) {

			if (cMem.rallyPoint == 'none') {

				if (creep.ticksToLive <= 2) creep.say('☠️');
				if (room.name !== cMem.attackRoom) creep.moveTo(Game.flags.Attack);

				if (pos.x == 49) creep.move(LEFT);
				else if (pos.x == 0) creep.move(RIGHT);
				else if (pos.y == 49) creep.move(TOP);
				else if (pos.y == 0) creep.move(BOTTOM);

				const hostiles = room.find(FIND_HOSTILE_CREEPS);
				const target = pos.findClosestByRange(hostiles);
			
				if (target) {
					if (creep.rangedAttack(target) == ERR_NOT_IN_RANGE)
						creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.5, lineStyle: 'undefined' } });
				} else {

					let structures = room.find(FIND_HOSTILE_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });

					if (!structures) structures = room.find(FIND_HOSTILE_STRUCTURES);

					const target = pos.findClosestByRange(structures);

					if (target) {
						if (creep.rangedAttack(target) == ERR_NOT_IN_RANGE)
							creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000', opacity: 0.5, lineStyle: 'undefined' } });
					}
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
}

module.exports = roleRanger;