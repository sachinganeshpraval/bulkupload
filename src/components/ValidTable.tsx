import React, { Component } from 'react'
import { Header, Item } from './ValidPage';
import { checkLength, isValidPositiveMetric, isValidType } from '../helpers/ValidationHelpers';

interface IValidTableProps<T> {
    data: any[];
    render: (item: T, index: number) => React.ReactNode;
    headers: Header[],
    validators?:any,
    setError : (index:number,obj:Object) => void ,
    setErrorMessage: (errorMessage:string[]) => void
}

interface IValidTableState<T> {
    fullData: any[]
}

class ValidTable<T> extends Component<IValidTableProps<T>, IValidTableState<T>> {
    constructor(props: IValidTableProps<T>) {
        super(props);
        this.state = {
            fullData: [],
            
        }
    }

    componentDidUpdate(prevProps: Readonly<IValidTableProps<T>>, prevState: Readonly<IValidTableState<T>>, snapshot?: any): void {
        if (prevProps.data != this.props.data) {
            this.setState({ fullData: this.props.data });
            this.validator();
        }
    }

    validator = () => {
      
        const data = this.props.data;
        const errorsMessages = new Set<string>();
        var startTime = performance.now()

        for (let i = 0; i < data.length; i++) {
            const currItem = data[i];
            console.log(new Date(),"rending")
            for (let j = 0; j < this.props.headers.length; j++) {
                const currHeader = this.props.headers[j];
                const currValue = currItem[currHeader.value];

                if(currHeader.allowedValues){
                    const isValid = currHeader.allowedValues[currValue];
                    if(!isValid){
                        this.props.setError(i,{[currHeader.value]:true});
                        errorsMessages.add(`The only values that are allowed are ${Object.keys(currHeader.allowedValues).join(' ')}`);  
                    }
                }

                if(!currValue) {
                    this.props.setError(i,{[currHeader.value]:true})
                    errorsMessages.add(`${currHeader.value} can't be a empty`);
                }

                if(!isValidType(currHeader.type,currValue)){
                    this.props.setError(i,{[currHeader.value]:true})
                    errorsMessages.add(`Invalid Type`);
                }

                if(currHeader.positiveMetric && !isValidPositiveMetric(currValue)){
                    this.props.setError(i,{[currHeader.value]:true});
                    errorsMessages.add(`${currHeader.value} should be a number`);
                }
              
                if(currHeader.maxLength && !checkLength(currHeader.maxLength,currValue)){
                    this.props.setError(i,{[currHeader.value]:true});
                    errorsMessages.add(`Only ${currHeader.maxLength} Characters allowed in ${currHeader.value}`);

                }
            }
        }
        var endTime = performance.now()
        console.log(`Call to doSomething took ${endTime - startTime} milliseconds`)

        this.props.setErrorMessage(Array.from(errorsMessages));
        console.log(new Date(),"ended")
    }

    render() {
        
        return (
            <div>
                <div className='row'>{this.props.headers.map((header, index) => {
                    return <div key={index} className={`${header.colSize}`}>{header.label}</div>
                })}</div>
                <div>{this.state.fullData.map(this.props.render)}</div>
            </div>
        )
    }
}

export default ValidTable;
