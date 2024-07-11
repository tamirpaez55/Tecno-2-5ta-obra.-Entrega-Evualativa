
class Cuadro {
    constructor(posX, posY, size, color, rotacion, img, grupoIndex) {
        this.posX = posX;
        this.posY = posY;
        this.size = size;
        this.color = color;
        this.rotacion = rotacion;
        this.img = img;
        this.grupoIndex = grupoIndex;
        this.rotacionObjetivo = null;
    }

    dibujar(cuadr) {
        cuadr.push();
        cuadr.tint(this.color[0], this.color[1], this.color[2]);
        cuadr.translate(this.posX + this.size / 2, this.posY + this.size / 2);
        cuadr.rotate(this.rotacion);
        cuadr.image(this.img, -this.size / 2, -this.size / 2, this.size, this.size);
        cuadr.pop();
    }

    cambiarImagen(nuevaImagen) {
        this.img = nuevaImagen;
    }

    rotar90Grados() {
        this.rotacion += 1.5 * PI;
    }
}
