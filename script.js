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

// CLASSE PARA OS SPRITES DO JOGO
class Sprite {
    constructor({ position, velocity, image, frames = { max: 1 } }) {
        this.position = position;
        this.image = image;
        this.frames = frames;
        // ESPERA A IMAGEM CARREGAR PARA RETORNAR SEU TAMANHO PELA QNTD DE FRAMES
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max;
            this.height = this.image.height;
        };
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
        x: canvas.width / 2.05,
        y: 488,
    },
    image: playerImage,
    frames: {
        max: 4,
    },
});

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
const movables = [background, ...boundaries];

function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y + rectangle1.width >= rectangle2.position.y &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.width
    );
}

// DESENHO E MOVIMENTAÇÃO DOS ELEMENTOS NA TELA
function animate() {
    window.requestAnimationFrame(animate);
    background.draw();
    boundaries.forEach((boundary) => {
        boundary.draw();
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
                            y: boundary.position.y - 23,
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
                            x: boundary.position.x + 3.14,
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
                            x: boundary.position.x - 3.14,
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
