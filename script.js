{
    init: function(elevators, floors) {
        console.clear(); 

        // Initialize variables for each elevator's queues
        var queues = [];
        for (var i = 0; i < elevators.length; i++) {
            queues[i] = {
                internal: [],
                external: []
            };
        }

        // Process the next destination for a given elevator
        function processNextDestination(elevator, queue) {
            if (queue.internal.length > 0) {
                elevator.goToFloor(queue.internal.shift());
            } else if (queue.external.length > 0) {
                elevator.goToFloor(queue.external.shift());
            } else {
                elevator.goToFloor(0);
            }
        }

        // Add external calls to the appropriate elevator's queue
        floors.forEach(function(floor) {
            floor.on("up_button_pressed down_button_pressed", function() {
                var minDist = Number.MAX_VALUE;
                var closestElevator;
                queues.forEach(function(queue, i) {
                    var dist = elevators[i].destinationQueue.length + queue.external.length;
                    if (dist < minDist) {
                        minDist = dist;
                        closestElevator = i;
                    }
                });
                var queue = queues[closestElevator];
                if (!queue.external.includes(floor.floorNum())) {
                    queue.external.push(floor.floorNum());
                }
                if (elevators[closestElevator].destinationQueue.length === 0) {
                    processNextDestination(elevators[closestElevator], queue);
                }
            });
        });

        // Process the next destination for each elevator when it becomes idle
        elevators.forEach(function(elevator, i) {
            elevator.on("idle", function() {
                var queue = queues[i];
                processNextDestination(elevator, queue);
            });
        });

        // Add a floor to the appropriate elevator's internal queue when a customer presses a button inside the elevator
        elevators.forEach(function(elevator, i) {
            elevator.on("floor_button_pressed", function(floorNum) {
                var queue = queues[i];
                if (!queue.internal.includes(floorNum)) {
                    queue.internal.push(floorNum);
                }
                if (elevator.destinationQueue.length === 0) {
                    processNextDestination(elevator, queue);
                }
            });
        });

        // Stop at a floor if an elevator is passing a floor where a stop is needed
        elevators.forEach(function(elevator, i) {
            elevator.on("passing_floor", function(floorNum, direction) {
                var queue = queues[i];
                if (queue.internal.includes(floorNum)) {
                    elevator.goToFloor(floorNum, true);
                }
            });
        });
    },

    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}
