var game;
var player;
var platforms;
var bitcoins;
var poisons;
var cursors;
var jumpButton;
var scoreText;
var livesText;
var finalMessage;
var won = false;
var gameOver = false;
var currentScore = 0;
var lives = 3;
var winningScore = 100;

function createPlatforms() {
    platforms = game.add.physicsGroup();
    platforms.create(930, 350, 'platform');
    platforms.create(700, 450, 'platform');
    platforms.create(300, 450, 'platform');
    platforms.create(500, 350, 'platform');
    platforms.create(970, 80, 'platform');
    platforms.create(460, 535, 'platform1'); //2nd ground platform
    platforms.create(50, 540, 'platform1');  //1nd ground platform
    platforms.create(820, 500, 'platform1'); //3rd ground platform
    platforms.create(765, 200, 'platform2'); //1st cloud on the right
    platforms.create(440, 120, 'platform2'); //middle cloud
    platforms.create(140, 110, 'platform2'); //1st cloud on the left
    platforms.create(0, 260, 'platform2');   //tree branch on the left
    
    platforms.setAll('body.immovable', true);
}

function createBitcoins() {
    bitcoins = game.add.physicsGroup();
    bitcoinCreate(930, 280, 'bitcoin');
    bitcoinCreate(700, 380, 'bitcoin');
    bitcoinCreate(300, 380, 'bitcoin');
    bitcoinCreate(500, 280, 'bitcoin');
    bitcoinCreate(970, 10, 'bitcoin');
    bitcoinCreate(50, 350, 'bitcoin');
    bitcoinCreate(320, 10, 'bitcoin');
    bitcoinCreate(5, 180, 'bitcoin');
    bitcoinCreate(230, 140, 'bitcoin');
    bitcoinCreate(610, 140, 'bitcoin');
}

function createPoisons() {
    poisons = game.add.physicsGroup();

    poisonCreate(675, 275, 'poison');
    poisonCreate(450, 375, 'poison');
    poisonCreate(375, 475, 'poison');
    poisonCreate(575, 185, 'poison');
    poisonCreate(170, 190, 'poison');
    poisonCreate(700, 10, 'poison');

}

function bitcoinCreate(left, top, bitcoinImage) {
    var bitcoin = bitcoins.create(left, top, bitcoinImage);
    bitcoin.animations.add('spin');
    bitcoin.animations.play('spin', 8, true);
}

function poisonCreate(left, top, poisonImage) {
    var poison = poisons.create(left, top, poisonImage);
    poison.animations.add('bubble');
    poison.animations.play('bubble', 8, true);
}

function bitcoinCollect(player, bitcoin) {
    bitcoin.kill();
    currentScore = currentScore + 10;
    if (currentScore === winningScore) {
        won = true;
    }
}

function poisonCollect(player, poison) {
    poison.kill();
    lives = lives - 1;
    if (lives === 0) {
        player.kill();
        gameOver = true;
    }
}

window.onload = function () {

    game = new Phaser.Game(1050, 600, Phaser.AUTO, '', { 
        preload: preload, 
        create: create, 
        update: update, 
        render: render 
    });

    function preload() {

        //Load images
        game.load.image("background", "hills.png");
        game.load.image('platform', 'platform.png');
        game.load.image('platform1', 'platform_1.png');
        game.load.image('platform2', 'platform_2.png');

        //Load spritesheets
        game.load.spritesheet('player', 'fluffy.png', 48, 62);
        game.load.spritesheet('bitcoin', 'bitcoin.png', 36, 44);
        game.load.spritesheet('poison', 'poison.png', 32, 32);
    }

    function create() {

        background = game.add.tileSprite(0, 0, 1050, 600, "background");

        player = game.add.sprite(150, 600, 'player');
        player.animations.add('walk');
        player.anchor.setTo(0.5, 1);

        game.physics.arcade.enable(player);

        player.body.collideWorldBounds = true;
        player.body.gravity.y = 500;

        createBitcoins();
        createPoisons();
        createPlatforms();

        cursors = game.input.keyboard.createCursorKeys();
        jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        scoreText = game.add.text(16, 16, "SCORE: " + currentScore, { font: "24px Roboto", fill: "white" });
        livesText = game.add.text(750, 16, "LIVES: " + lives, { font: "24px Roboto", fill: "white" });

        finalMessage = game.add.text(game.world.centerX, 350, "", { font: "75px Roboto", fill: "red" });
        finalMessage.anchor.setTo(0.5, 1);
    }

    function update() {
        scoreText.text = "SCORE: " + currentScore;
        livesText.text = "LIVES: " + lives;

        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.overlap(player, bitcoins, bitcoinCollect);
        game.physics.arcade.overlap(player, poisons, poisonCollect);

        player.body.velocity.x = 0;

        if (cursors.left.isDown) {
            player.animations.play('walk', 10, true);
            player.body.velocity.x = -350;
            player.scale.x = - 1;
        }
        else if (cursors.right.isDown) {
            player.animations.play('walk', 10, true);
            player.body.velocity.x = 350;
            player.scale.x = 1;
        }
        else {
            player.animations.stop();
        }

        if (jumpButton.isDown && (player.body.onFloor() || player.body.touching.down)) {
            player.body.velocity.y = -400;
        }
        if (won) {
            finalMessage.text = "YOU WON 100 \n BITCOINS !!!";
        }
        if (gameOver) {
            finalMessage.text = "GAME OVER!!!";
        }

    }

    function render() {

    }

};

//Creator Dorina Mihai
