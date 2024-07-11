class Cuad {
    constructor() {
        this.size = 60;
        //this.rotacion = random([0, HALF_PI, PI, -HALF_PI]);
        this.colorPalette = [
            [222, 209, 68], [33, 111, 139], [220, 123, 21], [77, 113, 121],
            [107, 158, 178], [206, 227, 222], [187, 84, 19], [37, 53, 25],
            [141, 153, 56], [76, 73, 57], [123, 77, 81], [113, 20, 21],
            [145, 156, 131], [36, 156, 207], [126, 121, 50], [143, 55, 17],
            [181, 26, 13], [158, 155, 17], [53, 95, 80], [110, 72, 45],
            [205, 27, 18], [96, 72, 82], [166, 157, 46], [135, 190, 150],
            [183, 110, 77]
        ];
        this.grupos = [[], []]; // 0 para CuadroTipo1, 1 para CuadroTipo2
    }

    dibujar(cuadr) {
       
        for (let boxW = width; boxW > 0; boxW -= (this.size + 15)) {
            for (let boxH = height; boxH > 0; boxH -= (this.size + 15)) {
                const posX = width - boxW + 8;
                const posY = height - boxH + 8;

                if (random(0, 1) > 0.7 && this.grupos[0].length < 64) {
                    this.dibujarCuadroBase(posX, posY, cuadr);
                    this.dibujarCuadroTipo1(posX, posY, cuadr);
                } else if (this.grupos[1].length < 64) {
                    this.dibujarCuadroTipo2(posX, posY, cuadr);
                }
            }
        }
        
    }

    dibujarCuadroBase(posX, posY, cuadr) {
        const randomColor = random(this.colorPalette);
        cuadr.tint(randomColor[0], randomColor[1], randomColor[2]);
        cuadr.image(cuadimg, posX, posY, this.size, this.size);
        const cuadro = new Cuadro(posX, posY, this.size, randomColor, this.rotacion, cuadimg, 0);
        this.grupos[0].push(cuadro);
    }

    dibujarCuadroTipo1(posX, posY, cuadr) {
        if (this.grupos[0].length >= 64) return;
        let numeroRandom = Math.floor(random(0, 3));
        let img;
        if (numeroRandom == 0) {
            img = diagimg;
        } else if (numeroRandom == 1) {
            img = rectimg;
        } else if (numeroRandom == 2) {
            img = diagimg;
        }  
        const color = random(this.colorPalette);
        const rotacion = random([0, HALF_PI, PI, -HALF_PI]);
        const cuadro = new Cuadro(posX, posY, this.size, color, rotacion, img, 0);
        this.grupos[0].push(cuadro);
        cuadro.dibujar(cuadr);
        
    }

    dibujarCuadroTipo2(posX, posY, cuadr) {
        if (this.grupos[1].length >= 64) return;
        let numeroRandom = Math.floor(random(0, 4));
        let img;
        if (numeroRandom ==0) {
            img = cuad1;
        } else if (numeroRandom ==1) {
            img = cuad5;
        } else if (numeroRandom ==2) {
            img = cuad2;
        } else if (numeroRandom ==3) {
            img = cuad4;
        }
        const color = random(this.colorPalette);
        const rotacion = random([0, HALF_PI, PI, -HALF_PI]);
        const cuadro = new Cuadro(posX, posY, this.size, color, rotacion, img, 1);
        this.grupos[1].push(cuadro);
        cuadro.dibujar(cuadr);
    }

    cambiarImagenesGrupo0() {
        for (let cuadro of this.grupos[0]) {
            let numeroRandom = Math.floor(random(0, 3));
            let nuevaImagen;
            if (numeroRandom ==0) {
                nuevaImagen = diagimg;
            } else if (numeroRandom ==1) {
                nuevaImagen = rectimg;
            } else if (numeroRandom ==2) {
                nuevaImagen = diagimg;
            } 
            cuadro.cambiarImagen(nuevaImagen);
        }
    }

    cambiarImagenesGrupo1() {
        for (let cuadro of this.grupos[1]) {
            let numeroRandom = Math.floor(random(0, 6));
            //console.log("numero random:", numeroRandom);
            let nuevaImagen;
            if (numeroRandom ==0) {
                nuevaImagen = cuad1;
            } else if (numeroRandom ==1) {
                nuevaImagen = cuad2;
            } else if (numeroRandom ==2) {
                nuevaImagen = cuad4;
            }  else if (numeroRandom ==3) {
                nuevaImagen = cuad5;
            }else if (numeroRandom ==4) {
                nuevaImagen = cuad3;
            }else if (numeroRandom ==5) {
            nuevaImagen = cuadimg;
            }
            cuadro.cambiarImagen(nuevaImagen);
        }
    }

    rotarGrupo0() {
        for (let cuadro of this.grupos[0]) {
            cuadro.rotar90Grados();
        }
    }
}
