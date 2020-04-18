$(function(){

  let reloadMessages = function() {
    let last_message_id = $('.message:last').data('message-id');
    $.ajax({
      url: "api/messages",
      type: 'get',
      dataType: 'json',
      data: {id: last_message_id}
    })
    .done(function(messages){
      if (messages.length !== 0) {
        let insertHTML = '';
        $.each(messages, function(i, message) {
          insertHTML += buildHTML(message)
        });
        $('.chat-space__view').append(insertHTML);
        $('.chat-space__view').animate({ scrollTop: $('.chat-space__view')[0].scrollHeight});
      }
    })
    .fail(function(){
      alert('error');
    });
  };

  function buildHTML(message){

    let messageInfo = `<div class="message-wrap__info">
                  <div class="message-wrap__info--name">
                    ${message.user_name}
                  </div>
                  <div class="message-wrap__info--date">
                    ${message.created_at}
                  </div>
                </div>`

    if (message.image) {

      let html = `<div class="message" data-message-id=${message.id}> 
                    <div class="message-wrap">`
                      + messageInfo +
                      `<div class="message-wrap__body">
                        <p class="message-wrap__body--text">
                          ${message.body}
                        </p>
                      <img class="message-wrap__body--image" src=${message.image}>
                      </div>
                    </div>
                  </div>`
      return html;
    } else {
      let html = `<div class="message" data-message-id=${message.id}>
                    <div class="message-wrap">`
                      + messageInfo +
                      `<div class="message-wrap__body">
                        <p class="message-wrap__body--text">
                          ${message.body}
                        </p>
                      </div>
                    </div>
                  </div>`
      return html;
    };
  }

  $('#new_message').on('submit', function(e){
    e.preventDefault();
    let formData = new FormData(this);
    let url = $(this).attr('action')
    $.ajax({
      url: url,
      type: 'POST',
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      let html = buildHTML(data);
      $('.chat-space__view').append(html);
      $('form')[0].reset();
      $('.chat-space__view').animate({ scrollTop: $('.chat-space__view')[0].scrollHeight});
      $('.form-submit').prop('disabled', false);
    })
    .fail(function() {
      alert("メッセージ送信に失敗しました");
      $('.form-submit').prop('disabled', false);
    });
  })
  setInterval(reloadMessages, 7000);
});