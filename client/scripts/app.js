let app = {};

$(document).ready(function() {
  let d = new Date();
  
  app.init = function() {
    let fetchInterval = window.setInterval( () => app.fetch(), 1000);
  };

  app.send = function() {
    let $text = $('.messageInput');
    debugger;
    let message = {
      username: 'Meow',
      text: $text.val(),
      roomname: '4chan'
    };

    $.ajax({
    // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        $text.val('');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  };

  app.fetch = function() {
    // console.log('fetch is running');
    let parseData = function(jsonObj) {
      for (let i = 0; i < jsonObj.results.length; i++) {
        addToDOM(jsonObj.results[i]);
      }
    };

    let addToDOM = function(data) {
      let $text = $('<p></p>').text(`${new Date(data.createdAt)} Username: ${data.username} Message: ${data.text}`);
      $('#chats').prepend($text);
    };

    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: `https://api.parse.com/1/classes/messages?order=-createdAt&where={"createdAt":{"$gte":{"__type":"Date","iso":"${d.toISOString()}"}}}`,
      type: 'GET',
      // data: JSON.stringify(message),
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

  app.init();  
});