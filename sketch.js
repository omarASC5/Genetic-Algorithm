var firstPopulation = [];
var secondGen = [];
var rArray = [];
var bArray = [];
var gArray = [];
var medianRed, medianGreen, medianBlue;
var medianGenStrength;
var genArray = [];

var x, y, c, red, green, blue;
var newRed, newBlue, newGreen;
var mutationRate = 0.1;
var previousPopulation = [];
var goodR = [];
var goodG = [];
var goodB = [];
var avgFitness = [];
var avgPercentFitness;
var avgShownFitness = 0;
var generationCount = 0;

var rBackground = 102;
var gBackground = 255;
var bBackground = 153;

var timeDiff = 0;
var generationFont;

var xShift = 0.5;
var yShift = 0.5;

var xButton = 50;
var yButton = 1000;
var buttonHeight = 100;
var buttonWidth = 50;

function preload() {
  generationFont = loadFont('KoolBean.ttf');
}

function setup() {
  frameRate(30);
  createCanvas(1200, 1200);


  for (let j = 0; j <= 600; j += 30) {
    for (let i = 0; i <= 1000; i += 50) {
      let xCitizenShift = i * xShift;
      let yCitizenShift = j * yShift;
      firstPopulation.push(new citizen(i + xCitizenShift, j + yCitizenShift));
    }
  }
}


function draw() {
  background(rBackground, gBackground, bBackground);
  fill(255, 0, 0);
  rect(450, yButton, buttonWidth, buttonHeight);

  fill(0, 255, 0);
  rect(550, yButton, buttonWidth, buttonHeight);

  fill(0, 0, 255);
  rect(650, yButton, buttonWidth, buttonHeight);

  fill(255, 255, 0);
  rect(750, yButton, buttonWidth, buttonHeight);


  //pushes fitnessRed into new array ==> rArray
  for (let p = 0; p < firstPopulation.length; p++) {
    rArray.push((firstPopulation[p].fitnessRed));
  }

  //pushes fitnessGreen into new array ==> gArray
  for (let p = 0; p < firstPopulation.length; p++) {
    gArray.push((firstPopulation[p].fitnessGreen));
  }

  //pushes fitnessBlue into new array ==> bArray
  for (let p = 0; p < firstPopulation.length; p++) {
    bArray.push((firstPopulation[p].fitnessBlue));
  }

  //pushes genStrength into new array ==> genArray
  for (let p = 0; p < firstPopulation.length; p++) {
    genArray.push((firstPopulation[p].genStrength));
  }

  //medians of red, green, and blue fitness of population
  medianRed = median(rArray);
  medianGreen = median(gArray);
  medianBlue = median(bArray);
  medianGenStrength = median(genArray);

  fill(0);
  textFont(generationFont);
  textSize(36);
  text("Generation Count: " + str(timeDiff), 485, 980);
  text("Average Generation Strength: " + str(avgShownFitness) + "%", 0, 1150);
  text("Max Generations: 500", 890, 1150);
  if (timeDiff == 500) { ///interation stopper
    noLoop();
  }


  for (let i = 0; i <= firstPopulation.length - 1; i++) {
    firstPopulation[i].color();
    firstPopulation[i].drawRect();
    firstPopulation[i].fitness();
    firstPopulation[i].strength();

  }

  setTimeout(function afterTwoSeconds() {

    previousPopulation = firstPopulation.sort(function(a, b) {
      return b.genStrength - a.genStrength
    });



    for (let i = 0; i <= firstPopulation.length - 1; i++) {
      firstPopulation[i].reColor();


    }

    for (let i = 420; i <= firstPopulation.length - 1; i++) { //selects citizens above 220
      firstPopulation[i].upgrade();
    }

    avgPercentFitness = avgFitness.reduce(getSum);
    timeDiff++;

  }, 1000);
  avgShownFitness = round((avgPercentFitness / 440) * 100);

}


function mousePressed() {
  //red button
  if (mouseX > 450 && mouseX < 500 && mouseY < buttonHeight + yButton && mouseY > yButton) {
    timeDiff = 0;
    strokeWeight(4);
    rBackground = 255;
    gBackground = 0;
    bBackGround = 0;
  }
  //green button
  if (mouseX > 550 && mouseX < 650 && mouseY < buttonHeight + yButton && mouseY > yButton) {
    timeDiff = 0;
    strokeWeight(4);
    rBackground = 0;
    gBackground = 255;
    bBackGround = 0;
  }
  //blue button
  if (mouseX > 650 && mouseX < 750 && mouseY < buttonHeight + yButton && mouseY > yButton) {
    timeDiff = 0;
    strokeWeight(4);
    rBackground = 0;
    gBackground = 0;
    bBackGround = 255;
  }
  //yellow button
  if (mouseX > 750 && mouseX < 850 && mouseY < buttonHeight + yButton && mouseY > yButton) {
    timeDiff = 0;
    strokeWeight(4);
    rBackground = 255;
    gBackground = 255;
    bBackGround = 0;
  }
}

function citizen(x, y) {
  this.x = x;
  this.y = y;
  this.r = round(random(255));
  this.g = round(random(255));
  this.b = round(random(255));
  this.genStrength = 0;

  this.color = function() {
    fill(this.r, this.g, this.b);
  }
  this.drawRect = function() {
    rect(this.x, this.y, 50, 30);
  }

  this.fitness = function() {
    this.fitnessRed = 1 - (abs((this.r - rBackground)) / 255); //red fitness
    this.fitnessGreen = 1 - (abs((this.g - gBackground)) / 255); //blue fitness
    this.fitnessBlue = 1 - (abs((this.b - bBackground)) / 255); //green fitness
    this.totalFitness = (this.fitnessRed + this.fitnessBlue + this.fitnessGreen) / 3;
  }
  this.strength = function() {
    if (this.fitnessRed > medianRed) {
      this.genStrength++;
    }
    if (this.fitnessGreen > medianGreen) {
      this.genStrength++;
    }
    if (this.fitnessBlue > medianBlue) {
      this.genStrength++;
    }
  }
  this.reColor = function() {
    previousPopulation = previousPopulation.slice(0, 40);
    goodR = previousPopulation.map(a => a.r);
    goodG = previousPopulation.map(a => a.g);
    goodB = previousPopulation.map(a => a.b);
    avgFitness = firstPopulation.map(a => a.totalFitness);
  }
  this.upgrade = function() {
    this.r = (goodR[Math.floor(Math.random() * goodR.length)] + floor(random(-4, 4)));
    this.g = (goodG[Math.floor(Math.random() * goodG.length)] + floor(random(-4, 4)));
    this.b = (goodB[Math.floor(Math.random() * goodB.length)] + floor(random(-4, 4)));
  }
}

//function that calculates median of array
function median(values) {
  values.sort(function(a, b) {
    return a - b;
  });
  
  if (values.length === 0) return 0

  var half = Math.floor(values.length / 2);

  if (values.length % 51)
    return values[half];
  else
    return (values[half - 1] + values[half]) / 2.0;
}

function getSum(total, num) {
  return (total + num);
}