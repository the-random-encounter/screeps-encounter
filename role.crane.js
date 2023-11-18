const roleCrane = {
    
    run: function (creep) {
        
        if (creep.memory.disableAI === undefined)
            creep.memory.disableAI = false;

        if (!creep.memory.disableAI) {

            if (!creep.memory.link)
                creep.memory.link = creep.room.memory.data.linkRegistry.central;
            if (!creep.memory.storage)
                creep.memory.storage = creep.room.memory.objects.storage[0];
            if (!creep.memory.terminal && creep.room.memory.objects.terminal[0])
                creep.memory.terminal = creep.room.memory.objects.terminal[0];
            if (!creep.memory.destination && creep.room.memory.data.linkRegistry.destination)
                creep.memory.destination = creep.room.memory.data.linkRegistry.destination;
            if (!creep.memory.atCraneSpot === undefined)
                creep.memory.atCraneSpot = false;
            if (creep.memory.upgrading == true && creep.store.getUsedCapacity() == 0) {
                creep.memory.upgrading = false;
            }

            const objLink = Game.getObjectById(creep.memory.link);
            const objStorage = Game.getObjectById(creep.memory.storage);
            const objTerminal = Game.getObjectById(creep.memory.terminal);
            const objDestination = Game.getObjectById(creep.memory.destination);

            let craneSpot;
            if (creep.room.name == 'E58S51') {
                craneSpot = [39, 7];
            } else if (creep.room.name == 'W23N35') {
                craneSpot = [25, 22];
            }

            if (!creep.memory.atCraneSpot) {
                if (creep.pos.x !== craneSpot[0] || creep.pos.y !== craneSpot[1]) {
                    creep.moveTo(new RoomPosition(craneSpot[0], craneSpot[1], creep.room.name));
                } else {
                    creep.memory.atCraneSpot = true;
                    //console.log('crane at spot');
                }
            }

            if (creep.memory.atCraneSpot == true) {
                if (creep.store.getFreeCapacity() == 0 && creep.memory.dropLink == false) {
                    //console.log('full inventory, droplink false');
                    const resTypes = Object.keys(creep.store);
        
                    for (let types in resTypes) {

                        if (creep.store[types] !== 'energy')
                            creep.transfer(objStorage, types)
                    }
                }

                if (creep.memory.dropLink == true) {
                    //console.log('droplink true');
                    creep.transfer(objStorage, RESOURCE_ENERGY)
                    creep.say('🎇');
                    creep.memory.dropLink = false;
                    creep.memory.upgrading = false;
                    return;
                } else if (creep.memory.xferDest == true) {
                    creep.transfer(objLink, RESOURCE_ENERGY);
                    creep.say('🎆');
                    creep.memory.xferDest = false;
                    creep.memory.upgrading = false;
                    objLink.transferEnergy(objDestination);
                    return;
                } else if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0 && creep.memory.upgrading == false) {
                    //console.log('free energy capacity is zero, upgrading is false');
                    creep.transfer(objStorage, RESOURCE_ENERGY);
                    creep.say('🎇');
                } else {
                    if (objLink.store[RESOURCE_ENERGY] >= 30) {
                        //console.log('link store >= 30');
                        if (creep.withdraw(objLink, RESOURCE_ENERGY) == OK) {
                            creep.say('⚡');
                            creep.memory.dropLink = true;
                            creep.memory.upgrading = false;
                            return;
                        }
                    } else if (objTerminal.store.getUsedCapacity() > 0 && Object.keys(objTerminal.store).length > 1) {
                        //console.log('terminal used capacity > 0 and multiple resource types in terminal');
                        if (creep.store[RESOURCE_ENERGY] > 0) {
                            //console.log('crane energy store > 0')
                            creep.transfer(objStorage, RESOURCE_ENERGY)
                            creep.say('🎇');
                            creep.memory.upgrading = false;
                            return;
                        } else if (creep.store.getFreeCapacity() == 0) {
                            //console.log('crane free capacity = 0');
                            const resourceTypes = Object.keys(objTerminal.store);
                            for (let i = 0; i < resourceTypes.length; i++) {
                                if (resourceTypes[i] !== 'energy') {
                                    creep.say('🧮');
                                    creep.transfer(objStorage, resourceTypes[i]);
                                    creep.memory.upgrading = false;
                                    return;
                                }
                            }
                        } else {
                            //console.log('withdrawing remaining terminal resource types');
                            const resourceTypes = Object.keys(objTerminal.store);
                            for (let i = 0; i < resourceTypes.length; i++) {
                                if (resourceTypes[i] !== 'energy') {
                                    creep.withdraw(objTerminal, resourceTypes[i]);
                                    creep.say('🧮');
                                    creep.memory.upgrading = false;
                                    return;
                                }
                            }
                        }
                    } else if ((creep.room.memory.settings.flags.craneUpgrades) && (creep.memory.upgrading == false)) {
                        if (creep.store.getUsedCapacity() == 0) {
                            creep.withdraw(objStorage, RESOURCE_ENERGY);
                            creep.say('⚡');
                            creep.memory.upgrading = true;
                        } else {
                            creep.upgradeController(creep.room.controller)
                        }
                    } else if (objDestination && objDestination.store.getFreeCapacity() >= objLink.store.getUsedCapacity() && objLink.cooldown == 0) {
                        if (creep.store.getFreeCapacity() > 0) {
                            console.log('crane: getting energy for C2D xfer');
                            creep.withdraw(objStorage, RESOURCE_ENERGY);
                            creep.say('⚡');
                            creep.memory.xferDest = true;
                        }
                    }
                
                }
            }
        } else {
            console.log('[' + creep.room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
            creep.say('AI Disabled');
        }        
    }
}

module.exports = roleCrane;