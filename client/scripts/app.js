// YOUR CODE HERE:
let app = {};

app.init = function() {

};

app.send = function() {
  $.ajax({
  // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/messages',
    type: 'POST',
    data: JSON.stringify('message111111'),
    contentType: 'application/json',
    success: function (data) {
      console.log(data);
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = function() {

  let parseData = function(jsonObj) {
    for (var i = 0; i < jsonObj.results.length; i++) {
      addToDOM(jsonObj.results[i]);
    }
  };

  let addToDOM = function(data) {
    $('#chats').append(`<p>Username: ${data.username}
      Message: ${data.text}</p>`);
  };

  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/messages',
    type: 'GET',
    // data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log(data);
      parseData(data);
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch();

window.log = function(data) {
  console.log(data);
};