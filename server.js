var express = require( 'express');
var app = express();

/* official
var path = require( 'path');
app.use(express.static(process.argv[3]||path.join(__dirname, 'public')));
*/

// app.use( express.static( 'e://projects/websites/nodet/base/public')); // process.argv[3]));
app.use( express.static( __dirname ));

app.listen( 8080); // process.argv[2]); //
console.log( "server listening on 8080");
