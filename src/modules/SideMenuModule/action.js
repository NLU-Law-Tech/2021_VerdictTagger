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