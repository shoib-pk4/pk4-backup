var app = require('express')()
  , express = require('express')
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , path = require('path');
  
 server.listen(8080);
var url  = require('url');
var qs = require('querystring');
/************************ Process call details for inbound calls****************/
app.all('/call.html', function (req, res) {
	   res.writeHead(200, {"Content-Type": "text/html"});
	   res.write("{\"Call\":\"Success\"}");
	   res.end();
	   var reqURL = req.url;
           reqURL = reqURL.replace(/&amp;/g,"&");
	   var url_parts = url.parse(reqURL, true);
           var queryStr = url_parts.query;
	   var today = new Date();
	   console.log(today);
        var phNum = queryStr['phoneNumber'];var ucid=queryStr['ucid'];var did= queryStr['did'];var callerID= queryStr['phoneNumber'];var skillName= queryStr['skillName'];var agentID = queryStr['agentId'];var campaignId= queryStr['campaignID'];var monitorUcid= queryStr['monitorUcid'];var type= queryStr['type'];var uui = queryStr['uui'];var customer = queryStr['customer'];var dataId = queryStr['dataId'];var email = queryStr['email'];
		if(queryStr['email']) {
			agentID = email;
			console.log("email-"+email);
		}

	   var jsonStr= '{"phNum":"'+phNum+'","ucid":"'+ucid+'","did":"'+did+'","callerID":"'+callerID+'","skillName":"'+skillName+'","agentID":"'+agentID+'","campaignId":"'+campaignId+'","monitorUcid":"'+monitorUcid+'","type":"'+type+'","uui":"'+uui+'","customer":"'+customer+'"}';

	//   console.log("Room-",agentID);
	  io.sockets.in(agentID).emit('processCall',jsonStr);
});
/*****************Process call details of inbound call on call disposition ************/
app.all('/callDetails.html', function (req, res) {
         //var data = req.query['data'];
		 var mq = req.query['validKey'];
		 console.log("mq-"+mq);
		 if (req.method == 'POST') {
			var fullBody = '';
			
			req.on('data', function(chunk) {
			  // append the current chunk of data to the fullBody variable
			  fullBody += chunk.toString();
			});
			
			req.on('end', function() {
			  // parse the received body data
			  var decodedBody = qs.parse(fullBody);
			  var data=decodedBody.data;
			  data = JSON.parse(data);
			  //var mq=data["mq"];
			  var monitorUCID =data["monitorUCID"];var comment = data['Comments'];var callerID = data['CallerID'];
			  var locatn= data['Location'];var status= data['Status'];
			  var did = data["Did"];var uui= data['UUI'];var phName= data['PhoneName'];
			  var skill= data['Skill'];var startTime = data['StartTime'];var endTime = data['EndTime'];var timeToAnswer = data["TimeToAnswer"];
			  var duration= data['Duration'];var fallBackRule = data['FallBackRule'];var dialedNum= data['DialedNumber'];
			  var type= data['Type'];var agentID = data['AgentID'];var agentUniqueID = data['AgentUniqueID'];
			  var disposition= data['Disposition'];var hangupBy = data['HangupBy'];
			  var audioFile= data['AudioFile'];var transferType= data['TransferType'];var transfferedTo=data['TransferredTo'];
			  var dialStatus=data['DialStatus'];var apiKey = data["Apikey"];
              if(duration){
			  var durationSplit = duration.split(":");
			  var hr = durationSplit[0]; var mins = durationSplit[1]; var secds=durationSplit[2];
			  hr = parseInt(hr)*60 ; mins=parseInt(mins); secds = parseInt(secds)/60;
			  duration = hr+mins+secds;
              }
			  mq = encodeURIComponent(mq);
			  var postData = "mq="+mq+"&monitorUcid="+monitorUCID+"&callerID="+callerID+"&comment="+comment+"&locatn="+locatn+"&status="+status+"&did="+did+"&uui="+uui+"&phName="+phName+"&skill="+skill+"&startTime="+startTime+"&endTime="+endTime+"&timeToAnswer="+timeToAnswer+"&duration="+duration+"&fallBackRule="+fallBackRule+"&dialedNum="+dialedNum+"&type="+type+"&agentID="+agentID+"&agentUniqueID="+agentUniqueID+"&disposition="+disposition+"&hangupBy="+hangupBy+"&audioFile="+encodeURIComponent(audioFile)+"&transferType="+transferType+"&transfferedTo="+transfferedTo+"&dialStatus="+dialStatus+"&apiKey="+apiKey;
			  // postData = encodeURIComponent(postData);
			  var today = new Date();
			  console.log(today);
			  console.log(postData);
			  res.writeHead(301,{Location: 'http://192.168.11.11:9090/atCRM/custom/LZ/CallCenter/callDispositionOzonetel.html?'+postData});
			  res.end();
			});
		 }
		 
    });

app.all('/server', function (req, res){
		//console.log('request object from client  ',req.headers);
		res.sendfile(__dirname + '/chat.html');
		//app.use(express.static(path.join(__dirname, 'assets')));
		app.use(express.static(__dirname));
		});


function callback(socket){
	//var html = "<div style='display:block;background:gray;height:50px;float:right;'><div style='width:100px;height:15px'>"+value+"(you)</div></div>";
	var html= "<input type='button'  id='btnToChat' value='chat' onclick='addChat()'>";
	socket.emit('callback',html);
	//socket.emit('getValue',socket);
}

// usernames which are currently connected to the chat
var usernames = {};
var chatusers = {};
var usersFromIT = {};
var ImpelUsers = {};

var usersList = new Array();
var usersToJava = new Array();
// rooms which are currently available in chat
var rooms = ['room1','room2','room3'];
var from_user ;
io.sockets.on('connection',function(socket){
	var status;
      
	  //This will be fired when data is received from client over a single socket
        socket.on('message', function(msg){
            console.log('Received message from client ',msg);
        });
		
	
		//This will be fired when user wants to disconnect chat
		socket.on('forceDisconnect', function(){
           socket.disconnect();
	     });
      
		// when the client emits 'adduser', this listens and executes
		socket.on('adduser', function(username){
			for(var key in username) {
				var value = username[key];
		
			}
			if(usernames[value] === undefined){
				  chatusers[value] = [socket];

			}
			else if(usernames[value] === value){
				 chatusers[value].push(socket);
			}
			
			 console.log('Server addin new client to chat app',chatusers[value]);
			 // store the username in the socket session for this client
			 socket.username = value;
			 // store the room name in the socket session for this client
			 socket.room = 'room1';
			// add the client's username to the global list
			 usernames[value] = value;
			 // send client to room 1
			 socket.join('room1');
			 // echo to room 1 that a person has connected to their room
			 socket.broadcast.to('room1').emit('updatechat', 'SERVER', value + ' has connected to this room at' );
		//	impelSmsFunction();
			
		    var value;
			var i=0;
			for(var key in usernames) {
				  usersToJava[i++] = usernames[key];
			}
		io.sockets.emit('updateusers', usersToJava);
		callback(socket);
	 });


	 // when the client emits 'adduser', this listens and executes
		socket.on('usersFromImpelTouch', function(username){
			var value;
			for(var key in username) {
				 value = username[key];
		
			}
			if(usersFromIT[value] === undefined){
				  usersFromIT[value] = [socket];
			}
			else if(usersFromIT[value] === value){
				 usersFromIT[value].push(socket);
			}
		console.log('Server addin impelTouch client to chat app',usersFromIT[value]);
	 });

//Users from impel, used to send sms
  socket.on('usersFromImpel', function(username){
	  var value
		for(var key in username) {
			 value = username[key];
		
			}

			if( ImpelUsers[value] === undefined){
				   ImpelUsers[value] = [socket];
			}
			else if( ImpelUsers[value] === value){
				  ImpelUsers[value].push(socket);
			}
			console.log('Server addin impel client to chat app',ImpelUsers[value]);
	 });
	

	//Chat Events
	 socket.on('MessageFromImpeltouch', function (recipientName) {
		 var  Test_Char= recipientName.Test_Char;
		 if(Test_Char === "d"){
			 var  reciName= recipientName.checkuser;
			 var senderName = recipientName.sender;
			 console.log("Test_Char :  " +  Test_Char);
			 console.log("Chat user :  " +  reciName);
			 console.log("sender  : " +  senderName);
			 from_user = recipientName.sender;
			 status = false;
			 for(var x in usernames){
				 console.log('x value  : ', x);
				 if(x === reciName ){
						status = true;
				}
			 }
			 if(status === true){
				 for (var i=0;i<chatusers[reciName].length;i++)
					{ 
						console.log("chat user length : ",chatusers[reciName].length);
						 chatusers[reciName][i].emit('chatReuest',senderName);
						//chatusers[senderName][i].emit('UserLoginStatus',  "Busy");
					}
			 }
			else{
					 for (var i=0;i<chatusers[senderName].length;i++)
					{ 
					  console.log("chat user length : ",chatusers[senderName].length);
						chatusers[senderName][i].emit('UserLoginStatus',  status);
					}
					
				 }
			 }
			
		 
		 else  if(Test_Char === "b"){
			  var sender = socket.username;
			   var to_user = recipientName.Login_Name;
			  var chatstr = recipientName.chatBodyStr;
			  var timeStr = recipientName.timeStr;
			 
			  console.log('to_user ' + to_user );
			  console.log('chatstring' + chatstr);
			  
			  //Getting current date time
			  var newDate = new Date();
			  var currentTime = new Date()
			  var hours = currentTime.getHours()
			  var minutes = currentTime.getMinutes()
			  if (minutes < 10){
					minutes = "0" + minutes
				}			
			  var currentTime = hours + ":" + minutes ;
			  if(hours > 11){
					currentTime = currentTime + "PM";
			  } else {
				currentTime = currentTime + "AM";
			  }

			var month=new Array();
			month[0]="Jan";
			month[1]="Feb";
			month[2]="Mar";
			month[3]="Apr";
			month[4]="May";
			month[5]="Jun";
			month[6]="Jul";
			month[7]="Aug";
			month[8]="Sep";
			month[9]="Oct";
			month[10]="Nov";
			month[11]="Dec";
			var n = month[newDate.getMonth()];
			var day=newDate.getDate();
			currentTime = currentTime  + "," + " " +  n + " " + day;
			 for (var i=0;i<chatusers[to_user].length;i++)
			{ 
				 console.log("chat request to user : ",chatusers[to_user][i]);
				chatusers[to_user][i].emit('chatResponse_from_sever',chatstr , socket.username+"~"+currentTime);
				
			}
			 for (var i=0;i<chatusers[sender].length;i++)
   				{ 
					if( chatusers[sender][i] !== socket){
						chatusers[sender][i].emit('chatStringFromSender',chatstr ,to_user+"~"+timeStr);
					}
				}
	}

	//Code to receive sms from Impeltouch client
	 else  if(Test_Char === "f"){
			  var Login_Name = recipientName.Login_Name;
			  var User_Id = recipientName.User_Id;
			  var phoneNoStr = recipientName.phoneNoStr;
			  var smsBodyStr = recipientName.smsBodyStr;
			  console.log('Test_Char' + Test_Char);
			  console.log('Server received sms message from Impeltouch client' ,smsBodyStr);
			   var myArray = new Array();
			  myArray[0] = "f";
			  myArray[1] = phoneNoStr;
			  myArray[2] = smsBodyStr;
			  myArray[3] = Login_Name;
			  for(var x in ImpelUsers){
				 console.log('usersFromIT users   : ', x);
				 if(x === User_Id ){
					 for (var i=0;i<ImpelUsers[User_Id].length;i++)
					{ 
						 ImpelUsers[User_Id][i].emit('sms_from_sever', socket.username, myArray);
					}
					
				 }
		     }
	 }
	 //Code to receive sms from Impeltouch client
	 else  if(Test_Char === "g"){
			pushSmsToDevice(data);
	 }

});

   //Chat reuest response string
	socket.on('chatRequestResponse', function (resString){
		 var requestResponse = resString.RequestResponse;
		 var to_user =  resString.To_User;
		 var from_user =  resString.From_User;
		 console.log("chatRequestResponse string" +  requestResponse);
		 console.log("to_user : " +  to_user);
		 console.log("from_user : " +  from_user);
		 if( requestResponse === "Ready"){
				status = true;
				
			    for (var i=0;i<chatusers[to_user].length;i++)
   				{ 
					chatusers[to_user][i].emit('UserLoginStatus',  status);
				}
		 }
		 else if(requestResponse === "Busy"){
				status = false;
			    for (var i=0;i<chatusers[to_user].length;i++)
   				{ 
					chatusers[to_user][i].emit('UserLoginStatus',  status);
				}
        }
	});
	
	//Code executes if user closes chat
	socket.on('closedChatWindow', function (resString){
		 var Response = resString.RequestResponse;
		 var to_user =  resString.To_User;
		var from_user =  resString.From_User;
		 var status;
		 console.log("chatRequestResponse string" + Response);
		 console.log("to_user : " +  to_user);
		 console.log("from_user : " +  from_user);
		 for(var x in chatusers){
			 console.log('x value  : ', x);
			 if(x === to_user ){
				 status="true";
				for (var i=0;i<chatusers[to_user].length;i++)
   				{ 
					chatusers[to_user][i].emit('exitFromChat',  Response);
				}
			 }
		 }
  });

	 
	
	//Code to send sms to client
	function pushSmsToDevice(data)
	{
		 var Login_Name = data.Login_Name;
			  var User_Id = data.User_Id;
			  var phoneNoStr = data.phoneNoStr;
			  var smsBodyStr = data.smsBodyStr;
			  var userLoginStatus;
		 var myArray = new Array();
			  myArray[0] = "g";
			  myArray[1] = phoneNoStr;
			  myArray[2] = smsBodyStr;
			  myArray[3] = Login_Name;

           for(var x in usersFromIT){
			 console.log('usersFromIT users   : ', x);
			 if(x === User_Id ){
				userLoginStatus = true;
				 for (var i=0;i<usersFromIT[User_Id].length;i++)
   				{ 
					 usersFromIT[User_Id][i].emit('sms_from_sever', socket.username, myArray);
				}
			 }
		   }
		   
		   if (userLoginStatus !== "true")
		   {
			 console.log(User_Id,'sms user not logged in  : ');
		   }

	}

	function impelSmsFunction(){
		 var data = {Login_Name:"vadiraj@impeltouch.com",
						  User_Id:"vadiraj@impeltouch.com",
						  phoneNoStr:"9886764314",
						  smsBodyStr:"Hi msg from impel server"};	
		 myFunction(data);
	}

	socket.on('switchRoom', function(newroom){
		// leave the current room (stored in session)
		socket.leave(socket.room);
		// join new room, received as function parameter
		socket.join(newroom);
		socket.emit('updatechat', 'SERVER', 'you have connected to '+ newroom);
		// sent message to OLD room
		socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' has left this room');
		// update socket session room title
		socket.room = newroom;
		socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username+' has joined this room');
		socket.emit('updaterooms', rooms, newroom);
	});


//code executes when user disconnects socket
socket.on('disconnect', function(x){
			console.log("***********************On_disconnect******************************"+typeof x+"********"+x);
		 console.log('user logged out');
		 var impelITusers;
		 var impel_Users;
		  for(var x in usersFromIT){
			 console.log('usersFromIT users   : ', x);
			 if(usersFromIT[x] === socket ){
				impelITusers = "true";
			 }
          }
		  if(impelITusers === "true"){
			 delete  usersFromIT[socket.username];
		     impelITusers = false;
		  }
		  for(var x in ImpelUsers){
			 console.log('ImpelUsers users   : ', x);
			 if(ImpelUsers[x] === socket ){
				impel_Users = "true";
			 }
          }
		  if(impel_Users === "true"){
			 delete  ImpelUsers[socket.username];
			 impel_Users = "false";
		  }
		  try{
		  console.log('socket.username on disconnect ',socket.username);
		   console.log('chatusers[socket.username] ',chatusers[socket.username]);
		var chatuserLength = chatusers[socket.username].length;
		console.log('before deleting from chatusers : chatuserLength on disconnect ',chatuserLength);
		 // remove the username from global usernames list
		 for (var i=0;i<chatusers[socket.username].length;i++)
   			{ 
				if(chatusers[socket.username][i] === socket)
					{
					  delete  chatusers[socket.username][i];
					}
			}
       console.log('chatuser variable after disconnect' ,chatusers[socket.username]);
		var chatuserLength = chatusers[socket.username].length;
		console.log('after deleting from chatusers : chatuserLength on disconnect ',chatuserLength);
		}
		catch(err)
		{
			console.log("........................"+err);
		}
	   if(chatusers[socket.username] === undefined){
		   delete usernames[socket.username];
			 
	   }
		// update list of users in chat, client-side
		 var value;
			var i=0;
			for(var key in usernames) {
				  usersToJava[i++] = usernames[key];
			}
		io.sockets.emit('updateusers', usersToJava);
		socket.leave(socket.room);
	});
        
});