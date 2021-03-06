import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setCurrentSelectDefendant, setDefendants } from './action'

export class defendant extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isAddingNewDefendant: false,//是否在新增的state
            currentSelectWord: {},
            selectNewDefendants: [],
            isDelingDefendant: false,//是否在刪除模式
            currentKeyDown: undefined,
            _props: {}
        }
    }
  
    delingDefendant = () => {
        let { isDelingDefendant } = this.state
        this.setState({
            isDelingDefendant: !isDelingDefendant,//解開 use not(state)
            isAddingNewDefendant: false
        })
    }
    //新增狀態(按下新增被告)
    addingNewDefendant = () => {
        let{ dispatch } = this.props
        let { isAddingNewDefendant } = this.state
        this.setState({
            isAddingNewDefendant: !isAddingNewDefendant,
            isDelingDefendant: false,
          
        })
        dispatch(setCurrentSelectDefendant(undefined))
    }

    delDefendant = (selectNewDefendant) => {
        let { dispatch } = this.props
        let { selectNewDefendants } = this.state
        selectNewDefendants = selectNewDefendants.filter((defendant) => {
            return defendant !== selectNewDefendant
        })
        this.setState({
            selectNewDefendants
        })
        dispatch(setCurrentSelectDefendant(undefined))
        dispatch(setDefendants(selectNewDefendants))
    }

    setSelectDefendant = (defendant) => {
        let { dispatch } = this.props
        console.log('setselect:'+defendant)
        dispatch(setCurrentSelectDefendant(defendant))
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
       // console.log(nextProps)
        let { props, state } = this,
            { dispatch } = props

        // update with new props
        if(props.state.SideMenuReducer.defendants !== nextProps.state.SideMenuReducer.defendants){
            this.setState({
                selectNewDefendants:nextProps.state.SideMenuReducer.defendants
            })
        }

        // catch new select
        if (state.isAddingNewDefendant === true && (props.state.TagReducer.currentSelectWord !== nextProps.state.TagReducer.currentSelectWord)) {
            let pushStart=nextProps.state.TagReducer.currentSelectWord.tag_start
            let pushEnd=nextProps.state.TagReducer.currentSelectWord.tag_end
            state.selectNewDefendants.push(nextProps.state.TagReducer.currentSelectWord.val+'_S:'+pushStart+'E:'+pushEnd)
            //+'_S:'+currentSelectWord.tag_start+'E:'+currentSelectWord.tag_end
            dispatch(setDefendants(state.selectNewDefendants))
            this.setState({
                isAddingNewDefendant: false,
                selectNewDefendants:state.selectNewDefendants
            })
        }

        // hot key
        if(nextProps.state.MainReducer.currentKeyDown !== this.state.currentKeyDown){
            this.setState({
                currentKeyDown:nextProps.state.MainReducer.currentKeyDown
            })
            let key = nextProps.state.MainReducer.currentKeyDown
            if(key === 'q'){
                this.addingNewDefendant()
            }
            else if(key === 'w'){
                this.delingDefendant()
            }
            else if(!isNaN(parseInt(key))){
                try {
                    let selectDefendant = this.state.selectNewDefendants[parseInt(key)-1]
                    if(this.state.isDelingDefendant){
                        this.delDefendant(selectDefendant)
                    }
                    else{
                        this.setSelectDefendant(selectDefendant)
                    }
                    
                } catch (error) {
                    console.log(error)
                }
            }
        }
    }

    render() {
        let { isAddingNewDefendant, isDelingDefendant, selectNewDefendants } = this.state
        let { SideMenuReducer={} } = this.props.state,
        {  currentSelectDefendant } = SideMenuReducer
        return (
            <div className="card">
                <div className="card-body">
                    <div className="card-title"><b>車牌號碼</b></div>
                    <div className="card-text">
                        <button className="mr-2" onClick={this.addingNewDefendant}>新增車牌(q)</button>
                        <button className="mr-2" onClick={this.delingDefendant}>刪除車牌(w)</button>
                       
                        <br/>
                        {isAddingNewDefendant ? '在文章中拖曳選擇車牌' : undefined}
                        {isDelingDefendant ? '點選紅色車牌按鈕刪除' : undefined}
                        <br />
                        <hr />
                        {selectNewDefendants.map((selectNewDefendant,index) => {
                            return (
                                <div key={selectNewDefendant}>
                                    {isDelingDefendant ?
                                        <button key={'del'} className="btn btn-sm btn-danger m-1" onClick={() => this.delDefendant(selectNewDefendant)}>{`${selectNewDefendant}(${index+1})`}</button>
                                        :
                                        <button key={'set'} className={`btn btn-sm btn-info m-1 ${currentSelectDefendant===selectNewDefendant?'active':''}`} onClick={() => this.setSelectDefendant(selectNewDefendant)}>{`${selectNewDefendant}(${index+1})`}</button>
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

export default connect(mapStateToPtops)(defendant)
