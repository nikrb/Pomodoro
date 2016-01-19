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

    function makeSVGText( append_to, tag, attrs, text) {
        var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (var k in attrs)
            el.setAttribute(k, attrs[k]);
        var tn = document.createTextNode( text);
        el.appendChild( tn);
        document.getElementById( append_to).appendChild( el);
        return el;
    }
    function formatSVGText( id, txt){
        var tbox = txt.getBBox();
        var ty = Math.floor( tbox.height/2);
        var tx = Math.floor( tbox.width/2);
        var tpos = { x:100-tx, y:100+(ty/2)};
        console.log( "new text position:", tpos, tbox);
        $( '#'+id).attr( tpos);
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
    function drawGradations( ){

    }
    // ha! interval face (if) is a keyword, so use period face (pf)
    var pf = $('#interval_face');
    drawFace( 'interval_clip_path', parseFloat( pf.attr( "cx")), parseFloat( pf.attr( 'cy')),
                                    parseFloat( pf.attr( 'r'))+40, 200);
    var mf = $('#minutes_face');
    drawFace( 'minutes_clip_path', parseFloat( mf.attr( 'cx')), parseFloat( mf.attr( 'cy')),
                                    parseFloat( mf.attr( 'r'))+30, 220);
    var sf = $( '#seconds_face');
    drawFace( 'seconds_clip_path', parseFloat( sf.attr( "cx")), parseFloat( sf.attr( "cy")),
                                    parseFloat( sf.attr( "r"))+20, 180);

$('#pomodoro_face text').remove();
var txt = makeSVGText( 'pomodoro_face', 'text', { id:'minutes_text', x:'100', y:'100', fill:'darkorange',
                                    'font-size':'25', 'font-weight':'bold'}, "24");
formatSVGText( 'minutes_text', txt);

    $('.btn').click( function( e){
    });
});