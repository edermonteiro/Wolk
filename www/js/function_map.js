function mostramapa () {

    //L.marker(e.latlng, {draggable:true}).addTo(map)
    
    
    var myLoc = null;

    var restshow = [];
    
   // initialize the map on the "map" div with a given center and zoom
    var map = L.map('map', {
        center: [16.844633563675657, -24.97020721435547],
        zoom: 12
    });
    
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    
    //pesquisar Locais
    L.Control.geocoder().addTo(map);

//Botões
    
    //Botão minha localização
    L.easyButton({
        states:[
            {
                stateName: 'unloaded',
                icon: 'fa fa-crosshairs',
                title: 'Onde eu estou?',
                onClick: function(control){

                    control.state("loading");

                    control._map.on('locationfound', function(e){

                        this.setView(e.latlng, 16);

                        myLoc = L.marker(e.latlng).addTo(map)
                        .bindPopup("Voce esta aqui!!").openPopup();

                        control.state('loaded');

                    });

                    control._map.on('locationerror', function(){
                        control.state('error');
                    });

                    control._map.locate();

                }
            }, {
                stateName: 'loading',
                icon: 'fa-spinner fa-spin'
            }, {
                stateName: 'loaded',
                icon: 'fa-map-marker fa-lg',
                title: 'Estas aqui!',
                onClick: function(control) {
                   map.removeLayer(myLoc);
                    myLoc = null;
                   control.state('unloaded');
                    //control._map.locate();
                }

            }, {
                stateName: 'error',
                icon: 'fa-frown-o',
                title: 'Localização não encontrada!',
                onClick: function(control) {
                    control.state("loading");

                    control._map.on('locationfound', function(e){

                        this.setView(e.latlng, 16);

                        L.marker(e.latlng).addTo(map)
                        .bindPopup("Voce esta aqui!!").openPopup();

                        control.state('loaded');

                    });

                    control._map.on('locationerror', function(){
                        control.state('error');
                    });

                    control._map.locate();
                }
            }
        ]
    }).addTo(map); 
    
    //Botão DIV
    L.easyButton( 'fa-star', function(){
        alert('you just clicked a font awesome icon');
        //map.setView([42.3748204,-71.1161913],16);
    }).addTo(map);
    
    //Botão Restaurantes Exemplo
    L.easyButton({
        states:[
            {
                stateName: 'show',
                icon: 'fa-cutlery',
                title: 'Restaurantes',
                onClick: function(control){       
                    
                    var rest = [
                        [ 16.886929939381798, -24.98855352401733, "Id 1" ],
                        [ 16.895435300435125, -24.98477697372436, "Id 2" ],
                        [ 16.896574794636177, -24.98990535736084, "Id 3" ], 
                        [ 16.89474749429772 , -24.98954057693481, "Id 4" ],
                        [ 16.888048952658462, -24.988328218460083, "ID 5" ]
                     ];
                        
                     //Loop through the markers array
                     for (var i=0; i<rest.length; i++) {  
                         
                        restshow[i] =  L.marker([rest[i][0], rest[i][1]],{id:i})
                            .addTo(map).on('click', function (e) {
                                sidebar.show();
                            
                                $('#nome').html(rest[e.target.options.id][2]);
                            
                                 // $('#ender').html(re[i]);   
                                
                            });                         
                     }  
                    
                    control.state('hiden');
                }
            }, {
                stateName: 'hiden',
                icon: 'fa-cutlery',
                title: 'Restaurantes tese',
                onClick: function(control){
                     sidebar.hide();
                    for (var i=0; i<restshow.length; i++) {
                        map.removeLayer(restshow[i]);
                    }
                   
                    control.state('show');
                }
            }
        ]
    }).addTo(map);

//End Botões
    

//SIDEBAR
    
    var sidebar = L.control.sidebar('sidebar', {
            closeButton: true,
            position: 'left'
        });
        
        map.addControl(sidebar);

//END SIDEBAR

// ROTASS
    
    L.easyButton({
        
        states:[
            {
              stateName: 'rotashow',
              icon: 'fa-compass',
              title: 'Rotas',
              onClick: function(control){
                  control.state('rotahide');

                   rota = L.Routing.control({
                        waypoints: [
                            /*L.latLng(57.74, 11.94),
                            L.latLng(57.6792, 11.949)*/
                        ],
                        routeWhileDragging: true,
                        geocoder: L.Control.Geocoder.nominatim(),
                        routeDragTimeout: 250,
                        showAlternatives: true,
                        //language: 'pt',
                       //autoRoute: true,
                       summaryTemplate:  '<h2>{name}</h2><h3>Distacia: {distance}</h3>',/*, {time}</h3>',*/
                        altLineOptions: {
                            styles: [
                                {color: 'black', opacity: 0.15, weight: 9},
                                {color: 'white', opacity: 0.8, weight: 6},
                                {color: 'blue', opacity: 0.5, weight: 2}
                            ]
                        }
                    }).addTo(map);

                  $('input[placeholder="Start"]').focusin(function(){
           
                        $('.leaflet-container').css('cursor','crosshair');
                      map.off('click');
                      
                      $('input[placeholder="End"]').off('click');

                          map.on('click', function(e) {

                            var latClick = e.latlng.lat;
                            var lonClick = e.latlng.lng;

                              $('input[placeholder="Start"]').focus().val(latClick+','+lonClick);
                              $('.leaflet-container').css('cursor','');

                         });
                   });
                  

                      //$('.leaflet-container').css('cursor','');
                        //$('input[placeholder="Start"]').off('click');
                        //map.off('click');
                  
                  
                  $('input[placeholder="End"]').focusin(function(){
                        $('.leaflet-container').css('cursor','crosshair');
                        $('input[placeholder="Start"]').off('click');
                        map.off('click');
                      
                       map.on('click', function(e) {

                            var latClick = e.latlng.lat;
                            var lonClick = e.latlng.lng;

                              $('input[placeholder="End"]').focus().val(latClick+','+lonClick);
                           $('.leaflet-container').css('cursor','');

                         });
                        
                   });
                  
                  

              }
            },{
              stateName: 'rotahide',
              icon: 'fa-compass',
              title: 'Rotas',
              onClick: function(control){
                  map.removeControl(rota);
                  //map.removeLayer(rout_mark);
                  control.state('rotashow');
              }
            }
        ]
    }).addTo(map);
    
var address = [
    [16.886929939381798, -24.98855352401733],
    [ 16.895435300435125, -24.98477697372436]
];
    for (var i=0; i<address.length; i++) {
        $.get(location.protocol + '//nominatim.openstreetmap.org/search?format=json&q='+address[i], function(data){
           //console.log(data[0]['display_name']);
           console.log(data);
        });
    }
    
//Icons personalizados

 /*  
var muxiIconProperties = {
  iconUrl: "http://muxi.com.br/app/webroot/img/maps-marker.png"
, iconSize: [44, 59]
, iconAnchor: [22, 59]
, popupAnchor: [0, -50]
};

iconUrl: myURL + 'images/pin24.png',
    iconRetinaUrl: myURL + 'images/pin48.png',
    iconSize: [29, 24],
    iconAnchor: [9, 21],
    popupAnchor: [0, -14]

var muxiIcon = L.icon(muxiIconProperties);

L.marker(muxiCoordinates, {icon: muxiIcon})
  .addTo(map)
  .bindPopup(muxiMarkerMessage)
;
    */
    
}