import {readFileSync, writeFileSync} from "fs";
import {Ride} from "./Car";

export class RidesData{
    public R: number; // number of rows
    public C: number; // number of columns
    public F: number; // number of vehicles
    public N: number; // number of rides
    public B: number; // per-ride bonus
    public T: number; // number of steps in the simulation
    public rides: Ride[];

    constructor(data: string){
        const lines: string[] = data.split('\n');
        [this.R, this.C, this.F, this.N, this.B, this.T] = lines[0].split(' ')
            .map((num) => parseInt(num, 10));
        this.rides = lines.slice(1, lines.length - 1).map((line, index) => new Ride([...line.split(' ')
            .map((num) => parseInt(num, 10)), index]));
        this.rides.sort((a:Ride, b: Ride) => {
            return a.endTime - b.endTime || a.startTime - b.startTime;
        })
    }
}

export function writeData(name: string, rides: string){
    writeFileSync(`./output/${name}_v${process.env.SOLUTION_VERSION||1}.out`,
        rides);
}
export function readData(name: string): RidesData{
    return new RidesData(readFileSync(`./data/${name}`, {encoding:'ascii'}))
}