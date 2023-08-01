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
  private _rows = 2;
  private _cols = 5;
  private _cardFaceKeys: string[] = [];

  constructor(config: Types.Core.GameConfig) {
    super(config);

    this._config = config;
  }

  preload() {
    this.load.image(this._backgroundName, this._backgroundURL);
    this.load.image(this._cardName, this._cardURL);

    for (let i = 1; i <= this._cols; i++) {
      const cardKey = `${this._cardName}-${i}`;

      this._cardFaceKeys.push(cardKey);

      this.load.image(cardKey, `${this._assetsURL}/card${i}.png`);
    }
  }

  create() {
    this.add.sprite(0, 0, this._backgroundName).setOrigin(0, 0);

    const cardsGrid = new CardsGrid({
      rows: this._rows,
      cols: this._cols,
      gameConfig: this._config,
      cardBackPreloadKey: this._cardName,
      cardFacePreloadKeys: this._cardFaceKeys,
      scene: this,
    });
  }
}

export { MainScene };
