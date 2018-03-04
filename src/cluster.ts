import * as  cluster from "cluster"
import {worker} from "cluster";
const files = ['a_example.in', 'b_should_be_easy.in', 'c_no_hurry.in', 'd_metropolis.in', 'e_high_bonus.in'];

if(cluster.isMaster){
    for(let i = 0; i < files.length; i++){
        const worker = cluster.fork({INPUT_FILE: files[i]});

            worker.on("message",(data) => {
                console.log(worker.id, data)
            });
    }
}else{
    console.log('Worker ' + process.pid + ' has started.');
    process.send({msg:`${process.env.INPUT_FILE} send data`});
    require("./index");
    // console.log("CHILD", process.env.INPUT_FILE);
    // let count = 0;
    // const loop = setInterval(() =>{
    //     count ++;
    //     process.send({msg: count});
    //     if( count>= 100) {
    //         clearInterval(loop);
    //         process.exit(0)
    //     }
    // },1000)
}