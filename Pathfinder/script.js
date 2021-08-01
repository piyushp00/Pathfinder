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

var myGrid = generateGrid( totalRows, totalCols);
$( "#tableContainer" ).append( myGrid );

/* --------------------------- */
/* --- OBJECT DECLARATIONS --- */
/* --------------------------- */

function Queue() { 
	this.stack = new Array();
	this.dequeue = function(){
		 return this.stack.pop(); 
	} 
	this.enqueue = function(item){
		 this.stack.unshift(item);
		 return;
	}
	this.empty = function(){
		return ( this.stack.length == 0 );
	}
	this.clear = function(){
		this.stack = new Array();
		return;
	}
   }
   
   function minHeap() {
	   this.heap = [];
	   this.isEmpty = function(){
		   return (this.heap.length == 0);
	   }
	   this.clear = function(){
		   this.heap = [];
		   return;
	   }
	   this.getMin = function(){
		   if (this.isEmpty()){
			   return null;
		   }
		   var min = this.heap[0];
		   this.heap[0] = this.heap[this.heap.length - 1];
		   this.heap[this.heap.length - 1] = min;
		   this.heap.pop();
		   if (!this.isEmpty()){
			   this.siftDown(0);
		   }
		   return min;
	   }
	   this.push = function(item){
		   this.heap.push(item);
		   this.siftUp(this.heap.length - 1);
		   return;
	   }
	   this.parent = function(index){
		   if (index == 0){
			   return null;
		   }
		   return Math.floor((index - 1) / 2);
	   }
	   this.children = function(index){
		   return [(index * 2) + 1, (index * 2) + 2];
	   }
	   this.siftDown = function(index){
		   var children = this.children(index);
		   var leftChildValid = (children[0] <= (this.heap.length - 1));
		   var rightChildValid = (children[1] <= (this.heap.length - 1));
		   var newIndex = index;
		   if (leftChildValid && this.heap[newIndex][0] > this.heap[children[0]][0]){
			   newIndex = children[0];
		   }
		   if (rightChildValid && this.heap[newIndex][0] > this.heap[children[1]][0]){
			   newIndex = children[1];
		   }
		   // No sifting down needed
		   if (newIndex === index){ return; }
		   var val = this.heap[index];
		   this.heap[index] = this.heap[newIndex];
		   this.heap[newIndex] = val;
		   this.siftDown(newIndex);
		   return;
	   }
	   this.siftUp = function(index){
		   var parent = this.parent(index);
		   if (parent !== null && this.heap[index][0] < this.heap[parent][0]){
			   var val = this.heap[index];
			   this.heap[index] = this.heap[parent];
			   this.heap[parent] = val;
			   this.siftUp(parent);
		   }
		   return;
	   }
   }
   
   /* ------------------------- */
   /* ---- MOUSE FUNCTIONS ---- */
   /* ------------------------- */
   
   $( "td" ).mousedown(function(){
	var index = $( "td" ).index( this );
	var startCellIndex = (startCell[0] * (totalCols)) + startCell[1];
	var endCellIndex = (endCell[0] * (totalCols)) + endCell[1];
	if ( !inProgress ){
		// Clear board if just finished
		if ( justFinished  && !inProgress ){ 
			clearBoard( keepWalls = true ); 
			justFinished = false;
		}
		if (index == startCellIndex){
			movingStart = true;
			//console.log("Now moving start!");
		} else if (index == endCellIndex){
			movingEnd = true;
			//console.log("Now moving end!");
		} else {
			createWalls = true;
		}
	}
});

$( "td" ).mouseup(function(){
	createWalls = false;
	movingStart = false;
	movingEnd = false;
});

$( "td" ).mouseenter(function() {
	if (!createWalls && !movingStart && !movingEnd){ return; }
	var index = $( "td" ).index( this );
	var startCellIndex = (startCell[0] * (totalCols)) + startCell[1];
	var endCellIndex = (endCell[0] * (totalCols)) + endCell[1];
	if (!inProgress){
		if (justFinished){ 
			clearBoard( keepWalls = true );
			justFinished = false;
		}
		//console.log("Cell index = " + index);
		if (movingStart && index != endCellIndex) {
			moveStartOrEnd(startCellIndex, index, "start");
		} else if (movingEnd && index != startCellIndex) {
			moveStartOrEnd(endCellIndex, index, "end");
		} else if (index != startCellIndex && index != endCellIndex) {
			$(this).toggleClass("wall");
		}
	}
});

$( "td" ).click(function() {
	var index = $( "td" ).index( this );
	var startCellIndex = (startCell[0] * (totalCols)) + startCell[1];
	var endCellIndex = (endCell[0] * (totalCols)) + endCell[1];
	if ((inProgress == false) && !(index == startCellIndex) && !(index == endCellIndex)){
		if ( justFinished ){ 
			clearBoard( keepWalls = true );
			justFinished = false;
		}
		$(this).toggleClass("wall");
	}
});

$( "body" ).mouseup(function(){
	createWalls = false;
	movingStart = false;
	movingEnd = false;
});

/* ----------------- */
/* ---- BUTTONS ---- */
/* ----------------- */

$( "#startBtn" ).click(function(){
	if ( algorithm == null ){ return;}
	if ( inProgress ){ update("wait"); return; }
	traverseGraph(algorithm);
});

$( "#clearBtn" ).click(function(){
	if ( inProgress ){ update("wait"); return; }
	clearBoard(keepWalls = false);
});


/* --------------------- */
/* --- NAV BAR MENUS --- */
/* --------------------- */

$( "#algorithms .dropdown-item").click(function(){
	if ( inProgress ){ update("wait"); return; }
	algorithm = $(this).text();
	updateStartBtnText();
	console.log("Algorithm has been changd to: " + algorithm);
});

$( "#speed .dropdown-item").click(function(){
	if ( inProgress ){ update("wait"); return; }
	animationSpeed = $(this).text();
	updateSpeedDisplay();
	console.log("Speed has been changd to: " + animationSpeed);
});

$( "#mazes .dropdown-item").click(function(){
	if ( inProgress ){ update("wait"); return; }
	maze = $(this).text();
	if (maze == "Random"){
		randomMaze();
	} else if (maze == "Recursive Division"){
		recursiveDivMaze(null);
	} else if (maze == "Recursive Division (Vertical Skew)"){
		recursiveDivMaze("VERTICAL");
	} else if (maze == "Recursive Division (Horizontal Skew)"){
		recursiveDivMaze("HORIZONTAL");
	} else if (maze == "Simple Spiral"){
		spiralMaze();
	}
	console.log("Maze has been changd to: " + maze);
});

