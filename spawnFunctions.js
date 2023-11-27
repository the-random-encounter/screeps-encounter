Spawn.prototype.spawnDismantler = function (maxEnergy) {
	
	Game.spawns.Spawn1.spawnCreep([MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK], 'RAWRR', { memory: { role: 'warrior', roleForQuota: 'warrior', homeRoom: 'W13N34', rallyPoint: 'W13N33', customAttackTarget: '6050a493210d07b5d7fd9247' } })
	
	Game.spawns.Spawn1.spawnCreep([MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, WORK], 'RBguy', {memory: {role: 'remotebuilder', roleForQuota: 'remotebuilder', homeRoom: 'W13N34', rallyPoint: 'W13N33', workRoom: 'W13N33'}})
}

Spawn.prototype.spawnWarrior = function (maxEnergy) {
	
	const baseBody = [MOVE, ATTACK];


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
			const locality = this.room.memory.data.logisticalPairs[this.room.memory.data.pairCounter][3];
			const pathLen = this.room.memory.data.logisticalPairs[this.room.memory.data.pairCounter][5];
			const carryParts = (Math.ceil(Math.ceil(pathLen / 5) * 5) * 2 / 5) + 1;
			const moveParts = Math.ceil(carryParts / 2);
			const partCost = (carryParts * 50) + (moveParts * 50);
			let bodyArray = [];
			for (let i = carryParts; i > 0; i--) bodyArray.push(CARRY);
			for (let i = moveParts; i > 0; i--) bodyArray.push(MOVE);
			if (locality == 'remote') {
				let isEven = carryParts.length % 2;
				if (isEven == 0) {
					bodyArray.push(WORK);
					bodyArray.push(MOVE);
				} else {
					bodyArray.push(WORK);
				}
			}
			console.log(bodyArray);
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