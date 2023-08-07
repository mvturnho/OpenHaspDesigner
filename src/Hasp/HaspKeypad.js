import HaspButtonmatrix from "./HaspButtonmatrix";


export default class HaspKeypad extends HaspButtonmatrix {

    constructor(config){
        config.options = ["1","2","3","\n","4","5","6","\n","7","8","9","\n","*","0","."];
        config.height = 240;
        config.type = "btnmatrix";
        super(config)
    }
}