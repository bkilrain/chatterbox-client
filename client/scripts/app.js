let app = {};

$(document).ready(function() {
  let d = new Date();

  app.handleSubmit = function() {
    let $text = $('#message');
    let pattern = /username=(.*)/;
    let message = {
      username: decodeURIComponent(pattern.exec(window.location.search)[1]),
      text: $text.val(),
      roomname: $('#roomSelect').val()
    };
    app.send(message);
  };

  $('#send').on('submit', function(event) {
    event.preventDefault();
    app.handleSubmit();
  });
  
  app.init = function() {
    let fetchInterval = window.setInterval( () => app.fetch(), 1000);
  };

  app.send = function(message) {
    $.ajax({
      url: 'https://api.parse.com/1/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        $('#message').val('');
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  };

  app.fetch = function() {
    let parseData = function(jsonObj) {
      for (let i = 0; i < jsonObj.results.length; i++) {
        app.addMessage(jsonObj.results[i]);
      }
    };

    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/messages',
      type: 'GET',
      data: {
        'order': '-createdAt',
        'where': `{"createdAt":{"$gte":{"__type":"Date","iso":"${d.toISOString()}"}}}`
      },
      contentType: 'application/json',
      success: function (data) {
        parseData(data);
        d = new Date();
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to fetch message', data);
      }
    });
  };

  app.clearMessages = function() {
    $('#chats').children().remove();
  };

  app.addMessage = function(data) {
    let $div = $('<div><a href="#" class="username"></a><p></p></div>');
    $('#chats').prepend($div);
    $('#chats div:first-child').addClass(data.roomname);
    let username = `${data.username}`;
    $('#chats div:first-child a').text(username);
    let message = `Message: ${data.text}`;
    $('#chats div:first-child p').text(message);
    $('.username').on('click', function(event) {
      let $targetUsername = $(event.target).text();
      app.addFriend($targetUsername);
      event.stopImmediatePropagation();
    });

  };

  app.addRoom = function() {
    let roomName = ($('.roomSelectText')).val();
    let $room = $('<option></option>').text(roomName).val(roomName);
    $('#roomSelect').append($room);
  };

  app.addFriend = function(targetUsername) {
    console.log(targetUsername);
  };

  app.server = 'https://api.parse.com/1/classes/messages';

  app.init();

});