const roleHealer = {

	/** @param {Creep} creep **/
	run: function (creep) {
		
		const room = creep.room;
		const cMem = creep.memory;
		const rMem = room.memory;
		const pos = creep.pos;

		if (cMem.disableAI === undefined) cMem.disableAI = false;
		if (cMem.attackRoom === undefined) cMem.attackRoom = room.name;
		if (cMem.rallyPoint === undefined) cMem.rallyPoint = 'none';
		if (cMem.customAttackTarget === undefined) cMem.customAttackTarget = 'none';
		if (cMem.squad === undefined) cMem.squad = rMem.data.squads[0];
		if (cMem.subTeam === undefined) cMem.subTeam = 'healers';
		
		if (!cMem.disableAI) {

			if (cMem.rallyPoint == 'none') {
			
				if (creep.pos.x == 49) creep.move(LEFT);
				else if (creep.pos.x == 0) creep.move(RIGHT);
				else if (creep.pos.y == 49) creep.move(TOP);
				else if (creep.pos.y == 0) creep.move(BOTTOM);
				
				if (creep.ticksToLive <= 2) creep.say('☠️');
				
				if (Memory.rooms[cMem.homeRoom].data.attackSignal == true) {
					const target = pos.findClosestByRange(FIND_MY_CREEPS, { filter: (object) => object.memory.squad == cMem.squad && object.memory.subTeam == 'combatants' });
				
					if (target) {
						creep.moveTo(target, { visualizePathStyle: { stroke: '#00ff00', opacity: 0.5, lineStyle: 'undefined', ignoreCreeps: true } });
						if (pos.isNearTo(target)) {
							if (target.hits < target.hitsMax) creep.heal(target);
						}
						else {
							if (target.hits < target.hitsMax) creep.rangedHeal(target);
							creep.moveTo(target);
						}
					} else {
						const secondaryTarget = pos.findClosestByRange(FIND_MY_CREEPS, { filter: (object) => object.memory.squad == cMem.squad && (object.memory.subTeam == 'combatants' || object.memory.subTeam == 'healers') });

						if (secondaryTarget) {
							creep.moveTo(secondaryTarget, { visualizePathStyle: { stroke: '#00ff00', opacity: 0.5, lineStyle: 'undefined', ignoreCreeps: true } });
							if (pos.isNearTo(secondaryTarget)) {
								if (secondaryTarget.hits < secondaryTarget.hitsMax) creep.heal(secondaryTarget);
							}
							else {
								if (secondaryTarget.hits < secondaryTarget.hitsMax) creep.rangedHeal(secondaryTarget);
							}
						}
					}
				} else {
					const musterFlag = cMem.squad + '-muster';
					if (!pos.isNearTo(Game.flags[musterFlag]))
						creep.moveTo(Game.flags[musterFlag], { visualizePathStyle: { stroke: '#00ff00', opacity: 0.5, lineStyle: 'undefined', ignoreCreeps: true } });
				}
			} else { // I HAVE A RALLY POINT, LET'S BOOGY!
        if (cMem.rallyPoint instanceof Array) {
          if (cMem.rallyPoint.length == 1 && pos.isNearTo(Game.flags[cMem.rallyPoint[0]])) cMem.rallyPoint = 'none';
          else if (!pos.isNearTo(Game.flags[cMem.rallyPoint[0]])) creep.moveTo(Game.flags[cMem.rallyPoint[0]], { visualizePathStyle: { stroke: '#00ff00', opacity: 0.5, lineStyle: 'undefined' } });
          else {
            if (cMem.rallyPoint.length > 1)
              creep.moveTo(Game.flags[cMem.rallyPoint[1]], { visualizePathStyle: { stroke: '#00ff00', opacity: 0.5, lineStyle: 'undefined' } });
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
					else creep.moveTo(rally, { visualizePathStyle: { stroke: '#00ff00', opacity: 0.5, lineStyle: 'undefined', ignoreCreeps: true } });
				}
			}
		}	else {
			if (!Memory.globalSettings.alertDisabled)
				console.log('[' + room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('💤');
		}
	}
}

module.exports = roleHealer;