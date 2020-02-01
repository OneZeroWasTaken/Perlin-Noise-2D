class Settings {
    constructor() {
        this.canvasWidth = 900;
        this.canvasHeight = 600;
        this.color = [0, 0, 0];       // Default background color

        // Changes how the Perlin Noise is displayed on the canvas
        this.drawMode = "square";   // Options: "square", "circle". The shape of the noise
        this.colorMode = "gray";    // Options: "gray", "hsb". How it is colored. Change to hsb for a more fun experience


        /**
         * The following settings will change the way the Perlin Noise will generate
         * 
         * 
         * gridSize                     Output size. Recomended max size is 1500 by 1000
         * vectorGridSize               Larger vectorGrid makes the noise more detailed. If large enough the Perlin Noise will become total random noise. Warning: Minimum of 2 is required
         * 
         * fade             (boolean)   If the fade function should be used at the end of each calculation (apparantly makes lines smoother, but will most likely make everything one color)
         * useMaxMin        (boolean)   When mapping the value to for example between 0 - 255, use the overall max and min value on the current calculation instead of the unlikely total min and max (-1 and 1). 
         *                              When true more pixles will be closer to the highs and lows of the mapping spectrum (e.g. more blacks and whites instead of grays)
         * 
         * gradientVectorRange          The minimum and maximum range in which the gradientVectors will be initialized as   [ [minX, maxX], [minY, maxY] ]
         */

        this.gridSize = [150, 100];
        this.vectorGridSize = [15, 10];

        this.fade = false;
        this.useMaxMin = true;

        this.gradientVectorRange = [
            [-Math.SQRT2, Math.SQRT2],
            [-Math.SQRT2, Math.SQRT2]
        ];        
    }
}