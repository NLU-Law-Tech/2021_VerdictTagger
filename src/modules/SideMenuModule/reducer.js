const initialState = {
  currentSelectDefendant:undefined,
  currentSelectBankAccount:undefined,
  defendants:[],
  bankAccounts:[],
  phoneNumbers:[],
  defendantsTagInfo:{},
  bankAccountsTagInfo:{},
  phoneNumbersTagInfo:{}
 
}

function Reducer(state = initialState, action) {
  //
    switch (action.type) {
      case "INIT_APP":
        return Object.assign({},initialState)
      
      case "SIDE_MENU_UPDATE_DEFENDANTS_TAG_INFO":
        return Object.assign({},state,{
          defendantsTagInfo:action.defendantsTagInfo
        })

      case 'SIDE_MENU_SET_DEFENDANTS':
        return Object.assign({},state,{
          defendants:action.defendants
        })

      case 'SIDE_MENU_SET_CURRENT_SELECT_DEFENDANT':
        return Object.assign({},state,{
          currentSelectDefendant:action.defendant
        })
      //bank
      case "SIDE_MENU_UPDATE_BANKACCOUNT_TAG_INFO":
        return Object.assign({},state,{
          bankAccountsTagInfo:action.bankAccountsTagInfo
        })
      case 'SIDE_MENU_SET_BANKACCOUNT':
        return Object.assign({},state,{
          bankAccounts:action.bankAccounts
         })

      case 'SIDE_MENU_SET_CURRENT_SELECT_BANKACCOUNT':
        return Object.assign({},state,{
          currentSelectBankAccount:action.bankAccount
        })
    
      //PHONE
      case "SIDE_MENU_UPDATE_PHONENUMBER_TAG_INFO":
        return Object.assign({},state,{
          phoneNumbersTagInfo:action.phoneNumbersTagInfo
        })
      case 'SIDE_MENU_SET_PHONENUMBER':
        return Object.assign({},state,{
          phoneNumbers:action.phoneNumbers
         })

      case 'SIDE_MENU_SET_CURRENT_SELECT_PHONENUMBER':
        return Object.assign({},state,{
          currentSelectPhoneNumber:action.phoneNumber
        })



      default:
        return state
    }
}
  
export default Reducer