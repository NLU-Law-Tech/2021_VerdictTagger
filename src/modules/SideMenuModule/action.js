export const setCurrentSelectDefendant = (defendant)=>{
    return{
        type:'SIDE_MENU_SET_CURRENT_SELECT_DEFENDANT',
        defendant
    }
}

export const setDefendants = (defendants)=>{
    return{
        type:'SIDE_MENU_SET_DEFENDANTS',
        defendants
    }
}

export const updateDefendantsTagInfo = (defendantsTagInfo)=>{
    return{
        type:"SIDE_MENU_UPDATE_DEFENDANTS_TAG_INFO",
        defendantsTagInfo
    }
}
//bank
export const setCurrentSelectBankAccount = (bankAccount)=>{
    return{
        type:'SIDE_MENU_SET_CURRENT_SELECT_BANKACCOUNT',
        bankAccount
    }
}

export const setBankAccounts = (bankAccounts)=>{
    return{
        type:'SIDE_MENU_SET_BANKACCOUNT',
        bankAccounts
    }
}
export const updateBankAccountsTagInfo = (bankAccountsTagInfo)=>{
    return{
        type:"SIDE_MENU_UPDATE_BANKACCOUNT_TAG_INFO",
        bankAccountsTagInfo
    }
}
//phone

export const setCurrentSelectPhoneNumber = (phoneNumber)=>{
    return{
        type:'SIDE_MENU_SET_CURRENT_SELECT_PHONENUMBER',
        phoneNumber
    }
}

export const setPhoneNumber = (phoneNumbers)=>{
    return{
        type:'SIDE_MENU_SET_PHONENUMBER',
        phoneNumbers
    }
}
export const updatePhoneNumbersTagInfo = (phoneNumbersTagInfo)=>{
    return{
        type:"SIDE_MENU_UPDATE_PHONENUMBER_TAG_INFO",
        phoneNumbersTagInfo
        
    }
}