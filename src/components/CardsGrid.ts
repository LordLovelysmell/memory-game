import { type Types, type Scene, Utils, type Input } from "phaser";
import { Card } from "./Card";

interface CardsGridProps {
  rows: number;
  cols: number;
  gameConfig: Types.Core.GameConfig;
  cardBackPreloadKey: string;
  cardFacePreloadKeys: string[];
  scene: Scene;
}

class CardsGrid {
  private _cardWidth: number;
  private _cardHeight: number;
  private _gap = 4;

  constructor({
    rows,
    cols,
    gameConfig,
    cardBackPreloadKey,
    cardFacePreloadKeys,
    scene,
  }: CardsGridProps) {
    const backFaceSprite = scene.add.sprite(0, 0, cardBackPreloadKey);

    this._cardWidth = backFaceSprite.width;
    this._cardHeight = backFaceSprite.height;

    backFaceSprite.destroy();

    const cardFaces = cardFacePreloadKeys.concat(cardFacePreloadKeys);
    Utils.Array.Shuffle(cardFaces);

    const offsetX = (Number(gameConfig.width) - this._cardWidth * cols) / 2;
    const offsetY = (Number(gameConfig.height) - this._cardHeight * rows) / 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const card = new Card({
          positionX: offsetX + col * (this._cardWidth + this._gap),
          positionY: offsetY + row * (this._cardHeight + this._gap),
          backFaceSprite: scene.add.sprite(0, 0, cardBackPreloadKey),
          frontFaceSprite: scene.add.sprite(0, 0, cardFaces.pop()),
        });
      }
    }
  }
}

export { CardsGrid };
