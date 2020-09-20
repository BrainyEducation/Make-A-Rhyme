class PreloadScene extends Phaser.Scene {
    constructor() {
        super({key : 'preloadScene'});
    }

    preload() {
        this.load.json('poemData', './assets/data/poem_data.json');
        this.load.json('wordsData', './assets/data/words_data.json');
        this.load.image('play', './assets/images/other/play.png');
        this.load.audio('play', './assets/audio/other/play.mp3');

        this.load.plugin('rexgrayscalepipelineplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexgrayscalepipelineplugin.min.js', true);

        if (!localStorage.getItem("masteredWords")) {
            localStorage.setItem("masteredWords", JSON.stringify({}));
        }
    }

    create() {

        this.plugins.get('rexgrayscalepipelineplugin').add(this, "GrayScale", {

            intensity: 1
        });

        this.cameras.main.setRoundPixels(true);

        var titleStyle = {
            fontFamily: 'Comic Sans MS, cursive, sans-serif',
            fontSize: '15em',
            color: 0xecf8f9,
            stroke: 0x717676,
            strokeThickness: 3
        };
        var titleText = this.add.text(this.cameras.main.width/2, 100, "Make A Rhyme", titleStyle);
        titleText.setOrigin(0.5, 0.5);
        titleText.setColor("#ecf8f9");

        var playButton = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'play');
        playButton.displayWidth = this.cameras.main.width / 3;
        playButton.scaleY = playButton.scaleX;
        let origiScale = playButton.scaleX;
        playButton.setOrigin(0.5, 0.5);
        playButton.setInteractive();
        var playButtonAudio = this.sound.add('play');

        playButton
            .on('pointerover', function () {
                this.scene.game.sound.stopAll();
                playButton.setScale(playButton.scaleX * 1.1, playButton.scaleY * 1.1);
                playButtonAudio.play();
            })
            .on('pointerout', function () {
                playButton.setScale(origiScale, origiScale);
            })
            .on('pointerdown', function () {
                this.scene.start("sidebarScene");
                this.scene.start("menuScene");
            }, this);
    }
}

export default PreloadScene;