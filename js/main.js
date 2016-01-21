/*
change the browser tab text
document.title = 'New title';
set countdown timer time

  x = R*cos(theta) and y = R*sin(theta)
 second timer:
  countdown from start (25) to 0
  angle goes from 270 to -90
  calc
    angle = count * 360/n -90
 */

$(document).ready( function(){
    var interval_hand = $('#interval_face');
    var minute_hand = $('#minutes_face');
    var second_hand = $( '#seconds_face');
    var centre_x = parseInt( second_hand.attr( 'cx'));
    var centre_y = parseInt( second_hand.attr( 'cy'));
    var radius = parseInt( second_hand.attr( 'r'));
    var work_interval = true;
    var seconds_max = 60;
    var seconds = seconds_max;
    var minutes = 25;
    var minutes_max = 25;
    var minutes_bg_colour = 'red';
    var intervals = 4;
    // timer id
    var interval_id = 0;
    // need from and to points for animate, so keep a hold of the last. Start with the placeholder
    var last_points = initial_points = {
                        'minutes' : "100,100 100,0 200,100 100,200 0,100 100,0 100,100",
                        'intervals':"100,100 100,0 200,100 100,200 0,100 100,0 100,100"
                    };

    // jquery init
    $(document).on( 'keypress', function( e){
        switch( e.which){
            case 32:
                e.preventDefault();
                if( interval_id === 0){
                    resume();
                } else {
                    pause();
                }
                break;
            case 115:
                e.preventDefault();
                if( interval_id === 0){
                    start();
                } else {
                    stop();
                }
                break;
        }
    });

    $('#error_panel_close').click( function(evt){
        $('.error_message_panel').addClass( 'collapse');
    });
    $('input').blur( function(e){
        try{
            var r = $(this).val().match( /^[3-9]$|^[1-5][0-9]$|^60$/ );
            if( r === null) throw new Error( "not a single number in range");
            // if( cval < 5 || cval > 60) throw new Error( "out of range");
        } catch( ex){
            e.stopImmediatePropagation();
            console.log( "Exception:", ex.message);
            $('.error_message_panel').removeClass( 'collapse');
            $('#error_message_text').html( "Minutes can only be a whole number in the range 5 to 60.");
            if( $(this).attr( 'id') === 'interval_minutes'){
                $(this).val( 25);
            } else {
                $(this).val( 5);
            }
        }
    });
    $('a').click( function( e){
        var ip_ele = $(this).siblings('input');
        var cval = parseInt( ip_ele.val());
        switch( e.target.text){
            case '+':
                ip_ele.val( cval+1);
                break;
            case '-':
                ip_ele.val( cval-1);
                break;
        }
    });
    $( '.btn').click( function( e){
        switch( $(this).text()){
            case 'short':
                $('#short_break_minutes').val( 5);
                break;
            case 'long':
                $('#long_break_minutes').val( 10);
                break;
            case 'standard':
                $('#interval_minutes').val( 25);
                break;
            case 'Reset':
                runTimer( false);
                setDefaultBreakTimes();
                refreshFace();
                break;
            case 'Start':
                start();
                break;
            case 'Stop':
                stop();
                break;
            case 'Pause':
                pause();
                break;
            case 'Resume':
                resume();
                break;
            case 'Help':
                var face = document.getElementById( 'help_overlay');
                if( face.style.display === 'none')
                    face.style.display = 'block';
                else
                    face.style.display = 'none';
                break;
            case 'Test':
                setupTest();
                break;
        }
    });
    function setupTest(){
        if( seconds_max === 60){
            minutes_max = 3;
            $('#interval_minutes').val( 3);
            minutes = minutes_max;
            $('#short_break_minutes').val( 3);
            $('#long_break_minutes').val( 3);
            seconds_max = 3;
            seconds = seconds_max;
            refreshFace();
        } else {
            // don't set actual seconds here, let it finish and then wrap to 60
            seconds_max = 60;
            minutes_max = 5;
        }
    }
    function start(){
        $('#start_btn').text( 'Stop');
        work_interval = true;
        seconds = seconds_max;
        minutes_max = parseInt( $('#interval_minutes').val());
        minutes = minutes_max;
        intervals = 4;
        refreshFace();
        runTimer( true);
    }
    function stop( $ele){
        runTimer( false);
        $('#start_btn').text( 'Start');
    }
    function pause(){
        runTimer( false);
        $('#pause_btn').text( 'Resume');
    }
    function resume(){
        runTimer( true);
        $('#pause_btn').text( 'Pause');
    }
    function runTimer( run){
        if( interval_id) clearInterval( interval_id);
        interval_id = 0;
        if( run) interval_id = setInterval( tic, 1000);
    }
    function tic(){
        if( --seconds === 0){
            seconds = seconds_max;
            if( --minutes === 0){
                playDing();
                if( work_interval){
                    work_interval = false;
                    minutes_bg_colour = 'green';
                    // last interval has a long break
                    if( intervals === 1){
                        minutes_max = parseInt( $('#long_break_minutes').val());
                    } else {
                        minutes_max = parseInt( $('#short_break_minutes').val());
                    }
                } else {
                    playDing();
                    work_interval = true;
                    minutes_bg_colour = 'red';
                    minutes_max = parseInt( $('#interval_minutes').val());
                    intervals--;
                    if( intervals === 0){
                        playDing(2);
                        intervals = 4;
                    }
                    refreshIntervalHand();
                }
                minutes = minutes_max;
                displayGradationText();
            }
            refreshMinuteHand();
        }
        refreshSecondHand();
    }
    function setDefaultBreakTime(){
        $('#short_break_minutes').val( 5);
        $('#long_break_minutes').val( 10);
        $('#interval_minutes').val( 25);
    }
    function playDing(){

    }

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
        $( '#'+id).attr( tpos);
    }
    function drawSVGLine( append_to, tag, attrs) {
        var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (var k in attrs)
            el.setAttribute(k, attrs[k]);
        document.getElementById( append_to).appendChild( el);
    }

    function animateSVG( append_to, attrs) {
        var old = document.getElementById( attrs.id);
        if( old) old.remove();
        var el= document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        for (var k in attrs)
            el.setAttribute(k, attrs[k]);
        document.getElementById( append_to).appendChild( el);
        el.beginElement();
    }
    /**
        drawFace
        draw doughnut progress
        to animate clipath points must have the same number of pairs
        using 8 pointed poly, back to the start (top point of poly) is another point, 
        centre start and finish is another 2. So we have 11 points in total.
        id_base:ele element base name of doughnut to draw
        cx:int      centre x
        cy:int      centre y
        radius:int  doughnut outer radius
        angle:int   how far around doughnut has progressed
    **/
    function drawFace( id_base, cx, cy, radius, angle, anim){
        var pathstring = "100,100";
        var x,y;
        var delta = angle/4;
        var ang = 0;
        // for( var i = -90; i<= angle; i += delta){
        for( var i = 0; i<5; i++){
            ang = i*delta -90;
            x = cx + radius * Math.cos( toRad(ang));
            y = cy + radius * Math.sin( toRad(ang));
            pathstring += " "+x+","+y;
        }
        pathstring += " 100,100";
        if( anim){
            var attrs = {
                id              : id_base+"_polyline_anim",
                dur             : "1s",
                from            : last_points[id_base],
                to              : pathstring,
                attributeName   : "points",
                fill            : "freeze",
                calcMode        : "spline",
                keySplines      : "0.42 0 0.58 1"
            };
            animateSVG( id_base+"_polyline", attrs);
            last_points[id_base] = pathstring.slice();
        } else {
            var old = document.getElementById( id_base+"_polyline_anim");
            if( old){
                old.remove();
                last_points[id_base] = pathstring.slice();
            }
            $('#'+id_base+">polyline").attr( "points", pathstring);
        }
        // check 
        // if( id_base === 'intervals'){
        //     $('#pathGhost').attr( "points", pathstring);
        // }
    }

    /**
        drawGradations
        display pomodoro gradation (svg) text
        haven't bothered with gradations on seconds
        params:
        total:int       number of gradations, e.g. (secs:60, mins:25, intervals:4)
        mf:$.element    one of the doughnut faces, [interval_face, minutes_face, seconds_face]
        id_base:string  base string for gradations, e.g. mins_grad_text for minutes
    **/
    function drawGradations( total, mf, id_base){
        var angle_delta = 360/total;
        // the text radius needs to be in the middle of the doughnut
        var mfr = parseInt( mf.attr('r'))-10;
        var cx =  parseInt( mf.attr( 'cx'));
        var cy =  parseInt( mf.attr( 'cy'));
        for( var i=1; i<=total; i++){
            // we go from -90 to +270, - offset to move grad text off the grad line
            var ang = i*angle_delta -90 - angle_delta/2;
            // FIXME gotta love tweaks (+-3), need a read through svg text
            var tx = cx + mfr * Math.cos( toRad(ang)) - 3;
            var ty = cy + mfr * Math.sin( toRad(ang)) + 3;
            var txt = makeSVGText( 'pomodoro_face', 'text', { id:id_base+"_text"+i, x:tx, y:ty, fill:'black',
                                            'font-size':'6'}, i);
        }
        // the line radius needs to start at the outer edge
        var mfrl = parseInt( mf.attr('r'));
        for( i=0; i<total; i++){
            var ang = i*angle_delta -90;
            var x1 = cx + mfrl * Math.cos( toRad(ang));
            var y1 = cy + mfrl * Math.sin( toRad(ang));
            var x2 = cx + (mfrl-5) * Math.cos( toRad(ang));
            var y2 = cy + (mfrl-5) * Math.sin( toRad(ang));
            var line_attrs = { id:'id_base'+i, 'x1':x1, 'y1':y1, 'x2':x2, 'y2':y2, 'stroke':'#222', 'stroke-width':1};
            drawSVGLine( 'pomodoro_face', 'line', line_attrs);
        }
    }
    // FIXME we really only want to refresh minutes grads after initial draw.
    //          we'll need to put the minute stuff in an svg group on it's own me thinx
    function displayGradationText(){
        // display the gradation text
        $('#pomodoro_face text').remove();
        $('#pomodoro_face line').remove();
        // the the doughnut grads for minutes and interval
        drawGradations( minutes_max, minute_hand, 'minsgrad');
        drawGradations( 4, interval_hand, 'intervalgrad');
    }

    function refreshIntervalHand(){
        var angle = intervals * 360/4;
        var anim = true;
        if( intervals === 4){
            anim = false;
            last_points['intervals'] = initial_points['intervals'].slice();
        }
        drawFace( 'intervals', centre_x, centre_y, 200, angle, anim);
    }
    function refreshMinuteHand(){
        var angle = minutes * 360 / minutes_max;
        var anim = true;
        if( minutes === minutes_max){
            anim = false;
            last_points['minutes'] = initial_points['minutes'].slice();
        }
        minute_hand.attr( 'fill', minutes_bg_colour);
        drawFace( 'minutes', centre_x, centre_y, 150, angle, anim);
        $('#minutes_text').remove();
        // main centred text show minutes left for current interval
        var txt = makeSVGText( 'pomodoro_face', 'text', { id:'minutes_text', x:'100', y:'100', fill:'darkorange',
                                            'font-size':'25', 'font-weight':'bold'}, minutes);
        formatSVGText( 'minutes_text', txt);
    }
    function refreshSecondHand(){
        var angle = seconds * 360 / 60;
        drawFace( 'seconds_clip_path', centre_x, centre_y, radius+50, angle, false);
    }
    function refreshFace(){
        displayGradationText();
        refreshSecondHand();
        refreshMinuteHand();
        refreshIntervalHand();
    }
    setupTest();
    refreshFace();
});