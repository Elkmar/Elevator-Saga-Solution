{
    init: function(elevators, floors) {
        console.clear();
        var elevator = elevators[0]; // Let's use the first elevator

        var internalQueue = [];
        var externalQueue = [];

        function processNextDestination() {
            if (internalQueue.length > 0) {
                elevator.goToFloor(internalQueue.shift());
            } else if (externalQueue.length > 0) {
                elevator.goToFloor(externalQueue.shift());
            } else {
                elevator.goToFloor(2);
            }
        }

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

        elevator.on("floor_button_pressed", function(floorNum) {
            if (!internalQueue.includes(floorNum)) {
                internalQueue.push(floorNum);
            }
            if (elevator.destinationQueue.length === 0) {
                processNextDestination();
            }
        });

    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}
