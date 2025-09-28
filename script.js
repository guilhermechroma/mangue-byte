// PEGA A TAG CANVAS, ONDE IRÁ RODAR TODO O JGOO
const canvas = document.querySelector(".game-canvas");

// VARIÁVEL FÁCIL DO CANVAS NO CONTEXTO DO JOGO
const c = canvas.getContext("2d");

// CORTA O JSON DAS CAIXAS DE COLISÃO EM VÁRIAS LINHAS E ARMAZENA NUMA ARRAY
const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 15) {
    collisionsMap.push(collisions.slice(i, 15 + i));
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

// IMAGEM DE FUNDO
const backgroundImage = new Image();
backgroundImage.src = "./assets/imgs/map.png";

// IMAGEM DOS ELEMENTOS EM PRIMEIRO PLANO
const foregroundImage = new Image();
foregroundImage.src = "./assets/imgs/foregroundObjects.png";

// IMAGEM DO JOGADOR OLHANDO PARA BAIXO (PADRÃO)
const playerDownImage = new Image();
playerDownImage.src = "./assets/imgs/playerDown.png";

// IMAGEM DO JOGADOR OLHANDO PARA CIMA
const playerUpImage = new Image();
playerUpImage.src = "./assets/imgs/playerUp.png";

// IMAGEM DO JOGADOR OLHANDO PARA ESQUERDA
const playerLeftImage = new Image();
playerLeftImage.src = "./assets/imgs/playerLeft.png";

// IMAGEM DO JOGADOR OLHANDO PARA DIREITA
const playerRightImage = new Image();
playerRightImage.src = "./assets/imgs/playerRight.png";

//IMAGEM DOS CARROS
const car1Image = new Image();
car1Image.src = "./assets/imgs/car1.png";

const car1ReverseImage = new Image();
car1ReverseImage.src = "./assets/imgs/car1-reverse.png";

const car2Image = new Image();
car2Image.src = "./assets/imgs/car2.png";

const car2ReverseImage = new Image();
car2ReverseImage.src = "./assets/imgs/car2-reverse.png";

//IMAGEM DOS CARROS
const truck1Image = new Image();
truck1Image.src = "./assets/imgs/truck1.png";

const truck1ReverseImage = new Image();
truck1ReverseImage.src = "./assets/imgs/truck1-reverse.png";

const truck2Image = new Image();
truck2Image.src = "./assets/imgs/truck2.png";

const truck2ReverseImage = new Image();
truck2ReverseImage.src = "./assets/imgs/truck2-reverse.png";

// FUNÇÃO PARA PEGAR UMA IMAGEM ALEATÓRIA DENTRO DE UMA ARRAY
function getRandomImage(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
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
    image: playerDownImage,
    frames: {
        max: 4,
    },
    sprites: {
        up: playerUpImage,
        down: playerDownImage,
        left: playerLeftImage,
        right: playerRightImage,
    },
});

const carsToLeft = [car1Image, car2Image]; // Imagens para carros que movem para a esquerda
const carsToRight = [car1ReverseImage, car2ReverseImage]; // Imagens para carros que movem para a direita

// CARROS DO JOGO
const cars = [
    // PRIMEIRA RUA
    new Vehicle({
        position: { x: -200, y: 300 }, // y 300 = fileira de cima (primeira rua)
        image: getRandomImage(carsToRight),
        velocity: { x: 4, y: 0 }, // Movimento para a direita (positivo)
        collisionBox: { width: 100, height: 50 },
        width: 100,
        height: 50,
    }),
    new Vehicle({
        position: { x: 600, y: 300 },
        image: getRandomImage(carsToRight),
        velocity: { x: 4, y: 0 },
        collisionBox: { width: 100, height: 50 },
        width: 100,
        height: 50,
    }),
    new Vehicle({
        position: { x: 300, y: 400 }, // y 400 = fileira de baixo (primeira rua)
        image: getRandomImage(carsToLeft),
        velocity: { x: -3, y: 0 }, // Movimento para a esquerda (negativo)
        collisionBox: { width: 100, height: 50 },
        width: 100,
        height: 50,
    }),
    new Vehicle({
        position: { x: 700, y: 400 },
        image: getRandomImage(carsToLeft),
        velocity: { x: -3, y: 0 },
        collisionBox: { width: 100, height: 50 },
        width: 100,
        height: 50,
    }),
    // SEGUNDA RUA
    new Vehicle({
        position: { x: -200, y: -800 }, // y -800 = fileira de cima (segunda rua)
        image: getRandomImage(carsToRight),
        velocity: { x: 4, y: 0 }, // Movimento para a direita (positivo)
        collisionBox: { width: 100, height: 50 },
        width: 100,
        height: 50,
    }),
    new Vehicle({
        position: { x: 600, y: -800 },
        image: getRandomImage(carsToRight),
        velocity: { x: 4, y: 0 },
        collisionBox: { width: 100, height: 50 },
        width: 100,
        height: 50,
    }),
    new Vehicle({
        position: { x: 300, y: -700 }, // y -700 = fileira de baixo (segunda rua)
        image: getRandomImage(carsToLeft),
        velocity: { x: -3, y: 0 }, // Movimento para a esquerda (negativo)
        collisionBox: { width: 100, height: 50 },
        width: 100,
        height: 50,
    }),
    new Vehicle({
        position: { x: 700, y: -700 },
        image: getRandomImage(carsToLeft),
        velocity: { x: -3, y: 0 },
        collisionBox: { width: 100, height: 50 },
        width: 100,
        height: 50,
    }),
    // TERCEIRA RUA
    new Vehicle({
        position: { x: -200, y: -1120 }, // y -1120 = fileira de cima (terceira rua)
        image: getRandomImage(carsToRight),
        velocity: { x: 4, y: 0 }, // Movimento para a direita (positivo)
        collisionBox: { width: 100, height: 50 },
        width: 100,
        height: 50,
    }),
    new Vehicle({
        position: { x: 600, y: -1120 },
        image: getRandomImage(carsToRight),
        velocity: { x: 4, y: 0 },
        collisionBox: { width: 100, height: 50 },
        width: 100,
        height: 50,
    }),
    new Vehicle({
        position: { x: 300, y: -1020 }, // y -1020 = fileira de baixo (terceira rua)
        image: getRandomImage(carsToLeft),
        velocity: { x: -3, y: 0 }, // Movimento para a esquerda (negativo)
        collisionBox: { width: 100, height: 50 },
        width: 100,
        height: 50,
    }),
    new Vehicle({
        position: { x: 700, y: -1020 },
        image: getRandomImage(carsToLeft),
        velocity: { x: -3, y: 0 },
        collisionBox: { width: 100, height: 50 },
        width: 100,
        height: 50,
    }),
    // QUARTA RUA
    new Vehicle({
        position: { x: -200, y: -2140 }, // y -2140 = fileira de cima (quarta rua)
        image: getRandomImage(carsToRight),
        velocity: { x: 4, y: 0 }, // Movimento para a direita (positivo)
        collisionBox: { width: 100, height: 50 },
        width: 100,
        height: 50,
    }),
    new Vehicle({
        position: { x: 600, y: -2140 },
        image: getRandomImage(carsToRight),
        velocity: { x: 4, y: 0 },
        collisionBox: { width: 100, height: 50 },
        width: 100,
        height: 50,
    }),
    new Vehicle({
        position: { x: 300, y: -2040 }, // y -2040 = fileira de baixo (quarta rua)
        image: getRandomImage(carsToLeft),
        velocity: { x: -3, y: 0 }, // Movimento para a esquerda (negativo)
        collisionBox: { width: 100, height: 50 },
        width: 100,
        height: 50,
    }),
    new Vehicle({
        position: { x: 700, y: -2040 },
        image: getRandomImage(carsToLeft),
        velocity: { x: -3, y: 0 },
        collisionBox: { width: 100, height: 50 },
        width: 100,
        height: 50,
    }),
];

const trucksToLeft = [truck1Image, truck2Image]; // Imagens para caminhões que movem para a esquerda
const trucksToRight = [truck1ReverseImage, truck2ReverseImage]; // Imagens para caminhões que movem para a direita

// CAMINHÕES DO JOGO (TEM HITBOX MAIOR QUE OS CARROS)
const trucks = [
    // PRIMEIRA RUA
    new Vehicle({
        position: { x: 200, y: 285 },
        image: getRandomImage(trucksToRight),
        velocity: { x: 4, y: 0 },
        collisionBox: { width: 150, height: 80 },
        width: 150,
        height: 80,
    }),
    new Vehicle({
        position: { x: 1100, y: 385 },
        image: getRandomImage(trucksToLeft),
        velocity: { x: -3, y: 0 },
        collisionBox: { width: 150, height: 80 },
        width: 150,
        height: 80,
    }),
    // SEGUNDA RUA
    new Vehicle({
        position: { x: 200, y: -815 },
        image: getRandomImage(trucksToRight),
        velocity: { x: 4, y: 0 },
        collisionBox: { width: 150, height: 80 },
        width: 150,
        height: 80,
    }),
    new Vehicle({
        position: { x: 1100, y: -715 },
        image: getRandomImage(trucksToLeft),
        velocity: { x: -3, y: 0 },
        collisionBox: { width: 150, height: 80 },
        width: 150,
        height: 80,
    }),
    // TERCEIRA RUA
    new Vehicle({
        position: { x: 200, y: -1135 },
        image: getRandomImage(trucksToRight),
        velocity: { x: 4, y: 0 },
        collisionBox: { width: 150, height: 80 },
        width: 150,
        height: 80,
    }),
    new Vehicle({
        position: { x: 1100, y: -1035 },
        image: getRandomImage(trucksToLeft),
        velocity: { x: -3, y: 0 },
        collisionBox: { width: 150, height: 80 },
        width: 150,
        height: 80,
    }),
    // QUARTA RUA
    new Vehicle({
        position: { x: 200, y: -2155 },
        image: getRandomImage(trucksToRight),
        velocity: { x: 4, y: 0 },
        collisionBox: { width: 150, height: 80 },
        width: 150,
        height: 80,
    }),
    new Vehicle({
        position: { x: 1100, y: -2055 },
        image: getRandomImage(trucksToLeft),
        velocity: { x: -3, y: 0 },
        collisionBox: { width: 150, height: 80 },
        width: 150,
        height: 80,
    }),
];

// ARRAY QUE ARMAZENA TODOS OS VEÍCULOS DO JOGO
const vehicles = [];
vehicles.push(...cars, ...trucks);

// PROPRIEDADES DOS ELEMENTOS EM PRIMEIRO PLANO
const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y,
    },
    image: foregroundImage,
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

// FUNÇÃO DE TODAS AS COLISÕES DO JOGO
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

// CHECAGEM DE FIM DE JOGO
let gameOver = false;

// ELEMENTOS QUE PODEM SE MOVER PARA CIMA E PARA BAIXO
const movables = [background, ...boundaries, ...cars, ...trucks, foreground];

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
            car.position.x = -200;
            car.image = getRandomImage(carsToRight); // Randomiza a imagem do carro novamente ao ser resetado
        } else if (car.velocity.x < 0 && car.position.x < -180) {
            car.position.x = canvas.width + 100;
            car.image = getRandomImage(carsToLeft); // Randomiza a imagem do carro novamente ao ser resetado
        }

        // Lógica de colisão entre o jogador e o carro
        if (rectangularCollision({ rectangle1: player, rectangle2: car })) {
            alert("Você foi atropelado! Fim de jogo.");
            gameOver = true;
        }
    });
    // Loop para atualizar e desenhar os caminhões
    trucks.forEach((truck) => {
        truck.update();
        truck.draw();

        // Reinicia o carro se ele sair da tela
        if (truck.velocity.x > 0 && truck.position.x > canvas.width + 100) {
            truck.position.x = -200;
            truck.image = getRandomImage(trucksToRight);
        } else if (truck.velocity.x < 0 && truck.position.x < -180) {
            truck.position.x = canvas.width + 100;
            truck.image = getRandomImage(trucksToLeft);
        }

        // Lógica de colisão entre o jogador e o carro
        if (rectangularCollision({ rectangle1: player, rectangle2: truck })) {
            alert("Você foi atropelado! Fim de jogo.");
            gameOver = true;
        }
    });
    player.draw();
    foreground.draw();

    const playerSpeed = 8;
    player.moving = false;

    // Verificação de movimento UP (W)
    if (keys.w.pressed) {
        player.moving = true;
        player.image = player.sprites.up;

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
                            y: boundary.position.y + 2,
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
                movable.position.y += playerSpeed;
            });
        }
    }

    // Verificação de movimento DOWN (S)
    if (keys.s.pressed) {
        player.moving = true;
        player.image = player.sprites.down;

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
                            y: boundary.position.y - 2,
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
                movable.position.y -= playerSpeed;
            });
        }
    }

    // Verificação de movimento LEFT (A)
    if (keys.a.pressed) {
        player.moving = true;
        player.image = player.sprites.left;

        let canMoveLeft = true;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x + 2,
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
            player.position.x -= playerSpeed;
        }
    }

    // Verificação de movimento RIGHT (D)
    if (keys.d.pressed) {
        player.moving = true;
        player.image = player.sprites.right;

        let canMoveRight = true;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x - 2,
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
            player.position.x += playerSpeed;
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
