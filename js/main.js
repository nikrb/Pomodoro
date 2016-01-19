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
    $('.btn').click( function( e){
    });

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
    // the current interval minutes left needs centreing.
    function formatSVGText( id, txt){
        var tbox = txt.getBBox();
        var ty = Math.floor( tbox.height/2);
        var tx = Math.floor( tbox.width/2);
        var tpos = { x:100-tx, y:100+(ty/2)};
        console.log( "new text position:", tpos, tbox);
        $( '#'+id).attr( tpos);
    }
    /**
        drawFace
        draw doughnut progress
        id:ele      element doughnut to draw
        cx:int      centre x
        cy:int      centre y
        radius:int  doughnut outer radius
        angle:int   how far around doughnut has progressed
    **/
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

    /**
        drawGradations
        display pomodoro gradation (svg) text 
        params:
        total:int       number of gradations, e.g. (secs:60, mins:25, intervals:4)
        mf:$.element    one of the doughnut faces, [interval_face, minutes_face, seconds_face]
        id_base:string  base string for gradations, e.g. mins_grad_text for minutes
    **/
    function drawGradations( total, mf, id_base){
        var angle_delta = 360/total;
        var mfr = parseInt( mf.attr('r'))-10;
        var cx =  parseInt( mf.attr( 'cx'));
        var cy =  parseInt( mf.attr( 'cy'));
        console.log( "cx[%d] cy[%d]", cx, cy);
        if( total > 12){
            offset = 2;
        }
        for( var i=1; i<=total; i++){
            // we go from -90 to +270
            var ang = i*angle_delta -90;
            // FIXME gotta love tweaks (+-3), need a read through svg text
            var tx = cx + mfr * Math.cos( toRad(ang)) - 3;
            var ty = cy + mfr * Math.sin( toRad(ang)) + 3;
            var txt = makeSVGText( 'pomodoro_face', 'text', { id:id_base+i, x:tx, y:ty, fill:'black',
                                            'font-size':'6'}, i);
        }
    }

    function displayGradationText(){
        // display the gradation text
        $('#pomodoro_face text').remove();
        // main centred text show minutes left for current interval
        var txt = makeSVGText( 'pomodoro_face', 'text', { id:'minutes_text', x:'100', y:'100', fill:'darkorange',
                                            'font-size':'25', 'font-weight':'bold'}, "24");
        formatSVGText( 'minutes_text', txt);

        // the the doughnut grads for minutes and interval
        drawGradations( 25, mf, 'minsgrad');
        drawGradations( 4, pf, 'intervalgrad');
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

    displayGradationText();

    
});