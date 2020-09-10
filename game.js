import PreloadScene from "./scenes/preloadScene.js";
import MenuScene from "./scenes/menuScene.js";
import PoemScene from "./scenes/poemScene.js";
import QuizScene from "./scenes/quizScene.js";
import SidebarScene from "./scenes/sidebarScene.js";

// Our game scene
let preloadScene = new PreloadScene();
let menuScene = new MenuScene();
let poemScene = new PoemScene();
let quizScene = new QuizScene();
let sidebarScene = new SidebarScene();

var config = {
    type: Phaser.AUTO,
    resolution: window.devicePixelRatio,
    scale: {
        mode: Phaser.Scale.RESIZE,
        parent: "game",
        width: '100%',
        height: '100%'
    },
    dom: {
        createContainer: true
    },
    backgroundColor: '#70C7D1'
}

var game = new Phaser.Game(config);

game.scene.add("preloadScene", preloadScene);
game.scene.add("menuScene", menuScene);
game.scene.add("poemScene", poemScene);
game.scene.add("quizScene", quizScene);
game.scene.add("sidebarScene", sidebarScene);

game.scene.start("preloadScene");


