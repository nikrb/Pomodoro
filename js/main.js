// change the browser tab text
// document.title = 'New title';
// set countdown timer time
/**

  x = R*cos(theta) and y = R*sin(theta)
 second timer:
  countdown from start (25) to 0
  angle goes from 270 to -90
  calc
    360/25 = delta
    
*/
$(document).ready( function(){
    function toRad( a){
        return a*(Math.PI/180);
    }
    function drawFace( id, cx, cy, radius, angle){
        console.log( "@drawFace args:", arguments);
        var pathstring = "100,100 ";
        var x,y;
        for( var i = angle; i > -90 ; i -= 45){
            x = cx + radius * Math.cos( toRad(i));
            y = cy + radius* Math.sin( toRad(i));
            pathstring += " "+x+","+y;
        }
        x = cx + radius * Math.cos( toRad( -90));
        y = cy + radius* Math.sin( toRad( -90));
        pathstring += " "+x+","+y+" 100,100";
        $('#'+id+">polyline").attr( "points", pathstring);
        // $('#pathGhost').attr( "points", pathstring);
    }
    var sf = $( '#seconds_face');
    drawFace( 'seconds_clip_path', parseFloat( sf.attr( "cx")), parseFloat( sf.attr( "cy")),
                                    parseFloat( sf.attr( "r"))+20, 240);
    var mf = $('#minutes_face');
    drawFace( 'minutes_clip_path', parseFloat( mf.attr( 'cx')), parseFloat( mf.attr( 'cy')),
                                    parseFloat( sf.attr( 'r'))+30, 220);
    // drawFace( 'minutes_clip_path', 90, 140);
    $('.btn').click( function( e){
    });
});