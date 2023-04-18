{
    init: function(elevators, floors) {
        console.clear();
        var elevator = elevators[0]; // Let's use the first elevator

        var internalQueue = [];
        var externalQueue = [];

        //if there is internal calls, process them first, then external calls, then go to the ground floor
        function processNextDestination() {
            if (internalQueue.length > 0) {
                elevator.goToFloor(internalQueue.shift());
            } else if (externalQueue.length > 0) {
                elevator.goToFloor(externalQueue.shift());
            } else {
                elevator.goToFloor(0);
            }
        }

        //add external calls to the queue if they are not already there
        floors.forEach(function(floor) {
            floor.on("up_button_pressed down_button_pressed", function() {
                if (!externalQueue.includes(floor.floorNum())) {
                    externalQueue.push(floor.floorNum());
                }
                if (elevator.destinationQueue.length === 0) {
                    processNextDestination();
                }
            });
        });

        elevator.on("idle", function() {
            processNextDestination();
        });

        //if a customer press a button inside the elevator, add the floor to the queue if it's not already there
        elevator.on("floor_button_pressed", function(floorNum) {
            if (!internalQueue.includes(floorNum)) {
                internalQueue.push(floorNum);
            }
            if (elevator.destinationQueue.length === 0) {
                processNextDestination();
            }
        });
        
        //if the elevator is passing a floor where a stop is needed, stop there
        elevator.on("passing_floor", function(floorNum, direction) {
            if (internalQueue.includes(floorNum)) {
                elevator.goToFloor(floorNum, true);
            }
         });


    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}
