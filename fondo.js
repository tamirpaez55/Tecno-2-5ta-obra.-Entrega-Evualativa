class Fondo {
    constructor() {
      this.backgroundColors = [
        [188, 18, 50], 
        [88,145,30],  
        [39, 107, 123], 
        [	188, 88, 18], 
        [147,154,47],
        [121,75,73],
        [24,48,81],
      ];
    }
    colorFon(){
      const randomColor = random(this.backgroundColors);
      pg.background(color(randomColor[0], randomColor[1], randomColor[2]));
    }
  }