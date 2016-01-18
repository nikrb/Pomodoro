
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
  x = cx + r * Math.cos( toRad( 200));
  y = cy + r* Math.sin( toRad( 200));
  $('#pathClip').attr( "points", pathstring);
  $('#pathGhost').attr( "points", pathstring);
  $('.btn').click( function( e){
  });
});