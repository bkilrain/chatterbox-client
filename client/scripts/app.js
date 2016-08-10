// YOUR CODE HERE:
let app = {
  server: 'https://api.parse.com/1/classes/messages',
  username: 'anonymous',
  roomname: 'lobby', 
  messages: [],

  init: function() {
    app.username = window.location.search.substring(10);
    //setInterval(app.fetch, 1000);

    $('#messageSend').on('submit', app.submitMessage);

  },
  send: function(message) {
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      success: function (data) {
        console.log(data);
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
        app.messages.forEach(app.addMessage)
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },
  addMessage: function(message) {
    let $chat = $('<div class="chat" />');
    let $username = $('<span class="username" />');
    $username
      .text(message.username + ': ')
      .appendTo($chat);

    let $message = $('<br><span />')
    $message
      .text(message.text)
      .appendTo($chat);

    $('#chats').append($chat);
  },
  clearMessages: function() {
    $('#chats').children().remove();
  },
  submitMessage: function() {
    event.preventDefault()
    let message = {
      username: app.username,
      text: $('#msg').text(),
      roomname: app.roomname,
    }
    app.send(message);
  },

};
