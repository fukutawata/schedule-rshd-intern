/**
 main.js
 created by shiro on 2022/08/22
 */

const client = new KintoneRestAPIClient({});
$(function(){
    kintone.events.on('app.record.index.show', event => {
        const { record } = event;
        const listName = event.viewName;
        const header = kintone.app.getHeaderMenuSpaceElement();

        // CSV読み込みボタン
        const fileReader = new FileReader();
        // fileReader.onload = () => {
        //     //解析結果がreader.resultに代入されている
        //     console.log(fileReader.result);
        //     alert("ファイルが読み込まれました。");
        // };
        fileReader.addEventListener('load',async function(event){
            console.log(fileReader.result);
            // const parseData = parseCSV(fileReader.result);
            const parseData = $.csv.toArrays(fileReader.result, {
                delimiter: '"', 
                separator: ',',
            });
            console.log(parseData);
            // debugger;
            await importCSVData(parseData);
            
            alert("ファイルからデータが読み込まれました。");
        },false);

        const uploadForm = document.createElement('form');
        uploadForm.id = 'upload_form';
        header.appendChild(uploadForm);
        uploadForm.addEventListener(
            'submit',
            // async function(event) {
            function(event) {
                console.log(event);
                console.log('成功しました');
                const selectFile = document.getElementById('select_btn');
                const files = selectFile.files;

                // ファイルが選択されていなかったら終了
                if (files.length === 0) {
                    alert("ファイルが選択されていません");
                    return false;
                }
                // 1つ目のファイルを取得する
                const file = files[0];
                
                
                const fileInput = fileReader.readAsText(file, "Shift_JIS");
                // const fileInput = fileReader.readAsText(file);
                // debugger;

                return false;
            },
            false
        );

        const selectBtn = document.createElement('input');
        selectBtn.setAttribute('type', 'file');
        selectBtn.setAttribute('accept','.csv');
        selectBtn.id = 'select_btn';
        uploadForm.appendChild(selectBtn);
        
        const importBtn = document.createElement('input');
        importBtn.setAttribute('type', 'submit');
        importBtn.innerText = '読み込み';
        uploadForm.appendChild(importBtn);

        return event;
    });

    // async function getGaroonImportRecords() {
    //     return await client.record.getAllRecords({
    //         app: 9999999999,
    //         condition: ``,
    //     });
    // }
    async function importCSVData(csvRows) {
        try {
            const insertRecordsArray = [];
            // for (let i = 0; i < csvRows.length; i++) {
            for (let i = 1; i < 100; i++) {
                const csvRow = csvRows[i];
                console.log(csvRow[1]);
                const insertRecord = {
                    
                    // 開始日","開始時刻","終了日","終了時刻","予定","予定詳細","メモ","参加者/組織/施設","登録者"
                    メンバー: {
                        value: [{code:csvRow[7]}],
                        
                    },
                    開始日: {
                        value: csvRow[0].replace(/\//g,'-'),
                        // value: csvRow[0],
                    },
                    開始時刻: {
                        value: csvRow[1],
                    },
                    終了日: {
                        // value: '2022-06-02',
                        value: csvRow[2].replace(/\//g,'-'),
                    },
                    終了時刻: {
                        value: csvRow[3],
                    },
                    カテゴリ: {
                        value: csvRow[4],
                    },
                    Garoon予定カテゴリ: {
                        value: csvRow[4],
                    },
                    予定詳細: {
                        value: csvRow[5],
                    },
                    メモ: {
                        value: csvRow[6],
                    },
                    // 参加者: {
                    //     value: csvRow[7],
                    // },
                    // 登録者: {
                    //     value: csvRow[8],
                    // }
                    
                };
                insertRecordsArray.push(insertRecord);
            }
            return await client.record.addAllRecords({ app: 3207, records: insertRecordsArray,});
            // return await kintone.api(kintone.api.url('/k/v1/records.json', true), 'POST', { app: 3207, records: insertRecordsArray});
        } catch (e) {
            console.log(e.toString());
        }

    }
    // function parseCSV(csv){
    //     let tmp=[];
    //     csv=csv.replace(/("[^"]*")+/g,(match)=>{
    //         tmp.push(match.slice(1,-1).replace(/""/g,'"'));return '[TMP]';
    //     });
    //     return csv.split("\n").map((row)=>{
    //         return row.split(',').map((val)=>val==='[TMP]'?tmp.shift():val)
    //     });
    // };
});
