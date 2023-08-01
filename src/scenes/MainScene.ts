import { Scene } from "phaser";
import type { Types } from "phaser";
import { CardsGrid } from "../components/CardsGrid";

class MainScene extends Scene {
  private _assetsURL = "assets/images";
  private _backgroundURL = `${this._assetsURL}/background.png`;
  private _cardURL = `${this._assetsURL}/card.png`;
  private _backgroundName = "bg";
  private _cardName = "card";
  private _config: Types.Core.GameConfig;

  constructor(config: Types.Core.GameConfig) {
    super(config);

    this._config = config;
  }

  preload() {
    this.load.image(this._backgroundName, this._backgroundURL);
    this.load.image(this._cardName, this._cardURL);
  }

  create() {
    this.add.sprite(0, 0, this._backgroundName).setOrigin(0, 0);

    const cardsGrid = new CardsGrid({
      rows: 2,
      cols: 5,
      gameConfig: this._config,
      spriteToShow: () => {
        return this.add.sprite(0, 0, this._cardName).setOrigin(0, 0);
      },
    });
  }
}

export { MainScene };
