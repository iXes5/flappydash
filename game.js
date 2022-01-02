//Select canvas
const cvs = document.getElementById("flappy");
const ctx = cvs.getContext("2d");

//Game vars and const
let frames = 0;
const DEGREE = Math.PI/180;

//Load sprite image
const sprite = new Image();
sprite.src = "image/sprite.png";

//Load sounds
const SCORE = new Audio();
SCORE.src = "audio/point.wav";
const FLAP = new Audio();
FLAP.src = "audio/wing.wav";
const HIT = new Audio();
HIT.src = "audio/hit.wav";
const SWOOSHING = new Audio();
SWOOSHING.src = "audio/swooshing.wav";
const OVER = new Audio();
OVER.src = "audio/end.wav";
const NGU = new Audio();
NGU.src = "audio/occho.m4a";
const ADU = new Audio();
ADU.src = "audio/adu.m4a";
const TROI = new Audio();
TROI.src = "audio/troi.m4a";

//Game state
const state = {
    current : 0,
    getReady : 0,
    game : 1,
    over : 2
}

//Start button
const startButton = {
    x : 118,
    y : 310,
    w : 83,
    h : 29
}

//Controll the game
document.addEventListener("click", function(evt) {
    switch (state.current) {
        case state.getReady:
            state.current = state.game;
            SWOOSHING.play();
            break;
        case state.game:
            bird.flap();
            FLAP.play();
            break;                                  
        case state.over:
            let rect = cvs.getBoundingClientRect();
            let clickX = evt.clientX - rect.left;
            let clickY = evt.clientY - rect.top;
            //Start button check
            if (clickX >= startButton.x && clickX <= startButton.x + startButton.w && clickY >= startButton.y && clickY <= startButton.y + startButton.h) {
                pipes.reset();
                bird.speedReset();
                score.reset();
                state.current = state.getReady;
            }
            break;
    }
})
document.addEventListener("keypress", function() {
    if (state.current == state.game) {
        bird.dash();
        for (let i = 0; i < pipes.position.length; i++) {
            let p = pipes.position[i];
            dash = 70;
            p.x -= dash;
            OVER.play();
        }
    }
})

//Background
const bg = {
    sX : 0,
    sY : 0,
    w : 275,
    h : 226,
    x : 0,
    y : cvs.height - 226,

    draw : function() {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    }
}

//Foreground
const fg = {
    sX : 276,
    sY : 0,
    w : 224,
    h : 112,
    x : 0,
    y : cvs.height - 112,
    dx : 2,

    draw : function() {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    },

    update : function() {
        //Move foreground to left
        if (state.current == state.game) {
            this.x = (this.x - this.dx)%(this.w/2);
        }
    }
}

//Bird
const bird = {
    animation : [
        {sX : 276, sY : 112},
        {sX : 276, sY : 139},
        {sX : 276, sY : 164},
        {sX : 276, sY : 139},
    ],
    x : 120,
    y : 150,
    w : 34,
    h : 26,

    radius : 12,

    frame : 0,

    speed : 0,
    gravity : 0.25,
    jump : 4,
    rotation : 0,

    d : -70,
    tY : 0,

    draw : function() {
        let bird = this.animation[this.frame];

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(sprite, bird.sX, bird.sY, this.w, this.h, - this.w/2, - this.h/2, this.w, this.h);
        ctx.restore();

        ctx.fillStyle = "#ffff00";
        ctx.fillRect(this.d, this.tY, 70, 4);
    },

    flap : function() {
        this.speed = - this.jump;
    },

    update : function() {
        //If the game state is get ready state, the bird must flap slowly
        this.period = state.current ==  state.getReady ? 10 : 5;

        //We increment the frame by 1, each period
        this.frame += frames%this.period == 0 ? 1 : 0;

        //Frame goes from 0 to 4, if 4 again to 0
        this.frame = this.frame%this.animation.length;

        if (state.current == state.getReady) {
            this.y = 150;
            this.rotation = 0 * DEGREE;
        }else {
            this.speed += this.gravity;
            this.y += this.speed;
            //Foreground touch
            if (this.y + this.h/2 >= cvs.height - fg.h) {
                this.y = cvs.height - fg.h - this.h/2;
                if (state.current == state.game) {
                    state.current = state.over;
                    HIT.play();
                    //No score = dumb
                    if (score.value == 0) {
                        NGU.play()
                    }
                }
            };

            //Set degree for bird in state.game
            if (this.speed >= this.jump) {
                this.rotation = 90 * DEGREE;
                this.frame = 1;
            }else {
                this.rotation = -25 * DEGREE
            };
        }
    },

    speedReset : function() {
        this.speed = 0;
        this.d = -70;
    },

    dash : function() {
        this.d = this.x - this.w/2 - 70;
        this.tY = this.y - 2;
    }
}

//Get ready
const getReady = {
    sX : 0,
    sY : 228,
    w : 173,
    h : 152,
    x : cvs.width/2 - 173/2,
    y : cvs.height/2 - 152/2,

    draw : function() {
        if (state.current == state.getReady) {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    }
}

//Game over
const gameOver = {
    sX : 175,
    sY : 228,
    w : 225,
    h : 202,
    x : cvs.width/2 - 225/2,
    y : cvs.height/2 - 202/2,

    draw : function() {
        if (state.current == state.over) {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    }
}

//Pipes
const pipes = {
    position : [],

    top : {
        sX : 553,
        sY : 0,
    },

    bottom : {
        sX : 502,
        sY : 0,
    },

    w : 53,
    h : 400,
    gap : 65,
    maxYPos : -150,
    dx : 2,

    draw : function() {
        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];

            let topYPos = p.y;
            let bottomYPos = p.y + this.h + this.gap;

            //Top pipes
            ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x, topYPos, this.w, this.h);

            //Bottom pipes
            ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x, bottomYPos, this.w, this.h);
        }
    },

    update : function() {
        if (state.current !== state.game) return;

        //Add pipes per 100 frames
        if (frames%120 == 0) {
            this.position.push({
                x : cvs.width,
                y : this.maxYPos * (Math.random() + 1),
            })
        };
        
        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];
            
            //Move pipes to left
            p.x -= this.dx;

            let bottomPipesYPos = p.y + this.h + this.gap;
            
            //Top pipes touch
            if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y - bird.radius < p.y + this.h && bird.y + bird.radius > 0) {
                state.current = state.over;
                HIT.play();
                //No score = dumb
                if (score.value == 0) {
                    NGU.play()
                }
            }

            //Bottom pipes touch
            if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > bottomPipesYPos) {
                state.current = state.over;
                HIT.play();
                //No score = dumb
                if (score.value == 0) {
                    NGU.play()
                }
            }

            if (p.x + this.w <= 0) {
                this.position.shift();
                score.value += 1;
                SCORE.play();

                //Sound of me (for the good player)
                if (score.value == 10) {
                    ADU.play();
                }
                if (score.value == 25) {
                    TROI.play();
                }

                score.best = Math.max(score.best, score.value);
                localStorage.setItem("best", score.best);
            }
        }

        //Move the tail of bird to left, bird if put this into the bird, its so difficult to repair so i decided to put this one here and it worked, not lucky man, its my talent
        bird.d -= this.dx;
    },

    reset : function() {
        this.position = []
    }
}

//Score
const score = {
    best : parseInt(localStorage.getItem("best")) || 0,
    value : 0,

    draw : function() {
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000";

        if (state.current == state.game) {
            ctx.lineWidth = 2;
            ctx.font = "35px Teko";
            ctx.fillText(this.value, cvs.width/2 - 5, 50);
            ctx.strokeText(this.value, cvs.width/2 - 5, 50);
        }else if (state.current == state.over) {
            ctx.font = "25px Teko";
            //Score value
            ctx.fillText(this.value, 225, 235);
            ctx.strokeText(this.value, 225, 235);
            //Score best
            ctx.fillText(this.best, 225, 277);
            ctx.strokeText(this.best, 225, 277);
        }
    },

    reset : function() {
        this.value = 0
    }
}

//Draw
function draw() {
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, cvs.width, cvs.height);

    bg.draw();
    pipes.draw();
    fg.draw();
    bird.draw();
    getReady.draw();
    gameOver.draw();
    score.draw();
}

//Update
function update() {
    bird.update();
    fg.update();
    pipes.update();
}

//Loop
function loop() {
    update();
    draw();

    frames++;

    requestAnimationFrame(loop);
}
loop();