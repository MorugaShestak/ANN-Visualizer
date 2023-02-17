class Sensor {
    constructor(object, rayCount, rayLenght, raySpread) {
        // Init object that will use sensors
        this.object = object;

        // Init basic sensor characteristic
        this.rayCount = rayCount;
        this.rayLength = rayLenght;
        this.raySpread = raySpread

        // Init arrays for all rays and readings
        this.rays = [];
        this.readings = [];
    }

    // Function get and a point, in x:y format, that shows a coordinates for ray start & end
    #getRaysCoordinates() {
        this.rays.clear()

        for(let i = 0; i < this.rayCount; i++) {
            const rayAngle = lerp(this.raySpread/2, -this.raySpread/2, i/(this.rayCount-1))
            const start = {
                x: this.object.x,
                y: this.object.y,
            };
            const end = {
                x: start.x - Math.sin(rayAngle) * this.rayLength,
                y: start.y - Math.cos(rayAngle) * this.rayLength,
            };

            this.rays.push([start, end])
        }
    }

    draw(context) {
        for(let i = 0; i < this.rayCount; i++) {
            let end = this.rays[i][1];
        }
    }
}
