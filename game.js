//Select canvas
const cvs = document.getElementById("main");
const ctx = cvs.getContext("2d");
const but = document.getElementById("button");
const butCtx = but.getContext("2d");

//Game vars and const
let frames = 0;
const DEGREE = Math.PI/180;

//Load sprite image
const sprite = new Image();
sprite.src = "image/sprite.png";
const chicArt = new Image();
chicArt.src = "image/chicken.png";
const star = new Image();
star.src = "image/star.png"
const circle = new Image();
circle.src = "image/circle.png";
const staff = new Image();
staff.src = "image/staff.png";

//Load sounds
const SCORE = new Audio();
SCORE.src = "audio/point.wav";
const FLAP = new Audio();
FLAP.src = "audio/wing.wav";
const HIT = new Audio();
HIT.src = "audio/hit.wav";
const SWOOSHING = new Audio();
SWOOSHING.src = "audio/swooshing.wav";
const DASH = new Audio();
DASH.src = "audio/end.wav";
const CHICKEN = new Audio();
CHICKEN.src = "audio/chicken.m4a"
const SHOOT = new Audio();
SHOOT.src = "audio/shoot.m4a"
const SKILL = new Audio();
SKILL.src = "audio/flash.m4a"

//Game state
const state = {
    current : 0,
    getReady : 0,
    game : 1,
    over : 2,
    paradise : 3
}

//Start button
const startButton = {
    x : 183,
    y : 310,
    w : 83,
    h : 29
}

//Controll the game (PC)
document.addEventListener("click", function(evt) {
    let rect1 = cvs.getBoundingClientRect();
    let clickX = evt.clientX - rect1.left;
    let clickY = evt.clientY - rect1.top;

    switch (state.current) {
        case state.getReady:
            if (clickX >= 0 && clickX <= cvs.width && clickY >= 0 && clickY <= cvs.height) {
                state.current = state.game;
                SWOOSHING.play();
                break;
            }
        case state.game:
            if (clickX >= 0 && clickX <= cvs.width && clickY >= 0 && clickY <= cvs.height) {
                bird.flap();
                FLAP.play();
                break;
            }
        case state.over:
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
document.addEventListener("keypress", (event) => {
    var key = event.code;

    //Press D for dash
    if (key == "KeyD" && state.current == state.game) {
            bird.dash();
            pipes.cut();
            DASH.play();
    }

    //Press S to shoot
    if (key == "KeyS" && state.current == state.game) {
            bird.shoot();
    }

    //Press Q for flash skill
    if (key == "KeyQ" && state.current == state.game) {
        score.jump();
    }

    //Press W for boom skill
    if (key == "KeyW" && state.current == state.game) {
        score.boom();
    }

    //Press E for shield skill
    if (key == "KeyE" && state.current == state.game) {
        score.shield();
    }

    //Press F to stop
    if (key == "KeyF") {
        if (state.current == state.game) {
            state.current = state.paradise
        }else if (state.current == state.paradise) {
            stop.cardinal = 1;
        }
    }
}, false)

//Controll the game (phone)
document.addEventListener("click", function(evt) {
    let rect2 = but.getBoundingClientRect();
    let pressX = evt.clientX - rect2.left;
    let pressY = evt.clientY - rect2.top;

    switch (state.current) {
        case state.getReady:
            if (pressX >= 0 && pressX <= button.w2 && pressY >= button.y + 80 && pressY <= but.height) {
                state.current = state.game;
                SWOOSHING.play();
                break;
            }
        case state.game:
            if (pressX >= 0 && pressX <= button.w2 && pressY >= button.y + 80 && pressY <= but.height) {
                bird.flap();
                FLAP.play();
                break;
            }else if (pressX >= button.w2 && pressX <= but.width && pressY >= button.y + 80 && pressY <= button.y + 160) {
                bird.dash();
                pipes.cut();
                DASH.play();
                break;
            }else if (pressX >= button.w2 && pressX <= but.width && pressY >= button.y + 160 && pressY <= but.height) {
                bird.shoot();
                break;
            }else if (pressX >= button.w1 && pressX <= button.w1 * 2 && pressY >= button.y && pressY <= button.y + 80) {
                score.jump();
                break;
            }else if (pressX >= button.w1 * 2 && pressX <= button.w1 * 3 && pressY >= button.y && pressY <= button.y + 80) {
                score.boom();
                break;
            }else if (pressX >= button.w1 * 3 && pressX <= but.width && pressY >= button.y && pressY <= button.y + 80) {
                score.shield();
                break;
            }else if (pressX >= 0 && pressX <= button.w1 && pressY >= button.y && pressY <= button.y + 80) {
                state.current = state.paradise;
                break;
            }
        case state.over:
            if (pressX >= 0 && pressX <= button.w2 && pressY >= button.y + 80 && pressY <= but.height) {
                pipes.reset();
                bird.speedReset();
                score.reset();
                state.current = state.getReady;
                break;
            }
        case state.paradise:
            if (pressX >= 0 && pressX <= button.w1 && pressY >= button.y && pressY <= button.y + 80) {
                stop.cardinal = 1;
                break;
            }
        }
})

//Delay between paradise
const stop = {
    cardinal : 0,
    count : 0,
    w : 60,
    h : 15,

    draw : function() {
        if (this.count > 0 && state.current == state.paradise) {
            ctx.fillStyle = "#0000ff";
            ctx.fillRect(bird.x - 30, bird.y - 60, this.w - this.count, this.h);
        }
    },

    update : function() {
        this.count += this.cardinal
        if (this.count == 60) {
            state.current = state.game;
            this.count = 0;
            this.cardinal = 0;
        }
    }
}

//Button for phone
const button = {
    x : 0,
    y : 0,
    w1 : but.width/4,
    w2 : but.width/2,
    h : 80,

    draw : function() {
        if (type == "b" || type == "B") {
            //Dash button
            butCtx.fillStyle = "#ffff00";
            butCtx.fillRect(this.w2, this.y + 80, this.w2, this.h);
            butCtx.fillStyle = "#000000";
            butCtx.strokeRect(this.w2, this.y + 80, this.w2, this.h);

            //Shoot buuton
            butCtx.fillStyle = "#008000";
            butCtx.fillRect(this.w2, this.y + 160, this.w2, this.h);
            butCtx.fillStyle = "#000000";
            butCtx.strokeRect(this.w2, this.y + 160, this.w2, this.h);

            //Flap button
            butCtx.fillStyle = "#70c5ce";
            butCtx.fillRect(0, this.y + 80, this.w2, this.h * 2);
            butCtx.fillStyle = "#000000";
            butCtx.strokeRect(0, this.y + 80, this.w2, this.h * 2);

            //Pause button
            butCtx.fillStyle = "#808080";
            butCtx.fillRect(0, this.y, this.w1, this.h);
            butCtx.fillStyle = "#000000";
            butCtx.strokeRect(0, this.y, this.w1, this.h);

            //Q skill button
            butCtx.fillStyle = "#ff4500";
            butCtx.fillRect(this.w1, this.y, this.w1, this.h);
            butCtx.fillStyle = "#000000";
            butCtx.strokeRect(this.w1, this.y, this.w1, this.h);

            //W skill button
            butCtx.fillStyle = "#ff4500";
            butCtx.fillRect(this.w1 * 2, this.y, this.w1, this.h);
            butCtx.fillStyle = "#000000";
            butCtx.strokeRect(this.w1 * 2, this.y, this.w1, this.h);

            //E skill button
            butCtx.fillStyle = "#ff0000";
            butCtx.fillRect(this.w1 * 3, this.y, this.w1, this.h);
            butCtx.fillStyle = "#000000";
            butCtx.strokeRect(this.w1 * 3, this.y, this.w1, this.h);
        }
    }
}

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
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w*2, this.y, this.w, this.h);
    },

    update : function() {
        //Move foreground to left
        if (state.current == state.game) {
            this.x = (this.x - this.dx)%(this.w/2);
        }
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

//Bird
const bird = {
    animation : [
        {sX : 276, sY : 112},
        {sX : 276, sY : 139},
        {sX : 276, sY : 164},
        {sX : 276, sY : 139},
    ],
    x : 160,
    y : 150,
    w : 34,
    h : 26,

    radius : 12,

    frame : 0,

    speed : 0,
    gravity : 0.25,
    jump : 4,
    rotation : 0,

    tail : [],
    dashGap : 70,
    dx : 2,

    bullet : [],
    bulletSpeed : 30,

    protect : 0,

    draw : function() {
        let bird = this.animation[this.frame];

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(sprite, bird.sX, bird.sY, this.w, this.h, - this.w/2, - this.h/2, this.w, this.h);
        ctx.restore();
        
        //Draw tail
        for (let i = 0; i < this.tail.length; i++) {
            if (state.current !== state.game) return;
            let t = this.tail[i];

            let tailX = t.tX;
            let tailY = t.tY;
            ctx.fillStyle = "#ffff00";
            ctx.fillRect(tailX, tailY, this.dashGap, 4);
        }

        //Draw bullet
        for (let i = 0; i < this.bullet.length; i++) {
            if (state.current !== state.game) return;
            let b = this.bullet[i];

            let bulletX = b.bX;
            let bulletY = b.bY;
            ctx.fillStyle = "#008000";
            ctx.fillRect(bulletX, bulletY, 8, 4);
        }

        //Draw shield
        if (this.protect > 0) {
            for (let i = 0; i < this.protect; i++) {
                ctx.drawImage(circle, 0, 0, 2000, 2000, this.x - 25 - i*10, this.y - 25 - i*10, 50 + 2*i*10, 50 + 2*i*10)
            }
        }

        //Draw jump tail
        ctx.fillStyle = "#ff4500";
        ctx.fillRect(this.jX, this.jY, 200, 4);
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
        }else if (state.current !== state.paradise) {
            this.speed += this.gravity;
            this.y += this.speed;
            //Foreground touch
            if (this.y + this.h/2 >= cvs.height - fg.h) {
                this.y = cvs.height - fg.h - this.h/2;
                if (state.current == state.game) {
                    if (this.protect > 0) {
                        this.protect -= 1;
                        this.y = 135;
                        this.speed = 0;
                    }else {
                        state.current = state.over;
                        HIT.play();
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

        //Canvas top max
        if (this.y - this.h/2 <= 0) {
            this.y = this.h/2;
            this.speed = 0;
        }

        //Tail move to the left
        for (let i = 0; i < this.tail.length; i++) {
            if (state.current !== state.game) return;
            let t = this.tail[i];

            t.tX -= this.dx;

            //Shift the tail when it go beyone the canvas
            if (t.tX + this.dashGap <= 0) {
                this.tail.shift();
            }
        }
        
        //Bullet move fast to the right
        if (frames%5==0) {
            for (let i = 0; i < this.bullet.length; i++) {
                if (state.current !== state.game) return;
                let b = this.bullet[i];

                //Move the bullet very fast to the right
                b.bX += this.bulletSpeed;
            }
        }

        //Control the bullet
        for (let i = 0; i < this.bullet.length; i++) {
            if (state.current !== state.game) return;
            let b = this.bullet[i];

            //Shift the bullet when it touches the pipes
            for (let j = 0; j < pipes.position.length; j++) {
                let p = pipes.position[j];

                //Bullet touches top pipe
                if (b.bX + 8 >= p.x && b.bX <= p.x + pipes.w && b.bY <= p.y + pipes.h) {
                    this.bullet.shift();
                }

                //Bullet touches bottom pipe
                if (b.bX + 8 >= p.x && b.bX <= p.x + pipes.w && b.bY >= p.y + pipes.h + pipes.gap) {
                    this.bullet.shift();
                }

                //Bullet touches the chicken
                if (p.z > 0.7 && b.bX + 8 >= p.x && b.bX <= p.x + pipes.w && b.bY > p.y + pipes.h && b.bY < p.y + pipes.h + pipes.gap) {
                    p.z = 0;
                    CHICKEN.play();
                    this.bullet.shift();

                    score.value += 2;
                    score.num += 2;

                    if (score.bestScore < score.value) {
                        score.bestScore = score.value;
                        localStorage.setItem("bestScore", score.bestScore);
                        score.check += 1;
                    }
                }
            }
        }

        //Move jump tail to the left
        if (state.current == state.game) {
            this.jX -= this.dx;
        }
    },

    dash : function() {
        //Increase the tail
        this.tail.push({
            tX : this.x - this.w/2 - 70,
            tY : this.y - 2,
        });

        for (let i = 0; i < this.tail.length - 1; i++) {
            if (state.current !== state.game) return;
            let t = this.tail[i];

            //Move the tail to the left when dash make it really
            t.tX = t.tX - this.dashGap;
        }
    },

    shoot : function() {
        //Add bullet
        this.bullet.push({
            bX : this.x + this.w/2,
            bY : this.y - 2,
        });
        SHOOT.play();
    },

    speedReset : function() {
        this.speed = 0;
        this.d = -70;
        this.tail = [];
        this.bullet = [];
        this.protect = 0;
        this.jX = -200;
    },
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
    gap : 70,
    maxYPos : -150,
    dx : 2,
    dash : 70,
    
    chiW : 652,
    chiH : 779,

    jX : -200,
    jY : 0,

    draw : function() {
        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];

            let topYPos = p.y;
            let midYPos = p.y + this.h;
            let bottomYPos = p.y + this.h + this.gap;

            if (p.z <= 0.7) {
                //Top pipes
                ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x, topYPos, this.w, this.h);

                //Bottom pipes
                ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x, bottomYPos, this.w, this.h);
            }else {
                //Top pipes
                ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x, topYPos, this.w, this.h);

                //Add challenger
                ctx.drawImage(chicArt,  0, 0, this.chiW, this.chiH, p.x, midYPos, this.w, this.gap)

                //Bottom pipes
                ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x, bottomYPos, this.w, this.h);
            }
        }
    },

    update : function() {
        if (state.current !== state.game) return;

        //Add pipes per 100 frames
        if (frames%140 == 0) {
            this.position.push({
                x : cvs.width,
                y : this.maxYPos * (Math.random() + 1),
                z : Math.random()
            })
        };
        
        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];
            
            //Move pipes to left
            p.x -= this.dx;

            let bottomPipesYPos = p.y + this.h + this.gap;
            
            //Mid pipes touch
            if (p.z > 0.7 && bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w) {
                if (bird.protect > 0) {
                    bird.protect -= 1;
                    for (let j = 0; j < this.position.length; j++) {
                        let p = pipes.position[j];
                        p.x -= 100;
                    }
                }else {
                    state.current = state.over;
                    HIT.play();
                }
            }else {
                //Top pipes touch
                if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y - bird.radius < p.y + this.h) {
                    if (bird.protect > 0) {
                        bird.protect -= 1;
                        for (let j = 0; j < this.position.length; j++) {
                            let p = pipes.position[j];
                            p.x -= 100;
                        }
                    }else {
                        state.current = state.over;
                        HIT.play();
                    }
                }

                //Bottom pipes touch
                if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > bottomPipesYPos) {
                    if (bird.protect > 0) {
                        bird.protect -= 1;
                        for (let j = 0; j < this.position.length; j++) {
                            let p = pipes.position[j];
                            p.x -= 100;
                        }
                    }else {
                        state.current = state.over;
                        HIT.play();
                    }
                }
            }

            if (p.x + this.w <= 0) {
                if (p.z <= 0.7) {
                    score.num += 1;
                    score.value += 1;
                }else {
                    score.value += 3;
                    score.num += 3;
                }
                this.position.shift();
                SCORE.play();

                if (score.bestScore < score.value) {
                    score.bestScore = score.value;
                    localStorage.setItem("bestScore", score.bestScore);
                    score.check += 1;
                }
            }
        }
    },

    cut : function() {
        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];
            //Move the pipes to the left
            p.x -= this.dash;
            DASH.play();
        }
    },

    reset : function() {
        this.position = []
    }
}

//Score
const score = {
    bestScore : localStorage.getItem("bestScore") || 0,
    pro : localStorage.getItem("pro") || 0,
    check : 0,
    value : 0,
    num : 0,
    skill : 0,
    flash : 200,
    Wcount : 0,
    Wcardinal : 0,

    draw : function() {
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000";

        //Draw the score in game, after game and the best score
        if (state.current == state.game) {
            ctx.lineWidth = 2;
            ctx.font = "35px Teko";
            ctx.fillText(this.value, cvs.width - 50, 50);
            ctx.strokeText(this.value, cvs.width - 50, 50);
        }else if (state.current == state.over) {
            ctx.font = "25px Teko";
            //Score value
            ctx.fillText(this.value, 265, 235);
            ctx.strokeText(this.value, 265, 235);
            //Score best
            ctx.fillText(this.bestScore, 265, 277);
            ctx.strokeText(this.bestScore, 265, 277);
        }

        //Draw best player
        ctx.font = "20px Teko";
        //Score best player
        ctx.fillText(this.pro, 30, 30);
        ctx.strokeText(this.pro, 30, 30);
        //Score best
        ctx.fillText(this.bestScore, 30, 50);
        ctx.strokeText(this.bestScore, 30, 50);

        //Draw the skill you have after 5 score
        for (let i=0; i < this.skill; i++) {
            ctx.drawImage(star, 0, 0, 2400, 2400, 30 + i*50, cvs.height - 30 - 50, 50, 50)
        }

        //Save the one who break the record
        if (this.check > 0 && state.current == state.over) {
            this.pro = prompt("Master, please tell me your name?");
            localStorage.setItem("pro", this.pro);
            this.check = 0;
        }

        //Draw the staff
        if (this.Wcardinal > 0) {
            ctx.save();
            ctx.translate(bird.x, bird.y);
            ctx.rotate(this.Wcount * DEGREE);
            ctx.drawImage(staff, 0, 0, 512, 512, - bird.w/2 - 15, - bird.h/2 - 15, bird.w + 30, bird.h + 30);
            ctx.restore();
        }
    },

    update : function() {
        //Each 5 points, get 1 star
        if (this.num >= 5) {
            this.skill +=1;
            this.num -= 5;
        };

        //Wcount up like pause
        if (state.current == state.game) {
            this.Wcount += this.Wcardinal;
        }

        //Delete all the pipes
        if (this.Wcount == 90) {
            for (let i = 0; i < pipes.position.length; i++) {
                let p = pipes.position[i];

                if (p.z > 0.7) {
                    this.value += 3;
                }else {
                    this.value += 1;
                }

                if (score.bestScore < score.value) {
                    score.bestScore = score.value;
                    localStorage.setItem("bestScore", score.bestScore);
                    score.check += 1;
                }
            }
            pipes.position = [];
            this.Wcount = 0;
            this.Wcardinal = 0;
            SKILL.play();
        }
    },

    jump : function() {
        if (this.skill > 0) {
            for (let i = 0; i < pipes.position.length; i++) {
                let p = pipes.position[i];
                //Move the pipes very long to the left (flash)
                p.x -= this.flash;
                this.skill -= 1;
                SKILL.play();
            };

            //Add jump tail
            bird.jX = bird.x - bird.w/2 - 200;
            bird.jY = bird.y - 2;
        }
    },

    boom : function() {
        if (this.skill > 0) {
            this.skill -= 1;
            this.Wcardinal = 3;
        }
    },

    shield : function() {
        if (this.skill > 1) {
            //Gain a shield protect the bird
            bird.protect += 1;
            this.skill -= 2;
            SKILL.play();
        }
    },

    reset : function() {
        this.value = 0;
        this.num = 0;
        this.skill = 0;
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
    score.draw();
    stop.draw();
    button.draw();
    gameOver.draw();

    ctx.fillStyle = "#000000";
    ctx.strokeRect(0, 0, cvs.width, cvs.height);
}

//Update
function update() {
    bird.update();
    fg.update();
    pipes.update();
    score.update();
    stop.update();
}

//Loop
function loop() {
    update();
    draw();

    if (state.current !== state.paradise) {
        frames++
    }

    requestAnimationFrame(loop);
}
loop();