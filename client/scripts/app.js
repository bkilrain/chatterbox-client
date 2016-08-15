
let app = {
  server: 'https://api.parse.com/1/classes/messages',
  username: 'anonymous',
  roomname: 'lobby', 
  messages: [],
  $newroom: $('<option />'),
  friends: {},

  init: function() {
    app.username = window.location.search.substring(10);
    // setInterval(app.fetch, 1000);

    $('#messageSend').on('submit', app.handleSubmit);
    $('select').on('change', app.changeRoom);
    $('#chats').on('click', '.username', app.addFriend);
    $('#refresh').on('click', app.refresh);


  },
  refresh: function() {
    app.fetch();
  },
  send: function(message) {
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      success: function (data) {
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  fetch: function() {
    $.ajax({
      url: app.server,
      type: 'GET',
      data: {
        order: '-createdAt'
      },
      contentType: 'application/json',
      success: function (data) {
        app.messages = data.results;
        app.addMessages(app.messages);
        app.renderRoomNames();
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to fetch message', data);
      }
    });
  },
  addMessages: function(messageArray) {
    app.clearMessages();
    let roomFiltered = messageArray.filter(function(msg) {
      return msg.roomname === app.roomname;
    });
    roomFiltered.forEach(function(msg) {
      app.addMessage(msg);
    });
  },
  addMessage: function(message) {
    let $chat = $('<div class="chat" />');
    let $username = $('<span class="username" />');
    $chat.addClass(message.roomname);
    $username
      .text(message.username + ': ')
      .appendTo($chat)
      .data('username', message.username);

    let $message = $('<br><span />')
    $message
      .text(message.text)
      .appendTo($chat);

    $('#chats').append($chat);
  },
  clearMessages: function() {
    $('#chats').children().remove();
  },
  handleSubmit: function() {
    event.preventDefault()

    let message = {
      username: app.username,
      text: $('#msg').val(),
      roomname: app.roomname,
    }
    app.send(message);
    $('#msg').val('');
  },
  addRoom: function(newRoomName) {
    $('select').append($('<option />').text(newRoomName));

  },
  changeRoom: function() {
    let selectedRoom = $('select').val();

    if (selectedRoom === 'Create Room') {
      newRoomName = prompt('New Room Name:')
      app.addRoom(newRoomName);
      $('select').val(newRoomName);
      app.roomname = newRoomName;

    } else {
      app.roomname = selectedRoom;
      app.addMessages(app.messages);

    }
  },
  renderRoomNames: function() {
    let rooms = {lobby: true};
    app.messages.forEach(function(msg) {
      if (msg.roomname && !rooms[msg.roomname]) {
        app.addRoom(msg.roomname);
        rooms[msg.roomname] = true; 
      }
    });
  },
  addFriend() {
    console.log($(event.target).data('username'))
    let username = $(event.target).data('username');
    if (username !== undefined) {
         app.friends[username] = !app.friends[username];
       }

       var selector = '[data-username="' + username.replace(/"/g, '\\\"') + '"]';
       console.log(selector)
       $('span').find(selector).toggleClass('friend');
  }

};
