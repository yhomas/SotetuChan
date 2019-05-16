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
  // ユーザーのメッセージを取得
  
  // カレンダー情報の取得
  var calenderID=PropertiesService.getScriptProperties().getProperty("calenderID1");
  var myCals=CalendarApp.getCalendarById(calenderID); //特定のIDのカレンダーを取得
  var myEvents=myCals.getEventsForDay(new Date());　//カレンダーの本日のイベントを取得
 
  var userMessage = "今日("+Utilities.formatDate(new Date(), 'JST', 'yyyy/MM/dd')+")の旦那の予定は以下デッツ↓\n";

  for(var i=0;i<myEvents.length;i++){
    var strTitle=myEvents[i].getTitle(); //イベントのタイトル
    userMessage=userMessage + strTitle + '\n'; //チャットワークに送る文字列にイベント内容を追加
  }
  if(myEvents.length==0) userMessage=userMessage + 'なし';
  
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