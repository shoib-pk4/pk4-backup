var To_User = '';
var usernames = [];
var actvUsers = [];
var actvWidMe = []; // users list  currently chatting with.
var obj = {}; //  creating object of active user.
var iChatConnected = false;
var impelChatSckt = io.connect('http://192.168.11.11:60051');
var ifChrm = window.webkitNotifications ? true : false;
var window_focus = true;
// on connection to server, ask for user's name with an anonymous callback
impelChatSckt.on('connect', function () {
    // call the server-side function 'adduser' and send one parameter (value of the prompt)
    //From_User=prompt("what is your name?").replace(/^\s+|\s+$/g,'');
    impelChatSckt.emit('addChatUser', {
        'username': From_User
    });
    impelChatSckt.emit('usersFromImpel', {
        'username': From_User
    });
    //enableTextArea($targetDiv);
    $('.chat_content_wrap').each(function () {
        $targetDiv = $('#usr_' + makeId($(this).data("to_user")));
        enableTextArea($targetDiv);
    });

});


//on successful connection add a button to send chat_request 
impelChatSckt.on('__ACK', function () {
    iChatConnected = true;
    if (!$('#confirmBox').length) $('body').append("<div id='confirmBox'><div class='message'></div><span class='button yes'>Accept</span><span class='button no'>Reject</span></div>");
    if (ifChrm) new notify('', 'Impel chat', 'Status: Connected');
});

//this will list current users list
impelChatSckt.on('updateusers', function (usernames) {     
    actvUsers    = usernames;
    console.log('active user names --> ' + JSON.stringify(usernames));
});


//client responding to chatRequest
impelChatSckt.on('chatReuest', function (senderName) {
    //alert(senderName+" wants to chat with you");  
    if (ifChrm) {
        var msgType = " wants to chat with you";
        chatMessageTitle = From_User + msgType; //this is global used in chats blinking tab
        newExcitingAlerts();
        new notify('', 'Impel chat', 'Chat request received from ' + senderName);
    }
    doConfirm("Chat request received from " + senderName, function yes() {

        impelChatSckt.emit("chatRequestResponse", {
            "RequestResponse": "Ready",
            "To_User": senderName,
            "From_User": From_User
        });
        if (!($('#usr_' + makeId(senderName)).length)) {
            createChatDiv(senderName);
        } else {
            $('#usr_' + makeId(senderName)).show();
            if ($('#usr_' + makeId(senderName)).find('.msgString').attr('disabled')) enableTextArea($('#usr_' + makeId(senderName)));
        }
        addUsr2ActvLst(senderName);
    }, function no() {
        impelChatSckt.emit("chatRequestResponse", {
            "RequestResponse": "Busy",
            "To_User": senderName,
            "From_User": From_User
        });
    });
});

//receiver responce status
impelChatSckt.on('UserLoginStatus', function (status, reciName) {
    if (status === false) {
        alert(reciName + ' is currently unavailable, please try after some time ');
        disableChat('User currently unavailable, please try after some time ', reciName);
    } else if (status === true) {
        addUsr2ActvLst(reciName);

        //store this user in db
        recorderInviteUser(To_User);

        $('#usr_' + makeId(reciName)).show();
        if ($('#usr_' + makeId(reciName)).find('.msgString').attr('disabled')) enableTextArea($('#usr_' + makeId(reciName)));

    }
});

//this will recieve message from user about user typing status
//receiver responce status: #shoib
impelChatSckt.on('typingStatus', function (status, reciName, whichUser) {
    // $('#usr_' + makeId(reciName)).find('.toUser_Name').text(whichUser + ' ' + status);
    $('#usr_' + makeId(reciName)).find('#chatStatus').text(whichUser + ' ' + status);
});


impelChatSckt.on('chatResponse_from_sever', function (msg, userNtime) {

    console.log(" -----" + msg + "-------- " + userNtime);
    var userNtimeArray = userNtime.split('~');
    var sender = userNtimeArray[0];
    var time = userNtimeArray[1];
    var $targetDiv = $('#usr_' + makeId(sender));
    if ($targetDiv.length) {
        //blink tab for new message
        var cmsg = " New message";
        chatMessageTitle = sender + cmsg; //this is global used in chats blinking tab
        newExcitingAlerts();
        //show message 
        incomingMsg(msg, sender, time);
    }


    /*else{
        var f1 = function(){createChatDiv(sender);}();
        var f2 = function(){incomingMsg(msg, sender, time);}();
        var xaa = [f1,f2];
        for (i in xaa)xaa[i];
    }*/
});


//this will show blinking of title bar text #shoib
newExcitingAlerts = (function () {
    var oldTitle = document.title;
    var timeoutId;
    var blink = function () {
        document.title = document.title == chatMessageTitle ? ' ' : chatMessageTitle;
    };
    var clear = function () {
        clearInterval(timeoutId);
        document.title = oldTitle;
        window.onmousemove = null;
        timeoutId = null;
    };
    return function () {
        if (!timeoutId) {
            timeoutId = setInterval(blink, 1000); //for every 1 second
            window.onmousemove = clear; //this is global
        }
    };
}());



function incomingMsg(msg, sender, time) {
    if (ifChrm) new notify('', 'Impel chat', sender + ": " + msg);
    var $targetDiv = $('#usr_' + makeId(sender));

    //this will highlight the color of div, which recived message
    if (!($targetDiv.find('.msgString').is(':focus'))) {
        $targetDiv.css({
            "box-shadow": "0px 0px 10px red"
        });
    }

    console.log(sender + " -----" + msg + "-------- " + time);
    $targetDiv.find('.content').append("<div class='client_msgWrap'><div class='glossy'><b>" + sender + " </b>: " + msg + "<br/><span class='timestamp'>" + time + "</span></div></div>");
    $targetDiv.show('slow');
    $targetDiv.find('.content').stop().animate({
        scrollTop: $targetDiv.find('.content')[0].scrollHeight
    }, 100);
    if ($targetDiv.find('.msgString').attr('disabled')) enableTextArea($targetDiv);
}

//on load of page .disabled=true;
$(function () {
    /*$('.sizeC').live('click',function(e){
            e.stopPropagation();
            $(e.target).closest('.titleBar').click();
        });*/
    $(document).on('mouseenter', '.chat_content_wrap', function (e) {

        e.stopPropagation();
        var $thisDiv = $(e.target).closest('.chat_content_wrap');
        var ToUser = $thisDiv.data('to_user');
        var clName = makeId(ToUser);
        var hndl = "#tb_" + clName;
        var cntid = "cnt_" + clName;
        var wWidth = $(window).width();
        $thisDiv.draggable({
            handle: hndl,
            scroll: false,
            stop: function (eve, ui) {
                var top = ui.offset['top'];
                var left = ui.offset['left'];
                // var btm = ui.offset['bottom'];
                var $cdiv = $(eve.target).closest('.chat_content_wrap');
                if (top < 0) {
                    $cdiv.css({
                        "top": "2px"
                    });
                }
                if (left < 0) {
                    $cdiv.css({
                        "left": "2px"
                    });
                }

                var cWidth = $cdiv.width();
                var end = wWidth - cWidth;
                if (left >= end) $cdiv.css({
                    "left": end + "px"
                });
            },
            stack: $(".chat_content_wrap")
        });
    }).on('click', '.chat_content_wrap', function (e) {
        e.stopPropagation();
    });
    $(document).on('click', '.cClose', function (e) {
        e.stopPropagation();
        ToUser = $(e.target).closest('.chat_content_wrap').data('to_user');
        impelChatSckt.emit('closedChatWindow', {
            'RequestResponse': 'User exited from chat',
            'To_User': ToUser,
            'From_User': From_User
        });
        $('#usr_' + makeId(ToUser)).remove();
        actvWidMe.pop(ToUser);
        console.log('active users list ' + JSON.stringify(actvWidMe));
    });
    $(document).on('mousedown', '.chat_content_wrap', function (e) {
        ToUser = $(e.target).closest('.chat_content_wrap').data('to_user');
        var $eTarget = $('#usr_' + makeId(ToUser));
        $eTarget.css({
            "box-shadow": "0px 0px 0px gray"
        });
        var zIndex = $eTarget.draggable("option", "zIndex", 1500);
        console.log(zIndex);
    });

    //here on the chat will be sent, this triggerd from enter key press
    $(document).on('click', '.sendBtn', function (e) {
        var $eTarget = $(e.target).closest('.chat_content_wrap');
        ToUser = $eTarget.data('to_user');
        var msg = $eTarget.find('.msgString').val();
        msg = msg.replace(/\s{2,}/g, ' ');
        if (msg != ' ' && msg != '') {

            if (msg.indexOf('impel' != -1)) {
                msg = msg.replace("impel", "<img src='http://images04.olx.in/ui/20/54/10/1335341391_362165410_1-Pictures-of--Drive-Sales-with-Impel-CRM.png'  height='25px'/>");
            }

            //append message in client side
            $eTarget.find('.content').append("<div class='client_msgWrap'><div class='glossy green'><b>Me</b> : " + msg + "<br/><span class='timestamp'>" + localTime() + "</span></div></div>");
            $eTarget.find('.msgString').val('');

            //send msg to server[with receipient name]
            impelChatSckt.emit("MessageFromImpeltouch", {
                "Test_Char": "b",
                "Login_Name": ToUser,
                "chatBodyStr": msg,
                "timeStr": localTime()
            });
        }
        $eTarget.find('.msgString').focus();
        $eTarget.find('.content').stop().animate({
            scrollTop: $eTarget.find(".content")[0].scrollHeight
        }, 100);
    });

    $(document).on('keyup', '.msgString', function (e) {
        var msg = $(e.target).closest('.chat_content_wrap').find('.msgString').val();
        msg = msg.replace(/\s{2,}/g, ' ');
        if (e.which == 13) {
            e.preventDefault();
            if (msg != ' ' && msg != '') {
                $(e.target).closest('.chat_content_wrap').find('.sendBtn').click();
            }
        } else {
            //notify reciever about i.e he is typing                                                
            if (msg.length != 0) {
                try {
                    impelChatSckt.emit("clientTyping", {
                        "Test_Char": "b",
                        "Login_Name": ToUser,
                        "statusMsg": ' as entered text..'
                    });
                } catch (e) {
                    console.log('failed: as entered text');
                }
            } else {
                try {
                    impelChatSckt.emit("clientTyping", {
                        "Test_Char": "b",
                        "Login_Name": ToUser,
                        "statusMsg": ' is typing..'
                    });
                } catch (e) {
                    console.log('Failed: is typing');
                }
            }
        }
    });

    //when user focuses on input
    $(document).on('focus', '.msgString', function (e) {
        try {
            impelChatSckt.emit("clientTyping", {
                "Test_Char": "b",
                "Login_Name": ToUser,
                "statusMsg": 'is typing..'
            });
        } catch (e) {
            console.log('Failed: is typing');
        }
    });

    //when user focuses on input
    $(document).on('blur', '.msgString', function (e) {
        try {
            impelChatSckt.emit("clientTyping", {
                "Test_Char": "b",
                "Login_Name": ToUser,
                "statusMsg": 'is idle..'
            });
        } catch (e) {
            console.log('Failed: is idle');
        }
    });


    //***********************************************//
    $(document).on('click', '.titleBar', function (e) {
        //  $('body').append('<textarea ></textarea>').val($(e.target).closest('.chat_content_wrap').html());
        e.stopPropagation();
        var $cdiv = $(e.target).closest('.chat_content_wrap');
        //$cdiv.draggable( "option", "stack", ".chat_content_wrap" );
        $cdiv.find('.msgBdWrp').slideToggle(200);
       // $cdiv.css({'top':'0','right':'0'});
        setTimeout(function () {
            $cdiv.find('.content').animate({
                scrollTop: $cdiv.find(".content")[0].scrollHeight
            }, 255);
        }, 555);
    });


    //hide icon if focus

    $(window).focus(function () {
        $('.chat_content_wrap .msgIcon').css('display', 'none');
        window_focus = true;
    });

    //show icon if blur
    $(window).blur(function () {
        $('.chat_content_wrap .msgIcon').css('display', 'block');
        window_focus = false;
    });

});


function createChatDiv(createForUser) {    
    var cleanName = makeId(createForUser);
    //  alert($(".chat_content_wrap").length);
    var prepareBox = "<div class='chat_content_wrap' id='usr_" + cleanName + "' data-to_user='" + createForUser + "' ><div class='titleBar' id='tb_" + cleanName + "'><div class='msgIcon' id='" + createForUser + "' ><img src='http://192.168.11.11:9090/atCRM/images/chat_logo.png' width='20px'/></div><div class='toUser_Name'>" + createForUser + "</div><div class='cClose' title='Close' ><img src='http://192.168.11.11:9090/atCRM/images/chat_close.png' width='25px'/></div><div class='sizeC' title='Toggle size'><img src='http://192.168.11.11:9090/atCRM/images/chat_toggle_icon.png' width='26px'/></div><div class='userTyping' title='" + createForUser + " is typing' style='display:none;'><img src='http://192.168.11.11:9090/atCRM/images/edit_pen.png' width='25px'/></div></div><div class='msgBdWrp'><div class='content default-skin' id='cnt_" + cleanName + "'></div><div class='inputBar'><p id='chatStatus'>Idle</p><textarea class='msgString'></textarea><input type='button' class='sendBtn' value='send'/></div></div></div>";
    //
    $("body").append(prepareBox);
    //return true;
}

function addChat() {
    if ($('#chatDialog').length) {
        chatDialog();
    } else {
        $('body').append("<div id='chatDialog'></div>");
        chatDialog();
    }
}

function chatDialog() {
    $('#chatDialog').dialog({
        title: "Impel chat (Users)",
        show: {
            effect: 'blind',
            duration: 555
        },
        /*hide: {
                    effect: 'blind',
                    duration: 555
                },*/
        modal: false,
        minWidth: 500,
        maxWidth: 500,
        MaxHeight: 250,
        minHeight: 150,
        open: function () {
            $(this).html("<span class='inviteNew' id='inviteUser' onclick='chatWithNewUser(this);'>Chat with user</span><span class='recentUsers' onclick='loadRecentUsers(this);'>Recent users</span><div class='chatDlgContent'></div>");
        }
    });
}



function chatWithNewUser(elem) { //$('#chatDialog').dialog('close');
    console.log(iChatConnected);
    console.log(iChatConnected === true);
    if (iChatConnected === true) {
        $(".inviteNew").addClass('selected');
        $(".recentUsers").removeClass('selected');
        $(".chatDlgContent").html("<div class='InputEmail'>Plase enter username with whom you want to chat <br/><input type='text' id='emailOf'/ onkeypress='trig_invite(event)' style='margin-top:10px;'><br/><div id='okayBtn' class='button' onclick='invite_user(1)'>Request</div><div id='cancelBtn' class='button' onclick='invite_user(0)'>Reset</div></div>");
        $("#okayBtn").button();
        $("#cancelBtn").button();
        return true;
    } else {
        alert('Chat is not available, Please try later');
        return false;
    }
}

function invite_user(x) {
    if (x === 1) {
        To_User = $("#emailOf").val().replace(/^\s+|\s+$/g, '');
        if (To_User == From_User && To_User != '') {
            alert('You are currently logged in as ' + To_User + ', sender and recipient cannot be same. Please user valid username.');
            $("#emailOf").val('');
        } else if (To_User == '') {
            alert('Please enter username');
        } else {
            console.log(actvWidMe.length);
            if(actvWidMe.length  < 4) { //limit only for 4 users
                console.log(To_User + '-' + From_User);
                try {                
                    impelChatSckt.emit("MessageFromImpeltouch", {
                        "Test_Char": "d",
                        "checkuser": To_User,
                        "sender": From_User
                    });    

                } 
                catch(e) {
                    console.log(e);
                }
                
                $('#chatDialog').dialog('close');
                $("#emailOf").val('');
           } 
           else {
            alert('Maximum mulitiple chat allowed is 4');
           }
        }
    } else {
        $("#emailOf").val('');
    }

}

function trig_invite(eve) {
    if (eve.which == 13) {
        invite_user(1);
    }
}
/*****************************************************************************/
impelChatSckt.on('userDisconnected', function (msg, sender) {
    disableChat(msg, sender);
});

impelChatSckt.on('waitForResponce', function (reciName) {
    //alert('Request sent to '+reciName);
    if (!($('#usr_' + makeId(reciName)).length)) 
        createChatDiv(reciName);
    else 
        $('#usr_' + makeId(reciName)).show();
    
    //disableChat("Chat request sent, waiting for response...", reciName);
});
/*****************************************************************************/
function doConfirm(msg, yesFn, noFn) {
    var confirmBox = $("#confirmBox");
    confirmBox.find(".message").text(msg);
    confirmBox.find(".yes,.no").unbind().click(function () {
        confirmBox.hide();
    });
    confirmBox.find(".yes").click(yesFn);
    confirmBox.find(".no").click(noFn);
    confirmBox.show('shake', 50);
}
/***********************************new code to be added**********************************/

impelChatSckt.on('exitFromChat', function (msg, sender) {
    disableChat(msg, sender);
    if (ifChrm) new notify('', 'Impel chat', sender + " exited");
});

function enableTextArea($targetDiv) {
    var $targetDiv2 = $targetDiv.find('.msgString');
    $targetDiv2.removeAttr('disabled').val('');
    $targetDiv2.attr({
        "style": "color:black;text-align:left;border:1px solid gray;"
    });

}

function disableChat(msg, sender) {
    var $targetDiv = $('#usr_' + makeId(sender));
    if ($targetDiv.length) {
        if (!($targetDiv.find('.msgString').is(':focus'))) $targetDiv.css({
            "box-shadow": "0px 0px 10px red"
        });
        //$targetDiv.find('.content').append("<div class='client_msgWrap'><div class='glossy'><span style='color:red;text-align:center;'>"+msg+"</span><br/><span class='timestamp'>"+localTime()+"</span></div></div>");
        $targetDiv.find('.msgString').val(msg);
        $targetDiv.show('slow');
        $targetDiv.find('.msgString').attr({
            "disabled": "disabled",
            "style": "color:firebrick;text-align:center;border:0;"
        });
    } else {
        //alert(sender+' Disconnected');
        console.log('user ' + sender + ' disconnected');

    }
    actvWidMe.pop(sender);
    console.log('after disable active users list ');
    console.log( JSON.stringify(actvWidMe));
}

function addUsr2ActvLst(usrNm) {
    actvWidMe.push(usrNm);
    console.log('user ' + usrNm + ' added to active users list');
    console.log('after adding active users list ' );
    console.log(JSON.stringify(actvWidMe));
}
/***********************************************************************************/
impelChatSckt.on('disconnect', function () {
    iChatConnected = false;
    $('.chat_content_wrap').each(function () {
        disableChat("Chat is not available", makeId($(this).data("to_user")));
    });
    if (ifChrm) new notify('', 'Impel chat', 'Connection lost');
});

function makeId(userName) {
    return userName.replace(/[^a-zA-Z0-9]/g, '_');
}

function localTime() {
    var newDate = new Date();
    var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var hrs12 = '';
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (hours > 12) hrs12 = hours % 12;
    else {
        if (hours == 0) hrs12 = 12;
        else hrs12 = hours;
    }
    var currentTime = hrs12 + ":" + minutes;
    if (hours > 11) {
        currentTime = currentTime + "PM";
    } else {
        currentTime = currentTime + "AM";
    }

    var month = new Array();
    month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var n = month[newDate.getMonth()];
    var day = newDate.getDate();
    currentTime = currentTime + "," + " " + n + " " + day;
    return currentTime;
}

var notify = function notify(url, UsrNameOrTitle, msg) {     //uncomment below, its causing to break chat request
    if (!url) { 
        var url = "/images/tIco.png"; 
    }
    if (!UsrNameOrTitle) var UsrNameOrTitle = "Impel chat";
    if (!msg) var msg = "Notification";

    if(window_focus === false)  { //show only if not focussed
        try {            
            var popup = window.webkitNotifications.createNotification(url, UsrNameOrTitle, msg);
            popup.show();
            setTimeout(function () {
                popup.cancel();
            }, '8452');
        }
        catch(e) {
            console.log('This is other than webkit browser!');
        }
    }
};


var userOptions = []; //init
function loadRecentUsers() {
    $(".recentUsers").addClass('selected');
    $(".inviteNew").removeClass('selected');
    $(".chatDlgContent").html("Retrieving please wait...");

    var userCont;   
    if(userOptions.length > 0) { //if found then, show it users        
        var userCont = $('<div class="recentChatUsersCont"></div>'), d;
        //loop through users
        $.each(userOptions, function(k,v) {
            if(k < 20 && v.length > 0) {
                d = $('<div></div>');
                d.addClass('userCont');
                d.append('<span>'+v+'</span>');
                if($.inArray(v, actvUsers) !== -1) 
                    d.addClass('userContActv');                    
                
                userCont.append(d);                
            }
        });
        $(".chatDlgContent").html(userCont); //add to dom
    } 
    else {
        $(".chatDlgContent").html("No users found...");
    }
    
}

//store unique user options
function storeUniqueUserOpt(str) {
    var users = str.split(','); 
    //loop through users
    $.each(users, function(k,v) {
        if($.inArray(v, userOptions) === -1) {
            userOptions.push(v); //add to global arr
        }
    });
    userOptions.sort(); //sort array
}



// fetch user options from db
var trackUserId='', trackUserNames=''; //this loads the recents users if
function fetchUserOptionFromDb() {
    //get the users list
    $.ajax(
        {
            url: zcServletPrefix+"/custom/JSON/system/getUserOptionsForChat.json?userOption=user_chat",
            type: 'POST',
            dataType: 'JSON',
            data: '',
            success: function (data) { 
                trackUserId = data.userOptionId; //global set value
                trackUserNames = data.OptionValue; //comma separated vals    
                storeUniqueUserOpt(trackUserNames);  //store unique user options    
            },
            error: function (response) {
                alert('failed to get user options');
                console.log(response);
            }
        }
    );
    
    return trackUserNames;
}

fetchUserOptionFromDb(); //init recent users and track id

function recorderInviteUser(toUser) {

    if(trackUserId == '') { //trackUserId is global
        var postData = "0-1-2=&0-1-3=user_chat&0-1-5=user_chat&0-1-4=User options stored comma separated&0-1-19="+toUser;
        var errMsg = 'Recording failed for first time';
    } 
    else {
        var postData = "0-1-2="+trackUserId+"&0-1-19="+userOptions.toString() + ',' + toUser;
        var errMsg = 'Updation of recording failed';
    }  

    $.ajax(
    {
        url: zcServletPrefix+'/custom/JSON/system/addEditUserOptions/editAction',
        type: 'POST',
        dataType: 'JSON',
        data: postData,
        success: function(data) {
            trackUserId = data.addedId;
            trackUserNames = data.addedTxt; //comma separated vals
            storeUniqueUserOpt(trackUserNames);  //store unique user options            
        },
        error: function(response) {
            alert(errMsg);
        }

    });

}


//this will add current click id to invite user input element
$('body').on('click', '.userCont', function() {
    var id = $(this).text();            
    if(chatWithNewUser()) {        
        $('.chatDlgContent #emailOf').val(id);
        invite_user(1);
    }
});