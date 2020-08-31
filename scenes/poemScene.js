class PoemScene extends Phaser.Scene {

    constructor() {
        super({key : 'poemScene'});
        this.wordSpots = {};
        this.poemLocation = 0;
    }

    init(data){
        this.poemName = data.poemName;
    }

    preload() {
        var poemJsonData = this.game.cache.json.get('poemData');
        var poemData = poemJsonData["poems"][this.poemName];
        var i;
        for (i = 1; i <= poemData['text'].length; i++) {
            this.load.audio(i, "assets/audio/" + this.poemName + "/" + i + ".mp3");
        }
    }

    addWordPlaceholders(words, container) {
        let wordPlaceholderWidth = 0.1 * container.displayWidth;
        let wordPlaceholderHeight = 0.15 * container.displayHeight;
        words.forEach(word => this.addWordPlaceholder(word, container, wordPlaceholderWidth, wordPlaceholderHeight));
    }

    addWordPlaceholder(word, container, width, height) {

        // Make word placeholder calculations
        let rectX = (word['x'] - 0.5) * container.displayWidth;
        let rectY = (word['y'] - 0.5) * container.displayHeight;

        // Create word placeholder and add to container
        var rect = this.add.rectangle(rectX, rectY, width, height);
        rect.setFillStyle(0xd3d3d3, 0.5);
        rect.setStrokeStyle(2, 0x000000, 0.5);
        rect.setOrigin(0, 0);
        container.add(rect);

        // Save for easy access
        this.wordSpots[word['spot-id']] = rect;
    }

    typewritePoemText(text) {
        this.poemTextElement.setText('')

        let i = 0
        this.time.addEvent({
            callback: () => {
                this.poemTextElement.text += text[i]
                ++i
            },
            repeat: text.length - 1,
            delay: 75
        })
    }

    playPoem(poemText) {
        this.typewritePoemText(poemText[this.poemLocation]);
        this.sound.play(this.poemLocation + 1);
        this.poemLocation += 1;
    }

    create() {
        console.log(this.poemName);

        // Poem background
        var poemImg = this.add.sprite(0, 0, this.poemName);
        poemImg.setOrigin(0.5, 0.5);
        poemImg.displayWidth = this.cameras.main.width * 0.70;
        poemImg.scaleY = poemImg.scaleX;

        //  Poem container
        var container = this.add.container(this.cameras.main.centerX, this.cameras.main.centerY);
        container.setSize(poemImg.displayWidth, poemImg.displayHeight);
        container.add(poemImg);

        // Poem text
        let textX = this.cameras.main.centerX;
        let textY = this.cameras.main.height - 100;
        this.poemTextElement = this.add.text(textX, textY);
        this.poemTextElement.setOrigin(0.5, 0.5);

        this.poemTextElement.setFontFamily('Comic Sans MS, cursive, sans-serif');
        this.poemTextElement.setFontSize(25);
        this.poemTextElement.setAlign('center');
        this.poemTextElement.setColor('#000000');
        // poemTextElement.setBackgroundColor('#C2EAE9');
        this.poemTextElement.setPadding(10, 0, 10, 0);

        var poemJsonData = this.game.cache.json.get('poemData');
        var poemData = poemJsonData["poems"][this.poemName];
        this.addWordPlaceholders(poemData['words'], container);

        this.playPoem(poemData['text']);

    }
}
export default PoemScene;