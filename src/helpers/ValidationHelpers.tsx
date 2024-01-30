import { DataTypes } from "../enums/DataTypes";
import { HeaderTypes } from "../enums/HeaderTypes";

function isValidType(type:HeaderTypes,value:any){
  

    switch(type){
        case HeaderTypes.text:
            return typeof(value) == DataTypes.string;
        case HeaderTypes.date:
            return isValidDate(value);
        case HeaderTypes.number:
            return typeof(value) == DataTypes.number;
        default:
            return value

    }
}

export function isValidPositiveMetric(value:any){
    if(typeof(value) == DataTypes.number && Math.floor(value) >= 1) return true;
    return false;
}

export function isValidDate(dateString: string): boolean {
    const dateObject = new Date(dateString);
    return !isNaN(dateObject.getTime());
}

export function checkLength(maxLength:number,value:string){
    return value.length <= maxLength;
}


export {isValidType};