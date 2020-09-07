class QuizScene extends Phaser.Scene {

    constructor() {
        super({key : 'quizScene'});
    }

    init(data){
        this.quizWord = data.quizWord;

        this.correct = 0;
        this.incorrect = 0;
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

        var answerChoices = [];
        answerChoices.push(this.quizWord);

        var i;
        for (i = 0; i < 3; i++) {
            answerChoices.push(this.wordsJsonData[i + 1][i]);
        }

        this.rexUI.add.gridButtons({
            width: this.cameras.main.width / 2, height: 400,
            anchor: {centerX: "center", bottom: "bottom"},

            buttons: [
                [this.createButton(answerChoices[0]), this.createButton(answerChoices[1])],
                [this.createButton(answerChoices[2]), this.createButton(answerChoices[3])],

            ],
            space: {
                left: 10, right: 10, top: 20, bottom: 20,
                row: 20, column: 10
            }
        })
            .layout()
            .on('button.click', function (button, index, pointer, event) {
                console.log(button.text);
                let scene = button.scene;
                scene.checkAnswer(button.text);
            })

    }

    checkAnswer(answer) {
        if (answer == this.quizWord) {
            // Correct
            this.correct += 1;
            this.incorrect = 0;
        } else {
            // Wrong
            this.incorrect += 1;
            this.correct = 0;
        }

        if (this.correct == 3) {
            // Finish quiz
            console.log("Quiz Completed!");
            var masteredWords = JSON.parse(localStorage.getItem("masteredWords"));
            masteredWords[this.quizWord] = true;
            localStorage.setItem("masteredWords", JSON.stringify(masteredWords));
            this.scene.wake("poemScene");
            this.scene.stop("quizScene");
        } else if (this.incorrect >= 3) {
            // Play instruction
        } else {
            // continue
        }
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