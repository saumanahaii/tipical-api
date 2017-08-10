let cityLocation = {
  geobyteslongitude: -73.935242,
  geobyteslatitude: 40.730610,
};
let clickedLocation;
let clickedMarker;
let vectorSource = new ol.source.Vector(),vectorLayer = new ol.layer.Vector({source: vectorSource})
let map = new ol.Map({
target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    }),
    vectorLayer
  ],
  overlay: new ol.Overlay({
          element: document.getElementById('overlay'),
          positioning: 'bottom-center'
        }),
  view: new ol.View({
    center: ol.proj.fromLonLat([cityLocation.geobyteslongitude, cityLocation.geobyteslatitude]),
    zoom: 10
  })
});


function CenterMap(long, lat) {
    console.log("Long: " + long + " Lat: " + lat);
    map.getView().setCenter(ol.proj.fromLonLat([parseFloat(long), parseFloat(lat)]));
    map.getView().setZoom(11);
}

$(function ()
 {
	 $("#search-field").autocomplete({
		source: function (request, response) {
		 $.getJSON(
			"https://gd.geobytes.com/AutoCompleteCity?callback=?&q="+request.term,
			function (data) {
			 response(data);
			}
		 );
		},
		minLength: 3,
		select: function (event, ui) {
		 var selectedObj = ui.item;
		 $("#search-field").val(selectedObj.value);
		getcitydetails(selectedObj.value);
		 return false;
		},
		open: function () {
		 $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
		},
		close: function () {
		 $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
		}
	});
	$("#search-field").autocomplete("option", "delay", 100);
});


let getcitydetails = (fqcn) => {
	if (typeof fqcn == "undefined") fqcn = $("#f_elem_city").val();
	cityfqcn = fqcn;
	if (cityfqcn) {
    $.getJSON(
      "https://gd.geobytes.com/GetCityDetails?callback=?&fqcn="+cityfqcn,
         function (data) {
            console.log(data);
            cityLocation = data;
          }
    );
	}
}

let flushMarkers = () => {

}

let getNearbyTips = (lat, lon) => {
  return fetch(`https://tipical.herokuapp.com?lat=${lat}&lon=${lon}`).then(tips=>{
    return tips.json();
  })
}

let generateMarkers = function(lat,lon){
  console.log(`lat: ${lat}, lon: ${lon}`);
  getNearbyTips(lat, lon).then(tips=>{
    //vectorSource.clear();
    tips.forEach(tip=>{
      console.log("making a marker");
      console.log(tip);

      let coord = ol.proj.transform([tip.location[1],tip.location[0]], 'EPSG:4326','EPSG:3857');
      console.log(coord)
      // coord = map.getPixelFromCoordinate([cityLocation.geobyteslongitude,
      // cityLocation.geobyteslatitude])
      // console.log(coord);
      var feature = new ol.Feature(
          new ol.geom.Point(coord)
      );

      let iconStyle = new ol.style.Style({
          image: new ol.style.Icon({
              anchor: [0.5, 46],
              anchorXUnits: 'fraction',
              anchorYUnits: 'pixels',
              opacity: 0.75,
              src: '//openlayers.org/en/v3.8.2/examples/data/icon.png'
          }),
          text: new ol.style.Text({
              font: '16px Calibri,sans-serif',
              fill: new ol.style.Fill({ color: '#000' }),
              stroke: new ol.style.Stroke({
                  color: '#fff', width: 5
              }),
              text: tip.body
          })
      });

      feature.setStyle(iconStyle);
      vectorSource.addFeature(feature);
      //console.log(feature)

      //TEMP COMMENTED OUT
      // var feature = new ol.Feature(
      //     new ol.geom.Point(evt.coordinate)
      // );
      // //THIS IS HOW YOU CAN GET COORDINATES FROM A FEATURE
      // // let coord = feature.getGeometry().getCoordinates();
      // // coord = ol.proj.transform(coord, 'EPSG:3857', 'EPSG:4326');
      // // console.log(coord)
      // feature.setStyle(iconStyle);
      // vectorSource.addFeature(feature);

    })
  });
};

function addPost(post) {
  fetch('https://tipical.herokuapp.com/posts', {
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
      //render the new markers
      generateMarkers(cityLocation.geobyteslatitude,cityLocation.geobyteslongitude);
  });
}

$('#tip-submit-button').on('click', (event)=>{
  event.preventDefault();
  const post = {
      'body' : `${$("#tip-field").val()}`,
      'location': [clickedLocation[1],clickedLocation[0]]
  };
  console.log('logging the post');
  console.log(post);
  addPost(post);

})

$('#search-button').on('click', (event)=>{
  event.preventDefault();
  let searchArray = $("#search-field").val().toString().split(',').map(val=>parseInt(val));
  console.log(cityLocation)
  CenterMap(cityLocation.geobyteslongitude,cityLocation.geobyteslatitude);
  getNearbyTips(cityLocation.geobyteslatitude,cityLocation.geobyteslongitude)
  // console.log(searchArray);
  // if(searchArray.length===2){
  //   renderList(searchArray[0],searchArray[1]);
  // }else{
  //   renderList();
  // }
});

map.on('click', function(evt){
  //now set the location

  let iconStyle = new ol.style.Style({
      image: new ol.style.Icon({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          opacity: 0.75,
          src: '//openlayers.org/en/v3.8.2/examples/data/icon.png'
      })
    });
    if(clickedMarker){
      vectorLayer.getSource().removeFeature(clickedMarker);
    }

    clickedMarker = new ol.Feature(
      new ol.geom.Point(evt.coordinate)
    );

    //THIS IS HOW YOU CAN GET COORDINATES FROM A FEATURE
    clickedLocation = clickedMarker.getGeometry().getCoordinates();
    clickedLocation = ol.proj.transform(clickedLocation, 'EPSG:3857', 'EPSG:4326');
    console.log(clickedLocation)


  clickedMarker.setStyle(iconStyle);
  vectorSource.addFeature(clickedMarker);

});

generateMarkers(cityLocation.geobyteslatitude,cityLocation.geobyteslongitude);
