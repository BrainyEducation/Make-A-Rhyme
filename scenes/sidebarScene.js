class SidebarScene extends Phaser.Scene {
    constructor() {
        super({key : 'sidebarScene'});
    }

    preload() {
        // Load star images
        this.load.image("friends", "assets/images/other/sidebar/friends-icon.png");
        this.load.image("wordbank", "assets/images/other/sidebar/wordbank-icon.png");

        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
    }

    create() {
        //  Poem container
        var container = this.add.container(0, 0);
        container.setSize(100, this.cameras.main.height);

        var background = this.add.rectangle(0, 0, container.width, container.height, 0xC2EAE9);
        background.setOrigin(0, 0);


        this.createButtons();
        container.add(background);
        container.add(this.answerGridButtons);
    }

    createButtons() {
        let width = 80;
        let height = this.cameras.main.height / 3;

        this.answerGridButtons = this.rexUI.add.gridButtons({
            width: width, height: height,
            anchor: {left: "left", top: "top"},

            buttons: [
                [this.createButton('wordbank')],
                [this.createButton('friends')]
            ],
            space: {
                left: 10, right: 10, top: 20, bottom: 20,
                row: 20, column: 20
            },

        })
            .layout()
            .on('button.click', function (button, index, pointer, event) {
                console.log(button);
            })
    }

    createButton(text) {
        let icon = this.add.image(0, 0, text);
        icon.displayWidth = 80;
        icon.scaleY = icon.scaleX;
        return this.rexUI.add.label({
            width: 40,
            height: 10,
            icon: icon,
            align: 'center'
        });
    }

}

export default SidebarScene;