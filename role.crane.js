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
                if (!cMem.storage) cMem.storage = rMem.objects.storage[0];
                //if (!cMem.terminal && rMem.objects.terminal[0]) cMem.terminal = rMem.objects.terminal[0];
                if (!cMem.destination && rMem.data.linkRegistry.destination) cMem.destination = rMem.data.linkRegistry.destination;
                if (!cMem.atCraneSpot === undefined) cMem.atCraneSpot = false;
                if (cMem.upgrading == true && creep.store.getUsedCapacity() == 0) cMem.upgrading = false;

                const objLink = Game.getObjectById(cMem.link);
                const objStorage = Game.getObjectById(cMem.storage);
                const objTerminal = Game.getObjectById(cMem.terminal);
                const objDestination = Game.getObjectById(cMem.destination);

                let craneSpot = rMem.data.craneSpot;
            

                if (!cMem.atCraneSpot) {
                    if (pos.x !== craneSpot[0] || pos.y !== craneSpot[1]) {
                        creep.moveTo(new RoomPosition(craneSpot[0], craneSpot[1], room.name));
                    } else {
                        cMem.atCraneSpot = true;
                        //console.log('crane at spot');
                    }
                }

                if (cMem.atCraneSpot == true) {
                    if (creep.store.getFreeCapacity() == 0 && cMem.dropLink == false) {
                        //console.log('full inventory, droplink false');
                        const resTypes = Object.keys(creep.store);
        
                        for (let types in resTypes) {

                            if (creep.store[types] !== 'energy')
                                creep.transfer(objStorage, types)
                        }
                    }

                    if (cMem.dropLink == true) {
                        //console.log('droplink true');
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
                        //console.log('free energy capacity is zero, upgrading is false');
                        creep.transfer(objStorage, RESOURCE_ENERGY);
                        creep.say('🎇');
                    } else {
                        if (objLink.store[RESOURCE_ENERGY] >= 30) {
                            //console.log('link store >= 30');
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
                            } else {
                                creep.upgradeController(room.controller)
                            }
                        } else if (objDestination && objDestination.store.getFreeCapacity() >= objLink.store.getUsedCapacity() && objLink.cooldown == 0) {
                            if (creep.store.getFreeCapacity() > 0) {
                                //console.log('crane: getting energy for C2D xfer');
                                creep.withdraw(objStorage, RESOURCE_ENERGY);
                                creep.say('⚡');
                                cMem.xferDest = true;
                            }
                        }
                    }
                }
            } else { // I HAVE A RALLY POINT, LET'S BOOGY!
				const rally = Game.flags[cMem.rallyPoint];
				if (pos.isNearTo(rally)) cMem.rallyPoint = 'none';
				else creep.moveTo(rally, { visualizePathStyle: { stroke: '#00ffff', opacity: 0.3, lineStyle: 'dotted', ignoreCreeps: true } });
			}
		} else { // MY AI IS DISABLED, DURRRRR..... *drools*
			if (!Memory.globalSettings.alertDisabled)
				console.log('[' + room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
			creep.say('AI Disabled');
        } 
    }
}

module.exports = roleCrane;