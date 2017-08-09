//ADD IN THE USERNAME INTO THE NEW POST POST

let renderList = function(lat,lon){
  console.log(`lat: ${lat}, lon: ${lon}`);
  if(lat == undefined || lon == undefined){
    $.get('https://localhost:8080/').then((val)=>{
      console.log("rendering default view");
      populateList(val);

    });
  }else{
    $.get(`https://localhost:8080?lat=${lat}&lon=${lon}`).then((val)=>{
      console.log("rendering Secondary view");
      populateList(val);

    });
  }
};

renderList();

let populateList = function(val){
  let html = '';
  val.forEach((val)=>{
    html+=`
      <div class="ui message grey column">
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

$('#search-button').on('click', (event)=>{
  event.preventDefault();
  let searchArray = $("#search-field").val().toString().split(',').map(val=>parseInt(val));
  console.log(searchArray);
  if(searchArray.length===2){
    renderList(searchArray[0],searchArray[1]);
  }else{
    renderList();
  }
});
