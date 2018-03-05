import {Car, Point, Ride} from "./Car";
import {readData, RidesData} from "./DataParser";
export class DriveSimulation{
    private inputData: RidesData;

    private rideSelectFunction: (car: Car, step: number) => Ride;
    private center: Point  = new Point(0,0);

    constructor(private inputFileName: string){
        this.inputData = readData(inputFileName);
        console.log("START ",inputFileName );
        this.initSimulation();
    }
    private fleet: Array<Car>;
    public writeOutput(): string {
        return this.fleet.map((car) => `${car.finishedRides.length} ${car.finishedRides.join(' ')}`).join('\n');
    }
    private initSimulation() {
        // this.inputData.rides.forEach((ride) =>{
        //     this.center.x += ride.start.x;
        //     this.center.y += ride.start.y;
        // });
        // this.center.x/=this.inputData.rides.length;
        // this.center.y/=this.inputData.rides.length;
        //
        // // this.inputData.rides.sort((a: Ride, b: Ride) => a.start.distanceTo(this.center) - b.start.distanceTo(this.center));
        // this.inputData.rides = this.inputData.rides.filter((ride: Ride) => (
        //     (Math.abs(ride.start.x - this.center.x) * Math.abs(ride.start.x - this.center.x)
        //         + Math.abs(ride.start.y - this.center.y) * Math.abs(ride.start.y - this.center.y)
        //         < this.inputData.R/7 * this.inputData.R/7)
        //     && (Math.abs(ride.finish.x - this.center.x) * Math.abs(ride.finish.x - this.center.x)
        //     + Math.abs(ride.finish.y - this.center.y) * Math.abs(ride.finish.y - this.center.y)
        //     < this.inputData.R/7 * this.inputData.R/7))
        // );
        const start = new  Date();
        this.fleet = new Array(this.inputData.F);
        if(this.inputData.B > 5){
            this.rideSelectFunction = this.getRideWithBonus;}
        else {
            this.rideSelectFunction = this.getRide;
        }
        for( let i =0; i < this.fleet.length; i++) {
            this.fleet[i] = new Car(i);
        }
        for (let step = 0; step < this.inputData.T; step ++) {
            if(step % 1000 === 0) {
                this.inputData.rides = this.inputData.rides.filter((ride) => ride.open);
                // console.log("STREP ",this.inputFileName, step,this.inputData.rides.length);
            }
            this.tick(step);
        }
        console.log(`TIME: ${(new Date().valueOf()  - start.valueOf())/1000} seconds ${this.inputFileName}`)
    }
    private tick(step: number): void {
        for (const car of this.fleet){
            if(car.state === "idle"){
                // magic
                const  ride = this.rideSelectFunction(car, step);
                if(!ride) continue;
                car.setRide(ride);
            }
            car.tick(step);
        }
    }
    private setRideV1(car: Car, tick: number): Ride {
        return this.inputData.rides.shift();
    }
    private getRide(car: Car, step: number): Ride {
        const validRides = this.inputData.rides.filter((ride: Ride): boolean =>{
            if(!ride.open || ride.finished || step > ride.endTime) return false;
            const distanceToStart = car.getDistance(ride.start);
            const distanceToFinish = distanceToStart + ride.rideLength;
            return ride.startTime <= distanceToStart + step && distanceToFinish + step < ride.endTime;
        });
        validRides.sort((a: Ride, b: Ride) => a.endTime - b.endTime || b.rideLength - a.rideLength || car.getDistance(a.start) - car.getDistance(b.start) );
        return validRides[0];
    }

    private getRideWithBonus(car: Car, step: number): Ride{
        const validRides = this.inputData.rides.filter((ride: Ride) =>{
            if(!ride.open || ride.finished || step > ride.endTime) return false;
            const distanceToStart = car.getDistance(ride.start);
            const distanceToFinish = distanceToStart + ride.rideLength;
            return ride.startTime === distanceToStart + step && distanceToFinish + step < ride.endTime;
        });
        if(!validRides.length) return this.getRide(car,step);
        validRides.sort((a: Ride, b: Ride) => car.getDistance(a.start) - car.getDistance(b.start) || b.rideLength - a.rideLength);
        return validRides[0];
    }

}