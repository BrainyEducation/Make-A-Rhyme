const slidingDeceleration = 10000;
const backDeceleration = 2000;

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
        this.poemData = this.game.cache.json.get('poemData')["poems"][this.poemName];
        var i;
        for (i = 1; i <= this.poemData['text'].length; i++) {
            this.load.audio(i, "assets/audio/" + this.poemName + "/" + i + ".mp3");
        }

        let categorySet = new Set();
        this.poemData['words'].forEach(word => word['categories'].forEach(category => categorySet.add(category)));

        this.wordsJsonData = this.game.cache.json.get('wordsData');
        categorySet.forEach(category => {
            if (category == "19") return;
            let categoryWords = this.wordsJsonData[category];
            categoryWords.forEach(word => {
                let wordImagePath = "assets/images/words/" + category + "/" + word + ".png";
                this.load.image(word, wordImagePath);

                let wordAudioPath = "assets/audio/words/" + word + ".mp3";
                this.load.audio(word, wordAudioPath);
            });
        });

        this.masteredWords = JSON.parse(localStorage.getItem("masteredWords"));


        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
        this.load.plugin('rexgrayscalepipelineplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexgrayscalepipelineplugin.min.js', true);

    }

    createWordPlaceholders(words, container) {
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
        this.wordSpots[word['spot-id']] = {assigned: false, word: null, container: container, image: rect, categories: word["categories"]};
    }

    typewritePoemText(text) {
        this.poemTextElement.setText('');
        let audioDuration = this.sound.get(this.poemLocation + 1).duration * 1000;
        let delay = audioDuration / text.length;
        let i = 0
        this.time.addEvent({
            callback: () => {
                this.poemTextElement.text += text[i]
                ++i
            },
            repeat: text.length - 1,
            delay: delay
        })
    }

    typewriteWordChoice(text) {
        let audioDuration = 1000;
        try {
            audioDuration = this.sound.get(text).duration * 1000
        } catch (e) {
            console.log(e);
        }

        text = " " + text;
        let delay = audioDuration / text.length;
        let i = 0
        this.time.addEvent({
            callback: () => {
                this.poemTextElement.text += text[i]
                ++i
            },
            repeat: text.length - 1,
            delay: delay
        })

        this.time.delayedCall(audioDuration + 1000, this.playNextLine, [], this);;
    }

    insertWordChoice(cueBox, cellContainer) {
        let placeholder = this.wordSpots[cueBox].image;
        let container = this.wordSpots[cueBox].container;

        var image = this.add.image(placeholder.x, placeholder.y, cellContainer.item);
        image.setOrigin(0, 0);
        image.displayWidth = placeholder.displayWidth;
        image.scaleY = image.scaleX;


        container.replace(placeholder, image);
        this.typewriteWordChoice(cellContainer.item);
        this.wordSpots[cueBox].assigned = true;
        this.wordSpots[cueBox].word = cellContainer.item;
    }

    showWordChoicesFor(cueBox) {
        var words = [];
        this.masteredWords = JSON.parse(localStorage.getItem("masteredWords"));
        this.wordSpots[cueBox].categories.forEach(category => this.wordsJsonData[category].forEach(word => words.push({word: word, category: category})));
        this.wordChoiceList.setItems(words);
        this.wordChoiceList.scrollToTop();
        this.wordChoiceList.cueBox = cueBox;
        this.rexUI.show(this.wordChoiceList);
    }

    createWordChoiceList() {

        this.wordChoiceList = this.rexUI.add.gridTable({
            x: this.cameras.main.displayWidth - 120,
            y: this.cameras.main.centerY,
            width: 220,
            height: 0.8 * this.cameras.main.displayHeight,

            scrollMode: 0,

            background: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, 0xE58F65),

            table: {
                cellWidth: undefined,
                cellHeight: 150,

                columns: 1,

                mask: {
                    padding: 2,
                },

                reuseCellContainer: false,
            },

            scroller: {
                threshold: 10,
                slidingDeceleration: 5000,
                backDeceleration: 2000,
            },

            header: this.add.triangle(100, 50, 0, 50, 50, 50, 25, 0, 0x999999),
            footer: this.add.triangle(100, 50, 0, 0, 50, 0, 25, 50, 0x999999),

            space: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,

                table: 10,
                header: 10,
                footer: 10,
            },

            createCellContainerCallback: function (cell, cellContainer) {
                var scene = cell.scene,
                    width = cell.width,
                    height = cell.height,
                    item = cell.item,
                    index = cell.index;

                var icon = scene.add.image(width / 2, 0, item.word);
                icon.displayWidth = 100;
                icon.scaleY = icon.scaleX;
                icon.setOrigin(0.5, 0.5);

                if (item.removed) {
                    return null;
                }
                cellContainer = scene.rexUI.add.label({
                    width: width,
                    height: height,
                    orientation: 0,
                    background: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 0).setStrokeStyle(2, 0x737373),
                    icon: icon,
                    align: 'center'
                });


                cellContainer.item = item.word;
                cellContainer.category = item.category;
                cellContainer.setAlpha(1);
                // Set properties from item value
                cellContainer.setMinSize(width, height); // Size might changed in this demo

                cellContainer.getElement('background').setStrokeStyle(2, 0x333333).setDepth(0);

                if (!scene.masteredWords[item.word]) {
                    icon.setPipeline('GrayScale');
                    cellContainer.mastered = false;
                } else {
                    cellContainer.mastered = true;
                }


                return cellContainer;
            },
            items: []
        })
            .layout();

        this.rexUI.hide(this.wordChoiceList);

        this.wordChoiceList
            .on('cell.over', function (cellContainer, cellIndex) {
                cellContainer.getElement('background')
                    .setStrokeStyle(2, 0xeeeeee)
                    .setDepth(1);
                this.sound.play(cellContainer.item);
            }, this)
            .on('cell.out', function (cellContainer, cellIndex) {
                cellContainer.getElement('background')
                    .setStrokeStyle(2, 0x333333)
                    .setDepth(0);
            }, this)
            .on('cell.click', function (cellContainer, cellIndex) {
                if (cellContainer.mastered) {
                    this.insertWordChoice(this.wordChoiceList.cueBox, cellContainer);
                } else {
                    if (cellContainer.category == 19) {
                        // Name friend
                        this.typewriteWordChoice(cellContainer.item);
                    } else {
                        // Go to quiz
                        this.scene.run("quizScene", {quizWord: cellContainer.item});
                        this.scene.sleep("poemScene");
                        this.insertWordChoice(this.wordChoiceList.cueBox, cellContainer);
                    }
                }
                this.rexUI.hide(this.wordChoiceList);
            }, this)

        this.wordChoiceList.childrenMap['header'].setInteractive()
            .on('pointerover', function () {
                this.scene.addScrollUp(this);
            })
            .on('pointerout', function () {
                this.scrollUpTween.remove();
            })

        this.wordChoiceList.childrenMap['footer'].setInteractive()
            .on('pointerover', function () {
                this.scene.addScrollDown(this);
            })
            .on('pointerout', function () {
                this.scrollDownTween.remove();
            })
    }

    addScrollDown(footer) {
        let scroller = this.wordChoiceList.childrenMap['scroller'];
        let scrollSpeed = 200;
        let duration = (scroller._value - scroller.minValue) / scrollSpeed * 1000;
        footer.scrollDownTween = this.tweens.add({
            targets: this.wordChoiceList,
            t: 1,
            ease: 'Linear',
            duration: duration,
            repeat: 0,
            yoyo: false,
        });
    }

    addScrollUp(header) {
        let scroller = this.wordChoiceList.childrenMap['scroller'];
        let scrollSpeed = 200;
        let duration = -scroller._value / scrollSpeed * 1000;
        header.scrollUpTween = this.tweens.add({
            targets: this.wordChoiceList,
            t: 0,
            ease: 'Linear',
            duration: duration,
            repeat: 0,
            yoyo: false,
        });
    }

    playNextLine() {
        this.sound.play(this.poemLocation + 1);
        let lineAudio = this.sound.get(this.poemLocation + 1);
        this.typewritePoemText(this.poemData["text"][this.poemLocation]);

        lineAudio.scene = this;
        lineAudio.once('complete', function() {
            let cue = this.scene.poemData["cueBox"][this.scene.poemLocation];
            if (this.scene.wordSpots[cue].assigned) {
                this.scene.poemLocation += 1;
                this.scene.typewriteWordChoice(this.scene.wordSpots[cue].word);
            } else {
                this.scene.showWordChoicesFor(cue);
                this.scene.poemLocation += 1;
            }
        });
    }

    create() {
        let sidebarSize = 100;
        this.cameras.main.setViewport(sidebarSize, 0, this.cameras.main.width - sidebarSize, this.cameras.main.height);
        console.log(this.cameras.main);

        this.grayscalePipeline = this.plugins.get('rexgrayscalepipelineplugin').add(this, "GrayScale", {
            intensity: 1
        });

        this.grayscalePipeline.setInt1('resolution', 2);
        console.log(this.grayscalePipeline);


        // Poem background
        var poemImg = this.add.sprite(0, 0, this.poemName);
        poemImg.setOrigin(0.5, 0.5);
        poemImg.displayWidth = this.cameras.main.width * 0.70;
        poemImg.scaleY = poemImg.scaleX;

        //  Poem container
        var container = this.add.container(poemImg.displayWidth / 2 + 20, this.cameras.main.centerY);
        container.setSize(poemImg.displayWidth, poemImg.displayHeight);
        container.add(poemImg);

        // Poem text
        let textX = this.cameras.main.width / 2;
        let textY = this.cameras.main.height - 100;
        this.poemTextElement = this.add.text(textX, textY);
        this.poemTextElement.setOrigin(0.5, 0.5);

        this.poemTextElement.setFontFamily('Comic Sans MS, cursive, sans-serif');
        this.poemTextElement.setFontSize(25);
        this.poemTextElement.setAlign('center');
        this.poemTextElement.setColor('#000000');
        this.poemTextElement.setWordWrapWidth(this.cameras.main.width - 100);
        this.poemTextElement.setPadding(10, 0, 10, 0);

        this.createWordPlaceholders(this.poemData['words'], container);

        this.createWordChoiceList();

        this.playNextLine();
    }
}
export default PoemScene;