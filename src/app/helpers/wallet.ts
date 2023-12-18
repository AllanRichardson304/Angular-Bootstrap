export const walletData = (exchangename: any, value: any) => {
  const exchange: any = {
    bybit: () => {
      let resulArr: any = []
      let arr;
      if (value) {
        arr = Object.entries(value);
        arr.forEach((element: any) => {
          if(element[1].available_balance > 0){
            resulArr.push({
              asset: element[0],
              free: element[1].available_balance
            })
          }
        });
      }
      return resulArr;
    },
    kucoin: () => {
      let resulArr: any = []
      if (value) {
        value.forEach((element: any) => {
          if(element.availableBalance > 0){
            resulArr.push({
              asset: element.currency,
              free: element.availableBalance
            })
          }
        });
        return resulArr;
      }
    }
  };
  return exchange[exchangename]()
}   