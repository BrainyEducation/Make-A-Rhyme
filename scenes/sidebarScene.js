class SidebarScene extends Phaser.Scene {
    constructor() {
        super({key : 'sidebarScene'});
    }

    preload() {
    }

    create() {
        //  Poem container
        var container = this.add.container(0, 0);
        container.setSize(100, this.cameras.main.height);

        var background = this.add.rectangle(0, 0, container.width, container.height, 0xC2EAE9);
        background.setOrigin(0, 0);
        container.add(background);
    }

}

export default SidebarScene;