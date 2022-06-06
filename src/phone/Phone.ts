import { Connection } from "../dax/Connection";
import { DaxSpace } from "../dax/DaxSpace";
import { PhoneXR } from "./PhoneXR";

export class Phone {
    public readonly connection: Connection;
    public readonly xr: PhoneXR | false
    private readonly space: DaxSpace;

    constructor(connection: Connection, space: DaxSpace) {
        this.connection = connection
        this.space = space

        if (this.connection.isMobile) this.xr = new PhoneXR(connection, space)
        else this.xr = false
         
    }



}


