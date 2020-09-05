class MenuScene extends Phaser.Scene {
    constructor() {
        super({key : 'menuScene'});
    }

    loadPoemAssets(poemJson) {
        var poemName = poemJson["name"].toLowerCase().split(" ").join("-");
        this.load.image(poemName, "assets/images/" + poemName + "/" + poemName + ".png");
        this.load.audio(poemName, "assets/audio/" + poemName + "/" + poemName + "-title.wav");
    }

    preload() {
        this.poemJsonData = this.game.cache.json.get('poemData');
        let poems = this.poemJsonData["poems"]
        Object.keys(poems).forEach(poemKey => this.loadPoemAssets(poems[poemKey]));
    }


    addPoem(poemJson, count) {
        var poemName = poemJson["name"].toLowerCase().split(" ").join("-");
        let poemImgWidth = this.cameras.main.width * .25;
        let poemImgPadding = (this.cameras.main.width - poemImgWidth * 3) / 4;
        var poemImg = this.add.image(poemImgPadding + (poemImgWidth + poemImgPadding) * count + poemImgWidth/2, 100, poemName);
        poemImg.displayWidth = poemImgWidth;
        poemImg.scaleY = poemImg.scaleX;
        let origiScale = poemImg.scaleX;
        poemImg.setOrigin(0.5, 0);
        poemImg.setInteractive();

        var poemAudio = this.sound.add(poemName);

        poemImg
            .on('pointerover', function () {
            this.scene.game.sound.stopAll();
            poemImg.setScale(poemImg.scaleX * 1.1, poemImg.scaleY * 1.1);
            poemAudio.play();
        }).on('pointerout', function () {
            poemImg.setScale(origiScale, origiScale);
        });

        poemImg.on('pointerdown', function () {
            this.scene.start("poemScene", {poemName: poemName});
        }, this);
    }

    create() {
        var titleStyle = {
            font: "50px Comic Sans MS",
            fontFamily: "cursive, sans-serif",
            color: "#ecf8f9",
        };
        var titleText = this.add.text(this.cameras.main.centerX, 50, "Rhymes", titleStyle);
        titleText.setOrigin(0.5, 0.5);
        titleText.setColor("#ecf8f9");

        var poems = this.poemJsonData["poems"];
        Object.keys(poems).forEach((poemKey, count) => this.addPoem(poems[poemKey], count));
    }


}

export default MenuScene;