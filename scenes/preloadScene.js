class PreloadScene extends Phaser.Scene {
    constructor() {
        super({key : 'preloadScene'});
    }

    preload() {
        this.load.json('poemData', './assets/data/poem_data.json');
        this.load.json('wordsData', './assets/data/words_data.json');
        this.load.on('complete', this.complete, {scene:this.scene});

        if (!localStorage.getItem("masteredWords")) {
            localStorage.setItem("masteredWords", JSON.stringify({}));
        }
    }

    create() {
        const GrayscalePipeline = new Phaser.Class({
            Extends: Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline,
            initialize:
                function GrayscalePipeline(game) {
                    Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline.call(this, {
                        game: game,
                        renderer: game.renderer,
                        fragShader: `
                precision mediump float;
                uniform sampler2D uMainSampler;
                varying vec2 outTexCoord;
                void main(void) {
                vec4 color = texture2D(uMainSampler, outTexCoord);
                float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
                gl_FragColor = vec4(vec3(gray), color.a);
                }`
                    });
                }
        });

        this.game.renderer.addPipeline('Grayscale', new GrayscalePipeline(this.game));
    }

    complete() {
        console.log("COMPLETE!");
        this.scene.start("menuScene");
    }
}

export default PreloadScene;