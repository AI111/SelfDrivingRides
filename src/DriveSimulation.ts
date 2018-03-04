import {readData, RidesData} from "./DataParser";
import {Car} from "./Car";
import * as ProgressBar from "progress"
export class DriveSimulation{
    private inputData: RidesData;
    private bar: ProgressBar;
    constructor(private inputFileName: string){
        this.inputData = readData(inputFileName);
        this.initSimulation();
    }
    private fleet: Array<Car>;
    public writeOutput(): string {
        return this.fleet.map((car) => `${car.finishedRides.length} ${car.finishedRides.join(' ')}`).join('\n');
    }
    private initSimulation() {
        const start = new  Date();
        this.fleet = new Array(this.inputData.F);
        // this.fleet.fill(new Car());
        for( let i =0; i < this.fleet.length; i++) {
            this.fleet[i] = new Car(i);
        }
        for (let step = 0; step < this.inputData.T; step ++) {
            this.tick(step);
        }
        console.log(`TIME: ${(new Date().valueOf()  - start.valueOf())/1000} seconds`)
    }
    private tick(step: number): void {
        for (const car of this.fleet){
            // if(car.id === 1 || car.id === 0){
            //     console.log(`STEP ${step} CAR: ${car.toString()}`);
            // }
            // console.log(step, this.inputData.rides);

            if(car.state === "idle"){
                // magic
                const  ride = this.getRideV2(car, step);
                if(!ride) continue;
                car.setRide(ride);
            }
            car.tick(step);
        }
        // console.log(` STEP: ${step} ${this.fleet.map((car) => car.toString())}`);
    }
    private setRideV1(car: Car, tick: number): number[] {
       return this.inputData.rides.shift();
    }
    private getRideV2(car: Car, step: number): number[]{
        // this.inputData.rides
        //     .sort((a: number[], b:number[]) => car.getDistance(a[0],a[1]) - car.getDistance(b[0],b[1]));
        const index = this.inputData.rides.findIndex((ride) => {
            if(step > ride[5]) return false;
            const distanceToStart = car.getDistance(ride[0], ride[1]);
            const distanceToFinish = distanceToStart + Math.abs(ride[0] - ride[2]) + Math.abs(ride[1] - ride[3]);
            return ride[4] === distanceToStart + step && distanceToFinish + step < ride[5];
        });
        if(index === -1) return null;
        const ride = this.inputData.rides.splice(index,1)[0];
        return ride;
    }

}