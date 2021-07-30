import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setCurrentSelectBankAccount, setBankAccounts } from './action'

export class bankAccount extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isAddingNewBankAccount: false,//是否在新增的state
            currentSelectWord: {},
            selectNewBankAccounts: [],
            isDelingBankAccount: false,//是否在刪除模式
            currentKeyDown: undefined,
            _props: {}
        }
    }
     
    delingBankAccount = () => {
        let { isDelingBankAccount } = this.state
        this.setState({
            isDelingBankAccount: !isDelingBankAccount,//解開 use not(state)
            isAddingNewBankAccount: false
        })
    }
    //新增狀態(按下新增被告)
    addingNewBankAccount= () => {
        let{ dispatch } = this.props
        let { isAddingNewBankAccount } = this.state
        this.setState({
            isAddingNewBankAccount: !isAddingNewBankAccount,
            isDelingBankAccount: false
        })
        dispatch(setCurrentSelectBankAccount(undefined))
    }

    delBankAccount = (selectNewBankAccount) => {
        let { dispatch } = this.props
        let { selectNewBankAccounts } = this.state
        selectNewBankAccounts = selectNewBankAccounts.filter((BankAccount) => {
            return BankAccount !== selectNewBankAccount
        })
        this.setState({
            selectNewBankAccounts
        })
        dispatch(setCurrentSelectBankAccount(undefined))
        dispatch(setBankAccounts(selectNewBankAccounts))
    }

    setSelectBankAccount = (bankAccount) => {
        let { dispatch } = this.props
        dispatch(setCurrentSelectBankAccount(bankAccount))
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        //console.log(nextProps)
        let { props, state } = this,
            { dispatch } = props

        // update with new props
        if(props.state.SideMenuReducer.BankAccounts !== nextProps.state.SideMenuReducer.bankAccounts){
            this.setState({
                selectNewBankAccounts:nextProps.state.SideMenuReducer.bankAccounts
            })
        }

        // catch new select
        if (state.isAddingNewBankAccount === true && (props.state.TagReducer.currentSelectWord !== nextProps.state.TagReducer.currentSelectWord)) {
            let pushStart=nextProps.state.TagReducer.currentSelectWord.tag_start
            let pushEnd=nextProps.state.TagReducer.currentSelectWord.tag_end
            state.selectNewBankAccounts.push(nextProps.state.TagReducer.currentSelectWord.val+'_S:'+pushStart+'E:'+pushEnd)
            dispatch(setBankAccounts(state.selectNewBankAccounts))
            this.setState({
                isAddingNewBankAccount: false,
                selectNewBankAccounts:state.selectNewBankAccounts
            })
        }

        // hot key
        if(nextProps.state.MainReducer.currentKeyDown !== this.state.currentKeyDown){
            this.setState({
                currentKeyDown:nextProps.state.MainReducer.currentKeyDown
            })
            let key = nextProps.state.MainReducer.currentKeyDown
            if(key === 'a'){
                this.addingNewBankAccount()
            }
            else if(key === 's'){
                this.delingBankAccount()
            }
            else if(!isNaN(parseInt(key))){
                try {
                    let selectBankAccount = this.state.selectNewBankAccounts[parseInt(key)-1]
                    if(this.state.isDelingBankAccount){
                        this.delBankAccount(selectBankAccount)
                    }
                    else{
                        this.setSelectBankAccount(selectBankAccount)
                    }
                    
                } catch (error) {
                    console.log(error)
                }
            }
        }
    }

    render() {
        let { isAddingNewBankAccount, isDelingBankAccount, selectNewBankAccounts } = this.state
        let { SideMenuReducer={} } = this.props.state,
        {  currentSelectBankAccount } = SideMenuReducer
        return (
            <div className="card">
                <div className="card-body">
                    <div className="card-title"><b>銀行帳號</b></div>
                    <div className="card-text">
                        <button className="mr-1" onClick={this.addingNewBankAccount}>新增帳號(a)</button>
                        <button onClick={this.delingBankAccount}>刪除帳號(s)</button>
                        <br/>
                        {isAddingNewBankAccount ? '在文章中拖曳選擇銀行帳號' : undefined}
                        {isDelingBankAccount ? '點選紅色帳號按鈕刪除' : undefined}
                        <br />
                        <hr />
                        {selectNewBankAccounts.map((selectNewBankAccount,index) => {
                            return (
                                <div key={selectNewBankAccount}>
                                    {isDelingBankAccount ?
                                        <button key={'del'} className="btn btn-sm btn-danger m-1" onClick={() => this.delBankAccount(selectNewBankAccount)}>{`${selectNewBankAccount}(${index+1})`}</button>
                                        :
                                        <button key={'set'} className={`btn btn-sm btn-info m-1 ${currentSelectBankAccount===selectNewBankAccount?'active':''}`} onClick={() => this.setSelectBankAccount(selectNewBankAccount)}>{`${selectNewBankAccount}(${index+1})`}</button>
                                    }
                                    <br />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

let mapStateToPtops = (state) => {
    return {
        state
    }
}

export default connect(mapStateToPtops)(bankAccount)
