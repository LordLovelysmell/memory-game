import { Game } from "phaser";

import { MainScene } from "./scenes/MainScene";
import "./index.scss";

const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  // autoCenter: Phaser.Scale.CENTER_BOTH,
};

const game = new Game(config);

game.scene.add("MainScene", new MainScene(config), true);
