import React, { ChangeEvent, Component } from 'react'
import ValidTable from './ValidTable'
import { read, utils } from 'xlsx';
import { HeaderTypes } from '../enums/HeaderTypes';
import { validatecol } from '../helpers/Utilities';


interface IValidPageProps {

}

interface IValidPageState {
    data: Item[],
    headers: Header[],
    errorsList: Map<number, any>,
    errorsSummary: string[]
}



enum Owner {
    HP,
    Dell
}

export interface Item {
    partName: string;
    partNumber: string;
    description: string;
    manufacturer: string;
    owner: string;
}

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

export default class ValidPage extends Component<IValidPageProps, IValidPageState> {
    constructor(props: IValidPageProps) {
        super(props);
        this.state = {
            data: [],
            headers: [
                { label: 'ID', value: 'ID', required: true, type: HeaderTypes.number, colSize: 'col-2' },
                { label: 'Praval', value: 'Praval', required: true, type: HeaderTypes.text, colSize: 'col-2' },
                { label: 'ISEMP', value: 'ISEMP', required: true, type: HeaderTypes.text, colSize: 'col-2' },
               
                { label: 'CREATED ON', value: 'CREATED ON', required: true, type: HeaderTypes.date, colSize: 'col-2'},
            ],
            errorsList: new Map(),
            errorsSummary: []
        };
    }

    CheckValidOwner = (label: any) => {
        if (label != Owner.Dell && label != Owner.HP) return {
            isError: true,
            message: 'The Owner should be either HP or Dell'
        };
        return {
            isError: false,
            message: ''
        };
    }

    setError = (index: number, obj: Object) => {
        let errors = this.state.errorsList;
        if(errors.has(index)){
            errors.set(index,{...obj,...errors.get(index)});
        }else{
            errors.set(index, obj);
        }
       
        this.setState({ errorsList: errors });
    }

    setErrorMessage = (errorMessage: string[]) => {
        this.setState({
            errorsSummary: errorMessage
        })

    }

    

    isErrorHandler = (index: number, name: string) => {
        const errors = this.state.errorsList;
        if (errors.has(index)) {
            const obj = errors.get(index);
            if (obj[name]) return "text-danger"
            return ''
        }
    }

    fileChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const files = (e.target as HTMLInputElement).files;
        if (files) {
            var file = files[0];
            var reader = new FileReader();
            reader.onload = (event) => {
                var wb = read(event.target?.result, { type: 'binary' });
                var sheets = wb.SheetNames;

                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];


                if (sheets.length) {
                    var rows = utils.sheet_to_json(ws);
                    let header = utils.sheet_to_json(wb.Sheets[sheets[0]],
                        {
                            header: 1,
                        })[0]
                    this.setState({
                        data: rows as Item[]
                    })
                   
                    const list = validatecol(rows);
                    console.log(list)
                }
            }
            reader.readAsArrayBuffer(file);
        }

    }

    render() {

        return (
            <div>
                <div>
                    <input onChange={this.fileChangeInput} type="file" name="" id="" />
                </div>
                <div>
                    {this.state.errorsSummary.map(function (err, index) {
                        return <div className='text-danger'> {err} </div>
                    })}
                </div>
                {/* <ValidTable setErrorMessage={this.setErrorMessage} setError={this.setError}  data={this.state.data} headers={this.state.headers} render={(item: any, index: number) => {
                    return <div className='row' key={index}>
                        <div className={`col-2 ${this.isErrorHandler(index, "ID")}`}>{item["ID"]}</div>
                        <div className={`col-2 ${this.isErrorHandler(index, "Praval")}`}>{item["Praval"]}</div>
                        <div className={`col-2 ${this.isErrorHandler(index, "ISEMP")}`}>{item["ISEMP"]}</div>
                    
                        <div className={`col-2 ${this.isErrorHandler(index, "CREATED ON")}`}>{item["CREATED ON"]}</div>
                        
                    </div>
                }} /> */}
            </div>
        )
    }
}
