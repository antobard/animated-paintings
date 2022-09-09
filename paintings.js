const refSeasonSky = document.querySelector("#seasons .background");
const refTowerSky = document.querySelector("#watchTower .background");
const refTowerMonster = document.getElementById("towerMonster");
const starsSky = document.querySelector("#stars .background");

const refBothIris = document.querySelectorAll(".iris");
var leftIrisBounds = refBothIris[0].getBoundingClientRect();
var rightIrisBounds = refBothIris[1].getBoundingClientRect();

var mouse = {x: 0, y: 0};

var windSpeed = 10;

var frameCount = 0;
var fps, fpsInterval, startTime, now, then, elapsed;
var randomLightningFrame = 0;

var rect;


// FUNCTIONS
startAnimating(60);

windObjectsCreation(3, 10);

starsPainting(60);

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max, decimals) {
    // From https://bobbyhadz.com/blog/javascript-get-random-float-in-range
    const str = (Math.random() * (max - min) + min).toFixed(decimals);

    return parseFloat(str);
}

function startAnimating(fps) {
    // FPS limitation (from https://stackoverflow.com/questions/19764018/controlling-fps-with-requestanimationframe)
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    loop();
}

function loop() {
    requestAnimationFrame(loop);

    now = Date.now();
    elapsed = now - then;

    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        frameCount++;

        if (frameCount % randomLightningFrame == 0) {
            refTowerSky.classList.toggle("lightningSky");
        }
        if (frameCount % (randomLightningFrame * getRandomIntInclusive(2, 5)) == 0) {
            refTowerMonster.classList.toggle("aMonsterCalls");
            frameCount = 0;
        }
        randomLightningFrame = getRandomIntInclusive(40, 90);
    }
}

function windObjectsCreation(cloudsNb, leavesNb) {
    var [duration, rotation, yMin, yMax] = [0, 0, 0, 0];
    var scaleRange = [];

    // Clouds
    var relativeOffsetY = 70;
    for (var i = 0; i < cloudsNb; i++) {
        duration = 120 / Math.abs(windSpeed) * 1000;
        rotation = 0;
        scaleRange = [0.8, 0.8];
        yMin = (-relativeOffsetY + getRandomIntInclusive(0, 200));
        yMax = yMin;

        createWindElement("cloud", duration, yMin, yMax, rotation, scaleRange);
        relativeOffsetY += 50;
    }
    
    // Leaves
    relativeOffsetY = cloudsNb * 70;
    for (var i = 0; i < leavesNb; i++) {
        duration = 60 / Math.abs(windSpeed) * 1000;
        rotation = getRandomIntInclusive(-180, 180);
        scaleRange = [getRandomFloat(0.2, 0.6, 1), getRandomFloat(0.2, 0.6, 2)];
        yMin = (-relativeOffsetY + getRandomIntInclusive(0, 200));
        yMax = (yMin + getRandomIntInclusive(-150, 150));

        createWindElement("leaf", duration, yMin, yMax, rotation, scaleRange);
        relativeOffsetY += 50;
    }
}

function createWindElement(type, duration, yMin, yMax, rotation, scaleRange) {
    const origins = ["left", "top", "right", "bottom", "center"];
    var delay = getRandomIntInclusive(1000, 9000); // Délaie les animations (en ms)

    var newElement = document.createElement("div");
    newElement.classList.add(type);
    refSeasonSky.appendChild(newElement);

    newElement.style.visibility = "hidden";
    newElement.style.transformOrigin = origins[Math.floor(Math.random() * origins.length)];

    newElement.animate([
        { visibility: "visible",
            transform: "translate(-150px, " + yMin + "px) scale(" + scaleRange[0] + ")" },
        { transform: "translate(750px, " + yMax + "px) scale(" + scaleRange[1] + ") rotate(" + rotation + "deg)" }
    ], {
        duration: duration,
        delay: delay,
        iterations: Infinity,
        easing: "linear",
        direction: "normal"
    });
}

function towerPainting() {
    var apparition = getRandomFloat(0.4, 0.8, 1);

    refTowerSky.animate([
        { background: "rgb(68, 94, 84)" },
        { background: "rgb(68, 94, 84)", offset: (apparition - 0.1) },
        { background: "rgb(173, 216, 200)", offset: apparition },
        { background: "rgb(68, 94, 84)", offset: (apparition + 0.1) },
        { background: "rgb(68, 94, 84)" }
    ], {
        duration: 2000,
        delay : 0,
        iterations: 1,
        easing: "linear"
    });

    refTowerMonster.animate([
        { opacity: "0" },
        { opacity: "1", offset: (apparition - 0.1)},
        { opacity: "1", offset: apparition},
        { opacity: "1", offset: (apparition + 0.1)},
        { opacity: "0" }
    ], {
        duration: 1000,
        delay: 0,
        iterations: Infinity,
        easing: "linear"
    });
}

function starsPainting(starsNb) {
    for (var i = 0; i < starsNb; i++) {
        newStar = document.createElement("div");
        newStar.classList.add("star");

        newStar.style.left = getRandomIntInclusive(-5, 255) + "px";
        newStar.style.top = getRandomIntInclusive(-5, 185) - i * 7 + "px";
        const randomSize = getRandomIntInclusive(3, 7) + "px";
        newStar.style.width = randomSize;
        newStar.style.height = randomSize;

        newStar.animate([
            { boxShadow: "0 0 10px 2px whitesmoke" },
            { boxShadow: "0 0 15px 4px rgb(105, 104, 103)", offset: 0.5 },
            { boxShadow: "0 0 10px 2px whitesmoke" }
        ], {
            duration: 2000,
            delay: getRandomIntInclusive(1000, 4000),
            iterations: Infinity
        });

        starsSky.appendChild(newStar);
    }
}

function eyesMoveUpdate() {
    const maxX = 80;
    const maxY = 40;

    var translateX = mouse.x - leftIrisBounds.x;
    var translateY = mouse.y - leftIrisBounds.y;

    if (translateX > maxX) {translateX = maxX}
    else if (translateX < -maxX) {translateX = -maxX}

    if (translateY > maxY) {translateY = maxY}
    else if (translateY < -maxY) {translateY = -maxY}

    refBothIris[0].style.transform = `translate(${translateX}%, ${translateY}%)`;

    translateX = mouse.x - rightIrisBounds.x;
    translateY = mouse.y - rightIrisBounds.y;

    if (translateX > maxX) {translateX = maxX}
    else if (translateX < -maxX) {translateX = -maxX}

    if (translateY > maxY) {translateY = maxY}
    else if (translateY < -maxY) {translateY = -maxY}
    
    refBothIris[1].style.transform = `translate(${translateX}%, ${translateY}%)`;
}


// EVENTS LISTENERS
document.addEventListener("mousemove", function(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    eyesMoveUpdate();
});

document.addEventListener("mousedown", () => {
    
})



