let app = {};

$(document).ready(function() {
  app.server = 'https://api.parse.com/1/classes/messages';
  let d = new Date();
  let lastObjectID = '';
  let roomName = 'Lobby';

  $('#send').on('submit', function(event) {
    event.preventDefault();
    app.handleSubmit();
  });

  $('#roomSelect').on('change', function(event) {
    roomName = event.target.selectedOptions[0].innerText;
    hideAllChatMessages();
    showElement();
  });

  app.init = function() {
    let fetchInterval = window.setInterval( () => app.fetch(), 1000);
  };

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

  let hideAllChatMessages = function() {
    $('#chats div').hide();
  };

  let showElement = function() {
    $('#chats div').filter(function() {
      return $(this).hasClass(roomName);
    }).show();
  };

  app.send = function(message) {
    $.ajax({
      url: app.server,
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

  let parseData = function(jsonObj) {
    //debugger;
    if (jsonObj.results.length > 0) {
      for (let i = 0; i < jsonObj.results.length; i++) {
        if (jsonObj.results[i].objectId !== lastObjectID) {
          app.addMessage(jsonObj.results[i]);
        } else {
          break;
        }
      }
      lastObjectID = jsonObj.results[0].objectId;
    }
  };

  app.fetch = function() {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
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

    addRoomSelect(data.roomname);
    showElement();
  };

  let addRoomSelect = function(roomname) {
    let optionExists = false;
    $('#roomSelect').find('option').each(function(opt) {
      if (this.text === roomname) {
        optionExists = true;
      }
    });
    if (!optionExists) {
      app.addRoom(roomname);
    }
  };

  app.addRoom = function(localRoomName) {
    localRoomName = localRoomName || ($('.roomSelectText')).val();
    if (localRoomName.trim() !== '') {
      let $room = $('<option></option>').text(localRoomName).val(localRoomName);
      $('#roomSelect').append($room);
    }
  };

  app.addFriend = function(targetUsername) {
    console.log(targetUsername);
  };

  app.init();
});