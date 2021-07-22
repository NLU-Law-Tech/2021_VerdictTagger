import { initApp } from '../action'
import { setDefendants, updateDefendantsTagInfo } from '../SideMenuModule/action'

const axios = require('axios');

let API_SERVER = ''
let { REACT_APP_LOCAL_MODE = 'FALSE' } = process.env


if (process.env.NODE_ENV !== 'production' && REACT_APP_LOCAL_MODE === 'FALSE') {
    API_SERVER = 'http://140.120.13.245:9489/verdicts'
    // API_SERVER = 'https://acf9b465017b.ngrok.io/verdicts'
}
console.log('API_SERVER:', API_SERVER)

export const getPostionList = () => {
    return (dispatch) => {
        dispatch({
            type: 'TAG_GET_POSITION_LIST_START'
        })
        axios.get('https://gist.githubusercontent.com/p208p2002/c4a2094f756eba2fa0f132480bf387dd/raw/position_list.txt')
            .then((res) => {
                // console.log(res.data.split("\n"))
                dispatch({
                    type: 'TAG_GET_POSITION_LIST_SUCCESS',
                    positionList: Array.from(new Set(res.data.split("\n")))
                })
            })
            .catch((res) => {
                console.log(res)
                dispatch({
                    type: 'TAG_GET_POSITION_LIST_FAIL'
                })
            })
    }
}

export const getIdentityList = () => {
    return (dispatch) => {
        dispatch({
            type: 'TAG_GET_IDENTITY_LIST_START'
        })
        //https://gist.github.com/p208p2002/cbc21d9a3dd270ad95a5b209e62c1cac
        axios.get('https://gist.githubusercontent.com/p208p2002/cbc21d9a3dd270ad95a5b209e62c1cac/raw/identity_list.txt')
            .then((res) => {
                // console.log(res.data.split("\n"))
                dispatch({
                    type: 'TAG_GET_IDENTITY_LIST_SUCCESS',
                    identitylist: Array.from(new Set(res.data.split("\n")))
                })
            })
            .catch((res) => {
                console.log(res)
                dispatch({
                    type: 'TAG_GET_IDENTITY_LIST_FAIL'
                })
            })
    }
}

export const submitTag = (tagWordObject) => {
    return {
        type: 'TAG_CURRENT_SELECT_WORD',
        currentSelectWord: tagWordObject
    }
}

export const errorDoc = (doc_id,err_message) => {
    let error_doc = {
        verdict_id: doc_id,
        errorMsg: err_message
    }
    return(dispatch) => {
        axios.post(API_SERVER + '/error-report', error_doc)
            .then((res) => {
                // console.log(res.)
                alert("完成")
                dispatch({type: 'TAG_ERROR_DOC_SUCCESS'})
                window.location.reload()
            })
            .catch((error) => {
                console.log(error)
                alert("失敗")
                dispatch({type: 'TAG_ERROR_DOC_FAIL'})
            })
            
    }
}

export const getReLableDoc = () => {
    return (dispatch) => {
        dispatch(initApp())
        dispatch({ type: "TAG_GET_RELABEL_DOC_START" })
        axios.get(API_SERVER+ "/relabel_doc",{headers: {"Access-Control-Allow-Origin": "*"}} )
            .then((res) => {
                let { verdict, content_id = '', labeled_data = [] } = res.data
                console.log(res.data)
                verdict = JSON.parse(verdict)
                let { judgement } = verdict

                dispatch({
                    type: "TAG_GET_RELABEL_DOC_SUCCESS",
                    unlabelDocId: content_id,
                    unlabelDoc: judgement,
                })

                let defendants = []
                labeled_data.forEach((ld) => {
                    let { name } = ld
                    defendants.push(name.content)
                })
                dispatch(setDefendants(defendants))

                let tagInfo = {}
                labeled_data.forEach((ld) => {
                    let { name, identities, laws, positions, units } = ld
                    // val tag_start tag_end
                    identities = identities.map((_id) => {
                        return {
                            val: _id.content,
                            tag_start: _id.start,
                            tag_end: _id.end
                        }
                    })

                    laws = laws.map((_id) => {
                        return {
                            val: _id.content,
                            tag_start: _id.start,
                            tag_end: _id.end
                        }
                    })

                    positions = positions.map((_id) => {
                        return {
                            val: _id.content,
                            tag_start: _id.start,
                            tag_end: _id.end
                        }
                    })

                    units = units.map((_id) => {
                        return {
                            val: _id.content,
                            tag_start: _id.start,
                            tag_end: _id.end
                        }
                    })


                    tagInfo[`${name.content}`] = {}
                    tagInfo[`${name.content}`]["單位"] = units
                    tagInfo[`${name.content}`]["職稱"] = positions
                    tagInfo[`${name.content}`]["身份"] = identities
                    tagInfo[`${name.content}`]["法條"] = laws

                    console.log(tagInfo)

                })
                dispatch(updateDefendantsTagInfo(tagInfo))

            })
            .catch((error) => {
                // console.log(error.response)
                let { response = {} } = error,
                    { status = -1 } = response
                if (status === 403) {
                    alert("無可標記文件")
                }
                else if (status === -1) {
                    alert("伺服器連線失敗")
                }
            })
    }
}

export const getUnlabelDoc = () => {
     
    return (dispatch) => {
        dispatch(initApp())
        dispatch({ type: "TAG_GET_UNLABEL_DOC_START" })
        axios.get(API_SERVER,{headers: {"Access-Control-Allow-Origin": "*"}})////"/unlabel_doc id" ,{headers: {"Access-Control-Allow-Origin": "*"}}
            .then((res) => {
                //後端input的JSON 直接抓欄位
                
                let content_id=res.data._id
                let judgement=res.data.judgement
                let highlight=res.data.highlight
                //  let { verdict, content_id = '' } = res.data

                // verdict = JSON.parse(verdict)
                // let { judgement } = verdict
                 
                dispatch({
                     type: "TAG_GET_UNLABEL_DOC_SUCCESS",
                     unlabelDocHl: highlight,
                    unlabelDocId: content_id,
                   unlabelDoc:judgement ,
                })
            })
            .catch((error) => {
                 console.log(error.response)
                let { response = {} } = error,
                    { status = -1 } = response
                if (status === 403) {
                    alert("無可標記文件")
                }
                else if (status === -1) {
                    alert("伺服器連線失敗")
                    
                }
            })
    }
}

const _changeObjectKey2Api = (oriObjects) => {
    
    return oriObjects.map((oriObject) => {
        return {
            content: oriObject.val,
            start: oriObject.tag_start,
            end: oriObject.tag_end
        }
    })
}

export const saveLabeledData = (unlabelDocId, defendantsTagInfo,bankAccountsTagInfo,phoneNumbersTagInfo) => {
    console.log(phoneNumbersTagInfo)
    return (dispatch) => {
        dispatch({ type: "TAG_SAVE_LABELED_DATA_START" })
        let defendantsTagInfoKeys = Object.keys(defendantsTagInfo)
        let bankAccountsTagInfoKeys = Object.keys(bankAccountsTagInfo)
        let phoneNumbersTagInfoKeys = Object.keys(phoneNumbersTagInfo)
        let defendant_name
        if(Object.keys(defendantsTagInfo).length  !== 0){ defendant_name=Object.values(defendantsTagInfo)[0].被告[0].val}
        else if(Object.keys(bankAccountsTagInfo).length  !== 0){defendant_name=Object.values(bankAccountsTagInfo)[0].被告[0].val}
        else if(Object.keys(phoneNumbersTagInfo).length  !== 0) { defendant_name=Object.values(phoneNumbersTagInfo)[0].被告[0].val}
        console.log(Object.keys(defendantsTagInfo).length)
        console.log(Object.keys(bankAccountsTagInfo).length)
        console.log(Object.keys(phoneNumbersTagInfo).length)
        let licensePlate=[]
        let bankAccount=[]
        let cellPhoneNumber=[]
       
        if(Object.keys(defendantsTagInfo).length  !== 0){
            defendantsTagInfoKeys.forEach((key) => {
            console.log(defendantsTagInfo)

                //車牌 let ACTION_TAGS = ['被告', '車種',]
                let defenantName_license = _changeObjectKey2Api(defendantsTagInfo[`${key}`][`${'被告'}`])
                let vehicleType = _changeObjectKey2Api(defendantsTagInfo[`${key}`][`${'車種'}`])
                
                console.log(vehicleType)
                licensePlate.push({
                    defenantName_license,
                    vehicleType,
                })
            })
        }
                    
        if(Object.keys(bankAccountsTagInfo).length  !== 0){
            bankAccountsTagInfoKeys.forEach((key)=>{
                    //帳號 let ACTION_TAGS = ['被告', '帳戶','銀行']
                    console.log(defendantsTagInfo[`${key}`])
    
                let defenantName_account=_changeObjectKey2Api(bankAccountsTagInfo[`${key}`][`${'被告'}`])
                let accountNumber=_changeObjectKey2Api(bankAccountsTagInfo[`${key}`][`${'帳戶'}`])
                let bankName=_changeObjectKey2Api(bankAccountsTagInfo[`${key}`][`${'銀行'}`])
                bankAccount.push({
                    defenantName_account,
                    bankName           })
            })
       
        }
      
        if(Object.keys(phoneNumbersTagInfo).length  !== 0){
            phoneNumbersTagInfoKeys.forEach((key)=>{
                //手機號碼 let ACTION_TAGS = ['被告', '手機號碼']
            let defenantName_phone=_changeObjectKey2Api(phoneNumbersTagInfo[`${key}`][`${'被告'}`])
            let phoneNumber=_changeObjectKey2Api(phoneNumbersTagInfo[`${key}`][`${'手機號碼'}`])
            
            cellPhoneNumber.push({
                defenantName_phone,
                phoneNumber        })
            })
        }
          console.log(cellPhoneNumber)

          //converge to spec labled data
          let api_labeled_data = {
            "verdict_id": unlabelDocId,
            "defendant": {
                [defendant_name]:{
                    licensePlate,
                    bankAccount,
                    cellPhoneNumber
                }
            }
        }
        axios.post(API_SERVER,api_labeled_data)
            .then((res) => {
                console.log(res)
                dispatch({type:"TAG_SAVE_LABELED_DATA_SUCESS" })
                alert("已儲存,ID:"+unlabelDocId)
            })
            .catch((error) => {
                console.log(error.response.data)
                alert("失敗")
            })

        

    }
}


export const downloadLabeledDoc = (unlabelDocId, unlabelDoc, defendantsTagInfo) => {
    console.log(unlabelDocId, defendantsTagInfo)
    let defendantsTagInfoKeys = Object.keys(defendantsTagInfo)

    let api_labeled_data = []
    defendantsTagInfoKeys.forEach((key) => {
        console.log(defendantsTagInfo[`${key}`])

        // let ACTION_TAGS = ['單位', '職稱', '身份', '法條']
        let units = _changeObjectKey2Api(defendantsTagInfo[`${key}`][`${'單位'}`])
        let positions = _changeObjectKey2Api(defendantsTagInfo[`${key}`][`${'職稱'}`])
        let identities = _changeObjectKey2Api(defendantsTagInfo[`${key}`][`${'身份'}`])
        let laws = _changeObjectKey2Api(defendantsTagInfo[`${key}`][`${'法條'}`])

        api_labeled_data.push({
            name: {
                content: key,
                start: 0,
                end: 0
            },
            units,
            positions,
            identities,
            laws
        })
    })

    let apiObject = {
        doc_id: unlabelDocId,
        full_doc: unlabelDoc,
        labeled_data: api_labeled_data
    }
    console.log(apiObject)

    const downloadFile = async (fine_name,myData) => {
        const fileName = fine_name.replace(/\..{1,6}$/,"");
        const json = JSON.stringify(myData);
        const blob = new Blob([json], { type: 'application/json' });
        const href = await URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = fileName + ".json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    downloadFile(unlabelDocId,apiObject)

    return {
        type: 'TAG_DOWNLOAD_LABLE_DOC'
    }
}
