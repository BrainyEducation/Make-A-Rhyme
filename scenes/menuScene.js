class MenuScene extends Phaser.Scene {
    constructor() {
        super({
            key : 'menuScene'
        });
    }

    loadPoemAssets(poemJson) {
        var poemName = poemJson["name"].toLowerCase().split(" ").join("-");
        this.load.image(poemName, "assets/images/" + poemName + "/" + poemName + ".png");
        this.load.audio(poemName, "assets/audio/" + poemName + "/" + poemName + "-title.wav");
    }

    preload() {
        this.poemJsonData = this.game.cache.json.get('poemData');
        let poems = this.poemJsonData["poems"];
        Object.keys(poems).forEach(poemKey => this.loadPoemAssets(poems[poemKey]));
    }

    addPoem(poemJson, count) {
        var poemName = poemJson["name"].toLowerCase().split(" ").join("-");
        let poemImgWidth = this.cameras.main.width * .25;
        let poemImgPadding = (this.cameras.main.width - poemImgWidth * 3) / 4;
        let poemX = poemImgPadding + (poemImgWidth + poemImgPadding) * count + poemImgWidth/2;
        let poemY = 120;

        var poemImg = this.add.sprite(poemX, poemY, poemName);
        poemImg.displayWidth = poemImgWidth;
        poemImg.scaleY = poemImg.scaleX;
        let origiScale = poemImg.scaleX;
        poemImg.setOrigin(0.5, 0);
        poemImg.setInteractive();

        // Make rounded corner mask for poem image
        var shape = this.make.graphics();
        shape.fillStyle(0xffffff);
        shape.beginPath();
        shape.fillRoundedRect(poemX - poemImg.displayWidth / 2, poemY, poemImg.displayWidth, poemImg.displayHeight, 50);
        var mask = shape.createGeometryMask();

        poemImg.setMask(mask);

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
        this.updateSidebar();
        this.events.on('wake', function () {this.updateSidebar()}, this);

        let sidebarSize = 100;
        this.cameras.main.setViewport(sidebarSize, 0, this.cameras.main.width - sidebarSize, this.cameras.main.height);
        this.cameras.main.setRoundPixels(true);

        var titleStyle = {
            fontFamily: 'Comic Sans MS, cursive, sans-serif',
            fontSize: 80,
            color: 0xecf8f9,
            stroke: 0x717676,
            strokeThickness: 3
        };
        var titleText = this.add.text(this.cameras.main.width/2, 50, "Rhymes", titleStyle);
        titleText.setOrigin(0.5, 0.5);
        titleText.setColor("#ecf8f9");

        var poems = this.poemJsonData["poems"];
        Object.keys(poems).forEach((poemKey, count) => this.addPoem(poems[poemKey], count));
    }

    updateSidebar() {
        let answerGridButtons = this.scene.get('sidebarScene').answerGridButtons;
        answerGridButtons.hideButton(0);
        answerGridButtons.hideButton(1);
        answerGridButtons.showButton(2);
        answerGridButtons.showButton(3);
        answerGridButtons.layout();
    }

}

export default MenuScene;