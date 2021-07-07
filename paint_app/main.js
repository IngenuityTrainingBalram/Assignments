let canvas;

let context;
// Stores previously drawn image data to restore after
// new drawings are added
let savedImageData;

// Stores whether the mouse is being dragged or not.
let dragging = false;
let strokeColor = 'black';
let fillColor = 'black';
let line_Width = 3;
let polygonSides = 6;
// default selection of the tool is brush.
let currentTool = 'brush';
let canvasWidth = 500;
let canvasHeight = 500;


// Stores whether the brush is being used or not.

let usingBrush = false;
// Stores line x & ys used to make brush lines
let brushXPoints = new Array();
let brushYPoints = new Array();

// Stores whether mouse is down
let brushDownPos = new Array();

// Stores size data used to create rubber band shapes
// that will redraw as the user moves the mouse
class ShapeBoundingBox {
    constructor(left, top, width, height) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }
}

// Holds x & y position where clicked
class MouseDownPos {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

// Holds x & y location of the mouse
class Location {
    constructor(x, y) {
        this.x = x,
            this.y = y;
    }
}

// Holds x & y polygon point values
class PolygonPoint {
    constructor(x, y) {
        this.x = x,
            this.y = y;
    }
}
// Stores top left x & y and size of rubber band box (left point, right point, height and width)
let shapeBoundingBox = new ShapeBoundingBox(0, 0, 0, 0);
// Holds x & y position where clicked
let mousedown = new MouseDownPos(0, 0);
// Holds x & y location of the mouse
let loc = new Location(0, 0);

// Call for our function to execute when page is loaded
document.addEventListener('DOMContentLoaded', setupCanvas);

function setupCanvas() {
    // load canvas
    canvas = document.getElementById('my-canvas');
    context = canvas.getContext('2d');
    context.strokeStyle = strokeColor;
    context.lineWidth = line_Width;


    canvas.addEventListener("mousedown", functionToMouseDown);
    canvas.addEventListener("mousemove", functionToMouseMove);
    canvas.addEventListener("mouseup", functionToMouseUp);
}

function ChangeTool(toolClicked) {
    document.getElementById("brush").className = "";
    document.getElementById("line").className = "";
    document.getElementById("rectangle").className = "";
    document.getElementById("circle").className = "";
    document.getElementById("ellipse").className = "";
    document.getElementById("polygon").className = "";
    // Highlight the last selected tool on toolbar, 
    // this will change the class of selected tool with the class name "selected"
    document.getElementById(toolClicked).className = "selected";
    // Change current tool used for drawing which was earlier set to brush
    currentTool = toolClicked;
}
// Returns mouse x & y position based on canvas position in page
function GetMousePosition(x, y) {
    // Get canvas size and position in web page
    let canvasSizeData = canvas.getBoundingClientRect();
    return {
        x: (x - canvasSizeData.left) * (canvas.width / canvasSizeData.width),
        y: (y - canvasSizeData.top) * (canvas.height / canvasSizeData.height)
    };
}

function SaveCanvasImage() {
    savedImageData = context.getImageData(0, 0, canvas.width, canvas.height);
}

function RedrawCanvasImage() {
    // Restore the canvas previous image/ or the image that has some curves drawn.
    context.putImageData(savedImageData, 0, 0);
}

function UpdateRubberbandSizeData(loc) {
    // Height & width are the difference between were clicked
    // and current mouse position
    shapeBoundingBox.width = Math.abs(loc.x - mousedown.x);
    shapeBoundingBox.height = Math.abs(loc.y - mousedown.y);

    // If mouse is below where mouse was clicked originally
    if (loc.x > mousedown.x) {

        // Store mousedown because it is farthest left
        shapeBoundingBox.left = mousedown.x;
    } else {

        // Store mouse location because it is most left
        shapeBoundingBox.left = loc.x;
    }

    // If mouse location is below where clicked originally
    if (loc.y > mousedown.y) {

        // Store mousedown because it is closer to the top
        // of the canvas
        shapeBoundingBox.top = mousedown.y;
    } else {

        // Otherwise store mouse position
        shapeBoundingBox.top = loc.y;
    }
}

// Returns the angle using x and y, if x = Base and y = Perpendicualr then, Tan(Angle) = Perpendicualr / Base
// Angle = ArcTan(Perpendicualr / Base)
function getAngleUsingXAndY(mouselocX, mouselocY) {
    let adjacent = mousedown.x - mouselocX;
    let opposite = mousedown.y - mouselocY;

    return radiansToDegrees(Math.atan2(opposite, adjacent));
    // atan2() method in JS gives the angle between -pi to pi in radian hence it can give a negative value too. (counterclockwise)
}

function radiansToDegrees(rad) {
    if (rad < 0) {
        //    add 360 to the negative value since in trigonometry, sin(-45) = sin(360+(-45)), 
        // just here it has been used to find the correct values in positive format.
        return (360.0 + (rad * (180 / Math.PI))).toFixed(2);
    } else {
        return (rad * (180 / Math.PI)).toFixed(2);
    }
}

// Converts degrees to radians
function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function getPolygonPoints() {
    // Get angle in radians based on x & y of mouse location
    let angle = degreesToRadians(getAngleUsingXAndY(loc.x, loc.y));

    // X & Y for the X & Y point representing the radius is equal to
    // the X & Y of the bounding rubberband box
    let radiusX = shapeBoundingBox.width;
    let radiusY = shapeBoundingBox.height;
    // Stores all points in the polygon
    let polygonPoints = [];

    // if the centre of the polygon is considered as the vertex of a triangle then r*sin(theta) will be on x-co-ordinate 
    // and r*cos(theta) will be on Y.
    for (let i = 0; i < polygonSides; i++) {
        polygonPoints.push(new PolygonPoint(loc.x + radiusX * Math.sin(angle),
            loc.y - radiusY * Math.cos(angle)));

        // 2 * PI equals 360 degrees
        // Divide 360 into parts based on how many polygon 
        // sides you want 
        angle += 2 * Math.PI / polygonSides;
    }
    return polygonPoints;
}

// Get the polygon points and draw the polygon
function getPolygon() {
    let polygonPoints = getPolygonPoints();
    context.beginPath();
    context.moveTo(polygonPoints[0].x, polygonPoints[0].y);
    for (let i = 1; i < polygonSides; i++) {
        context.lineTo(polygonPoints[i].x, polygonPoints[i].y);
    }
    context.closePath();
}

// Called to draw the line
function drawRubberbandShape(loc) {
    context.strokeStyle = strokeColor;
    context.fillStyle = fillColor;
    if (currentTool === "brush") {
        // Create paint brush
        DrawBrush();
    } else if (currentTool === "line") {
        // Draw Line
        context.beginPath();
        context.moveTo(mousedown.x, mousedown.y);
        context.lineTo(loc.x, loc.y);
        context.stroke();
    } else if (currentTool === "rectangle") {
        // Creates rectangles
        context.strokeRect(shapeBoundingBox.left, shapeBoundingBox.top, shapeBoundingBox.width, shapeBoundingBox.height);
    } else if (currentTool === "circle") {
        // Create circles
        let radius = shapeBoundingBox.width;
        context.beginPath();
        context.arc(mousedown.x, mousedown.y, radius, 0, Math.PI * 2);
        context.stroke();
    } else if (currentTool === "ellipse") {
        // Create ellipses
        // context.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle)
        let radiusX = shapeBoundingBox.width / 2;
        let radiusY = shapeBoundingBox.height / 2;
        context.beginPath();
        context.ellipse(mousedown.x, mousedown.y, radiusX, radiusY, Math.PI / 4, 0, Math.PI * 2);
        context.stroke();
    } else if (currentTool === "polygon") {
        // Create polygons
        getPolygon();
        context.stroke();
    }
}

function UpdateRubberbandOnMove(loc) {
    // Stores changing height, width, x & y position of most 
    // top left point being either the click or mouse location
    UpdateRubberbandSizeData(loc);

    // Redraw the shape
    drawRubberbandShape(loc);
}

// Store each point as the mouse moves and whether the mouse
// button is currently being dragged
function AddBrushPoint(x, y, mouseDown) {
    brushXPoints.push(x);
    brushYPoints.push(y);
    // Store true that mouse is down
    brushDownPos.push(mouseDown);
}

// Cycle through all brush points and connect them with lines
function DrawBrush() {
    for (let i = 1; i < brushXPoints.length; i++) {
        context.beginPath();

        // Check if the mouse button was down at this point
        // and if so continue drawing
        if (brushDownPos[i]) {
            context.moveTo(brushXPoints[i - 1], brushYPoints[i - 1]);
        } else {
            context.moveTo(brushXPoints[i] - 1, brushYPoints[i]);
        }
        context.lineTo(brushXPoints[i], brushYPoints[i]);
        context.closePath();
        context.stroke();
    }
}

function functionToMouseDown(e) {
    // Change the mouse pointer to a crosshair
    canvas.style.cursor = "crosshair";
    // Store location 
    loc = GetMousePosition(e.clientX, e.clientY);
    // Save the current canvas image
    SaveCanvasImage();
    // Store mouse position when clicked
    mousedown.x = loc.x;
    mousedown.y = loc.y;
    // Store that yes the mouse is being held down
    dragging = true;

    // Brush will store points in an array
    if (currentTool === 'brush') {
        usingBrush = true;
        AddBrushPoint(loc.x, loc.y);
    }
};

function functionToMouseMove(e) {
    canvas.style.cursor = "crosshair";
    loc = GetMousePosition(e.clientX, e.clientY);

    // If using brush tool and dragging store each point
    if (currentTool === 'brush' && dragging && usingBrush) {
        // Throw away brush drawings that occur outside of the canvas
        if (loc.x > 0 && loc.x < canvasWidth && loc.y > 0 && loc.y < canvasHeight) {
            AddBrushPoint(loc.x, loc.y, true);
        }
        RedrawCanvasImage();
        DrawBrush();
    } else {
        if (dragging) {
            RedrawCanvasImage();
            UpdateRubberbandOnMove(loc);
        }
    }
};

function functionToMouseUp(e) {
    canvas.style.cursor = "default";
    loc = GetMousePosition(e.clientX, e.clientY);
    RedrawCanvasImage();
    UpdateRubberbandOnMove(loc);
    dragging = false;
    usingBrush = false;
}