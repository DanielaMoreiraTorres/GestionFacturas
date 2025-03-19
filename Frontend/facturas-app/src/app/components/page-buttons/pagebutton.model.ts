export interface PageButton{
    label:string,
    icon?: String | undefined;
    actionType?: Function | undefined;
    cssClass?: String | undefined;
    visible?:boolean | undefined;
    disabled?:boolean | undefined;
    onlyIcon?:boolean | undefined;
  }
  