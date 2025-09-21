import {Connection} from "mongoose"

declare global {
    var mongoose: {
        conn: Connection | null
        promise: Promise<Connection> | null //promise type is connection
    }
}
// conn established connection rakhta hai
// promise connection establish hone ka promise rakhta hai 
// (ek-in-fligh connect call ko share karne ke liye hota hai)


export {};
//mongoose ke andar ya toh hoga connection ya hoga promise