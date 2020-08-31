class PreloadScene extends Phaser.Scene {
    constructor() {
        super({key : 'preloadScene'});
    }

    preload() {
        this.load.json('poemData', './assets/poem_data.json');
        this.load.on('complete', this.complete, {scene:this.scene});
    }

    complete() {
        console.log("COMPLETE!");
        this.scene.start("menuScene");
    }
}

export default PreloadScene;