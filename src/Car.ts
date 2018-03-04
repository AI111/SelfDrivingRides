
export class Point{

    constructor(public y: number, public x: number){

    }
    public equal(point: Point): boolean{
        return this.x === point.x && this.y === point.y;
    }
    public toString(){
        return `[${this.y} ${this.x}]`
    }
}
export class Ride{
    public start: Point;
    public finish: Point;
    public startTime: number;
    public endTime: number;
    public id: number;
    public  open: boolean = true;
    public  finished: boolean = false;
    private _rideLength: number;
    public get rideLength(){
        return this._rideLength;
    }

    constructor(ride: number[]){
        this.start = new Point(ride[0], ride[1]);
        this.finish = new Point(ride[2], ride[3]);
        this.startTime = ride[4];
        this.endTime = ride[5];
        this.id = ride[6];
        this._rideLength = Math.abs(ride[0] - ride[2]) + Math.abs(ride[1] - ride[3])
    }
}
export class Car{
    public position: Point = new Point(0,0);
    public ride: Ride;
    public state: "ride" | "idle" | "goToClient" = "idle";
    public finishedRides = [];

    constructor(public id: number){

    }
    public getDistance(point: Point): number {
        return Math.abs(point.x -this.position.x) + Math.abs(point.y - this.position.y);
    }
    public toString(): string{
        return `${this.id} State: ${this.state}, position: ${this.position}, rides: ${this.finishedRides}`
    }
    public setRide(data: Ride): void{
        if(this.state !== "idle") throw new Error("this car on ride");
        this.ride = data;
        this.ride.open = false;
        if(this.position.equal(this.ride.start)){
            this.state = "ride";
        } else {
          this.state = "goToClient";
        }
    }
    public tick(step: number): void{
        if (this.state === "ride"){
            if(!this.driveToPoint(this.ride.finish)){
                this.finishedRides.push(this.ride.id);
                this.ride.finished = true;
                this.state = "idle";
            }
        } else if(this.state  === "goToClient"){
            if(!this.driveToPoint(this.ride.start)){
                // if ride time note come car wait
                if(step < this.ride.startTime) return;
                this.state = "ride";
            }
        } else {
            console.log("НАЗНАЧЬ СУКА ПОЕЗДКУ")
        }
    }
    private driveToPoint(point: Point): boolean{
        if(this.position.x !== point.x){
            this.position.x += Math.sign(point.x - this.position.x);
            return true;
        }else if(this.position.y !== point.y){
            this.position.y += Math.sign(point.y - this.position.y);
            return true;
        }else{
            return false;
        }
    }
}