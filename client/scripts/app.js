// // YOUR CODE HERE:
// var message = {
//   username: 'shawndrost',
//   text: 'trololo',
//   roomname: '4chan'
// };

// $.ajax({
//   url: app.server,
//   type: 'POST', 
//   data: JSON.stringify(message),
//   contentType: 'application/json',
//   success: function(data){
//     console.log('chatterbox: Message sent');
//   },
//   error: function(data) {
//     console.error('chatterbox: Failed to send message');
//   }

// });

//Setup app object
var app = {};
app.server = 'https://api.parse.com/1/classes/chatterbox';//App url
app.messageStorage = {};//Stores keys of all visible messages
app.currRoom = "lobby";
app.username = "anonymous";
app.canFetch = true;
app.friends = {};

var displayMessages = function(messageArray){
  // console.log("trying to display messages");
  // return;
  for(var i = messageArray.length-1; i>=0; i--){
    if(app.messageStorage.hasOwnProperty([messageArray[i]['objectId']])
      /*|| messageArray[i]['username'] === undefined || messageArray[i]['text']*/){
     continue;
    } else {
      app.messageStorage[[messageArray[i]['objectId']]] = true;
      $("#chats").prepend(messageMaker(messageArray[i]));
    }
  }
};

var messageMaker = function(message){
  //Get attributes
  var user = message['username'];
  var text = message['text'];
  //Create container divs
  var containerDiv = $('<div class="chat"></div>');
  var userDiv = $('<div class="username"></div>');
  var textDiv = $('<div class="text"></div>');
  //Set text
  userDiv.text(user);
  textDiv.text(text);
  //Append children to container
  containerDiv.append([userDiv, textDiv]);
  //Set click function
  userDiv.click(function(){
    app.addFriend(userDiv);
  });
  //Return container
  return containerDiv;
}; 

app.addFriend = function(DOMElement){
  this.friends[$(DOMElement).text()] = $(DOMElement).text();
};

app.handleSubmit = function(){
  console.log("handling submit");
  app.send({
    username: app.username, 
    text: $("#message").val(),
    roomname: app.currRoom
  });
};

$('#send .submit').click(function(event){
  console.log("clicked submit");
  app.handleSubmit();
  return false;
});

//Fetch messages from the server
app.fetch = function(){
  if(app.canFetch){
    var latestRoomMessages = [];
    //Use ajax to send message to server
    $.ajax({
      url: app.server,
      type: 'GET', 
      data: 'where={"roomname": "' + app.currRoom + '"}',
      contentType: 'application/json',
      success: function(data){
        // console.log('chatterbox: Message sent');
        // var count = 0;
        // for(var i = 0; i < data.results.length; ++i){
        //   if(data.results[i]["roomname"] === app.currRoom){
        //     count++;
        //     break;
        //   }
        // }
        // if(count > 0){
        //   latestRoomMessages = data.results;
        // }
        displayMessages(data.results);
      },
      error: function(data) {
        console.error('chatterbox: Failed to send message');
      }
    });
    return latestRoomMessages;
  }
};

//Initialize method
app.init = function(){
  if(app.username === undefined){
    app.username = prompt("Gimme: ");
  }
  setInterval(app.fetch, 5000);
};
app.init();

//Clear all messages
app.clearMessages = function(){
  //Select container and remove all child nodes
  $("#chats").empty();
  //Clear out keys
  app.messageStorage = {};
};

//Send message method
app.send = function(message){
  //Use ajax to send message to server
  
  $.ajax({
    url: app.server,
    type: 'POST', 
    data: JSON.stringify({
      username: message["username"],
      text: message["text"],
      roomname: message["roomname"]
    }),
    contentType: 'application/json',
    success: function(data){
      // console.log('chatterbox: Message sent');
      
      app.addMessage(message);
    },
    error: function(data) {
      
      console.error('chatterbox: Failed to send message');
    }
  });
};

//Add a message to the DOM
app.addMessage = function(message){
  //Turn off fetching
  // app.canFetch = false;
  //Prepend to DOM
  $("#chats").prepend(messageMaker(message));
  //Get key and update
  var lastMsg;
  // $.ajax({
  //   url: app.server,
  //   type: 'GET', 
  //   data: 'where={"username": "' + app.username + '"}',
  //   contentType: 'application/json',
  //   success: function(data){
  //     console.log("called");
  //     lastMsg = data.results[0];
  //     console.log(lastMsg);
  //   },
  //   error: function(data) {
  //     console.error('chatterbox: Failed to send message');
  //   }
  // });
  // //Set message ID to avoid duplicates
  // app.messageStorage[lastMsg['objectId']] = true;
  // //Return to fetching
  // app.canFetch = true;
};

//Send message method
app.getRoomMessages = function(room){
  // var roomExists = false;
  var latestRoomMessages = [];
  //Use ajax to send message to server
  $.ajax({
    url: app.server,
    type: 'GET', 
    data: 'where={"roomname": "' + room + '"}',
    contentType: 'application/json',
    success: function(data){
      // console.log('chatterbox: Message sent');
      // console.log(data);
      var count = 0;
      for(var i = 0; i < data.results.length; ++i){
        if(data.results[i]["roomname"] === room){
          count++;
          break;
        }
      }
      if(count > 0){
        latestRoomMessages = data.results;
      }
    },
    error: function(data) {
      console.error('chatterbox: Failed to send message');
    }
  });
  return latestRoomMessages;
};

//A function to add a room
app.addRoom = function(room){
  //If dom element doesnt exist
  if($("body > #roomSelect")){
    //Create it
    var roomFilter;
    if($("body > #roomSelect").children().length === 0){
      roomFilter = $('<div class="filter-btn""></div>');
      roomFilter.css({
        height: 50,
        width: 50,
        "border-radius": "10%",
        "background-color": "red"
      });
    }
    if(!roomFilter){
      roomFilter = $("body > #roomSelect > .filter-btn");
    }
    roomFilter.text(room);
    //Click function
    var clickFunction = function(){
      app.currRoom = room;
      app.clearMessages();
    };
    roomFilter.click(function(){clickFunction();});

    //Click function
    roomFilter.trigger("click");
    $("#roomSelect").append(roomFilter);
  }
};

//A button too add room
document.getElementById("makeRoomButton").onclick = function(){
  app.addRoom($("#makeRoomField").val());
};