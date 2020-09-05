class QuizScene extends Phaser.Scene {

    constructor() {
        super({key : 'quizScene'});
    }

    init(data){
        this.quizWord = data.quizWord;
    }

    preload() {
        this.wordsJsonData = this.game.cache.json.get('wordsData');
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
    }

    create() {
        // Quiz image
        var quizImg = this.add.sprite(this.cameras.main.centerX, 100, this.quizWord);
        quizImg.setOrigin(0.5, 0);
        quizImg.displayWidth = this.cameras.main.width * 0.25;
        quizImg.scaleY = quizImg.scaleX;

        this.rexUI.add.gridButtons({
            width: this.cameras.main.width / 2, height: 400,
            anchor: {centerX: "center", bottom: "bottom"},

            buttons: [
                [this.createButton("A"), this.createButton("B")],
                [this.createButton("C"), this.createButton("D")],

            ],
            space: {
                left: 10, right: 10, top: 20, bottom: 20,
                row: 20, column: 10
            }
        })
            .layout()
            .on('button.click', function (button, index, pointer, event) {
                console.log(`Click button-${button.text}`);
            })

    }

    createButton(text) {
        return this.rexUI.add.label({
            width: 40,
            height: 40,
            background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0xAAAAAA),
            text: this.add.text(0, 0, text, {
                fontSize: 18
            }),
            space: {
                left: 10,
                right: 10,
            },
            align: 'center'
        });
    }


}
export default QuizScene;