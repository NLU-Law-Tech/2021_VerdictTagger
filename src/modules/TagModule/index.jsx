import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { saveLabeledData as saveLabledDataAction, submitTag, getUnlabelDoc, delDoc, getReLableDoc, downloadLabeledDoc } from './action'
import LocalUpload from './localUpload'

const TagBlockFront = styled.pre`
    z-index:2;
    pointer-events: none;
    position: absolute;
    top:0px;
    font-size:${(props) => props.fontSize};
    & > span{
        padding: 0px !important;
        background-color:${(props) => props.markColor};
        opacity:${(props) => props.opacity === undefined ? '0.5' : props.opacity};
    }
`

const TagBlockRear = styled.pre`
    z-index:1;
    position: absolute;
    top:0px;
    /* background-color:rgba(0,0,0,0); */
    font-size:${(props) => props.fontSize};
`

export class index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fontSize: 20,
            cj_text: '',
            cj_text_hl: '',
            hightLightCJText: () => { }
        }
        this.inputOpenFileRef = React.createRef()

    }


    componentDidMount() {
        const parseUrl = require("parse-url")
        let { REACT_APP_LOCAL_MODE = 'FALSE' } = process.env
        if (REACT_APP_LOCAL_MODE === 'FALSE') {
            if (parseUrl(window.location.href).search === 'relabel=true') {
                this.requestLabeledDoc()
            }
            else {
                this.requestUnlabelDoc()
            }
        }
        else {
            // this.inputOpenFileRef.current.click()
        }



        this.setState({
            saveLabeldData: this.saveLabeldData,
            getNextDoc: this.getNextDoc,
            hightLightCJText: this.hightLightCJText,
            exportLabeledDoc: this.exportLabeledDoc
        })
    }

    getNextDoc = () => {
        window.location.reload()
    }

    delDocOnclick = () => {
        let { dispatch } = this.props,
            { TagReducer = {} } = this.props.state,
            { unlabelDocId = '' } = TagReducer
        dispatch(delDoc(unlabelDocId))
    }

    exportLabeledDoc = () => {
        let { dispatch } = this.props
        let { SideMenuReducer,TagReducer } = this.props.state,
            { defendantsTagInfo } = SideMenuReducer,
            { unlabelDocId = '',unlabelDoc } = TagReducer
        
        dispatch(downloadLabeledDoc(unlabelDocId,unlabelDoc,defendantsTagInfo))
    }

    static getDerivedStateFromProps(props, state) {
        let { TagReducer = {}, MainReducer = {}, SideMenuReducer = {} } = props.state,
            // eslint-disable-next-line
            { currentSelectDefendant = '', adefendants } = SideMenuReducer
        // { dispatch } = props
        // console.log(TagReducer)
        if (state.cj_text !== TagReducer.unlabelDoc) {
            return {
                // cj_text_hl: state.hightLightCJText(TagReducer.unlabelDoc),
                cj_text: TagReducer.unlabelDoc
            }
        }

        if (MainReducer.currentKeyDown !== state.currentKeyDown) {
            if (MainReducer.currentKeyDown === 's') {
                state.saveLabeldData()
            }
            if (MainReducer.currentKeyDown === 'n') {
                state.getNextDoc()
                // window.location.reload()
            }
            if (MainReducer.currentKeyDown === 't') {
                state.exportLabeledDoc()
            }
        }

        return {
            currentKeyDown: MainReducer.currentKeyDown,
            // cj_text_hl: state.hightLightCJText(state.cj_text, defendants.concat(TagReducer.identitylist)),
            // cj_text_hl: state.hightLightCJText(state.cj_text, [currentSelectDefendant]),
        }
    }

    hightLightCJText = (cj_text, reg_type,highlights) => {
        var re_array
        if (reg_type==="bank")
        {   

            let re_bank_1=new RegExp("(.{0,4})(銀行|郵局|郵政|信託|世華|金庫|商銀|企銀|開發|信合社|漁會|農會|信用合作社|中央信託局)(.{0,5})(帳號|帳戶|│)?(?:(?!年|元|月|萬|千|百|第)\\w)(.{0,11})(?:(?!年|元|月|萬|千|百|第)\\w)[0-9]{0,4}(-|─|－|—|–)?(?:(?!年|元|月|萬|千|百|第)\\w)[0-9]{3,15}(.{0,9})(帳戶|存簿)","g");
            let re_bank_2=new RegExp("(.{0,4})(銀行|郵局|郵政|信託|世華|金庫|商銀|企銀|開發|信合社|漁會|農會|信用合作社|中央信託局)+(.{0,20})(帳號|帳戶|局號|│|卡號)(.{0,10})(?:(?!年|元|月|萬|千|百)\\w)[0-9]{0,4}(-|─|－|—|–)?(?:(?!年|元|月|萬|千|百)\\w)[0-9]{3,15}(?:(?!年|元|月|萬|千|百)\\w)(號)?(帳戶)?(、)?[0-9]*","g")
            // var test=/(.{0,30})高雄銀行帳號00/g.exec(cj_text)
            // console.log(7777)
            // console.log(test)
            var re_array_2=cj_text.match(re_bank_2)
            re_array=cj_text.match(re_bank_1)
            if(re_array===null && re_array_2===null)
            {
                return;
            }
            
            if(re_array_2!==null && re_array !==null)
            {
                re_array=re_array.concat(re_array_2);
            }
            // console.log(re_array_1);
            
        }
        else if (reg_type==='phone')
        {
            let re_phone=new RegExp("[^編帳]{1}[^ 第0-9\uFF10-\uFF19a-z\uFF41-\uFF5AA-Z\uFF21-\uFF3A：、警戶鑑-]{1}[ ]{0,2}([0-9]{4}[-─－—–]?[0-9]{3}[-─－—–]?[0-9]{3})[^0-9\uFF10-\uFF19a-z\uFF41-\uFF5AA-Z\uFF21-\uFF3A帳戶]{1}","g")
             re_array=cj_text.match(re_phone)
        }
        else if(reg_type=== 'car')
        {
            let re_car=new RegExp("(牌照號碼|車牌號碼|車號|車牌)(號|為|：|:)?([a-zA-Z0-9]{1,5}[-─－—–][a-zA-Z0-9]{1,5})號?","g")
             re_array=cj_text.match(re_car)
        }
        if (re_array === null )
        {
            return;
        }
        re_array.forEach((hlText) => {
            if (hlText !== '') {
                let re = new RegExp(hlText, "g");
                for(var i=0;i<highlights.length;i++)
                {
                    let contain=hlText.includes(highlights[i].value)
                    console.log(contain)
                    if(contain===true)
                    {
                        
                        var certain_text=highlights[i].value
                        console.log("contain",certain_text)
                        console.log(hlText)
                        console.log('------------------')
                        hlText=hlText.replace(certain_text,`<span>${certain_text}</span>`)
                        console.log(hlText)
                        console.log(777777777777777777777)
                        cj_text = cj_text.replace(re,hlText)
                    }
                }
                
                // cj_text = cj_text.replace(re,hlText)
            }
        })
        
        return cj_text
    }

    saveLabeldData = () => {
        // eslint-disable-next-line
        let { dispatch } = this.props,
            { SideMenuReducer = {}, TagReducer = {} } = this.props.state,
            { defendantsTagInfo } = SideMenuReducer,
            { unlabelDocId = '' } = TagReducer
        console.log('save ->', defendantsTagInfo)
        // if (unlabelDocId !== '' && Object.keys(defendantsTagInfo).length > 0) {
        //     dispatch(saveLabledDataAction(unlabelDocId, defendantsTagInfo))
        // }
        // else {
        //     alert("saveLabeldData error,rule not pass")
        //     console.warn("saveLabeldData error,rule not pass", unlabelDocId, defendantsTagInfo)
        // }
    }

    requestLabeledDoc = () => {
        let { dispatch } = this.props
        dispatch(getReLableDoc())
    }

    requestUnlabelDoc = () => {
        let { dispatch } = this.props
        dispatch(getUnlabelDoc())
    }

    setFontSize = (newSize) => {
        this.setState({
            fontSize: newSize
        })
    }

    tagWords = (e) => {
        let { dispatch } = this.props
        let selection = window.getSelection();
        let selectWord = selection.toString();
        let tag_start = selection.anchorOffset;
        let tag_end = selection.focusOffset - 1;

        if (selectWord.length === 0) {
            return
        }

        if (tag_end < tag_start) {
            var _tmp = tag_end
            tag_end = tag_start
            tag_start = _tmp
        }

        let selectTag = {
            val: selectWord,
            tag_start,
            tag_end
        }
        console.log(selectTag)
        dispatch(submitTag(selectTag))
        this.cleanSelection()

    }

    cleanSelection = () => {
        if (window.getSelection) {
            if (window.getSelection().empty) {
                // Chrome
                window.getSelection().empty();
            } else if (window.getSelection().removeAllRanges) {
                // Firefox
                window.getSelection().removeAllRanges();
            }
        } else if (document.selection) {
            // IE?
            document.selection.empty();
        }
    }

    render() {

        let { cj_text, fontSize } = this.state
        // console.log(7777777777777)
        // console.log(this.props.state)
        // console.log(7777777777777)
        let { SideMenuReducer = {}, TagReducer = {} } = this.props.state,
            { defendants } = SideMenuReducer,
            { unlabelDocHl } = TagReducer
        let cj_text_defendants_hl = this.hightLightCJText(cj_text, "bank", unlabelDocHl)
        let cj_text_identitylist_hl = this.hightLightCJText(cj_text, "car", unlabelDocHl)
        let cj_text_positionList_hl = this.hightLightCJText(cj_text, "phone", unlabelDocHl)
        // let cj_text_law_hl = this.hightLightCJText(cj_text, ['條', '項', '款'])
        // console.log(cj_text_hl)

        let { REACT_APP_LOCAL_MODE = 'FALSE' } = process.env
        if (REACT_APP_LOCAL_MODE === 'TRUE' && cj_text === '') {
            return (
                <>
                    <LocalUpload />
                </>
            )
        }
        return (
            <div>
                <div>
                    <label htmlFor="">font-size:{fontSize}&nbsp;&nbsp;</label>
                    <button className="mr-1" onClick={() => { this.setFontSize(fontSize + 1) }}> + </button>
                    <button onClick={() => { this.setFontSize(fontSize - 1) }}> - </button>
                </div>
                <hr />
                <button className="mr-1" onClick={this.saveLabeldData}>儲存(s)</button>
                <button className="mr-1" onClick={this.getNextDoc}>下一篇(n)</button>
                <button className="mr-1" onClick={this.exportLabeledDoc}>匯出本篇標註結果(t)</button>
                <button className="float-right btn-danger" onClick={this.delDocOnclick}>撤銷本篇</button>
                <hr />
                {cj_text === '' ?
                    <small>載入中</small>
                    :
                    <div style={{ position: 'relative', zIndex: 0 }}>
                        {/* 被告HL */}
                        <TagBlockFront
                            fontSize={`${fontSize}px`}
                            markColor={'yellow'}
                            opacity={'0.5'}
                            dangerouslySetInnerHTML={{
                                __html: cj_text_defendants_hl
                            }}
                        />

                        {/* 身份HL */}
                        <TagBlockFront
                           fontSize={`${fontSize}px`}
                           markColor={'cyan'}
                           opacity={'0.25'}
                           dangerouslySetInnerHTML={{
                               __html: cj_text_identitylist_hl
                           }}
                        />

                        {/* 職稱HL */}
                        <TagBlockFront
                           fontSize={`${fontSize}px`}
                           markColor={'green'}
                           opacity={'0.25'}
                           dangerouslySetInnerHTML={{
                               __html: cj_text_positionList_hl
                           }}
                        />

                        {/* 法條HL */}
                        <TagBlockFront
                        //    fontSize={`${fontSize}px`}
                        //    markColor={'purple'}
                        //    opacity={'0.15'}
                        //    dangerouslySetInnerHTML={{
                        //        __html: cj_text_law_hl
                        //    }}
                        />

                        {/* Tagging onMouseUp */}
                        <TagBlockRear
                            key={JSON.stringify(this.props)}
                            fontSize={`${fontSize}px`}
                            onMouseUp={(e) => this.tagWords(e)}
                        >
                            {cj_text}
                        </TagBlockRear>

                    </div>
                }
            </div >
        )
    }
}

let mapStateToProps = (state) => {
    return {
        state
    }
}

export default connect(mapStateToProps)(index)