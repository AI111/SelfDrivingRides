import {Car, Ride} from "./Car";
import * as ProgressBar from "progress"
import {readData, RidesData} from "./DataParser";
export class DriveSimulation{
    private inputData: RidesData;
    private bar: ProgressBar;

    private rideSelectFunction: (car: Car, step: number) => Ride;

    constructor(private inputFileName: string){
        this.inputData = readData(inputFileName);
        // this.bar = new ProgressBar('  download |:bar| :percent', {
        //     complete: '='
        //     , incomplete: ' '
        //     , width: 40
        //     , total: this.inputData.T
        // });
        console.log("START ",inputFileName );
        this.initSimulation();
    }
    private fleet: Array<Car>;
    public writeOutput(): string {
        return this.fleet.map((car) => `${car.finishedRides.length} ${car.finishedRides.join(' ')}`).join('\n');
    }
    private initSimulation() {
        const start = new  Date();
        this.fleet = new Array(this.inputData.F);
        if(this.inputData.B > 5){
            this.rideSelectFunction = this.getRideWithBonus;}
        else {
            this.rideSelectFunction = this.getRide;
        }
        // this.fleet.fill(new Car());
        for( let i =0; i < this.fleet.length; i++) {
            this.fleet[i] = new Car(i);
        }
        for (let step = 0; step < this.inputData.T; step ++) {
            if(step % 1000 === 0) {
                // console.log("STREP ",this.inputFileName, step);
                // this.bar.tick(step);
                this.inputData.rides = this.inputData.rides.filter((ride) => !ride.finished);
            }
            this.tick(step);
        }
        console.log(`TIME: ${(new Date().valueOf()  - start.valueOf())/1000} seconds ${this.inputFileName}`)
    }
    private tick(step: number): void {
        for (const car of this.fleet){
            // if(car.id === 1 || car.id === 0){
            //     console.log(`STEP ${step} CAR: ${car.toString()}`);
            // }
            // console.log(step, this.inputData.rides);

            if(car.state === "idle"){
                // magic
                const  ride = this.rideSelectFunction(car, step);
                if(!ride) continue;
                car.setRide(ride);
            }
            car.tick(step);
        }
        // console.log(` STEP: ${step} ${this.fleet.map((car) => car.toString())}`);
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
        validRides.sort((a: Ride, b: Ride) => car.getDistance(a.start) - car.getDistance(b.start) || b.rideLength - b.rideLength);
        return validRides[0];
    }
    private getRideWithBonus(car: Car, step: number): Ride{
        const validRides = this.inputData.rides.filter((ride: Ride) =>{
            if(!ride.open || ride.finished || step > ride.endTime) return false;
            const distanceToStart = car.getDistance(ride.start);
            const distanceToFinish = distanceToStart + ride.rideLength;
            return ride.startTime === distanceToStart + step && distanceToFinish + step < ride.endTime;
        });
        if(!validRides.length) return this.getRide(car, step);
        validRides.sort((a: Ride, b: Ride) => car.getDistance(a.start) - car.getDistance(b.start) || b.rideLength - b.rideLength);
        return validRides[0];
    }

}