Spawn.prototype.spawnDismantler = function (maxEnergy) {
	
	Game.spawns.Spawn1.spawnCreep([MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK], 'RAWRR', { memory: { role: 'warrior', roleForQuota: 'warrior', homeRoom: 'W13N34', attackRoom: 'W12N35', rallyPoint: 'Flag1', customAttackTarget: '6564d33314d1181713f3e657' } })
	
	Game.spawns.Spawn1.spawnCreep([MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, WORK], 'RBguy', {memory: {role: 'remotebuilder', roleForQuota: 'remotebuilder', homeRoom: 'W13N34', rallyPoint: 'W13N33', workRoom: 'W13N33'}})
}

Spawn.prototype.spawnWarrior = function (creepName, targetRoom, waypoints = false, maxEnergy = false) {
	
	if (!validateRoomName(targetRoom)) return 'Invalid roomname provided.';
	if (!validateFlagName(waypoints)) return 'Invalid waypoints provided.';

	const baseBody = [MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK];

	const result = this.spawnCreep(baseBody, creepName, { memory: { role: 'warrior', roleForQuota: 'warrior', homeRoom: this.room.name, attackRoom: targetRoom, rallyPoint: waypoints } });
	return this.room.link() + 'Spawning warrior (target: ' + targetRoom + ')... RESULT CODE: ' + result;
}

Spawn.prototype.spawnHarvester = function (targetRoom, name) {
	const result = this.spawnCreep([CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK], name, { memory: { role: 'harvester', homeRoom: targetRoom, rallyPoint: targetRoom } });
	return '[' + this.room.name + ']: Spawning harvester (home: ' + targetRoom + ')... RESULT CODE: ' + result;
}
Spawn.prototype.spawnClaimer = function (claimRoom) {

	const homeRoom = this.room.name;

	this.spawnCreep([MOVE, CLAIM], 'Claimer', { memory: { role: 'claimer', roleForQuota: 'claimer', homeRoom: homeRoom, claimRoom: claimRoom } });

	return '[' + this.room.name + ']: Spawning claimer (home: ' + homeRoom + ') (claim: ' + claimRoom + ')';
}
Spawn.prototype.determineBodyparts = function (creepRole, maxEnergy = false) {
	
	switch (creepRole) {
		case 'reserver':
		
			break;
		case 'rebooter':
		
			break;
		case 'harvester':
		
			break;
		case 'upgrader':
		
			break;
		case 'builder':
		
			break;
		case 'collector':
		
			break;
		case 'repairer':
		
			break;
		case 'ranger':
		
			break;
		case 'warrior':
		
			break;
		case 'runner':

			const maxCarryCost = Math.ceil(maxEnergy / 3 * 2);
			const maxMoveCost = Math.floor(maxEnergy / 3);
			const maxCarryParts = maxCarryCost / 50;
			const maxMoveParts = maxMoveCost / 50;

			let currCarryCost = 0;
			let currMoveCost = 0;
			//let segmentCost = _.sum(segment, s => BODYPART_COST[s]);
			const locality = this.room.memory.data.logisticalPairs[this.room.memory.data.pairCounter][3];
			const pathLen = this.room.memory.data.logisticalPairs[this.room.memory.data.pairCounter][5];
			const carryParts = (Math.ceil(Math.ceil(pathLen / 5) * 5) * 2 / 5) + 1;
			const moveParts = Math.ceil(carryParts / 2);
			
			let bodyArray = [];
			for (let i = carryParts; i > 0; i--) {
				if (currCarryCost < maxCarryCost) {
					bodyArray.push(CARRY);
					currCarryCost += 50;
				}
			}
			for (let i = moveParts; i > 0; i--) {
				if (currMoveCost < maxMoveCost) {
					bodyArray.push(MOVE);
					currMoveCost += 50;
				}
			}

			const partCost = currCarryCost + currMoveCost;

			if (locality == 'remote') {
				let isEven = carryParts.length % 2;
				if (isEven == 0) {
					if (maxEnergy - partCost >= 150) {
						bodyArray.push(WORK);
						bodyArray.push(MOVE);
					}
				} else {
					if (maxEnergy - partCost >= 100)
						bodyArray.push(WORK);
					}
			}
			return bodyArray;
			
		case 'healer':
		
			break;
		case 'remotelogistician':
		
			break;
		case 'remoteharvester':
		
			break;
		case 'remoterunner':
		
			break;
		case 'remotebuilder':
		
			break;
		case 'remoteguard':
		
			break;
		case 'crane':
		
			break;
		case 'miner':
		
			break;
		case 'scientist':
		
			break;
		case 'claimer':
		
			break;
		case 'provider':
		
			break;
		case 'scout':
		
			break;
	}
}