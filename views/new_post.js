function getCurrentUser(){
  return fetch('https://localhost:8080/users', {
      method: 'get',
      credentials:'include',
      headers: {
          'Accept':'application/json',
          'Content-Type':'application/json',
      }
  })
  .then(val => {
      console.log('this is the val: ');
      console.dir(val);
      return val;
  });
}

function addPost(post) {
  fetch('https://localhost:8080/posts', {
      method: 'POST',
      body: JSON.stringify(post),
      credentials:'include',
      headers: {
          'Accept':'application/json',
          'Content-Type':'application/json',
          // 'Authorization' : `Basic ${btoa(username + ":" + pw)}`
      }
  })
  .then(newPost => {
      console.log('this is the newPost: ');
      console.dir(newPost);
  });
}

$(document).ready(function() {
    $('#sub').on('click',function(event){
        event.preventDefault();
        getCurrentUser().then((val)=>{

          const post = {
              'body' : `${$("#postData").val()}`,
              'location': [parseFloat($("#lat").val()),parseFloat($("#lon").val())],
              'username' : `${val}`
          };
          console.log('logging the post');
          console.log(post);
          addPost(post);

        });

    });
});
