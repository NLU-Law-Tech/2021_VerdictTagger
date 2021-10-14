import React, { Component } from 'react'
import { connect } from 'react-redux'


let ACTION_TAGS = ['持有人']
let HOT_KEYS = ['c',]
export class tagInfoPhone extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentSelectWord: undefined,
            phonNumbers: [],
            phoneNumbersTagInfo: {},
            
            
            tagAction:ACTION_TAGS[0],
            // firstUpdate:true
        }
    }

    static getDerivedStateFromProps(props, state) {
        let { SideMenuReducer = {}, TagReducer={}, MainReducer } = props.state,
            { phoneNumbers = [], currentSelectPhoneNumber } = SideMenuReducer,
            { currentSelectWord } = TagReducer,
            { currentKeyDown } = MainReducer
       // console.log("初始化")
        let { tagAction } = state
        // let { dispatch } = props

        // 被告變動
        let phoneNumbersTagInfo = state.phoneNumbersTagInfo
       
        if (phoneNumbers !== state.phoneNumbers) {
            // 檢查字典中是否已有初值，若無則新增
            for (let i = 0; i < phoneNumbers.length; i++) {
                let phoneNumber = phoneNumbers[i]
              
                if (phoneNumber in phoneNumbersTagInfo !== true) {
                    phoneNumbersTagInfo[`${phoneNumber}`] = {}
                    ACTION_TAGS.forEach((ACTION_TAG) => {
                        phoneNumbersTagInfo[`${phoneNumber}`][`${ACTION_TAG}`] = []
                    })
                }
            }

            // 檢查字典中是否有應該被刪除的
            for (let i = 0; i < Object.keys(phoneNumbersTagInfo).length; i++) {
                let key = Object.keys(phoneNumbersTagInfo)[i]
                // console.log(key)
                if (!phoneNumbers.includes(key)) {
                    delete phoneNumbersTagInfo[`${key}`]
                }
            }
        }

        // 新選擇資訊進入
        if(typeof (tagAction)==='undefined'){
            var alert='請選擇項目再進行標記'
            console.log(alert)
         }
        else if (typeof (currentSelectPhoneNumber) !== 'undefined' && currentSelectWord !== state.currentSelectWord) {
            phoneNumbersTagInfo[`${currentSelectPhoneNumber}`][`${state.tagAction}`].push(currentSelectWord)
            tagAction = undefined
        }
       

        // hot key
        if(typeof (currentSelectPhoneNumber) !== 'undefined' && currentKeyDown !== state.currentKeyDown){
            try {
                if(HOT_KEYS.includes(currentKeyDown)){
                    let actionIndex = HOT_KEYS.indexOf(currentKeyDown)
                    tagAction = ACTION_TAGS[actionIndex]
                }
            } catch (error) {
                console.log(error)
            }
        }
       // console.log(phoneNumbersTagInfo)
       
        return {
            tagAction,
            currentKeyDown,
            phoneNumbers: [...phoneNumbers],
            currentSelectWord,
            phoneNumbersTagInfo:SideMenuReducer.phoneNumbersTagInfo,
            _props: props
        }
    }

    setTagAction = (tagAction) => {
        this.setState({
            tagAction
        })
    }

    delActionTagElement = (phoneNumber, actionTag, val) => {
        let { phoneNumbersTagInfo } = this.state
        // console.log(defendant, actionTag, val)
        // console.log(defendantsTagInfo)
        phoneNumbersTagInfo[`${phoneNumber}`][`${actionTag}`] = phoneNumbersTagInfo[`${phoneNumber}`][`${actionTag}`].filter((option) => {
            return option.val !== val
        })
        this.setState({
            phoneNumbersTagInfo
        })
    }

    render() {
        let { tagAction,phoneNumbersTagInfo } = this.state
        let { state = {} } = this.props,
            { SideMenuReducer = {} } = state,
            { currentSelectPhoneNumber } = SideMenuReducer
         
        return (
            <div className="card">
                {typeof (currentSelectPhoneNumber) === 'undefined' ?
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
                            <small>標註手機:{currentSelectPhoneNumber}</small>
                            <br />
                            <small>標註動作:{tagAction}</small>
                        </div>
                        <div className="card-text">
                        <button className="m-1 btn btn-sm btn-warning" onClick={() => this.setTagAction(undefined)}>取消<b>標注動作</b></button><br />
                            {
                            ACTION_TAGS.map((actionTag, index) => {
                              
                            
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
                                            {phoneNumbersTagInfo[`${currentSelectPhoneNumber}`][`${actionTag}`].map((option, index) => {
                                                return <li key={index} onClick={() => this.delActionTagElement(currentSelectPhoneNumber, actionTag, option.val)}><button>{option.val}</button></li>
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

export default connect(mapStateToProps)(tagInfoPhone)
