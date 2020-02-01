class PerlinNoise {
    constructor() {
        this.grid = [];         // At the end of the calculation this will be filled with outputs (between 0 - 1)
        this.vectorGrid = [];   // The size of this grid defines how detailed the noise will become in the output grid. Holds the gradient vectors that are randomized in setup

        this.distanceVectors = [];   // When calculating the value of one of the outputs in the grid, the distanceVectors are calculated by the distance between the point and the corners of the vectorGrid the point it is in


        this.max = 0;
        this.min = 1;
    }

    setup() {
        for (var y = 0; y < s.vectorGridSize[1]; y++) {   // Make the vector grid 2D and fill it with gradient vectors
            this.vectorGrid[y] = [];
            for (var x = 0; x < s.vectorGridSize[0]; x++) {
                this.vectorGrid[y][x] = new Vector(rand(s.gradientVectorRange[0][0], s.gradientVectorRange[0][1]), rand(s.gradientVectorRange[1][0], s.gradientVectorRange[1][1]));
            }
        }
        
        function rand(min, max) {   // Randomization function (float)
            return Math.random() * (max - min) + min;
        }
    }


    calculate() {
        console.log("Calculation Started");

        var Sw = s.gridSize[0] / (s.vectorGridSize[0] - 1);     // Vector grid square width in amounts of outputs in the square (how big the vector square is in proportion to the output grid)
        var Sh = s.gridSize[1] / (s.vectorGridSize[1] - 1);     // Vector grid square height

        for (var outY = 0; outY < s.gridSize[1]; outY++) {   // Loop through all outputs in the grid
            this.grid[outY] = [];
            for (var outX = 0; outX < s.gridSize[0]; outX++) {
            
                // Finds the index of the top left vectorGrid corner closest to the currently calculated output
                var xi = Math.floor(outX / Sw);         // The x-axis index of the square the current output being calculated is located in the vector grid
                var yi = Math.floor(outY / Sh);         // Y-axis index


                // Calculates the fractional position (0 - 1) of the current output inside the vector grid square it is in (with index [yi][xi], calculated above)
                var fracX = (outX - xi * Sw) / Sw;      // Basically "delen / det hela" to get the fraction of the both axis
                var fracY = (outY - yi * Sh) / Sh;


                // Calculates the four dot valuse (one for each corner of the square the output is located in) by adding vectors: (vector1X * vector2X) + (vector1Y * vector2Y)
                var dot0 = (this.vectorGrid[yi][xi].x * fracX) + (this.vectorGrid[yi][xi].y * fracY);
                var dot1 = (this.vectorGrid[yi][xi + 1].x * (1 - fracX)) + (this.vectorGrid[yi][xi + 1].y * fracY);         // xi and yi is changed to change to the corners around
                var dot2 = (this.vectorGrid[yi + 1][xi].x * fracX) + (this.vectorGrid[yi + 1][xi].y * (1 - fracY));         // (1 - fracXY) to reverse the vector (e.g. make it go up instead of down)
                var dot3 = (this.vectorGrid[yi + 1][xi + 1].x * (1 - fracX)) + (this.vectorGrid[yi + 1][xi + 1].y * (1 - fracY));


                // Bilinear interpolation between dot products to calculate the final value of (outX, outY). I don't know what it means but I know the formula:
                var p0 = dot0 + fracX * dot1 - fracX * dot0;    // Interpolation between dots with the same x-value, named point 0 and 1
                var p1 = dot2 + fracX * dot3 - fracX * dot2;

                var value = p0 + fracY * p1 - fracY * p0;       // Interpolation between the calculated points 0 and 1's values in the y-axis that gives the final value of the output

                if (s.fade) {
                    value = this.fade((value + 1) / 2);
                }

                this.grid[outY][outX] = value;



                if (s.useMaxMin && !s.fade) {
                    if (value > this.max) {
                        this.max = value;
                    } else if (value < this.min) {
                        this.min = value;
                    }
                } else {
                    this.max = 1;
                    this.min = -1;
                }

            }
        }
        console.log("Calculation Ended");
        console.log("max: " + this.max);
        console.log("min: " + this.min);
    }


    draw() {
        console.log("Drawing Noise");
        
        var w = s.canvasWidth / this.grid[0].length;
        var h = s.canvasHeight / this.grid.length;
        strokeWeight(0);

        if (s.colorMode == "hsb") {
            colorMode(HSB);
        }

        for (var y = 0; y < this.grid.length; y++) {
            for (var x = 0; x < this.grid[0].length; x++) {
                switch (s.colorMode) {   // Decides what color to fill with
                    case "gray":
                        fill(map(this.grid[y][x], this.min, this.max, 0, 255, true));
                        break;

                    case "hsb":
                        fill(map(this.grid[y][x], this.min, this.max, 0, 360, true), 100, 100);
                        break;
                }


                switch (s.drawMode) {
                    case "square":
                        rect(x * w, y * h, w, h);
                        break;
                    case "circle":
                        ellipse(x * w + w / 2, y * h + h / 2, w * 0.9, h * 0.9);
                        break;
                }
            }
        }
        console.log("Drawing Finished");
        console.log("Waiting for the browser to display...");
    }

    fade(value) {   // Squeezes the value in a so-called s-curve function (high and low values become less uncommon)
        return 6 * Math.pow(value, 5) - 15 * Math.pow(value, 4) + 10 * Math.pow(value, 3);
    }
}