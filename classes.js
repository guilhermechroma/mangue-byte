// CLASSE PARA OS SPRITES DO JOGO
class Sprite {
    constructor({
        position,
        image,
        frames = { max: 1 },
        sprites,
        collisionBox,
        width,
        height,
    }) {
        this.position = position;
        this.image = image;
        this.frames = { ...frames, val: 0, elapsed: 0 };
        this.width = width;
        this.height = height;

        this.frames.frameWidth = width;
        this.frames.frameHeight = height;

        // ESPERA A IMAGEM CARREGAR PARA RETORNAR SEU TAMANHO PELA QNTD DE FRAMES
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max;
            this.height = this.image.height;
        };
        this.collisionBox = collisionBox;
        this.moving = false;
        this.sprites = sprites;
    }

    draw() {
        c.drawImage(
            this.image,
            this.frames.val * this.width, // Muda o frame da animação no sprite sheet
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height
        );

        if (!this.moving) {
            this.frames.val = 0;
            return;
        }

        if (this.frames.max > 1) {
            this.frames.elapsed++;
        }

        if (this.frames.elapsed % 10 === 0) {
            if (this.frames.val < this.frames.max - 1) this.frames.val++;
            else this.frames.val = 0;
        }
    }
}

// CLASSE DE VEÍCULO (QUE ESTENDE DE SPRITE)
class Vehicle extends Sprite {
    constructor({ position, image, velocity, collisionBox, width, height }) {
        super({ position, image, collisionBox, width, height });
        this.velocity = velocity;
    }

    // Método para atualizar a posição do carro a cada frame
    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        c.fillStyle = "rgba(255, 0, 0, 0.0)";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

// CLASSE DAS PROPRIEDADES DOS LIMITES/BOUNDARIES/CAIXAS DE COLISÃO
class Boundary {
    static width = 60;
    static height = 55;
    constructor({ position }) {
        this.position = position;
        this.width = 60;
        this.height = 55;
    }

    draw() {
        c.fillStyle = "rgba(255, 0, 0, 0.0)";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

// CLASSE DA COLISÃO DO JOGADOR DEBAIXO D'ÁGUA (QUE ESTENDE DE BOUNDARY)
class UnderwaterBoundary extends Boundary {
    static width = 60;
    static height = 55;
    super({ position }) {
        this.position = position;
        this.width = 60;
        this.height = 55;
    }

    draw() {
        c.fillStyle = "rgba(0, 0, 255, 0.0)";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

// CLASSE DA COLISÃO DE VITÓRIA (QUE ESTENDE DE BOUNDARY)
class WinBoundary extends Boundary {
    static width = 60;
    static height = 55;
    super({ position }) {
        this.position = position;
        this.width = 60;
        this.height = 55;
    }

    draw() {
        c.fillStyle = "rgba(0, 255, 0, 0.0)";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}
