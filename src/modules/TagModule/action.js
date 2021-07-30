import { initApp } from '../action'
import { setDefendants, updateDefendantsTagInfo } from '../SideMenuModule/action'

const axios = require('axios');

let API_SERVER = ''
let { REACT_APP_LOCAL_MODE = 'FALSE' } = process.env

//開發模式下，API_SERVER打到測試後端，production(build之後)
if (process.env.NODE_ENV !== 'production' && REACT_APP_LOCAL_MODE === 'FALSE') {
    API_SERVER = 'http://140.120.13.245:9489'
    //140.120.182.90:9487
    //http://140.120.13.245:9489
    // API_SERVER = 'https://acf9b465017b.ngrok.io/verdicts'
}
console.log('API_SERVER:', API_SERVER)



export const getIdentityList = () => {
    return (dispatch) => {
        dispatch({
            type: 'TAG_GET_IDENTITY_LIST_START'
        })
        //https://gist.github.com/l53513955/c18c72ae165dd7359713ba70b0ea00dc
        axios.get('https://gist.githubusercontent.com/l53513955/c18c72ae165dd7359713ba70b0ea00dc/raw/c506aec56ae064b1777a4b51aee30fec122fa75b/gistfile1.txt')
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
        axios.post(API_SERVER + '/verdicts/error-report', error_doc)
            .then((res) => {
                console.log(API_SERVER+'/verdicts/error-report')
                alert("完成")
                dispatch({type: 'TAG_ERROR_DOC_SUCCESS'})
            })
            .catch((error) => {
                console.log(API_SERVER+'/verdicts/error-report')
                console.log('錯誤訊息回傳失敗:',error.response.data)
                alert("失敗")
                dispatch({type: 'TAG_ERROR_DOC_FAIL'})
            })
            
    }
}


export const getUnlabelDoc = () => {
     
    return (dispatch) => {
        dispatch(initApp())
        dispatch({ type: "TAG_GET_UNLABEL_DOC_START" })
        axios.get(API_SERVER+'/verdicts',{headers: {"Access-Control-Allow-Origin": "*"}})////"/unlabel_doc id" ,{headers: {"Access-Control-Allow-Origin": "*"}}
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
    
    //return oriObjects.map((oriObject) => { })  每個case只有一組故不需回傳整個array
       let oriObject=oriObjects[0]
        return {
            value: oriObject.val,
            start: oriObject.tag_start,
            end: oriObject.tag_end
        }
    
}

export const saveLabeledData = (unlabelDocId, defendantsTagInfo,bankAccountsTagInfo,phoneNumbersTagInfo) => {
    console.log(phoneNumbersTagInfo)
    return (dispatch) => {
        dispatch({ type: "TAG_SAVE_LABELED_DATA_START" })
        let defendantsTagInfoKeys = Object.keys(defendantsTagInfo)
        let bankAccountsTagInfoKeys = Object.keys(bankAccountsTagInfo)
        let phoneNumbersTagInfoKeys = Object.keys(phoneNumbersTagInfo)
        // let defendant_name
        // if(Object.keys(defendantsTagInfo).length  !== 0){ defendant_name=Object.values(defendantsTagInfo)[0].被告[0].val}
        // else if(Object.keys(bankAccountsTagInfo).length  !== 0){defendant_name=Object.values(bankAccountsTagInfo)[0].被告[0].val}
        // else if(Object.keys(phoneNumbersTagInfo).length  !== 0) { defendant_name=Object.values(phoneNumbersTagInfo)[0].被告[0].val}
       
        let licensePlate=[]
        let bankAccount=[]
        let cellPhoneNumber=[]
       
        if(Object.keys(defendantsTagInfo).length  !== 0){
            defendantsTagInfoKeys.forEach((key) => {  
                //車牌 let ACTION_TAGS = ['被告', '車種',]
                let ownerPostion = _changeObjectKey2Api(defendantsTagInfo[`${key}`][`${'持有人'}`])
                let vehicleType = _changeObjectKey2Api(defendantsTagInfo[`${key}`][`${'車種'}`])
                let carNumber ='',nStart='',nEnd=''
                let i
              
                for(i=0;i<key.length;i++){
                    if (key[i]!=='_')
                      carNumber=carNumber+key[i]
                    else if (key[i]==='_') 
                        break 
                }           
                for(i;i<key.length;i++){
                    if (key[i]==='S'|| key[i]===':' ||key[i]==='_')
                          continue
                    else if (key[i]==='E') 
                        break  
                    else
                      nStart=nStart+key[i]
                                   
                }
                for(i;i<key.length;i++){
                    if (key[i]!=='E'&& key[i]!==':')
                        nEnd=nEnd+key[i]
                    else
                     continue              
                }
                let number={value: carNumber, start: parseInt(nStart,10), end: parseInt(nEnd, 10)}
                licensePlate.push({
                    number,
                    ownerPostion,
                    vehicleType,
                })
            })
        }
                    
        if(Object.keys(bankAccountsTagInfo).length  !== 0){
            bankAccountsTagInfoKeys.forEach((key)=>{
                    //帳號 let ACTION_TAGS = ['被告', '帳戶','銀行','分行']
                   
    
                let ownerPostion=_changeObjectKey2Api(bankAccountsTagInfo[`${key}`][`${'持有人'}`])
                let bank=_changeObjectKey2Api(bankAccountsTagInfo[`${key}`][`${'銀行'}`])
                let branch=_changeObjectKey2Api(bankAccountsTagInfo[`${key}`][`${'分行'}`])
                let bankNumber ='',nStart='',nEnd=''
                let i

                for(i=0;i<key.length;i++){
                    if (key[i]!=='_')
                        bankNumber=bankNumber+key[i]
                    else if (key[i]==='_') 
                        break 
                }           
                for(i;i<key.length;i++){
                    if (key[i]==='S'|| key[i]===':' ||key[i]==='_')
                          continue
                    else if (key[i]==='E') 
                        break  
                    else
                      nStart=nStart+key[i]
                                   
                }
                
                for(i;i<key.length;i++){
                    if (key[i]!=='E'&& key[i]!==':')
                        nEnd=nEnd+key[i]
                    else
                     continue              
                }
                let number={value: bankNumber, start: parseInt(nStart,10), end: parseInt(nEnd, 10)}
                bankAccount.push({
                    number,
                    ownerPostion,
                    bank ,
                    branch          })
            })
       
        }
      
        if(Object.keys(phoneNumbersTagInfo).length  !== 0){
            phoneNumbersTagInfoKeys.forEach((key)=>{
            let ownerPostion=_changeObjectKey2Api(phoneNumbersTagInfo[`${key}`][`${'持有人'}`])
            let phoneNumber ='',nStart='',nEnd=''
                let i
               
                for(i=0;i<key.length;i++){
                    if (key[i]!=='_')
                     phoneNumber=phoneNumber+key[i]
                    else if (key[i]==='_') 
                        break 
                }           
                for(i;i<key.length;i++){
                    if (key[i]==='S'|| key[i]===':' ||key[i]==='_')
                          continue
                    else if (key[i]==='E') 
                        break  
                    else
                      nStart=nStart+key[i]
                                   
                }
                for(i;i<key.length;i++){
                    if (key[i]!=='E'&& key[i]!==':')
                        nEnd=nEnd+key[i]
                    else
                     continue              
                }
                let number={value: phoneNumber, start: parseInt(nStart,10), end: parseInt(nEnd, 10)}
            
            
            cellPhoneNumber.push({
                number,
                ownerPostion,
                       })
            })
        }
       
          //converge to spec labled data
          let api_labeled_data = {
            "verdict_id": unlabelDocId,
            "property": {
                    licensePlate,
                    bankAccount,
                    cellPhoneNumber
                
            }
        }
        console.log("JSON:")
        console.log(api_labeled_data)
        axios.post(API_SERVER+'/verdicts',api_labeled_data)
            .then((res) => {
                //console.log(res)
                dispatch({type:"TAG_SAVE_LABELED_DATA_SUCESS" })
                alert("已儲存,ID:"+unlabelDocId)
            })
            .catch((error) => {
                console.log(API_SERVER+'/verdicts')
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
