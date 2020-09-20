class FriendsScene extends Phaser.Scene {
    constructor() {
        super({
            key : 'friendsScene'
        });
    }

    loadFriendImages(i) {
        this.load.image('friend' + i, "assets/images/friends/friend" + i + ".png");
    }

    preload() {
        var i;
        for (i = 1; i <= 31; i++) {
            this.loadFriendImages(i);
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


        this.scrollablePanel = this.rexUI.add.scrollablePanel({
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
        let friendSize = this.cameras.main.displayHeight / 5;
        var sizer = this.rexUI.add.sizer({
            orientation: 'y',
        })
            .add(
                this.createTable(friendSize), // child
                { expand: true }
            )
        return sizer;
    }

    createTable(friendSize) {
        var columns = 5;
        var rows = Math.floor(31 / columns) + 1;

        var table = this.rexUI.add.gridSizer({
            column: columns,
            row: rows,
            space: { column: 10, row: 10 }
        });

        var r, c;
        for (var i = 0, cnt = 31; i < cnt; i++) {
            r = Math.floor(i / columns);
            c = i % columns;
            table.add(this.createIcon(i + 1, friendSize), c, r, 'top', 0, true);
        }

        return this.rexUI.add.sizer({
            orientation: 'y',
            space: { left: 10, right: 10, top: 10, bottom: 10, item: 10 }
        })
            .add(table, // child
                1, // proportion
                'center', // align
                0, // paddingConfig
                true // expand
            );
    }

    createIcon = function (index, iconSize) {
        let friendImage = this.add.image(0, 0, 'friend' + index);
        friendImage.displayHeight = iconSize;
        friendImage.scaleY = friendImage.scaleX;

        var label = this.rexUI.add.label({
            orientation: 'y',
            icon: friendImage,
            text: this.add.text(0, 0, 'friend' + index),
            space: { icon: 1 }
        });

        return label;
    }

    updateSidebar() {
        let answerGridButtons = this.scene.get('sidebarScene').answerGridButtons;
        answerGridButtons.hideButton(0);
        answerGridButtons.showButton(1);
        answerGridButtons.showButton(2);
        answerGridButtons.hideButton(3);
        answerGridButtons.layout();
    }
}

export default FriendsScene;

