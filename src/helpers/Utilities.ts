interface ValidationRule {
    header: string;
    isValid: boolean;
    isNullable: boolean;
    type: 'string' | 'boolean' | 'number' | 'date';
    allowDupliates: boolean;
    allowNegativeOrZero?: boolean;
    maxLength: number | null;
  }
  
  interface ValidationResult {
    key: string;
    msg: string;
  }
  

  
  const validationRules: ValidationRule[] = [
    {
      header: "Part Number",
      isValid: true,
      isNullable: false,
      type: 'string',
      allowDupliates: false,
      maxLength: null
    },
    {
      header: "Part Name",
      isValid: true,
      isNullable: false,
      type: 'string',
      allowDupliates: true,
      maxLength: null
    },
    {
      header: "Description",
      isValid: true,
      isNullable: false,
      type: 'string',
      allowDupliates: true,
      maxLength: 5,
    },
    {
      header: "Unit Price",
      isValid: true,
      isNullable: false,
      type: 'number',
      allowDupliates: true,
      maxLength: null,
    },
    {
      header: "Comments",
      isValid: true,
      isNullable: false,
      type: 'string',
      allowDupliates: true,
      maxLength: null,
    },
    {
      header: "Date",
      isValid: true,
      isNullable: false,
      type: 'date',
      allowDupliates: true,
      maxLength: null,
    },
  ];
  
  export const filterdata = (data: any[], text: string): string => {
    let filtereddata = data;
    return "hello";
  };
  
  export const validatecol = (rows: any): any[] => {
    let result: any[] = [];
    let error: string | undefined = '';
   
    rows.forEach((row:any, rowIndex:any) => {
        let output: ValidationResult[] = validationRules.map((ruleheader, ruleindex) => {
          const columnValue = row[ruleheader.header];
          switch (ruleheader.type) {
            case 'string':
              error = validatedString(columnValue, ruleheader);
              break;
            case 'boolean':
              error = validatedBoolean(columnValue, ruleheader);
              break;
            case 'number':
              error = validatedNumber(columnValue, ruleheader);
              break;
            case 'date':
              error = validatedDate(columnValue, ruleheader);
              break;
            default:
              break;
          }
          if(ruleheader.allowDupliates){
            validatedDuplicates(rows, ruleheader.allowDupliates, ruleheader.header, row);
            return {key: ruleheader.header, msg:'Duplicate record'}
          }
          return { key: ruleheader.header, msg: error ? error : '' };
        });

        
        result.push({data:row,Errors: output});
    });
  
    return result;
  };
  
  const validatedDuplicates = (result: any[], allowDupliates: boolean, name: any, row: any): boolean => {
  
    if (!allowDupliates && (row[name] !== undefined)) {
      for(let i=0;i<result.length;i++){
        for(let item in result[i]){
          if(result[i][item] != row[item]) return false;
          console.log(result[i][item],row[item]);
        }
      }
      // result.filter((res, index) => {
      //   if (res[name] === row[name]) {
      //     result[index].Errors.push({ key: name.toString(), msg: "Duplicate record" });
      //   }
      // });
    }

    return true;
  };
  
  const validatedString = (columnValue: any, ruleheader: ValidationRule): string | undefined => {
    if (ruleheader.isNullable && (checkNull(columnValue))) {
      return;
    } else if (!ruleheader.isNullable && (checkNull(columnValue))) {
      return "value cannot be empty";
    } else if ((!ruleheader.isNullable || ruleheader.isNullable) && (!checkNull(columnValue)) && typeof columnValue !== ruleheader.type) {
      return "invalid data";
    } else if ((!checkNull(columnValue)) && (ruleheader.maxLength !== null) && (columnValue.length > ruleheader.maxLength)) {
      return "value length exceeded";
    }
  };
  
  const validatedBoolean = (value: any, ruleheader: ValidationRule): string | undefined => {
    let columnValue = value;
    if (ruleheader.isNullable && (checkNull(columnValue))) {
      return;
    } else if (!ruleheader.isNullable && (checkNull(columnValue))) {
      return "value cannot be empty";
    } else if ((!ruleheader.isNullable || ruleheader.isNullable) && (!checkNull(columnValue)) && typeof columnValue !== ruleheader.type) {
      return "invalid data";
    }
  };
  
  const validatedNumber = (columnValue: any, ruleheader: ValidationRule): string | undefined => {
    if (ruleheader.isNullable && (checkNull(columnValue))) {
      return;
    } else if (!ruleheader.isNullable && (checkNull(columnValue))) {
      return "value cannot be empty";
    } else if ((!ruleheader.isNullable || ruleheader.isNullable) && (!checkNull(columnValue)) && typeof columnValue !== ruleheader.type) {
      return "invalid data";
    } else if ((!ruleheader.isNullable || ruleheader.isNullable) && (!checkNull(columnValue)) && typeof columnValue === ruleheader.type && !ruleheader.allowNegativeOrZero && (Math.sign(columnValue) === -1 || Math.sign(columnValue) === 0)) {
      return "value cannot be Negative or zero";
    } else if ((!checkNull(columnValue)) && (ruleheader.maxLength !== null) && (columnValue.toString().length > ruleheader.maxLength)) {
      return "value length exceeded";
    }
  };
  
  const validatedDate = (columnValue: any, ruleheader: ValidationRule): string | undefined => {
    if (ruleheader.isNullable && (checkNull(columnValue))) {
      return;
    } else if (!ruleheader.isNullable && (checkNull(columnValue))) {
      return "value cannot be empty";
    } else if (!(ruleheader.isNullable || ruleheader.isNullable) && (!checkNull(columnValue)) && ((`${new Date(columnValue)}` === "Invalid Date") || (isNaN(Date.parse(columnValue))))) {
      return "invalid data";
    }
  };
  
  const checkNull = (columnValue: any): boolean => {
    return (columnValue === undefined || columnValue === null || columnValue === '');
  };
  