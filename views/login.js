$(document).ready(function() {

    $('#loginForm').submit(function(event) {
        event.preventDefault();
        let userInfo = {
            'username': $('#username').val(),
            'password': $('#password').val()
        };
        logIn(userInfo);
    });

    function logIn(userInfo) {
        fetch('https://tipical.herokuapp.com/users', {
            method: 'POST',
            body: JSON.stringify(userInfo),
            headers: {
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': `Basic ${btoa(userInfo.username + ':' + userInfo.password)}`
                }
            })
            .then(data => {
                console.log(data);
                console.log('success');
                window.location.href = '/app/user_posts.html';
        });
  }
});
