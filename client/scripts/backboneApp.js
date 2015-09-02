//Backbone App Model
var AppModel = Backbone.Model.extend({
  //Initialize
  initialize: function(server, roomname){
    if(server){
      this.set('server', server);
    }
    if(roomname){
      this.set('roomname', roomname);
    }
  }, 
  //Default attributes
  defaults: {
    server: 'https://api.parse.com/1/classes/chatterbox',
    username: 'anonymous',
    roomname: 'lobby',
    friends: []
  }

});

//Backbone Message Model
var MessageModel = Backbone.Model.extend({
  //Initialize
  initialize: function(obj){
    if(obj['objectId']){
      this.set('messageId', obj['objectId']);
    }
    if(obj['username']){
      this.set('username', obj['username']);
    }
    if(obj['text']){
      this.set('text', obj['text']);
    }
    //Default attributes
    defaults: {
      username: 'anonymous',
      text: 'No message',
      editable: false
    }
  }
});

//Backbone App View
var AppView = Backbone.View.extend({

});
//Backbone Message View
var MessageView = Backbone.View.extend({
  render: function(friends){
    //Create divs conventional
    var escaper = $('<div></div>');
    //Escape username
    escaper.text(this.model.get("username"));
    var userDivText = escaper.text();
    //Escaper message
    escaper.text(this.model.get("text"));
    var textDivText = escaper.text();

    //Check for friend
    var textClass = '<div class="text';
    if(friends[userDivText]){
      textClass += ' friend';
    }
    textClass += '">';
    
    //Convert array to string
    var html = [
      '<div class="chat">',
        '<div class="username">',
          userDivText,
        '</div>',
        textClass,
          textDivText,
        '</div>',
      '</div>'
    ];

    //Return html set result
    return this.$el.html(html);
  }

});