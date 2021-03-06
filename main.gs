//そてっちゃん水やりLINE BOT
//Author@Masakichi

// LINE developersのメッセージ送受信設定に記載のアクセストークン
var ACCESS_TOKEN = PropertiesService.getScriptProperties().getProperty("ACCESS_TOKEN");

function doPost(e) {
  // WebHookで受信した応答用Token
  var replyToken = JSON.parse(e.postData.contents).events[0].replyToken;
  // ユーザーのメッセージを取得
  var userMessage = JSON.parse(e.postData.contents).events[0].message.text;
  var userMessageArr = userMessage.split("");
  
  //var roomId = JSON.parse(e.postData.contents).events[0].source.roomId;
  
  // 応答メッセージ用のAPI URL
  var url = 'https://api.line.me/v2/bot/message/reply';
  
  if(userMessageArr[userMessageArr.length -1] == "?" || userMessageArr[userMessageArr.length -1] == "？"){
    //?を”デッツ”に変換する
    userMessageArr[userMessageArr.length -1] = "デッツ";
    userMessage = userMessageArr.join("");
    
    UrlFetchApp.fetch(url, {
      'headers': {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + ACCESS_TOKEN,
      },
      'method': 'post',
      'payload': JSON.stringify({
        'replyToken': replyToken,
        'messages': [{
          'type': 'text',
          'text': userMessage,
        }],
      }),
    });
    return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
  }
}

function needWater(){
  
  // グループのToken  
  var pushToken = PropertiesService.getScriptProperties().getProperty("ROOMID1");
  // ユーザーのメッセージを取得
  var userMessage = "そろそろお水がほしいデッツ！土が乾いて白くなっていたら水が下に抜けるくらいたくさん欲しいデッツ！";
  
  // 応答メッセージ用のAPI URL
  var url = 'https://api.line.me/v2/bot/message/push';
  
  UrlFetchApp.fetch(url, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'to': pushToken,
      'messages': [{
        'type': 'text',
        'text': userMessage,
      }],
    }),
  });
  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
  
}

function noticeEvent(){
  // グループのToken  
  var pushToken = PropertiesService.getScriptProperties().getProperty("ROOMID1");
  var date= new Date();
  
  //翌日を取得
  date.setDate(date.getDate() + 1);

  // ユーザーのメッセージを取得
  
  // 1人目のカレンダー情報の取得
  var calenderID1=PropertiesService.getScriptProperties().getProperty("calenderID1");
  var myCals1=CalendarApp.getCalendarById(calenderID1); //特定のIDのカレンダーを取得
  var myEvents1=myCals1.getEventsForDay(date);　//カレンダーの本日のイベントを取得
  
  // 2人目のカレンダー情報の取得
  var calenderID2=PropertiesService.getScriptProperties().getProperty("calenderID2");
  var myCals2=CalendarApp.getCalendarById(calenderID2); //特定のIDのカレンダーを取得
  var myEvents2=myCals2.getEventsForDay(date);　//カレンダーの本日のイベントを取得
  
  //1人目の予定メッセージの作成
  var userMessage1 = "今日("+Utilities.formatDate(new Date(), 'JST', 'yyyy/MM/dd')+")の旦那の予定は以下デッツ↓\n";
  
  for(var i=0;i<myEvents1.length;i++){
    var strTitle=myEvents1[i].getTitle(); //イベントのタイトル
    userMessage1=userMessage1 + strTitle + '\n'; //チャットワークに送る文字列にイベント内容を追加
  }
  if(myEvents1.length==0) userMessage1=userMessage1 + 'なし';
  
  //2人目の予定メッセージの作成  
  var userMessage2 = "今日("+Utilities.formatDate(new Date(), 'JST', 'yyyy/MM/dd')+")の奥の予定は以下デッツ↓\n";
  
  for(var i=0;i<myEvents2.length;i++){
    var strTitle=myEvents2[i].getTitle(); //イベントのタイトル
    userMessage2=userMessage2 + strTitle + '\n'; //チャットワークに送る文字列にイベント内容を追加
  }
  if(myEvents2.length==0) userMessage2=userMessage2 + 'なし';
  
 
  if(myEvents1.length >0 || myEvents2.length > 0){
  
  // 応答メッセージ用のAPI URL
  var url = 'https://api.line.me/v2/bot/message/push';
  
  UrlFetchApp.fetch(url, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'to': pushToken,
      'messages': [{
        'type': 'text',
        'text': userMessage1,
      },
                   {
                     'type': 'text',
                     'text': userMessage2,
                   }],
    }),
  });
  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
  }
}

function trainDelay(){
  //鉄道の遅延情報を取得
  var properties = PropertiesService.getScriptProperties();
  var URL="https://tetsudo.rti-giken.jp/free/delay.json";
  var response = UrlFetchApp.fetch(URL);
  var json=JSON.parse(response.getContentText());
  var previousDelay = properties.getProperty("previousDelay");
  var previousUpdate = properties.getProperty("previousUpdate");

  Logger.log(String(json.filter(function(x){return x.name=="千代田線"})[0].lastupdate_gmt));
  
  if(json.filter(function(x){return x.name=="千代田線"}).length > 0){//遅延情報が存在する場合
    if(!(previousDelay == "1" && previousUpdate == String(json.filter(function(x){return x.name=="千代田線"})[0].lastupdate_gmt))){
    
    properties.setProperty("previousDelay", "1");
    properties.setProperty("previousUpdate", String(json.filter(function(x){return x.name=="千代田線"})[0].lastupdate_gmt));

    var userMessage = "千代田線に新たな遅延/運休情報があるデッツ！→https://www.tokyometro.jp/unkou/history/chiyoda.html";
    
    // グループのToken  
    var pushToken = PropertiesService.getScriptProperties().getProperty("ROOMID1");
    
    // 応答メッセージ用のAPI URL
    var url = 'https://api.line.me/v2/bot/message/push';
    
    UrlFetchApp.fetch(url, {
      'headers': {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + ACCESS_TOKEN,
      },
      'method': 'post',
      'payload': JSON.stringify({
        'to': pushToken,
        'messages': [{
          'type': 'text',
          'text': userMessage,
        }],
      }),
    });
    return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
    }
  }else{ //遅延情報が存在しない場合
    if(previousDelay == "1"){
      
      properties.setProperty("previousDelay", "0");
      
      var userMessage = "千代田線の遅延/運休が回復したデッツ。";
    
    // グループのToken  
    var pushToken = PropertiesService.getScriptProperties().getProperty("ROOMID1");
    
    // 応答メッセージ用のAPI URL
    var url = 'https://api.line.me/v2/bot/message/push';
    
    UrlFetchApp.fetch(url, {
      'headers': {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + ACCESS_TOKEN,
      },
      'method': 'post',
      'payload': JSON.stringify({
        'to': pushToken,
        'messages': [{
          'type': 'text',
          'text': userMessage,
        }],
      }),
    });
    return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
      
    }

  }
  
}