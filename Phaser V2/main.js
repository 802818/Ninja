
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.audio('sfx:alert', 'assets/alert2.wav');
    game.load.audio('bgm:mm2Theme', 'assets/backgroundMusic.mp3');
    game.load.image('sky', 'assets/sky.png');
    game.load.image('city', 'assets/cityAllOn.png');
    game.load.image('ground', 'assets/Girder.png');
    game.load.image('girder', 'assets/GirderTile.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.image('box', 'assets/box.png');
    game.load.spritesheet('button', 'assets/Button (1).png', 63, 26);
    game.load.image('shuriken', 'assets/Shuriken.png');
    game.load.spritesheet('enemy', 'assets/baddie.png', 32, 32);
}

var player;
var platforms;
var cursors;
var objects;
var tick = 0;
var stars;
var score = 0;
var scoreText;
var gl= 80;
var movingPlat;
var mPlatTile;
var ground;
var negPos = 1;
var spacebar;
var mpy;
var jumpTick;
var enemy;
var direction;
var sTicks = 0;
var enemies;

var enemyHP = 100;

function create() {
    
    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'city');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();
    
    shurikens = game.add.group();
    shurikens.enableBody = true;
    shuriken = shurikens.create(-1000, -1000, 'shuriken');
    
    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;
    
    //platforms.friction = 100;
    girderTile = game.add.tileSprite(0,game.world.height-42, game.world.width, 42, 'girder');
    
    // Here we create the ground.
    ground = platforms.create(0, game.world.height - 42, 'ground');
    platforms.alpha = 0;
    
    Button = game.add.sprite(600, game.world.height - 59, 'button');
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(3, 1);
    

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;
    
    // Make box object
    objects = game.add.group();
    objects.enableBody = true;
     box = objects.create(140, game.world.height - 106, 'box');
    //box.body.velocity = 500;
    box.body.gravity.y = 300;
    box.body.drag.x = 500;
    box.collideWorldBounds - true;
    
    //  Now let's create two ledges
    var ledge = platforms.create(480, 350, 'ground');
    ledge.body.width = gl*5;
    //ledge.scale.setTo(2,1);
    game.add.tileSprite(480, 350, gl*5, 42, 'girder');
    ledge.body.immovable = true;
    
    var ledge2 = platforms.create(280, 350, 'ground');
    ledge2.body.width = gl*2;
    game.add.tileSprite(280, 350, gl*2, 42, 'girder');
    ledge2.body.immovable = true;
    
    movingPlat = platforms.create(0, 300, 'ground');
    mPlatTile = game.add.tileSprite(0, 300, gl*2, 42, 'girder');
    movingPlat.body.width = gl*2;
    movingPlat.body.immovable = true;

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);
    game.physics.arcade.enable(Button);
    
    // Make Enemy
    enemies = game.add.group();
    enemies.enableBody = true;
    var enemy = enemies.create(500, game.world.height - 75, 'enemy');
    enemy.health = 0;
    enemy.animations.add('left', [0,1], 6, true);
    enemy.animations.add('right', [3,2], 6, true);
    enemy = enemies.create(280, 320, 'enemy');
    enemy.health = 0;
    enemy.animations.add('left', [0,1], 6, true);
    enemy.animations.add('right', [3,2], 6, true);
    
    

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.1;
    player.body.gravity.y = 400;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    //  Finally some stars to collect
    stars = game.add.group();

    //  We will enable physics for any star that is created in this group
    stars.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 12; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = stars.create(i * 70, 0, 'star');

        //  Let gravity do its thing
        star.body.gravity.y = 300;
        
        //  This just gives each star a slightly random bounce value
        //star.body.bounce.y = 0.7 + Math.random() * 0.2;
        
    }

    //  The score
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
    spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    music = game.add.audio('bgm:mm2Theme');
    sound = game.add.audio('sfx:alert');    
    music.play();
    console.log("BTW the button currently does nothing.")
     
}

    

function update() {
    
    //  Collide the player and the stars with the platforms
    var hitPlatform = game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(platforms, objects);
    var hitObject = game.physics.arcade.collide(player, objects);
    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.overlap(player, enemies, hit, null, this);
    game.physics.arcade.overlap(Button, box, pressed, null, this);
    game.physics.arcade.overlap(Button, player, pressed, null, this);
    
    pressed(Button, player);
    tick++;
    mpy = movingPlat.y;
    mPlatTile.y = mpy;
    //movingPlat.move.x +=1;
    sTicks -=1;
    
    //Star Flicker
    if (tick % 10 == 0) { stars.alpha = 0;} 
    else if (tick % 10 == 1) { stars.alpha = 0;} 
    else if (tick % 10 == 2) { stars.alpha = 0;}    
    else if (tick % 10 == 3) {  stars.alpha = .5;} 
    else if (tick % 10 == 4) { stars.alpha = .5; } 
    else if (tick % 10 == 5) { stars.alpha = .5;}
    else if (tick % 10 == 6) { stars.alpha = .5; } 
    else if (tick % 10 == 7) {stars.alpha = 1;} 
    else if (tick % 10 == 8) { stars.alpha = 1; }
    else if (tick % 10 == 9) { stars.alpha = 1;}  
    else {stars.alpha = 1;} 
    
    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    game.physics.arcade.overlap(player, stars, collectStar, null, this);
    game.physics.arcade.overlap(player, objects, pushStuff, null, this);
    
    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;
    player.body.gravity.y = 100;
    
    if (cursors.left.isDown) {
        //  Move to the left
        player.body.velocity.x = -175;
        player.animations.play('left');
        direction = 1;
    }
    else if (cursors.right.isDown) {
        //  Move to the right
        player.body.velocity.x = 175;
        player.animations.play('right');
        direction = 2;
    } 
    else {
        //  Stand still
        player.animations.stop();
        if (direction == 1) {
            player.frame = 2;
        }
        else if(direction == 2) {
          player.frame = 5;  
        }
        else {
            player.frame = 4;
        }
    }
    
    //ATTACKK
    if (spacebar.isDown) {
        if (sTicks <= 0) {
            sTicks = 30;
            let shuriken = shurikens.create(player.x+5,player.y+20, 'shuriken');
            if (direction == 1) {
                shuriken.body.velocity.x = -300;  
            }
            else if (direction == 2) {
                shuriken.body.velocity.x = 300;
            }
                //p2AT = 15;
        }
    }
    
    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down && (hitPlatform|| hitObject)) {
        sound.play();
        player.body.velocity.y = -250;
        jumpTick = 0;
    }
    if (hitPlatform == false) {
        jumpTick++;
    }
    if (jumpTick >= 20) {
        player.body.gravity.y = 1000;
        //player.body.velocity.y = 200;
    }

    //Enemy 
    enemies.forEach(enemy => { 
        if (tick % 300 <= 150) {
            enemy.body.velocity.x = -75; 
            enemy.animations.play('left');
        }
        else {
            enemy.body.velocity.x = 75;
            enemy.animations.play('right');
        }
    });

    
    
}

function pushStuff (player, objects) {
    
}

function hit (player, enemy) {
    if (player.body.velocity.y > 1) {
        enemy.tint = Phaser.Color.interpolateColor(0xffffff, 0xff0000, 3, enemy.health, 255);
        enemy.health ++;
    } 
    else {
        //player.kill();
    }
    
}

function pressed (Button, player) {
    var press = false;

    if ((press == false && game.physics.arcade.overlap(Button, player))||(press == false && game.physics.arcade.overlap(Button, box))) {
    Button.frame = 1;
    console.log("hiiiiiii");
        if (movingPlat.y >= (game.world.height - 84)){
            negPos = -.5;
        }
        else if (movingPlat.y <= 325){
            negPos = .5;
            
        }
        console.log(movingPlat.y);
        movingPlat.y += negPos;
        press = true;    
    }
}
    
    

function collectStar (player, star) {
    
    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;

}