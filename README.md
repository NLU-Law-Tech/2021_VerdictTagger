# 2021 ITRI LAW-TAGGER
法律AI訓練、測試資料，答案標註系統

[使用者指南](https://hackmd.io/0nrrMc5NQRKxlZZVkwmD7w)



## ENV mode
```
REACT_APP_LOCAL_MODE = [TRUE|FALSE] # 單機標註模式
```

## Feature
- 拖移標記
- 關鍵字高亮
- 快捷鍵操作
- 完整標記資訊

## Demo
![](https://github.com/NLU-Law-Tech/2021_VerdictTagger/blob/aa0a6b80296948c8c04a25823d80481e7afc0c5e/demo.gif)
## Ouput Example
```json
{
    "verdict_id": "5fd20e379b09099b73e6ed41",
    "property": {
            "licensePlate": [
                { 
                    "number": {
                        "value": "000-0000",
                        "start": 1,
                        "end": 2
                    },
                    "vehicleType": {
                        "value": "自小客車",
                        "start": 1,
                        "end": 2
                    },
                    "ownerPostion": {
                        "value":"張友澤",
                        "start": 1,
                        "end": 2
                    }
                }
            ],
            "bankAccount": [
                {
                    "bank": {
                        "value": "台新銀行",
                        "start": 1,
                        "end": 2
                    },
                    "branch": {
                        "value": "敦南分行",
                        "start": 1,
                        "end": 2
                    },
                    "number": {
                        "value": "000-000000000",
                        "start": 1,
                        "end": 2
                    },
                    "ownerPostion": {
                        "value":"陳紫淇",
                        "start": 1,
                        "end": 3
                    }
                }
            ],
            "cellPhoneNumber": [
                {              
                    "number": {
                        "value": "0000000000",
                        "start": 1,
                        "end": 2
                    },
                    "ownerPostion": {
                        "value":"童智威",
                        "start": 1,
                        "end": 2
                    }
                }
            ]        
    }
}
             
```
