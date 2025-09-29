// PEGA A TAG CANVAS, ONDE IRÁ RODAR TODO O JGOO
const canvas = document.querySelector(".game-canvas");

// VARIÁVEL FÁCIL DO CANVAS NO CONTEXTO DO JOGO
const c = canvas.getContext("2d");

const boundaries = []; // Colisão normal
const winBoundaries = []; // Colisão de vitória
const underwaterBoundaries = []; // Colisão de vitória
const offset = {
    // Referente à posição inicial do fundo
    x: 0,
    y: -1600,
};

// CORTA O JSON DAS CAIXAS DE COLISÃO EM VÁRIAS LINHAS E ARMAZENA NUMA ARRAY
const MAP_WIDTH_IN_TILES = 16; // Largura do canvas (960px) / Largura do tile (64px) = 15

const collisionsMap = [];
for (let i = 0; i < collisions.length; i += MAP_WIDTH_IN_TILES) {
    collisionsMap.push(collisions.slice(i, MAP_WIDTH_IN_TILES + i));
}

// DEFINE ONDE AS COLISÕES SERÃO LOCALIZADAS PELO VALOR DELAS NO JSON
collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        // VALOR DA CAIXA DE COLISÃO (4097) NO JSON
        if (symbol === 321)
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

const underwaterMap = [];
for (let i = 0; i < underwater.length; i += MAP_WIDTH_IN_TILES) {
    underwaterMap.push(underwater.slice(i, MAP_WIDTH_IN_TILES + i));
}

// DEFINE ONDE AS COLISÕES SERÃO LOCALIZADAS PELO VALOR DELAS NO JSON
underwaterMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        // VALOR DA CAIXA DE COLISÃO (4097) NO JSON
        if (symbol === 323)
            underwaterBoundaries.push(
                new UnderwaterBoundary({
                    position: {
                        x: j * UnderwaterBoundary.width + offset.x,
                        y: i * UnderwaterBoundary.height + offset.y,
                    },
                })
            );
    });
});

// CORTA O JSON DAS COLISÃO DE VITÓRIA EM VÁRIAS LINHAS E ARMAZENA EM OUTRA ARRAY
const winMap = [];
for (let i = 0; i < win.length; i += MAP_WIDTH_IN_TILES) {
    winMap.push(win.slice(i, MAP_WIDTH_IN_TILES + i));
}

winMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        // VALOR DA CAIXA DE COLISÃO DE VITÓRIA (4098) NO JSON
        if (symbol === 322)
            winBoundaries.push(
                new WinBoundary({
                    position: {
                        x: j * WinBoundary.width + offset.x,
                        y: i * WinBoundary.height + offset.y,
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
foregroundImage.src = "./assets/imgs/foreground-elements.png";

// IMAGEM DO JOGADOR ANDANDO (PADRÃO)
const playerWalkImage = new Image();
playerWalkImage.src = "./assets/imgs/playerWalk.png";

// IMAGEM DO JOGADOR NADANDO
const playerSwimImage = new Image();
playerSwimImage.src = "./assets/imgs/playerSwim.png";

//IMAGEM DOS CARROS
const car1Image = new Image();
car1Image.src = "./assets/imgs/carros/carro1.png";

const car1ReverseImage = new Image();
car1ReverseImage.src = "./assets/imgs/carros/carro1-reverse.png";

const car2Image = new Image();
car2Image.src = "./assets/imgs/carros/carro2.png";

const car2ReverseImage = new Image();
car2ReverseImage.src = "./assets/imgs/carros/carro2-reverse.png";

const car3Image = new Image();
car3Image.src = "./assets/imgs/carros/carro3.png";

const car3ReverseImage = new Image();
car3ReverseImage.src = "./assets/imgs/carros/carro3-reverse.png";

//IMAGEM DOS LIXOS NA ÁGUA
const trash1Image = new Image();
trash1Image.src = "./assets/imgs/lixo/garrafa.png";

const trash2Image = new Image();
trash2Image.src = "./assets/imgs/lixo/saco.png";

const trash3Image = new Image();
trash3Image.src = "./assets/imgs/lixo/biscoito.png";

//IMAGEM DAS KOMBIS
const kombi1Image = new Image();
kombi1Image.src = "./assets/imgs/carros/kombi1.png";

const kombi1ReverseImage = new Image();
kombi1ReverseImage.src = "./assets/imgs/carros/kombi1-reverse.png";

const kombi2Image = new Image();
kombi2Image.src = "./assets/imgs/carros/kombi2.png";

const kombi2ReverseImage = new Image();
kombi2ReverseImage.src = "./assets/imgs/carros/kombi2-reverse.png";

//IMAGEM DOS CICLISTAS
const bike1Image = new Image();
bike1Image.src = "./assets/imgs/ciclista/ciclista1.png";

const bike1ReverseImage = new Image();
bike1ReverseImage.src = "./assets/imgs/ciclista/ciclista1-reverse.png";

const bike2Image = new Image();
bike2Image.src = "./assets/imgs/ciclista/ciclista2.png";

const bike2ReverseImage = new Image();
bike2ReverseImage.src = "./assets/imgs/ciclista/ciclista2-reverse.png";

const bike3Image = new Image();
bike3Image.src = "./assets/imgs/ciclista/ciclista3.png";

const bike3ReverseImage = new Image();
bike3ReverseImage.src = "./assets/imgs/ciclista/ciclista3-reverse.png";

// FUNÇÃO PARA PEGAR UMA IMAGEM ALEATÓRIA DENTRO DE UMA ARRAY
function getRandomImage(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

// VARIÁVEL PARA REGISTRAR O TEMPO DE INÍCIO DO JOGO
let startTime = Date.now();

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
        y: 493,
    },
    image: playerWalkImage,
    frames: {
        max: 3,
    },
    sprites: {
        walk: playerWalkImage,
        swim: playerSwimImage,
    },
});

const carsToLeft = [car1Image, car2Image, car3Image]; // Imagens para carros que movem para a esquerda
const carsToRight = [car1ReverseImage, car2ReverseImage, car3ReverseImage]; // Imagens para carros que movem para a direita

// CARROS DO JOGO (USANDO DIMENSÕES FIXAS E CONSISTENTES)
const CAR_WIDTH = 145;
const CAR_HEIGHT = 70;
const CAR_HITBOX_WIDTH = 145;
const CAR_HITBOX_HEIGHT = 70;

// CARROS DO JOGO
const cars = [
    // PRIMEIRA RUA
    new Vehicle({
        position: { x: 200, y: -100 },
        image: getRandomImage(carsToLeft),
        velocity: { x: -4, y: 0 },
        collisionBox: { width: CAR_HITBOX_WIDTH, height: CAR_HITBOX_HEIGHT },
        width: CAR_WIDTH,
        height: CAR_HEIGHT,
    }),
    new Vehicle({
        position: { x: 600, y: -100 },
        image: getRandomImage(carsToLeft),
        velocity: { x: -4, y: 0 }, // Movimento para a esquerda (negativo)
        collisionBox: { width: CAR_HITBOX_WIDTH, height: CAR_HITBOX_HEIGHT },
        width: CAR_WIDTH,
        height: CAR_HEIGHT,
    }),
    new Vehicle({
        position: { x: -200, y: -10 },
        image: getRandomImage(carsToRight),
        velocity: { x: 4, y: 0 }, // Movimento para a direita (positivo)
        collisionBox: { width: CAR_HITBOX_WIDTH, height: CAR_HITBOX_HEIGHT },
        width: CAR_WIDTH,
        height: CAR_HEIGHT,
    }),
    new Vehicle({
        position: { x: 600, y: -10 },
        image: getRandomImage(carsToRight),
        velocity: { x: 4, y: 0 },
        collisionBox: { width: CAR_HITBOX_WIDTH, height: CAR_HITBOX_HEIGHT },
        width: CAR_WIDTH,
        height: CAR_HEIGHT,
    }),
    // SEGUNDA RUA
    new Vehicle({
        position: { x: -10, y: -380 },
        image: getRandomImage(carsToLeft),
        velocity: { x: -4, y: 0 },
        collisionBox: { width: CAR_HITBOX_WIDTH, height: CAR_HITBOX_HEIGHT },
        width: CAR_WIDTH,
        height: CAR_HEIGHT,
    }),
    new Vehicle({
        position: { x: 400, y: -380 },
        image: getRandomImage(carsToLeft),
        velocity: { x: -4, y: 0 }, // Movimento para a esquerda (negativo)
        collisionBox: { width: CAR_HITBOX_WIDTH, height: CAR_HITBOX_HEIGHT },
        width: CAR_WIDTH,
        height: CAR_HEIGHT,
    }),
    new Vehicle({
        position: { x: 10, y: -290 },
        image: getRandomImage(carsToRight),
        velocity: { x: 4, y: 0 }, // Movimento para a direita (positivo)
        collisionBox: { width: CAR_HITBOX_WIDTH, height: CAR_HITBOX_HEIGHT },
        width: CAR_WIDTH,
        height: CAR_HEIGHT,
    }),
    new Vehicle({
        position: { x: -450, y: -290 },
        image: getRandomImage(carsToRight),
        velocity: { x: 4, y: 0 },
        collisionBox: { width: CAR_HITBOX_WIDTH, height: CAR_HITBOX_HEIGHT },
        width: CAR_WIDTH,
        height: CAR_HEIGHT,
    }),
];

const kombisToLeft = [kombi1Image, kombi2Image]; // Imagens para kombis que movem para a esquerda
const kombisToRight = [kombi1ReverseImage, kombi2ReverseImage]; // Imagens para kombis que movem para a direita

// CICLISTAS DO JOGO
const KOMBI_WIDTH = 175;
const KOMBI_HEIGHT = 80;
const KOMBI_HITBOX_WIDTH = 175;
const KOMBI_HITBOX_HEIGHT = 80;

const kombis = [
    // PRIMEIRA RUA
    new Vehicle({
        position: { x: 1000, y: -120 },
        image: getRandomImage(kombisToLeft),
        velocity: { x: -4, y: 0 },
        collisionBox: {
            width: KOMBI_HITBOX_WIDTH,
            height: KOMBI_HITBOX_HEIGHT,
        },
        width: KOMBI_WIDTH,
        height: KOMBI_HEIGHT,
    }),
    new Vehicle({
        position: { x: 200, y: -30 },
        image: getRandomImage(kombisToRight),
        velocity: { x: 4, y: 0 },
        collisionBox: {
            width: KOMBI_HITBOX_WIDTH,
            height: KOMBI_HITBOX_HEIGHT,
        },
        width: KOMBI_WIDTH,
        height: KOMBI_HEIGHT,
    }),
    // SEGUNDA RUA
    new Vehicle({
        position: { x: 800, y: -400 },
        image: getRandomImage(kombisToLeft),
        velocity: { x: -4, y: 0 },
        collisionBox: {
            width: KOMBI_HITBOX_WIDTH,
            height: KOMBI_HITBOX_HEIGHT,
        },
        width: KOMBI_WIDTH,
        height: KOMBI_HEIGHT,
    }),
    new Vehicle({
        position: { x: 400, y: -300 },
        image: getRandomImage(kombisToRight),
        velocity: { x: 4, y: 0 },
        collisionBox: {
            width: KOMBI_HITBOX_WIDTH,
            height: KOMBI_HITBOX_HEIGHT,
        },
        width: KOMBI_WIDTH,
        height: KOMBI_HEIGHT,
    }),
];

const bikesToLeft = [bike1Image, bike2Image, bike3Image]; // Imagens para ciclistas que movem para a esquerda
const bikesToRight = [bike1ReverseImage, bike2ReverseImage, bike3ReverseImage]; // Imagens para ciclistas que movem para a direita

// CICLISTAS DO JOGO
const BIKE_WIDTH = 75;
const BIKE_HEIGHT = 70;
const BIKE_HITBOX_WIDTH = 75;
const BIKE_HITBOX_HEIGHT = 70;

const bikes = [
    new Vehicle({
        position: { x: -400, y: 195 },
        image: getRandomImage(bikesToRight),
        velocity: { x: 3, y: 0 },
        collisionBox: { width: BIKE_HITBOX_WIDTH, height: BIKE_HITBOX_HEIGHT },
        width: BIKE_WIDTH,
        height: BIKE_HEIGHT,
    }),
    new Vehicle({
        position: { x: 50, y: 195 },
        image: getRandomImage(bikesToRight),
        velocity: { x: 3, y: 0 },
        collisionBox: { width: BIKE_HITBOX_WIDTH, height: BIKE_HITBOX_HEIGHT },
        width: BIKE_WIDTH,
        height: BIKE_HEIGHT,
    }),
    new Vehicle({
        position: { x: 450, y: 195 },
        image: getRandomImage(bikesToRight),
        velocity: { x: 3, y: 0 },
        collisionBox: { width: BIKE_HITBOX_WIDTH, height: BIKE_HITBOX_HEIGHT },
        width: BIKE_WIDTH,
        height: BIKE_HEIGHT,
    }),
    new Vehicle({
        position: { x: 300, y: 250 },
        image: getRandomImage(bikesToLeft),
        velocity: { x: -3, y: 0 },
        collisionBox: { width: BIKE_HITBOX_WIDTH, height: BIKE_HITBOX_HEIGHT },
        width: BIKE_WIDTH,
        height: BIKE_HEIGHT,
    }),
    new Vehicle({
        position: { x: 800, y: 250 },
        image: getRandomImage(bikesToLeft),
        velocity: { x: -3, y: 0 },
        collisionBox: { width: BIKE_HITBOX_WIDTH, height: BIKE_HITBOX_HEIGHT },
        width: BIKE_WIDTH,
        height: BIKE_HEIGHT,
    }),
    new Vehicle({
        position: { x: 1200, y: 250 },
        image: getRandomImage(bikesToLeft),
        velocity: { x: -3, y: 0 },
        collisionBox: { width: BIKE_HITBOX_WIDTH, height: BIKE_HITBOX_HEIGHT },
        width: BIKE_WIDTH,
        height: BIKE_HEIGHT,
    }),
];

// LIXOS NA ÁGUA
const trashes = [trash1Image, trash2Image, trash3Image];

const TRASH_WIDTH = 66;
const TRASH_HEIGHT = 55;
const TRASH_HITBOX_WIDTH = 66;
const TRASH_HITBOX_HEIGHT = 55;

const trash = [
    // LINHA 1
    new Vehicle({
        position: { x: -400, y: -600 },
        image: getRandomImage(trashes),
        velocity: { x: -4, y: 0 },
        collisionBox: {
            width: TRASH_HITBOX_WIDTH,
            height: TRASH_HITBOX_HEIGHT,
        },
        width: TRASH_WIDTH,
        height: TRASH_HEIGHT,
    }),
    new Vehicle({
        position: { x: 200, y: -600 },
        image: getRandomImage(trashes),
        velocity: { x: -4, y: 0 },
        collisionBox: {
            width: TRASH_HITBOX_WIDTH,
            height: TRASH_HITBOX_HEIGHT,
        },
        width: TRASH_WIDTH,
        height: TRASH_HEIGHT,
    }),
    new Vehicle({
        position: { x: 600, y: -600 },
        image: getRandomImage(trashes),
        velocity: { x: -4, y: 0 },
        collisionBox: {
            width: TRASH_HITBOX_WIDTH,
            height: TRASH_HITBOX_HEIGHT,
        },
        width: TRASH_WIDTH,
        height: TRASH_HEIGHT,
    }),
    // LINHA 2
    new Vehicle({
        position: { x: -100, y: -750 },
        image: getRandomImage(trashes),
        velocity: { x: 4, y: 0 },
        collisionBox: {
            width: TRASH_HITBOX_WIDTH,
            height: TRASH_HITBOX_HEIGHT,
        },
        width: TRASH_WIDTH,
        height: TRASH_HEIGHT,
    }),
    new Vehicle({
        position: { x: 400, y: -750 },
        image: getRandomImage(trashes),
        velocity: { x: 4, y: 0 },
        collisionBox: {
            width: TRASH_HITBOX_WIDTH,
            height: TRASH_HITBOX_HEIGHT,
        },
        width: TRASH_WIDTH,
        height: TRASH_HEIGHT,
    }),
    new Vehicle({
        position: { x: 800, y: -750 },
        image: getRandomImage(trashes),
        velocity: { x: 4, y: 0 },
        collisionBox: {
            width: TRASH_HITBOX_WIDTH,
            height: TRASH_HITBOX_HEIGHT,
        },
        width: TRASH_WIDTH,
        height: TRASH_HEIGHT,
    }),
    // LINHA 3
    new Vehicle({
        position: { x: -10, y: -900 },
        image: getRandomImage(trashes),
        velocity: { x: -4, y: 0 },
        collisionBox: {
            width: TRASH_HITBOX_WIDTH,
            height: TRASH_HITBOX_HEIGHT,
        },
        width: TRASH_WIDTH,
        height: TRASH_HEIGHT,
    }),
    new Vehicle({
        position: { x: 300, y: -900 },
        image: getRandomImage(trashes),
        velocity: { x: -4, y: 0 },
        collisionBox: {
            width: TRASH_HITBOX_WIDTH,
            height: TRASH_HITBOX_HEIGHT,
        },
        width: TRASH_WIDTH,
        height: TRASH_HEIGHT,
    }),
    new Vehicle({
        position: { x: 900, y: -900 },
        image: getRandomImage(trashes),
        velocity: { x: -4, y: 0 },
        collisionBox: {
            width: TRASH_HITBOX_WIDTH,
            height: TRASH_HITBOX_HEIGHT,
        },
        width: TRASH_WIDTH,
        height: TRASH_HEIGHT,
    }),
    // LINHA 4
    new Vehicle({
        position: { x: -200, y: -1050 },
        image: getRandomImage(trashes),
        velocity: { x: 4, y: 0 },
        collisionBox: {
            width: TRASH_HITBOX_WIDTH,
            height: TRASH_HITBOX_HEIGHT,
        },
        width: TRASH_WIDTH,
        height: TRASH_HEIGHT,
    }),
    new Vehicle({
        position: { x: 300, y: -1050 },
        image: getRandomImage(trashes),
        velocity: { x: 4, y: 0 },
        collisionBox: {
            width: TRASH_HITBOX_WIDTH,
            height: TRASH_HITBOX_HEIGHT,
        },
        width: TRASH_WIDTH,
        height: TRASH_HEIGHT,
    }),
    new Vehicle({
        position: { x: 600, y: -1050 },
        image: getRandomImage(trashes),
        velocity: { x: 4, y: 0 },
        collisionBox: {
            width: TRASH_HITBOX_WIDTH,
            height: TRASH_HITBOX_HEIGHT,
        },
        width: TRASH_WIDTH,
        height: TRASH_HEIGHT,
    }),
];

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

// CHECAGEM PARA O TOPO DO MAPA
let atTop = false;

// ELEMENTOS QUE PODEM SE MOVER PARA CIMA E PARA BAIXO
const movables = [
    background,
    ...boundaries,
    ...underwaterBoundaries,
    ...winBoundaries,
    ...cars,
    ...bikes,
    ...kombis,
    ...trash,
    foreground,
];

// DESENHO E MOVIMENTAÇÃO DOS ELEMENTOS NA TELA
function animate() {
    // FUNÇÃO PARA CALCULAR O TEMPO DE JOGO
    function getElapsedTime() {
        const elapsedMilliseconds = Date.now() - startTime;
        const totalSeconds = elapsedMilliseconds / 1000;

        // Calcula os minutos
        const minutes = Math.floor(totalSeconds / 60);

        // Calcula os segundos restantes (o resto da divisão por 60)
        const seconds = Math.floor(totalSeconds % 60);

        // Calcula os milissegundos restantes (as casas decimais dos segundos)
        // Usa toFixed(3) para 3 casas decimais
        const milliseconds = (totalSeconds % 1).toFixed(3).substring(2);

        // Formata a string de tempo
        let timeString = "";

        // Adiciona minutos apenas se o tempo for >= 1 minuto
        if (minutes > 0) {
            timeString += `${minutes} minuto${minutes > 1 ? "s" : ""}, `;
        }

        // Adiciona segundos e milissegundos
        timeString += `${seconds} segundo${
            seconds !== 1 ? "s" : ""
        } e ${milliseconds} milissegundos`;

        return timeString;
    }

    // Se o jogo acabou, para a animação
    if (gameOver) {
        return;
    }

    // Função importante para pedir ao navegador que continue desenhando os elementos em tela
    window.requestAnimationFrame(animate);

    // Desenha na tela os elementos que não atualizam
    background.draw();
    boundaries.forEach((boundary) => {
        boundary.draw();
    });
    underwaterBoundaries.forEach((boundary) => {
        boundary.draw();
    });
    winBoundaries.forEach((boundary) => {
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
    // Loop para atualizar e desenhar os ciclistas
    kombis.forEach((kombi) => {
        kombi.update();
        kombi.draw();

        // Reinicia o carro se ele sair da tela
        if (kombi.velocity.x > 0 && kombi.position.x > canvas.width + 100) {
            kombi.position.x = -200;
            kombi.image = getRandomImage(kombisToRight);
        } else if (kombi.velocity.x < 0 && kombi.position.x < -180) {
            kombi.position.x = canvas.width + 100;
            kombi.image = getRandomImage(kombisToLeft);
        }

        // Lógica de colisão entre o jogador e o carro
        if (rectangularCollision({ rectangle1: player, rectangle2: kombi })) {
            alert("Você foi atropelado! Fim de jogo.");
            gameOver = true;
        }
    });
    // Loop para atualizar e desenhar os ciclistas
    bikes.forEach((bike) => {
        bike.update();
        bike.draw();

        // Reinicia o carro se ele sair da tela
        if (bike.velocity.x > 0 && bike.position.x > canvas.width + 100) {
            bike.position.x = -200;
            bike.image = getRandomImage(bikesToRight);
        } else if (bike.velocity.x < 0 && bike.position.x < -180) {
            bike.position.x = canvas.width + 100;
            bike.image = getRandomImage(bikesToLeft);
        }

        // Lógica de colisão entre o jogador e o carro
        if (rectangularCollision({ rectangle1: player, rectangle2: bike })) {
            alert("Você foi atropelado! Fim de jogo.");
            gameOver = true;
        }
    });
    trash.forEach((trash) => {
        trash.update();
        trash.draw();

        // Reinicia o carro se ele sair da tela
        if (trash.velocity.x > 0 && trash.position.x > canvas.width + 100) {
            trash.position.x = -200;
            trash.image = getRandomImage(trashes);
        } else if (trash.velocity.x < 0 && trash.position.x < -180) {
            trash.position.x = canvas.width + 100;
            trash.image = getRandomImage(trashes);
        }

        // Lógica de colisão entre o jogador e o carro
        if (rectangularCollision({ rectangle1: player, rectangle2: trash })) {
            alert("Você foi atropelado! Fim de jogo.");
            gameOver = true;
        }
    });

    // Desenha os últimos elementos em ordem (o último fica em cima do anterior)
    player.draw();
    foreground.draw(); // Elementos em primeiro plano são desenhados em cima de tudo

    // Propriedades padrão do jogador
    player.image = player.sprites.walk;
    let playerSpeed = 3;
    player.moving = false;

    // LÓGICA DE TROCA DE SPRITE PARA NADO (SWIM)
    let isUnderwater = false;
    for (let i = 0; i < underwaterBoundaries.length; i++) {
        const boundary = underwaterBoundaries[i];
        if (
            rectangularCollision({
                rectangle1: player,
                rectangle2: boundary,
            })
        ) {
            isUnderwater = true;
            break; // Se colidir com uma, já sabemos que está na água
        }
    }

    // Aplica o sprite correto
    if (isUnderwater) {
        player.image = player.sprites.swim;
        playerSpeed = 2;
    } else {
        player.image = player.sprites.walk;
        playerSpeed = 3;
    }

    // CONDIÇÃO PARA MUDAR O MODO DE MOVIMENTO
    const topLimit = 0; // O topo do mapa é atingido quando background.position.y é 0 (ou um pouco mais)

    // CHECAGEM SE O LIMITE FOI ALCANÇADO, PARA MUDAR MODO DE MOVIMENTO
    if (background.position.y >= topLimit) {
        atTop = true;
    } else {
        atTop = false;
    }

    // Verificação de movimento UP (W)
    if (keys.w.pressed) {
        player.moving = true;

        let canMoveUp = true;
        // CHECAGEM PARA CAIXAS DE COLISÃO
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y + playerSpeed,
                        },
                    },
                })
            ) {
                canMoveUp = false;
                break;
            }
        }
        // CHECAGEM PARA COLISÃO COM O FIM DA FASE
        for (let i = 0; i < winBoundaries.length; i++) {
            const winBoundary = winBoundaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: winBoundary,
                })
            ) {
                // Obtém o tempo decorrido
                const timeTaken = getElapsedTime();
                alert(`Você GANHOU! \nTempo Total: ${timeTaken}`);
                gameOver = true;
            }
        }
        if (canMoveUp) {
            if (!atTop) {
                movables.forEach((movable) => {
                    movable.position.y += playerSpeed;
                });
            } else {
                // Se ESTIVER no topo, move APENAS o jogador para cima
                // E garante que ele não saia do limite superior da tela
                if (player.position.y > 0) {
                    player.position.y -= playerSpeed; // Move o jogador para cima
                }
            }
        }
    }

    // Verificação de movimento DOWN (S)
    if (keys.s.pressed) {
        player.moving = true;

        let canMoveDown = true;

        // CHECAGEM PARA CAIXAS DE COLISÃO
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y - playerSpeed,
                        },
                    },
                })
            ) {
                canMoveDown = false;
                break;
            }
        }
        // CHECAGEM PARA COLISÃO COM O FIM DA FASE
        for (let i = 0; i < winBoundaries.length; i++) {
            const winBoundary = winBoundaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: winBoundary,
                })
            ) {
                // Obtém o tempo decorrido
                const timeTaken = getElapsedTime();
                alert(`Você GANHOU! \nTempo Total: ${timeTaken}`);
                gameOver = true;
            }
        }
        if (canMoveDown) {
            // Se o jogador estiver no topo (atTop) E não estiver na posição inicial de Y (485),
            // move o jogador para baixo.
            if (atTop && player.position.y < canvas.height / 2.1) {
                player.position.y += playerSpeed; // Move o jogador para baixo
            } else {
                // Caso contrário, move o mapa (movables)
                movables.forEach((movable) => {
                    movable.position.y -= playerSpeed;
                });
            }
        }
    }

    // Verificação de movimento LEFT (A)
    if (keys.a.pressed) {
        player.moving = true;

        let canMoveLeft = true;
        // CHECAGEM PARA CAIXAS DE COLISÃO
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x + playerSpeed,
                            y: boundary.position.y,
                        },
                    },
                })
            ) {
                canMoveLeft = false;
                break;
            }
        }
        // CHECAGEM PARA COLISÃO COM O FIM DA FASE
        for (let i = 0; i < winBoundaries.length; i++) {
            const winBoundary = winBoundaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: winBoundary,
                })
            ) {
                // Obtém o tempo decorrido
                const timeTaken = getElapsedTime();
                alert(`Você GANHOU! \nTempo Total: ${timeTaken}`);
                gameOver = true;
            }
        }
        if (canMoveLeft) {
            player.position.x -= playerSpeed;
        }
    }

    // Verificação de movimento RIGHT (D)
    if (keys.d.pressed) {
        player.moving = true;

        let canMoveRight = true;
        // CHECAGEM PARA CAIXAS DE COLISÃO
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x - playerSpeed,
                            y: boundary.position.y,
                        },
                    },
                })
            ) {
                canMoveRight = false;
                break;
            }
        }
        // CHECAGEM PARA COLISÃO COM O FIM DA FASE
        for (let i = 0; i < winBoundaries.length; i++) {
            const winBoundary = winBoundaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: winBoundary,
                })
            ) {
                // Obtém o tempo decorrido
                const timeTaken = getElapsedTime();
                alert(`Você GANHOU! \nTempo Total: ${timeTaken}`);
                gameOver = true;
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
