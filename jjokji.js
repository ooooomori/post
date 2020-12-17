var notenum = {};
var noteread = {};

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
  if(notenum[sender] == undefined){
      notenum[sender] = 0;
    }
    if(noteread[sender] == undefined){
      noteread[sender] = false;
    }
    var note = FileStream.read("sdcard/botDB/"+room+"/note/note.json");
      if(note == null) note = [];
      else note = JSON.parse(note);
      
    if(msg.startsWith("!쪽지 ") && msg.indexOf("-")!=-1){
      var receiver = msg.split("!쪽지 ")[1].split("-")[0];
      var letter = msg.split("-")[1];
      try{
      note.push({
          'sender': sender, 
          'letter' : letter,
          'receiver' : receiver,
          'date' : new Date().toLocaleString(),
          'read' : "읽지 않음"
          });
         replier.reply("[!] "+receiver+"님에게 쪽지가 전송되었습니다.");
         noteread[receiver] = false;
        FileStream.write("sdcard/msgbot/"+room+"/note/note.json",JSON.stringify(note, null, '\t'));
        } catch(e){
          replier.reply("[!] 쪽지 발송 실패");
        }
      }
      var received = 0;
      var letternum = [];
      var newed = 0;
      for(var i=0; i<note.length; i++){
        if(note[i]['receiver'] == sender){
          received++;
          letternum.unshift(i);
          if(note[i]['read'] == "읽지 않음"){
            newed++;
          }
        }
      }
      if(received != 0 && received != notenum[sender] && note[letternum[0]]['read'] == "읽지 않음" && msg != "!쪽지확인" && noteread[sender] == false){
        replier.reply("[!] "+sender+"님, 아직 읽지 않은 쪽지가 "+newed+"개 있어요. '!쪽지확인'을 통해 쪽지를 읽어보세요.");
        noteread[sender] = true;
      }
      
      if(msg=="!쪽지확인"){
        if(received == 0){
          replier.reply("[!] 도착한 쪽지가 없어요.");
          return false;
        }
        notenum[sender] = received;
        newed =0;
        noteread[sender] = false;
        var notecheck = "["+sender+"] 님에게 온 쪽지: "+received+"개"+"\u200b".repeat(500)+"\n\n";
        for(var i=0; i<letternum.length; i++){
          if(note[letternum[i]]['read'] == undefined){
            note[letternum[i]]['read'] = "읽음";
          }
          notecheck += "-".repeat(35) + "\n• 발신인: " + note[letternum[i]]['sender'] + "\n\n• 내용: " +note[letternum[i]]['letter']+"\n\n• "+note[letternum[i]]['date'].split(" GMT")[0]+" ["+note[letternum[i]]['read']+"]\n"+"-".repeat(35)+"\n";
        }
        notecheck += "\n※ '!쪽지삭제'로 쪽지함을 비울 수 있습니다.";
        //notecheck += "-".repeat(25) + "\n• 발신인: " + note[letternum[letternum.length-1]]['sender'] + "\n• 내용: " +note[letternum[letternum.length-1]]['letter']+"\n• 날짜: "+note[letternum[letternum.length-1]]['date']+"\n"+"-".repeat(25);
        replier.reply(notecheck);
        for(var i=0; i<letternum.length; i++){
        note[letternum[i]]['read'] = "읽음";
      }
      FileStream.write("sdcard/msgbot/"+room+"/note/note.json",JSON.stringify(note, null, '\t'));
      }
      if(msg == "!쪽지삭제"){
        for(var i=0; i<letternum.length; i++){
        note.splice(letternum[0],1);
        letternum.splice(0,1);
        }
        letternum = [];
        notenum[sender] = 0;
        FileStream.write("sdcard/msgbot/"+room+"/note/note.json",JSON.stringify(note, null, '\t'));
        replier.reply("[!] 쪽지함 청소 완료");
      }
      
    if(msg == "!쪽지"){
      replier.reply("[!] !쪽지 닉네임-내용 형태로 압력해주세요");
    }
}
