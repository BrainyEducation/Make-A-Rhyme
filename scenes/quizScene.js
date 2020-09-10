class QuizScene extends Phaser.Scene {

    constructor() {
        super({key : 'quizScene'});
    }

    init(data){
        this.quizWord = data.quizWord;
        this.answerChoices = [];
        this.correct = 0;
        this.maxCorrect = 0;
        this.incorrect = 0;
    }

    preload() {
        this.wordsJsonData = this.game.cache.json.get('wordsData');
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });

        // Load star images
        this.load.image("empty-star", "assets/images/other/stars/empty-star.png");
        this.load.image("gold-star", "assets/images/other/stars/gold-star.png");
        this.load.image('silver-star', "assets/images/other/stars/silver-star.png");

        // Load quiz audio
        this.load.audio("quiz-instructions", "assets/audio/instructions/quiz-instructions.mp3");
        this.load.audio("3-times", "assets/audio/instructions/3-times.mp3");

        // Load praise audio
        var i;
        for (i = 0; i < 42; i++) {
            this.load.audio("praise-" + i, "assets/audio/praises/" + i + ".mp3");
        }
    }

    create() {
        let sidebarSize = 100;
        this.cameras.main.setViewport(sidebarSize, 0, this.cameras.main.width - sidebarSize, this.cameras.main.height);


        // Quiz image
        var quizImg = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.width / 9 + 20, this.quizWord);
        quizImg.setOrigin(0.5, 0);
        quizImg.displayWidth = this.cameras.main.width * 0.25;
        quizImg.scaleY = quizImg.scaleX;

        this.createStars();

        var allWords = [];

        Object.keys(this.wordsJsonData).forEach(category => {
            this.wordsJsonData[category].forEach( word => allWords.push(word));
        });
        let sorted = allWords.sort((a, b) => {
            var aHash = 0;
            var bHash = 0;
            for (var i = 0; i < this.quizWord.length; i++) {
                aHash *= 10;
                bHash *= 10;

                if (a.charAt(i) == this.quizWord.charAt(i)) aHash += 1;
                if (b.charAt(i) == this.quizWord.charAt(i)) bHash += 1;
            }
            return bHash - aHash;
        });

        var i;
        for (i = 0; i <= 10; i++) {
            if (sorted[i] == this.quizWord) continue;
            this.answerChoices.push(sorted[i]);
        }

        this.shuffleAnswerChoices();

        if (!sessionStorage.getItem("hasCompletedQuiz")) {
            this.sound.play("quiz-instructions");
        }
    }

    createStars() {
        let starSize = 0.1 * this.cameras.main.width;

        //  Stars container
        if (this.stars) this.stars.destroy();
        this.stars = this.add.container(this.cameras.main.width / 2, starSize / 2 + 10);
        this.stars.setSize(this.cameras.main.width / 3, 3 * 1.1 * starSize);

        var i;
        for (i = 0; i < 3; i++) {
            var xPos = (i - 1) * 1.1 * starSize;
            var starIcon;
            if (i < this.correct) {
                starIcon = this.add.image(xPos,0,"gold-star");
            } else if (i < this.maxCorrect) {
                starIcon = this.add.image(xPos,0,"silver-star");
            } else {
                starIcon = this.add.image(xPos,0,"empty-star");
            }
            starIcon.displayWidth = starSize;
            starIcon.scaleY = starIcon.scaleX;
            this.stars.add(starIcon);
        }
    }

    shuffleAnswerChoices() {

        var currentIndex = this.answerChoices.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = this.answerChoices[currentIndex];
            this.answerChoices[currentIndex] = this.answerChoices[randomIndex];
            this.answerChoices[randomIndex] = temporaryValue;
        }

        var buttons = this.answerChoices.slice(2);
        var correctAnswerIndex = Math.floor(Math.random() * 3);
        buttons.splice(correctAnswerIndex, 0, this.quizWord);

        // Make sure correct answer is not in same location as last time
        if (this.lastCorrectPostion == correctAnswerIndex) {
            let switchIndex = (correctAnswerIndex + 1) % 4;
            buttons[correctAnswerIndex] = buttons[switchIndex];
            buttons[switchIndex] = this.quizWord;
            correctAnswerIndex = switchIndex;
        }
        this.lastCorrectPostion = correctAnswerIndex;
        this.creteAnswerChoices(buttons);
    }

    checkAnswer(answer) {
        if (answer == this.quizWord) {
            // Correct
            this.sound.play("praise-" + Math.floor(Math.random() * 42));
            this.correct += 1;
            if (this.correct > this.maxCorrect) this.maxCorrect = this.correct;
            this.incorrect = 0;
        } else {
            // Wrong
            this.sound.play("3-times");
            this.incorrect += 1;
            this.correct = 0;
        }

        if (this.correct == 3) {
            // Finish quiz
            var masteredWords = JSON.parse(localStorage.getItem("masteredWords"));
            masteredWords[this.quizWord] = true;
            localStorage.setItem("masteredWords", JSON.stringify(masteredWords));
            sessionStorage.setItem("hasCompletedQuiz", "true");
            this.scene.wake("poemScene");
            this.scene.stop("quizScene");
        } else if (this.incorrect >= 3) {
            // Play instruction
        }
        this.shuffleAnswerChoices();
        this.createStars();
    }

    creteAnswerChoices(buttons) {
        if (this.answerGridButtons) {
            this.answerGridButtons.destroy();
        }

        let width = 0.8 * this.cameras.main.width;
        let height = 0.3 * width;

        this.answerGridButtons = this.rexUI.add.gridButtons({
            width: width, height: height,
            anchor: {centerX: "center", bottom: "bottom"},

            buttons: [
                [this.createButton(buttons[0]), this.createButton(buttons[1])],
                [this.createButton(buttons[2]), this.createButton(buttons[3])],
            ],
            space: {
                left: 20, right: 20, top: 20, bottom: 20,
                row: 20, column: 20
            }
        })
            .layout()
            .on('button.click', function (button, index, pointer, event) {
                let scene = button.scene;
                scene.checkAnswer(button.text);
            })
    }

    createButton(text) {
        return this.rexUI.add.label({
            width: 40,
            height: 10,
            background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0xdff2f5).setStrokeStyle(5, "black", 1),
            text: this.add.text(0, 0, text, {
                fontSize: this.cameras.main.width / 20,
                fontFamily: "Comic Sans MS",
                color: "black"
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