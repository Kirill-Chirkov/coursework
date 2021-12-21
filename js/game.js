var cvs = document.getElementById('canvas');
var ctx = cvs.getContext("2d");

//Изображения
var bird = new Image();
var bg = new Image();
var fg = new Image();
var pipeUp = new Image();
var pipeBottom = new Image();

bird.src = "img/bird.png";
bg.src = "img/bg.png";
fg.src = "img/fg.png";
pipeUp.src = "img/pipeUp.png";
pipeBottom.src = "img/pipeBottom.png";

//Звуковые файлы;'
var fly = new Audio();
var score_audio = new Audio();
var back_sound = new Audio();

score_audio.src = "audio/score.mp3";
back_sound.src = "audio/backsound.mp3"


document.addEventListener("keydown", moveUp); /* вызов функции, 
который заставляет птицу взлетать, при нажатии любой клавишы */

function moveUp() {
    yPos -= 40; //количество пикселей, на которое поднимается птица
}

var score = 0; //инициализация переменной

//Позиция птицы
var xPos = 30;
var yPos = 350;

//Создание блоков преград
var pipe = [];

pipe[0] = { //создание 0-го блока
    x : cvs.width,
    y : 0
}

function draw () {
    ctx.drawImage(bg, 0, 0); //прорисовка заднего плана
    ctx.drawImage(fg, 0, cvs.height - fg.height); //прорисовка переднего плана
    var gap = 180; //расстояние между облаками - 180px

    for(var i = 0; i < pipe.length; i++) {
        ctx.drawImage(pipeUp, pipe[i].x, pipe[i].y); //прорисовка верхнего облака
        ctx.drawImage(pipeBottom, pipe[i].x, pipe[i].y + pipeUp.height + gap);
        //прорисовка нижнего облака с отступом 180px

        pipe[i].x = pipe[i].x - 1; //скорость движения блоков

        //Прорисовка препятствий
        if(pipe[i].x == 25) { /* когда блок находится на расстоянии 25px от левой границы мира,
            появляется следующий блок */
            pipe.push ({
                x : cvs.width,
                y : Math.floor(Math.random() * pipeUp.height) - pipeUp.height //положение блока по y 
            })
        }

        //Отслеживание столкновений с трубами
        if(xPos + bird.width >= pipe[i].x && xPos <= pipe[i].x + pipeUp.width && (yPos <= pipe[i].y + pipeUp.height || yPos + bird.height >= pipe[i].y + pipeUp.height + gap)) {
            location.reload(); //Перезапуск игрового процесса
        }
        
        //Отслеживание столкновений с землей
        if(yPos + bird.height >= cvs.height - fg.height) {
            location.reload();
        }

        if(pipe[i].x == 5) { /*если блок находится в координате x = 5, 
            то препятствие считается пройдённым*/
            score++; //прибавление 1 к текущему значению счетчика
            score_audio.play(); // воспроизведение соответствующего звука
        }
        
        back_sound.play();

    }
 

    ctx.drawImage(bird, xPos, yPos);
    
    var grav = 1.2; //множитель силы гравитации
    yPos += grav;

    requestAnimationFrame(draw); //перерисовка игрового мира 

    ctx.fillStyle = "#07605D"; //цвет шрифта
    ctx.font = "54px Brush Hand RUS"; //размер и название шрифта
    ctx.fillText ("Счет: " + score, 20, 70); //надпись
}

pipeBottom.onload = draw;