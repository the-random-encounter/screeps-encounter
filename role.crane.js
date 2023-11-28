const roleCrane = {
	
	run: function (creep) {
		
		const room = creep.room;
		const cMem = creep.memory;
		const rMem = room.memory;
		const pos = creep.pos;

		if (cMem.disableAI === undefined) cMem.disableAI = false;
		if (cMem.rallyPoint === undefined) cMem.rallyPoint = 'none';

		if (!cMem.disableAI) {

			if (cMem.rallyPoint == 'none') {

				if (pos.x == 49) creep.move(LEFT);
				else if (pos.x == 0) creep.move(RIGHT);
				else if (pos.y == 49) creep.move(TOP);
				else if (pos.y == 0) creep.move(BOTTOM);
				
				if (!cMem.link) cMem.link = rMem.data.linkRegistry.central;
				if (!cMem.storage) cMem.storage = room.storage.id;
				if (!cMem.terminal) cMem.terminal = room.terminal.id;
				if (!cMem.destination && rMem.data.linkRegistry.destination) cMem.destination = rMem.data.linkRegistry.destination;
				if (!cMem.atCraneSpot === undefined) cMem.atCraneSpot = false;
				if (cMem.upgrading == true && creep.store.getUsedCapacity() == 0) cMem.upgrading = false;

				const objLink = Game.getObjectById(cMem.link);
				const objStorage = room.storage;
				const objTerminal = room.terminal;
				const objDestination = Game.getObjectById(cMem.destination);

				let craneSpot = rMem.data.craneSpot;

				if (!cMem.atCraneSpot) {
					if (pos.x !== craneSpot[0] || pos.y !== craneSpot[1])
						creep.moveTo(new RoomPosition(craneSpot[0], craneSpot[1], room.name));
					else
						cMem.atCraneSpot = true;
				}

				if (cMem.atCraneSpot == true) {
					if (creep.store.getFreeCapacity() == 0 && cMem.dropLink == false) {
						const resTypes = Object.keys(creep.store);
						for (let types in resTypes) {
							if (creep.store[types] !== 'energy')
								creep.transfer(objStorage, types)
						}
					}

					if (objTerminal && objTerminal.store.getUsedCapacity() > 0) {
						console.log('in the terminal');
						if (creep.store.getUsedCapacity() == 0) {
							const terminalItems = Object.keys(room.terminal.store);
							const energyIndex = terminalItems.indexOf('energy');
							const terminalCommodities = terminalItems.splice(energyIndex, 1);

							console.log('Terminal Items: ' + terminalItems);
							console.log('Terminal Commodities: ' + terminalCommodities);

							creep.withdraw(objTerminal, terminalCommodities[0]);
						} else {
							const craneItems = Object.keys(creep.store);
							const energyIndex = craneItems.indexOf('energy');
							const craneCommodities = craneItems.splice(energyIndex, 1);
							console.log('craneCommodities: ' + craneCommodities);
							const nearbyLabs = pos.findInRange(FIND_STRUCTURES, 2, { filter: { structureType: STRUCTURE_LAB } });
							let labMatch = false;
							for (let i = 0; i < nearbyLabs.length; i++) {
								if (craneCommodities[0] == nearbyLabs[i].mineralType) {
									labMatch = true;
									console.log(labMatch);
									if (nearbyLabs[i].store.getFreeCapacity() > 0)
										creep.transfer(nearbyLabs[i], craneCommodities[0]);
								} else continue;
							}
							if (!labMatch)
								creep.transfer(nearbyLabs[0], craneCommodities[0]);
						}
					} else {
						if (cMem.dropLink == true) {
							creep.transfer(objStorage, RESOURCE_ENERGY)
							creep.say('🎇');
							cMem.dropLink = false;
							cMem.upgrading = false;
							return;
						} else if (creep.store[RESOURCE_ENERGY] > 0 && cMem.xferDest == true) {
							creep.transfer(objLink, RESOURCE_ENERGY);
							creep.say('🎆');
							if (objLink.store[RESOURCE_ENERGY] > 700) {
								cMem.xferDest = false;
								cMem.upgrading = false;
								objLink.transferEnergy(objDestination);
							}
							return;
						} else if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0 && cMem.upgrading == false) {
							creep.transfer(objStorage, RESOURCE_ENERGY);
							creep.say('🎇');
						} else {
							if (objLink.store[RESOURCE_ENERGY] >= 30) {
								if (creep.withdraw(objLink, RESOURCE_ENERGY) == OK) {
									creep.say('⚡');
									cMem.dropLink = true;
									cMem.upgrading = false;
									return;
								}
							} else if ((rMem.settings.flags.craneUpgrades) && (cMem.upgrading == false)) {
								if (creep.store.getUsedCapacity() == 0) {
									creep.withdraw(objStorage, RESOURCE_ENERGY);
									creep.say('⚡');
									cMem.upgrading = true;
								} else
									creep.upgradeController(room.controller)
							} else if (objDestination && objDestination.store.getFreeCapacity() >= objLink.store.getUsedCapacity() && objLink.cooldown == 0) {
								if (creep.store.getFreeCapacity() > 0) {
									creep.withdraw(objStorage, RESOURCE_ENERGY);
									creep.say('⚡');
									cMem.xferDest = true;
								}
							}
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
		} else { // MY AI IS DISABLED, DURRRRR..... *drools*
			if (!Memory.globalSettings.alertDisabled)
				console.log('[' + room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('💤');
		} 
	}
}

module.exports = roleCrane;