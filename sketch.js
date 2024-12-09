// serial variables
let mSerial;
let connectButton;

let potVal = 0; 

// image variables
let oImg;
let mImg;
let x;
let y;

let RED = { r: 255, g: 0, b: 0 };
let YELLOW = { r: 255, g: 255, b: 0 };
let BLUE = { r: 0, g: 0, b: 255 };

function preload() {
  oImg = loadImage("mondriaan.jpg");
  mImg = loadImage("mondriaan.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  oImg.resize(0, height);
  mImg.resize(0, height);

  x = (width - oImg.width) / 2;
  y = (height - oImg.height) / 2;

  oImg.loadPixels();

  // setup serial
  mSerial = createSerial(); 
  connectButton = createButton("Connect To Serial");
  connectButton.position(width / 2, height / 2);
  connectButton.mousePressed(connectToSerial);

  print("Setup complete");
}

function draw() {
  background(0);

  if (mSerial.opened()) {
    mSerial.write(0xAB);
  }

  if (mSerial.opened() && mSerial.availableBytes() > 0) {
    receiveSerial();
  }

  let SIMILARITY_VALUE = map(potVal, 0, 4095, 0, 255);

  mImg.loadPixels();
  for (let idx = 0; idx < oImg.pixels.length; idx += 4) {
    let redVal = oImg.pixels[idx];
    let greenVal = oImg.pixels[idx + 1];
    let blueVal = oImg.pixels[idx + 2];
    let alphaVal = oImg.pixels[idx + 3];

    if (similar(redVal, greenVal, blueVal, RED, SIMILARITY_VALUE)) {
      mImg.pixels[idx] = 100;
      mImg.pixels[idx + 1] = 100;
      mImg.pixels[idx + 2] = 0;
      mImg.pixels[idx + 3] = 15;
    } else if (similar(redVal, greenVal, blueVal, YELLOW, SIMILARITY_VALUE)) {
      mImg.pixels[idx] = 0;
      mImg.pixels[idx + 1] = 100;
      mImg.pixels[idx + 2] = 100;
      mImg.pixels[idx + 3] = 15;
    } else if (similar(redVal, greenVal, blueVal, BLUE, SIMILARITY_VALUE)) {
      mImg.pixels[idx] = 100;
      mImg.pixels[idx + 1] = 0;
      mImg.pixels[idx + 2] = 100;
      mImg.pixels[idx + 3] = 15;
    } else {
      mImg.pixels[idx] = redVal;
      mImg.pixels[idx + 1] = greenVal;
      mImg.pixels[idx + 2] = blueVal;
      mImg.pixels[idx + 3] = alphaVal;
    }
  }
  mImg.updatePixels();

  image(mImg, x, y);
}

function connectToSerial() {
  if (!mSerial.opened()) {
    mSerial.open(9600);
    connectButton.hide();
    print("Connected to serial port");
  }
}

function receiveSerial() {
  let line = mSerial.readUntil("\n");
  if (!line) return;

  line = trim(line);

  // Print raw
  print("Received line:", line);

  if (line.length === 0) return;

  let val = parseInt(line, 10);

  if (!isNaN(val)) {
    //assign portVal
    potVal = constrain(val, 0,4095);
  } else {
    print("Received non-numeric data:", line);
  }
  
}

function similar(r, g, b, color, gap) {
  return (
    abs(r - color.r) < gap && abs(g - color.g) < gap && abs(b - color.b) < gap
  );
}
