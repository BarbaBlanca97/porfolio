// ************ BARRA DE NAVEGACION
var sideBar = document.getElementById('sidebar');
var hamburger = document.getElementById('hamburger');

var sideBarOpen = false;

var prevWidth = window.innerWidth;
var outAnimation = window.navigator.userAgent.indexOf("Edg") === -1 ? 'animated-out' : 'animated-out--no-clip';

var hamburgerClickHandler = function (event) {
    if (!sideBarOpen) {
        sideBar.style = 'display: flex;';

        sideBar.classList.remove(outAnimation);
        sideBar.classList.add('animated-in');

        sideBarOpen = true;
    }
    else {
        sideBar.classList.remove('animated-in');
        sideBar.classList.add(outAnimation);

        sideBarOpen = false;
    }

    event.stopPropagation();
};

var handleCloseAnimationEnd = function (event) {
    if (!sideBarOpen) {
        sideBar.style = 'display: none;';
    }
}

sideBar.onanimationend =  handleCloseAnimationEnd;

var sideBarClickHandler = function () {
    if ( window.innerWidth <= 1000 ) {
        sideBar.classList.remove('animated-in');
        sideBar.classList.add(outAnimation);

        sideBarOpen = false;
    }
};

var handleWindowResize = function () {
    if ( prevWidth < 1000 && window.innerWidth >= 1000 ) {
        sideBar.style = 'display: flex;'
        sideBarOpen = true;

        sideBar.classList.remove('animated-in');
        sideBar.classList.remove(outAnimation);
    }

    prevWidth = window.innerWidth;
};

hamburger.onclick = hamburgerClickHandler;
sideBar.onclick = sideBarClickHandler;

window.addEventListener('resize', handleWindowResize);

var removedIndicator = false;
var projectContainers = document.getElementsByClassName("project-img-container");
function touched() {
    if (!removedIndicator) {
        for ( projectContainer of projectContainers ) {
            projectContainer.removeEventListener("click", touched);
            projectContainer.removeEventListener("mouseover", touched);
        }
        document.getElementById("touch-indicator-pill").classList.add("d-none");
        removedIndicator = true;
    }
}
for ( projectContainer of projectContainers ) {
    projectContainer.addEventListener("click", touched);
    projectContainer.addEventListener("mouseover", touched);
}

//*********** EFECTO CANVAS

var canvas = document.getElementById("header-canvas");
var ctx = canvas.getContext("2d");
var cachedWindowWidth;

var horizontalCellCount;
var cellSize;
var verticalCellCount;

var img = new Image();
var imageSections = [
    { x: 0,     y: 0 },
    { x: 200,   y: 0 },
    { x: 400,   y: 0 },
    { x: 600,   y: 0 },
    { x: 800,   y: 0 },
    { x: 1000,  y: 0 },
    { x: 1200,  y: 0 },
    { x: 0,     y: 200 },
    { x: 200,   y: 200 },
    { x: 400,   y: 200 },
    { x: 600,   y: 200 },
    { x: 800,   y: 200 },
    { x: 1000,  y: 200 },
    { x: 1200,  y: 200 }
];
var maxOpacity = 1;
var imageCount;

var maxTime = 5000;

var availablePositions;
var activeCells;

function Cell(posX, posY, imgX, imgY) {
    this.startTime = Date.now() + (Math.random() * 5000);
    this.posX = posX;
    this.posY = posY;
    this.imgX = imgX;
    this.imgY = imgY;
}

function getOpacity(elapsedTime) {
    if (elapsedTime < 0) return 0;
    
    var percentage = elapsedTime / maxTime;
    
    if (percentage < .35)
    return (percentage / .35) * maxOpacity;
    else if (percentage > .65)
    return (1 - ((percentage - .65) / .35)) * maxOpacity;
    else
        return 1 * maxOpacity;
}
    
function generateCell() {
    var posIndex = Math.floor(Math.random() * availablePositions.length);
    var imgIndex = Math.floor(Math.random() * imageSections.length);
    
    var cell = new Cell(
        availablePositions[posIndex].x,
        availablePositions[posIndex].y,
        imageSections[imgIndex].x,
        imageSections[imgIndex].y);
            
    availablePositions.splice(posIndex, 1);
    
    return cell;
}

function updateCells() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (var i = 0; i < activeCells.length; i++) {
        var cell = activeCells[i];
        
        if ((Date.now() - cell.startTime) < maxTime) {
            ctx.globalAlpha = getOpacity(Date.now() - cell.startTime);
            ctx.drawImage(
                img, 
                cell.imgX, 
                cell.imgY, 
                200, 
                200,  
                cellSize * cell.posX, 
                cellSize * cell.posY, 
                cellSize, 
                cellSize);
        }
        else {
            availablePositions.push({ x: cell.posX, y: cell.posY });
            activeCells[i] = generateCell();
        }
    }
    
    window.requestAnimationFrame(updateCells);
}

function init () {
    cachedWindowWidth = window.innerWidth;
    horizontalCellCount = (document.documentElement.clientWidth <= 720)? 4 : 10;
    cellSize = canvas.clientWidth / horizontalCellCount;
    verticalCellCount = Math.ceil(canvas.clientHeight / cellSize);

    imageCount = horizontalCellCount * verticalCellCount * ((document.documentElement.clientWidth <= 720)? .45 : .25);

    canvas.height = canvas.clientHeight;
    canvas.width = canvas.height * (canvas.clientWidth / canvas.clientHeight);

    availablePositions = [];
    for (var i = 0; i < horizontalCellCount; i++) {
        for (var j = 0; j < verticalCellCount; j++) {
            availablePositions.push({ x: i, y: j });
        }
    }

    activeCells = [];
    for (var i = 0; i < imageCount; i++) {
        var generatedCell = generateCell();
        generatedCell.startTime -= 2000;
    
        activeCells.push(generatedCell);
    }
}

img.onload = function() {
    init();
    window.requestAnimationFrame(updateCells);
    window.addEventListener('resize', function() {
        if (window.innerWidth != cachedWindowWidth) init();
    });
}
img.src = "/porfolio/assets/logos.png";