const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const networkCanvas = document.getElementById( "networkCanvas" );
networkCanvas.width = 300;

const Visualizerr = new Visualizer();

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width/2,carCanvas.width*0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI", maxSpeed = 3);
const traffic=[
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-500,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-500,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-700,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-700,30,50,"DUMMY",2),
];

const N = 1000;
const cars = generateCars(N);
let bestCar = cars[0];

if (localStorage.getItem("bestBrain")) {
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"))
        if (i != 0) {
            NeuralNetwork.mutate(cars[i].brain, 0.3);
        }
    }
}

animate();

function save() {
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
    console.log("best Brain saved ");
}

function discard() {
    localStorage.removeItem("bestBrain")
}

function generateCars(N) {
    const cars = [];
    for (let i = 0; i < N; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"))
    }
    return cars
}

function refresh() {
    document.location.reload(true)
}

function damagedCarsCheck(cars) {
    let damagedCarsCount = 0
    for (const element of cars) {
        if (element.damaged) {
            damagedCarsCount++;
        }
    }
    if (damagedCarsCount >= cars.length - 30) {
        console.log("all cars are dead")
        damagedCarsCount = 0;
        refresh();
    }
}

function animate(time) {
    damagedCarsCheck(cars)

    for(let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }

    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);
    }

    bestCar = cars.find(c => c.y === Math.min(...cars.map(c => c.y)));
    save()

    car.update(road.borders, traffic);

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);

    road.draw(carCtx);
    for(let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx, "black");
    }

    carCtx.globalAlpha = 0.2;

    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx, "blue");
    }

    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, "blue", true);

    carCtx.restore();

    networkCtx.lineDashOffset = time/50;
    Visualizerr.drawNetwork(networkCtx, bestCar.brain)

    requestAnimationFrame(animate);
}