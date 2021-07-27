import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setCurrentSelectPhoneNumber, setPhoneNumber } from './action'

export class phoneNumber extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isAddingNewPhoneNumber: false,//是否在新增的state
            currentSelectWord: {},
            selectNewPhoneNumbers: [],
            isDelingPhoneNumber: false,//是否在刪除模式
            currentKeyDown: undefined,
            _props: {}
        }
    }
  
    delingPhoneNumber = () => {
        let { isDelingPhoneNumber } = this.state
        this.setState({
            isDelingPhoneNumber: !isDelingPhoneNumber,//解開 use not(state)
            isAddingNewPhoneNumber: false
        })
    }
    //新增狀態(按下新增被告)
    addingNewPhoneNumber = () => {
        let{ dispatch } = this.props
        let { isAddingNewPhoneNumber } = this.state
        this.setState({
            isAddingNewPhoneNumber: !isAddingNewPhoneNumber,
            isDelingPhoneNumber: false,
          
        })
        dispatch(setCurrentSelectPhoneNumber(undefined))
    }

    delPhoneNumber = (selectNewPhoneNumber) => {
        let { dispatch } = this.props
        let { selectNewPhoneNumbers } = this.state
         selectNewPhoneNumbers = selectNewPhoneNumbers.filter((phoneNumber) => {
            return phoneNumber !== selectNewPhoneNumber
        })
        this.setState({
            selectNewPhoneNumbers
        })
        dispatch(setCurrentSelectPhoneNumber(undefined))
        dispatch(setPhoneNumber(selectNewPhoneNumbers))
    }

    setSelectPhoneNumber = (phoneNumber) => {
        let { dispatch } = this.props
        dispatch(setCurrentSelectPhoneNumber(phoneNumber))
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        //console.log(nextProps)
        let { props, state } = this,
            { dispatch } = props

        // update with new props
        if(props.state.SideMenuReducer.PhoneNumbers !== nextProps.state.SideMenuReducer.phoneNumbers){
            this.setState({
                selectNewPhoneNumbers:nextProps.state.SideMenuReducer.phoneNumbers
            })
        }

        // catch new select
        if (state.isAddingNewPhoneNumber === true && (props.state.TagReducer.currentSelectWord !== nextProps.state.TagReducer.currentSelectWord)) {
            let pushStart=nextProps.state.TagReducer.currentSelectWord.tag_start
            let pushEnd=nextProps.state.TagReducer.currentSelectWord.tag_end
            state.selectNewPhoneNumbers.push(nextProps.state.TagReducer.currentSelectWord.val+'_S:'+pushStart+'E:'+pushEnd)
            dispatch(setPhoneNumber(state.selectNewPhoneNumbers))
            this.setState({
                isAddingNewPhoneNumber: false,
                selectNewPhoneNumbers:state.selectNewPhoneNumbers
            })
        }

        // hot key
        if(nextProps.state.MainReducer.currentKeyDown !== this.state.currentKeyDown){
            this.setState({
                currentKeyDown:nextProps.state.MainReducer.currentKeyDown
            })
            let key = nextProps.state.MainReducer.currentKeyDown
            if(key === 'a'){
                this.addingNewPhoneNumber()
            }
            else if(key === 'd'){
                this.delingPhoneNumber()
            }
            else if(!isNaN(parseInt(key))){
                try {
                    let selectPhoneNumber = this.state.selectNewPhoneNumbers[parseInt(key)-1]
                    if(this.state.isDelingPhoneNumber){
                        this.delPhoneNumber(selectPhoneNumber)
                    }
                    else{
                        this.setSelectPhoneNumber(selectPhoneNumber)
                    }
                    
                } catch (error) {
                    console.log(error)
                }
            }
        }
    }

    render() {
        let { isAddingNewPhoneNumber, isDelingPhoneNumber, selectNewPhoneNumbers } = this.state
        let { SideMenuReducer={} } = this.props.state,
        {  currentSelectPhoneNumber } = SideMenuReducer
        return (
            <div className="card">
                <div className="card-body">
                    <div className="card-title"><b>手機號碼</b></div>
                    <div className="card-text">
                        <button className="mr-2" onClick={this.addingNewPhoneNumber}>新增手機(a)</button>
                        <button className="mr-2" onClick={this.delingPhoneNumber}>刪除手機(d)</button>
                       
                        <br/>
                        {isAddingNewPhoneNumber ? '在文章中拖曳選擇手機' : undefined}
                        {isDelingPhoneNumber? '點選紅色手機號碼按鈕刪除' : undefined}
                        <br />
                        <hr />
                        {selectNewPhoneNumbers.map((selectNewPhoneNumber,index) => {
                            return (
                                <div key={selectNewPhoneNumber}>
                                    {isDelingPhoneNumber ?
                                        <button key={'del'} className="btn btn-sm btn-danger m-1" onClick={() => this.delPhoneNumber(selectNewPhoneNumber)}>{`${selectNewPhoneNumber}(${index+1})`}</button>
                                        :
                                        <button key={'set'} className={`btn btn-sm btn-info m-1 ${currentSelectPhoneNumber===selectNewPhoneNumber?'active':''}`} onClick={() => this.setSelectPhoneNumber(selectNewPhoneNumber)}>{`${selectNewPhoneNumber}(${index+1})`}</button>
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

export default connect(mapStateToPtops)(phoneNumber)
