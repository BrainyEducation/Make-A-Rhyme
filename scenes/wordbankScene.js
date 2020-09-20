class WordbankScene extends Phaser.Scene {
    constructor() {
        super({
            key : 'wordbankScene'
        });
    }

    preload() {

        var i;
        for (i = 1; i <= 18; i++) {
            this.load.image("category" + i, "assets/images/categories/" + i + ".png");
        }

        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
    }

    create() {
        this.updateSidebar();
        this.events.on('wake', function () {this.updateSidebar()}, this);

        let sidebarSize = 100;
        this.cameras.main.setViewport(sidebarSize, 0, this.cameras.main.width - sidebarSize, this.cameras.main.height);
        this.cameras.main.setRoundPixels(true);

        this.rexUI.add.scrollablePanel({
            anchor: {
                top: 'top',
                left: 'left'
            },
            width: this.cameras.main.displayWidth,
            height: this.cameras.main.displayHeight,
            panel: {
                child: this.createPanel(),
                mask: {
                    padding: 1
                },
            },
            slider: {
                track: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, 0xaaaaaa),
                thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 13, 0x123123),
            },
            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
                panel: 10,
            }
        })
            .layout()
    }

    createPanel() {
        var sizer = this.rexUI.add.sizer({
            orientation: 'y',
        })
            .add(
                this.createTable(), // child
                { expand: true }
            )
        return sizer;
    }

    createTable() {
        var columns = 5;
        var rows = Math.floor(18 / columns) + 1;

        var table = this.rexUI.add.gridSizer({
            column: columns,
            row: rows,
            space: { column: 10, row: 10 }
        });

        var r, c;
        for (var i = 0, cnt = 18; i < cnt; i++) {
            r = Math.floor(i / columns);
            c = i % columns;
            table.add(this.createIcon(i + 1), c, r, 'bottom', 0, true);
        }

        return this.rexUI.add.sizer({
            orientation: 'y',
            space: { left: 10, right: 10, top: 10, bottom: 10, item: 10 }
        })
            .add(table, 1, 'center', 0, true);
    }

    createIcon(index) {
        let categoryImage = this.add.image(0, 0, 'category' + index);
        categoryImage.displayWidth = this.cameras.main.displayWidth / 5 - 10 * 5;
        categoryImage.scaleY = categoryImage.scaleX;

        var label = this.rexUI.add.label({
            orientation: 'y',
            icon: categoryImage,
            text: this.add.text(0, 0, 'category' + index),
            space: { icon: 1 },
            align: 'bottom'
        });

        return label;
    }

    updateSidebar() {
        let answerGridButtons = this.scene.get('sidebarScene').answerGridButtons;
        answerGridButtons.hideButton(0);
        answerGridButtons.showButton(1);
        answerGridButtons.hideButton(2);
        answerGridButtons.showButton(3);
        answerGridButtons.layout();
    }
}

export default WordbankScene;