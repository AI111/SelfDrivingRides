import {DriveSimulation} from "./DriveSimulation";
import {writeData} from "./DataParser";
const files = ['a_example.in', 'b_should_be_easy.in', 'c_no_hurry.in', 'd_metropolis.in', 'e_high_bonus.in'];
//
// files.forEach((file) => {
//     const main = new DriveSimulation(file);
//     writeData(file.split('.')[0], main.writeOutput());
//     console.log(`FILE ${file} FINISHED`);
// });
const file = process.env.INPUT_FILE || 'd_metropolis.in';
    const main = new DriveSimulation(file);
    writeData(file.split('.')[0], main.writeOutput());
