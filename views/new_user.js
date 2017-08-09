$(document).ready(function() {

function addUser(user) {
    let usercredentials = user;
    fetch('https://localhost:8080/users', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Accept':'application/json',
            'Content-Type':'application/json',
            'Authorization': `Basic ${btoa(user.username + ':' + user.password)}`
            }
        })
        .then(data => {
            let userInfo = {
                'username': data.username,
                'password': usercredentials.password
        };
        logIn(userInfo);
    });
}

function logIn(userInfo) {
    fetch('https://localhost:8080/users', {
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


    $('#signupButton').on('click',function(event){
        event.preventDefault();
        const user = {
            'username': $('#username').val(),
            'password': $('#password').val()
        };
        console.log(user);
        addUser(user);
    });

    $('#loginButton').on('click',function(event){
        event.preventDefault();
        const user = {
            'username': $('#username').val(),
            'password': $('#password').val()
        };
        console.log(user);
        addUser(user);
    });
});
