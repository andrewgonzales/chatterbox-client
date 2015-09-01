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

var displayMessages = function(messageArray){
  console.log("trying to display messages");
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
  var user = message['username'];
  var text = message['text'];
  // var timeStamp = message['createdAt'];
  var containerDiv = $('<div class="chat"></div>');
  var userDiv = $('<div class="username"></div>');
  var textDiv = $('<div class="text"></div>');
  // var timeStampDiv = $('<div class="timeStamp"></div>');

  userDiv.text(user);
  textDiv.text(text);
  // timeStampDiv.text(timeStamp);
  containerDiv.append([userDiv, /*timeStampDiv, */textDiv]);

  return containerDiv;
}; 

//Fetch messages from the server
app.fetch = function(){
  $.ajax({
    url: app.server,
    type: 'GET', 
    // data: JSON.stringify({}),
    // contentType: 'application/json',
    success: function(data){
      console.log('chatterbox: Message received');
      console.log(data);
      displayMessages(data.results);
    },
    error: function(data) {
      console.error('chatterbox: Failed to send message');
    }
  });
};

//Initialize method
app.init = function(){
  setInterval(app.fetch, 1000);
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
      this.addMessage(message);
    },
    error: function(data) {
      console.error('chatterbox: Failed to send message');
    }
  });
};

//Add a message to the DOM
app.addMessage = function(message){
  //Prepend to DOM
  $("#chats").prepend(messageMaker(message));
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
      console.log(data);
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


app.addRoom = function(room){
  var roomMessages = app.getRoomMessages(room);
  if (roomMessage.length === 0) {
    //create room
    // prepend
  }
};