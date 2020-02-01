var s;
var noise;


function setup() {
	s = new Settings();
	noise = new PerlinNoise();

	createCanvas(s.canvasWidth, s.canvasHeight);
	background(s.color);


	noise.setup();
	noise.calculate();
	noise.draw();
}
