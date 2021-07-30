import React, { Component } from 'react'
import { connect } from 'react-redux'
//import { updateBankAccountsTagInfo } from './action'

let ACTION_TAGS = ['持有人','銀行','分行']
let HOT_KEYS = ['d','f','g']
export class tagInfoBank extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentSelectWord: undefined,
            bankAccount: [],
            bankAccountsTagInfo: {},
            tagAction: ACTION_TAGS[0],
            //firstUpdate:true
        }
    }

    static getDerivedStateFromProps(props, state) {
        let { SideMenuReducer = {}, TagReducer={}, MainReducer } = props.state,
            { bankAccounts = [], currentSelectBankAccount } = SideMenuReducer,
            { currentSelectWord } = TagReducer,
            { currentKeyDown } = MainReducer
        
        let { tagAction } = state
        // let { dispatch } = props

        // 被告變動
        let bankAccountsTagInfo = state.bankAccountsTagInfo
        if (bankAccounts !== state.bankAccounts) {
            // 檢查字典中是否已有初值，若無則新增
            for (let i = 0; i < bankAccounts.length; i++) {
                let bankAccount = bankAccounts[i]
                // console.log(defendant)
                if (bankAccount in bankAccountsTagInfo !== true) {
                    bankAccountsTagInfo[`${bankAccount}`] = {}
                    ACTION_TAGS.forEach((ACTION_TAG) => {
                        bankAccountsTagInfo[`${bankAccount}`][`${ACTION_TAG}`] = []
                    })
                }
            }

            // 檢查字典中是否有應該被刪除的
            for (let i = 0; i < Object.keys(bankAccountsTagInfo).length; i++) {
                let key = Object.keys(bankAccountsTagInfo)[i]
                // console.log(key)
                if (!bankAccounts.includes(key)) {
                    delete bankAccountsTagInfo[`${key}`]
                }
            }
        }

        // 新選擇資訊進入
        if(typeof (tagAction)==='undefined'){
            var alert='請選擇項目再進行標記'
            console.log(alert)
         }
        else if (typeof (currentSelectBankAccount) !== 'undefined' && currentSelectWord !== state.currentSelectWord) {
            bankAccountsTagInfo[`${currentSelectBankAccount}`][`${state.tagAction}`].push(currentSelectWord)
        }

        // hot key
        if(typeof (currentSelectBankAccount) !== 'undefined' && currentKeyDown !== state.currentKeyDown){
            try {
                if(HOT_KEYS.includes(currentKeyDown)){
                    let actionIndex = HOT_KEYS.indexOf(currentKeyDown)
                    tagAction = ACTION_TAGS[actionIndex]
                }
            } catch (error) {
                console.log(error)
            }
        }

   
        
        return {
            tagAction,
            currentKeyDown,
            bankAccounts: [...bankAccounts],
            currentSelectWord,
            bankAccountsTagInfo:SideMenuReducer.bankAccountsTagInfo,
            _props: props
        }
    }

    setTagAction = (tagAction) => {
        this.setState({
            tagAction
        })
    }

    delActionTagElement = (bankAccount, actionTag, val) => {
        let { bankAccountsTagInfo } = this.state
        // console.log(defendant, actionTag, val)
        // console.log(defendantsTagInfo)
        bankAccountsTagInfo[`${bankAccount}`][`${actionTag}`] = bankAccountsTagInfo[`${bankAccount}`][`${actionTag}`].filter((option) => {
            return option.val !== val
        })
        this.setState({
            bankAccountsTagInfo
        })
    }

    render() {
        let { tagAction,bankAccountsTagInfo } = this.state
        let { state = {} } = this.props,
            { SideMenuReducer = {} } = state,
            { currentSelectBankAccount } = SideMenuReducer
        // console.log(tagAction)
        return (
            <div className="card">
                {typeof (currentSelectBankAccount) === 'undefined' ?
                    <div className="card-body">
                        <div className="card-title">
                            <b>請先選擇項目</b>
                        </div>
                    </div>
                    :
                    <div className="card-body">
                        <div className="card-title">
                            <b>標註資訊</b>
                            <br />
                            <small>標註銀行帳號:{currentSelectBankAccount}</small>
                            <br />
                            <small>標註動作:{tagAction}</small>
                        </div>
                        <div className="card-text">
                        <button className="m-1 btn btn-sm btn-success" onClick={() => this.setTagAction(undefined)}>Done</button>
                            {ACTION_TAGS.map((actionTag, index) => {
                                return <button 
                                key={index} 
                                className={`m-1 btn btn-sm btn-secondary ${tagAction === actionTag ? 'active' : ''}`} 
                                onClick={() => this.setTagAction(actionTag)}>{`${actionTag}(${HOT_KEYS[index]})`}</button>
                            })}
                            <hr />
                            
                            {ACTION_TAGS.map((actionTag, index) => {
                                console.log(actionTag,index)
                                return (
                                    <div key={index} className={`${tagAction === actionTag ? 'bg-light font-weight-bold' : ''}`}>
                                        {actionTag}

                                        <ul>
                                            {bankAccountsTagInfo[`${currentSelectBankAccount}`][`${actionTag}`].map((option, index) => {
                                                return <li key={index} onClick={() => this.delActionTagElement(currentSelectBankAccount, actionTag, option.val)}><button>{option.val}</button></li>
                                            })}
                                        </ul>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                }
            </div>
        )
    }
}

let mapStateToProps = (state) => {
    return {
        state
    }
}

export default connect(mapStateToProps)(tagInfoBank)
