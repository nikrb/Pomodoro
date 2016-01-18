// change the browser tab text
// document.title = 'New title';

$(document).ready( function(){
  /*
  x = R*cos(theta) and y = R*sin(theta)
  */
  // 0 <= a <= 60
  function toRad( a){
    return a*(Math.PI/180);
  }

  var cx = 100;
  var cy = 100;
  var r = 70;
  var pathstring = "100,100 100,40";
  var x,y;
  for( var i = -90; i < 270; i+= 45){
    x = cx + r * Math.cos( toRad(i));
    y = cy + r* Math.sin( toRad(i));
    pathstring += " "+x+","+y;
  }
  x = cx + r * Math.cos( toRad( 240));
  y = cy + r* Math.sin( toRad( 240));
  pathstring += " "+x+","+y+" 100,100";
  $('#pathClip').attr( "points", pathstring);
  $('#pathGhost').attr( "points", pathstring);
  $('.btn').click( function( e){
  });
});