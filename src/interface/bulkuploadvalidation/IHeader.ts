import { HeaderTypes } from "../../enums/HeaderTypes";

export interface Header {
    label: string;
    value: string;
    type: HeaderTypes,
    required: boolean,
    colSize: string,
    validators?: string[],
    allowedValues?:any,
    positiveMetric?:boolean,
    maxLength?:number
}