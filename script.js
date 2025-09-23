// PEGA A TAG CANVAS, ONDE IRÁ RODAR TODO O JGOO
const canvas = document.querySelector(".game-canvas");

// VARIÁVEL FÁCIL DO CANVAS NO CONTEXTO DO JOGO
const c = canvas.getContext("2d");

// CORTA O JSON DAS CAIXAS DE COLISÃO EM VÁRIAS LINHAS E ARMAZENA NUMA ARRAY
const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 15) {
    collisionsMap.push(collisions.slice(i, 15 + i));
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

const boundaries = [];
const offset = {
    x: 0,
    y: -2580,
};

// DEFINE ONDE AS COLISÕES SERÃO LOCALIZADAS PELO VALOR DELAS NO JSON
collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        // VALOR DA CAIXA DE COLISÃO NO JSON
        if (symbol === 4097)
            boundaries.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y,
                    },
                })
            );
    });
});

// IMAGEM DO FUNDO/BACKGROUND
const backgroundImage = new Image();
backgroundImage.src = "./assets/imgs/map.png";

// IMAGEM DO JOGADOR
const playerImage = new Image();
playerImage.src = "./assets/imgs/playerDown.png";

//IMAGEM DOS CARROS
const car1Image = new Image();
car1Image.src = "./assets/imgs/car1.png";

const car1ReverseImage = new Image();
car1ReverseImage.src = "./assets/imgs/car1-reverse.png";

const car2Image = new Image();
car2Image.src = "./assets/imgs/car2.png";

const car2ReverseImage = new Image();
car2ReverseImage.src = "./assets/imgs/car2-reverse.png";

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

// PROPRIEDADES DO FUNDO/BACKGROUND
const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y,
    },
    image: backgroundImage,
});

// PROPRIEDADES DO PLAYER
const player = new Sprite({
    position: {
        x: canvas.width / 2.1,
        y: 485,
    },
    image: playerImage,
    frames: {
        max: 4,
    },
});

// PROPRIEDADES DO CARRO (QUE ESTENDE DE SPRITE)
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

// CARROS DO JOGO
const cars = [
    new Car({
        position: { x: 200, y: 300 }, // y 300 = fileira de cima
        image: car1ReverseImage,
        velocity: { x: 3, y: 0 }, // Movimento para a direita (positivo)
        collisionBox: { width: 100, height: 50 },
        width: 100,
        height: 50,
    }),
    new Car({
        position: { x: 600, y: 300 },
        image: car2ReverseImage,
        velocity: { x: 3, y: 0 },
        collisionBox: { width: 100, height: 50 },
        width: 100,
        height: 50,
    }),
    new Car({
        position: { x: -200, y: 300 },
        image: car2ReverseImage,
        velocity: { x: 3, y: 0 },
        collisionBox: { width: 100, height: 50 },
        width: 100,
        height: 50,
    }),
    new Car({
        position: { x: 600, y: 400 }, // y 400 = fileira de baixo
        image: car2Image,
        velocity: { x: -2, y: 0 }, // Movimento para a esquerda (negativo)
        collisionBox: { width: 100, height: 50 },
        width: 100,
        height: 50,
    }),
    new Car({
        position: { x: 1000, y: 400 },
        image: car1Image,
        velocity: { x: -2, y: 0 },
        collisionBox: { width: 100, height: 50 },
        width: 100,
        height: 50,
    }),
    new Car({
        position: { x: 300, y: 400 },
        image: car1Image,
        velocity: { x: -2, y: 0 },
        collisionBox: { width: 100, height: 50 },
        width: 100,
        height: 50,
    }),
];

// TECLAS DO JOGO INICIALIZADAS COMO NÃO PRESSIONADAS
const keys = {
    w: {
        pressed: false,
    },
    s: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
};

// ELEMENTOS QUE PODEM SE MOVER PARA CIMA E PARA BAIXO
const movables = [background, ...boundaries, ...cars];

function rectangularCollision({ rectangle1, rectangle2 }) {
    // Usar as dimensões da caixa de colisão, se existirem
    const rect1Width = rectangle1.collisionBox
        ? rectangle1.collisionBox.width
        : rectangle1.width;
    const rect1Height = rectangle1.collisionBox
        ? rectangle1.collisionBox.height
        : rectangle1.height;
    const rect2Width = rectangle2.collisionBox
        ? rectangle2.collisionBox.width
        : rectangle2.width;
    const rect2Height = rectangle2.collisionBox
        ? rectangle2.collisionBox.height
        : rectangle2.height;

    // Ajustar as posições para centralizar a colisão
    const rect1X = rectangle1.position.x + (rectangle1.width - rect1Width) / 2;
    const rect1Y =
        rectangle1.position.y + (rectangle1.height - rect1Height) / 2;
    const rect2X = rectangle2.position.x + (rectangle2.width - rect2Width) / 2;
    const rect2Y =
        rectangle2.position.y + (rectangle2.height - rect2Height) / 2;

    return (
        rect1X + rect1Width >= rect2X &&
        rect1X <= rect2X + rect2Width &&
        rect1Y + rect1Height >= rect2Y &&
        rect1Y <= rect2Y + rect2Height
    );
}

let gameOver = false;

// DESENHO E MOVIMENTAÇÃO DOS ELEMENTOS NA TELA
function animate() {
    // Se o jogo acabou, para a animação
    if (gameOver) {
        return;
    }

    window.requestAnimationFrame(animate);
    background.draw();
    boundaries.forEach((boundary) => {
        boundary.draw();
    });
    // Loop para atualizar e desenhar os carros
    cars.forEach((car) => {
        car.update(); // Atualiza a posição
        car.draw(); // Desenha o carro

        // Reinicia o carro se ele sair da tela
        if (car.velocity.x > 0 && car.position.x > canvas.width + 100) {
            car.position.x = -100;
        } else if (car.velocity.x < 0 && car.position.x < -100) {
            car.position.x = canvas.width + 100;
        }

        // Lógica de colisão entre o player e o carro
        if (rectangularCollision({ rectangle1: player, rectangle2: car })) {
            alert("Você foi atropelado! Fim de jogo.");
            gameOver = true;
        }
    });
    player.draw();

    // MOVIMENTAÇÃO DO JOGADOR, MOVENDO O FUNDO E CAIXAS DE COLISÃO
    // PARA AVANÇAR JUNTO COM O JOGADOR E DAR ILUSÃO DE MOVIMENTO

    // Verificação de movimento UP (W)
    if (keys.w.pressed) {
        let canMoveUp = true;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y + 2.5,
                        },
                    },
                })
            ) {
                canMoveUp = false;
                break;
            }
        }
        if (canMoveUp) {
            movables.forEach((movable) => {
                movable.position.y += 3.14;
            });
        }
    }

    // Verificação de movimento DOWN (S)
    if (keys.s.pressed) {
        let canMoveDown = true;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y - 2.5,
                        },
                    },
                })
            ) {
                canMoveDown = false;
                break;
            }
        }
        if (canMoveDown) {
            movables.forEach((movable) => {
                movable.position.y -= 3.14;
            });
        }
    }

    // Verificação de movimento LEFT (A)
    if (keys.a.pressed) {
        let canMoveLeft = true;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x + 2.5,
                            y: boundary.position.y,
                        },
                    },
                })
            ) {
                canMoveLeft = false;
                break;
            }
        }
        if (canMoveLeft) {
            player.position.x -= 3.14;
        }
    }

    // Verificação de movimento RIGHT (D)
    if (keys.d.pressed) {
        let canMoveRight = true;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x - 2.5,
                            y: boundary.position.y,
                        },
                    },
                })
            ) {
                canMoveRight = false;
                break;
            }
        }
        if (canMoveRight) {
            player.position.x += 3.14;
        }
    }
}
animate(); // MANTÉM O LOOP INFINITO DE ANIMAÇÃO

// CHECAGEM DE TECLA APERTADA
window.addEventListener("keydown", (e) => {
    switch (e.key) {
        // CIMA
        case "w":
        case "W":
            keys.w.pressed = true;
            break;
        // BAIXO
        case "s":
        case "S":
            keys.s.pressed = true;
            break;
        // ESQUERDA
        case "a":
        case "A":
            keys.a.pressed = true;
            break;
        // DIREITA
        case "d":
        case "D":
            keys.d.pressed = true;
            break;
    }
});

// CHECAGEM DE TECLA SOLTADA
window.addEventListener("keyup", (e) => {
    switch (e.key) {
        // CIMA
        case "w":
        case "W":
            keys.w.pressed = false;
            break;
        // BAIXO
        case "s":
        case "S":
            keys.s.pressed = false;
            break;
        // ESQUERDA
        case "a":
        case "A":
            keys.a.pressed = false;
            break;
        // DIREITA
        case "d":
        case "D":
            keys.d.pressed = false;
            break;
    }
});
