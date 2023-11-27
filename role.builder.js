const roleBuilder = {

  /** @param {Creep} creep **/
  run: function(creep) {

    const room = creep.room;
    const cMem = creep.memory;
    const rMem = room.memory;
    const pos = creep.pos;
    
    if (cMem.disableAI === undefined) cMem.disableAI = false;
    if (cMem.rallyPoint === undefined) cMem.rallyPoint = 'none';
    
    if (!cMem.disableAI) {
		  
      if (cMem.rallyPoint === 'none') {
        if (creep.ticksToLive <= 2) {
          creep.drop(RESOURCE_ENERGY);
          creep.say('☠️');
        }

        if (cMem.working && creep.store[RESOURCE_ENERGY] == 0) {
          cMem.working = false;
          creep.say('🔼');
        }
        if (!cMem.working && creep.store.getFreeCapacity() == 0) {
          cMem.working = true;
          creep.say('🏗️');
        }

        if (creep.pos.x == 49) creep.move(LEFT);
				else if (creep.pos.x == 0) creep.move(RIGHT);
				else if (creep.pos.y == 49) creep.move(TOP);
				else if (creep.pos.y == 0) creep.move(BOTTOM);
      
        if (creep.store.getUsedCapacity() == 0) {
    
          switch (Memory.rooms[cMem.homeRoom].settings.flags.centralStorageLogic || false) {
            case true: {
            
              const droppedPiles = room.find(FIND_DROPPED_RESOURCES);
              const containersWithEnergy = room.find(FIND_STRUCTURES, { filter: (i) => ((i.structureType == STRUCTURE_STORAGE || i.structureType == STRUCTURE_CONTAINER) && i.store[RESOURCE_ENERGY] > 0) } );
              const targets = droppedPiles.concat(containersWithEnergy);
              let target = pos.findClosestByRange(targets);

              if (target) {
                if (creep.pickup(target) == ERR_NOT_IN_RANGE || creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                  creep.moveTo(target, { visualizePathStyle: { stroke: '#0000ff', opacity: 0.3, lineStyle: 'dotted' } });
                else creep.withdraw(target, RESOURCE_ENERGY);
              }
              break;
            }
              
            default:
            case false: {
            
              const outboxes = rMem.settings.containerSettings.outboxes;
              if (outboxes && outboxes.length > 0) {

                let boxes = [];

                for (let i = 0; i < outboxes.length; i++) {
                  const boxObj = Game.getObjectById(outboxes[i]);
                  boxes.push(boxObj);
                }
                
                if (boxes.length > 1)
                  boxes.sort((a, b) => b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY]);

                let closestBox = boxes[0];
              
                if (creep.withdraw(closestBox, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.moveTo(closestBox, { visualizePathStyle: { stroke: '#0000ff', opacity: 0.3, lineStyle: 'dotted' } })
              } else {
                    
                let droppedPiles = room.find(FIND_DROPPED_RESOURCES);
                const target = droppedPiles[0];
                
                if (target) {
                  if (creep.pickup(target) == ERR_NOT_IN_RANGE || creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.moveTo(target, { visualizePathStyle: { stroke: '#0000ff', opacity: 0.3, lineStyle: 'dotted' } });
                  else {
                    
                    switch (target.structureType) {
                      case STRUCTURE_CONTAINER:
                      case STRUCTURE_STORAGE:
                        creep.withdraw(target, RESOURCE_ENERGY);
                        break;
                      default:
                        creep.pickup(target);
                        break;
                    }
                  }
                }
                break;
              }
            }
          }
        } else {
        
          let cSites = room.find(FIND_MY_CONSTRUCTION_SITES);
          if (rMem.settings.flags.sortConSites)
            cSites = cSites.sort((a, b) => b.progress - a.progress);
          
          let target;
          if (rMem.settings.flags.closestConSites)
            target = pos.findClosestByRange(cSites);
          else
            target = cSites[0];

          if (target) {
            if (creep.build(target) == ERR_NOT_IN_RANGE) creep.moveTo(target, { visualizePathStyle: { stroke: '#0000ff', opacity: 0.5, lineStyle: 'dotted', ignoreCreeps: true } });
          } else {
            let basics = [];
            let ramparts = [];
            let walls = [];
            let validTargets = [];
            const rampartsMax = Memory.rooms[cMem.homeRoom].settings.repairSettings.repairRampartsTo;
            const wallsMax = Memory.rooms[cMem.homeRoom].settings.repairSettings.repairWallsTo;
					
            if (Memory.rooms[cMem.homeRoom].settings.flags.repairBasics) {
              basics = room.find(FIND_STRUCTURES, {
                filter: (i) => (i.hits < i.hitsMax) && (i.structureType !== STRUCTURE_WALL || i.structureType !== STRUCTURE_RAMPART)/*(i.structureType ==
                  STRUCTURE_TOWER || i.structureType == STRUCTURE_SPAWN || i.structureType == STRUCTURE_EXTENSION || i.structureType == STRUCTURE_ROAD || i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_EXTRACTOR || i.structureType == STRUCTURE_LAB || i.structureType == STRUCTURE_LINK || i.structureType == STRUCTURE_STORAGE || i.structureType == STRUCTURE_TERMINAL)*/ } );
              validTargets = validTargets.concat(basics);
            }
					
            // add ramparts to the repair list, based on room flag & room max repair limit
            if (Memory.rooms[cMem.homeRoom].settings.flags.repairRamparts) {
              ramparts = room.find(FIND_STRUCTURES, { filter: (i) => ((i.structureType == STRUCTURE_RAMPART) && ((i.hits / i.hitsMax * 100) <= rampartsMax)) });
              validTargets = validTargets.concat(ramparts);
            }

            // add walls to the repair list, based on room flag & room max repair limit
            if (Memory.rooms[cMem.homeRoom].settings.flags.repairWalls) {
              walls = room.find(FIND_STRUCTURES, { filter: (i) => ((i.structureType == STRUCTURE_WALL) && ((i.hits / i.hitsMax * 100) <= wallsMax)) })
              validTargets = validTargets.concat(walls);
            }

            validTargets = validTargets.sort((a, b) => a.hits - b.hits);

            if (validTargets.length > 0) {
              if (creep.repair(validTargets[0]) == ERR_NOT_IN_RANGE) creep.moveTo(validTargets[0], { visualizePathStyle: { stroke: '#0000ff', opacity: 0.5, lineStyle: 'dotted', ignoreCreeps: true } });
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
    } else {
      if (!Memory.globalSettings.alertDisabled)
        console.log('[' + room.name + ']: WARNING: Creep ' + creep.name + '\'s AI is disabled.');
      creep.say('💤');
    }
  }
};

module.exports = roleBuilder;