let populateList = function(val){
  let html = '';
  val.forEach((val)=>{
    html+=`
      <div value=${val} class="ui message grey column tip">
      <button class="delete_button" value="${val._id}">Delete</button>
      <button class="edit_button" value="${val._id}">Edit</button>
        <div class="ui menu">
          <p class="header item">${val.points.length}</p>
          <p class = "header item">${val.location}</p>
          <p class = "header item">${val.username}</p>
          <p class="header item floated right">${val.date}</p>
        </div>
        <div><p>${val.body}</p></div>
      </div>

    `;
  });
  $('#posts').html(html);
};

let search = function(){
  let username = $("#uname").val();
  let pw = $("#pw").val();
  fetch('https://localhost:8080/user_posts', {
      method: 'get',
      headers: {
          'Accept':'application/json',
          'Content-Type':'application/json',
          'Authorization' : `Basic ${btoa(username + ":" + pw)}`
      }
  })
  .then(result => {
    return result.json();
  }).then((result)=>{
    populateList(result);
  });
};

let populateEditFields = function(){
  return `
    <form class="ui form">
      <label>Latitude</label>
      <input class="lat ui input text" type="text"></input>
      <label>Longitude</label>
      <input class="lon ui input text" type="text"></input>
      <label>Tip</label>
      <textArea class="edit_area ui input"></textArea>
      <button class=" edit_submit_button ui fluid button" type="submit">Submit your edit</button>
    </form>
  `;
};

//bind the search button
$("#sub").on('click',(event)=>{
  event.preventDefault();
  search();
});

//bind procedural delete buttons
$("body").on('click', '.delete_button', (event)=>{
  event.preventDefault();
  let id = $(event.currentTarget).val();
  let username = $("#uname").val();
  let pw = $("#pw").val();

  fetch(`https://localhost:8080/posts/${id}`, {
      method: 'delete',
      headers: {
          'Accept':'application/json',
          'Content-Type':'application/json',
          'Authorization' : `Basic ${btoa(username + ":" + pw)}`
      }
  })
  .then(() => {
    search();
  });
});

$("body").on('click', '.edit_button', (event)=>{
  event.preventDefault();
  let id = $(event.currentTarget).val();
  let username = $("#uname").val();
  let pw = $("#pw").val();
  let parentContainer = $(event.currentTarget).parent();
  //Do the fetch thing
  fetch(`https://localhost:8080/find_post/${id}`, {
      method: 'get',
      headers: {
          'Accept':'application/json',
          'Content-Type':'application/json',
          'Authorization' : `Basic ${btoa(username + ":" + pw)}`
      }
  })
  .then((result) => {
    return result.json();
  }).then((result)=>{
    parentContainer.html(populateEditFields());
    let lat = parentContainer.find('.lat').get(0);
    let lon = parentContainer.find('.lon').get(0);
    let body = parentContainer.find('.edit_area').get(0);

    console.log(result);
    $(lat).val(result.location[0]);
    $(lon).val(result.location[1]);
    $(body).val(result.body);

    lat = result.location[0];
    lon = result.location[1];
    body = result.body;


    let editedPost = {
	     "username": `${username}`,
	      "body": `${result.body}`,
	       "location": [0,0]
  };

    $('body').on('click','.edit_submit_button', (event)=>{
      editedPost.body = $(".edit_area").first().val();
      editedPost.location = [$(".lat").first().val(),$(".lon").first().val()];

      console.log(id);
      event.preventDefault();
      fetch(`http://localhost:8080/posts/${id}`, {
          method: 'put',
          body: JSON.stringify(editedPost),
          headers: {
              'Accept':'application/json',
              'Content-Type':'application/json',
              'Authorization' : `Basic ${btoa(username + ":" + pw)}`
          }
      })
      .then((result) => {
        console.log(result);
        search();
      });
    });

  });


});
