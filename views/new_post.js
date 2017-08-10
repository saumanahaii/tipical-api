function getCurrentUser(){
  return fetch('http://localhost:8080/users', {
      method: 'get',
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
  fetch('http://localhost:8080/posts', {
      method: 'POST',
      body: JSON.stringify(post),
      headers: {
          'Accept':'application/json',
          'Content-Type':'application/json',
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
          const post = {
              'body' : `${$("#postData").val()}`,
              'location': [parseFloat($("#lat").val()),parseFloat($("#lon").val())],
          };
          console.log('logging the post');
          console.log(post);
          addPost(post);
    });
});
