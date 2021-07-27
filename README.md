# ITRI LAW-TAGGER
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
![](https://github.com/NLU-Law-Tech/2021_VerdictTagger/blob/f8100d42a7373addbbede2d432b62e7d530b5eb1/demo.gif)
## Ouput Example
```json
{
    "林家珍": {
        "單位": [],
        "職稱": [
            {
                "val": "約僱人員",
                "tag_start": 305,
                "tag_end": 308
            }
        ],
        "身份": [
            {
                "val": "公務員",
                "tag_start": 488,
                "tag_end": 490
            }
        ],
        "法條": []
    }
}
```
