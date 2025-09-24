// CLASSE PARA OS SPRITES DO JOGO
class Sprite {
    constructor({
        position,
        image,
        frames = { max: 1 },
        collisionBox,
        width,
        height,
    }) {
        this.position = position;
        this.image = image;
        this.frames = frames;
        this.width = width;
        this.height = height;

        // ESPERA A IMAGEM CARREGAR PARA RETORNAR SEU TAMANHO PELA QNTD DE FRAMES
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max;
            this.height = this.image.height;
        };
        this.collisionBox = collisionBox;
    }

    draw() {
        c.drawImage(
            this.image,
            0,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height
        );
    }
}

// CLASSE DAS PROPRIEDADES DOS LIMITES/BOUNDARIES/CAIXAS DE COLISÃO
class Boundary {
    static width = 64;
    static height = 64;
    constructor({ position }) {
        this.position = position;
        this.width = 64;
        this.height = 64;
    }

    draw() {
        c.fillStyle = "rgba(255, 0, 0, 0.0)";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

// CLASSE DO CARRO (QUE ESTENDE DE SPRITE)
class Car extends Sprite {
    constructor({ position, image, velocity, collisionBox, width, height }) {
        super({ position, image, collisionBox, width, height });
        this.velocity = velocity;
    }

    // Método para atualizar a posição do carro a cada frame
    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}
