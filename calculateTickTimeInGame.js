"use strict";
// Tick length calculation by Kamots 17 januari 2019
// Provides global.tickTime as seconds
global.calcTickTime = function(tickSamples = 1000) { // Call this from 1st line of main loop. Can adjust samples used for calculation from there.
    let millis = Date.now();

    if (typeof Memory.tickStats == "undefined") Memory.tickStats = {};
    // Set some sane defaults
    if (typeof Memory.tickStats.lastTickMillis == "undefined") Memory.tickStats.lastTickMillis = millis - 1010;
    if (typeof Memory.tickStats.lastTickTime == "undefined") Memory.tickStats.lastTickTime = 1.01;
    if (typeof Memory.tickStats.tickTimeCount == "undefined") Memory.tickStats.tickTimeCount = 0;
    if (typeof Memory.tickStats.tickTimeTotal == "undefined") Memory.tickStats.tickTimeTotal = 0;
    
    let lastTickMillis = Number(Memory.tickStats.lastTickMillis);
    let tickTimeCount = Number(Memory.tickStats.tickTimeCount);
    let tickTimeTotal = Number(Memory.tickStats.tickTimeTotal);

    if (tickTimeCount >= (tickSamples-1)) {
        tickTimeTotal += millis - lastTickMillis;
        tickTimeCount++;
        global.tickTime = (tickTimeTotal / tickTimeCount) / 1000;
        console.log("Calculated tickTime as", global.tickTime, "from", tickTimeCount, "samples.");
        Memory.tickStats.lastTickTime = global.tickTime;
        Memory.tickStats.tickTimeTotal = millis - lastTickMillis;
        Memory.tickStats.tickTimeCount = 1;
        Memory.tickStats.lastTickMillis = millis;
    } else { 
        global.tickTime = Number(Memory.tickStats.lastTickTime);
        tickTimeTotal += millis - lastTickMillis;
        Memory.tickStats.tickTimeTotal = tickTimeTotal;
        tickTimeCount++;
        Memory.tickStats.tickTimeCount = tickTimeCount;
        Memory.tickStats.lastTickMillis = millis;
    }
    return 'Done';
}