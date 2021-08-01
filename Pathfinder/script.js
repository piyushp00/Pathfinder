//Things to do:
// Add more algorithms (research)
	// Bidirectional depth first search
	// Bidirectional A*?
	// Bidirectional breadth first search
// Add more maze creation functions
	// Do pure horizontal and pure vertical maze
	// Do spiral maze from middle?
/* ------------------------------------ */
/* ---- Var Declarations & Preamble---- */
/* ------------------------------------ */

var totalRows = 25;
var totalCols = 40;
var inProgress = false;
//var initialMessage = "Click or drag cells to build walls! Press start when you finish and have selected an algorithm!";
var cellsToAnimate = [];
var createWalls = false;
var algorithm = null;
var justFinished = false;
var animationSpeed = "Fast";
var animationState = null;
var startCell = [11, 15];
var endCell = [11, 25];
var movingStart = false;
var movingEnd = false;

function generateGrid( rows, cols ) {
    var grid = "<table>";
    for ( row = 1; row <= rows; row++ ) {
        grid += "<tr>"; 
        for ( col = 1; col <= cols; col++ ) {      
            grid += "<td></td>";
        }
        grid += "</tr>"; 
    }
    grid += "</table>"
    return grid;
}

