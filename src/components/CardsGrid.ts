import type { Types, GameObjects } from "phaser";
import { Card } from "./Card";

interface CardsGridProps {
  rows: number;
  cols: number;
  gameConfig: Types.Core.GameConfig;
  spriteToShow: () => GameObjects.Sprite;
}

class CardsGrid {
  private _cardWidth: number;
  private _cardHeight: number;
  private _gap = 4;

  constructor({ rows, cols, gameConfig, spriteToShow }: CardsGridProps) {
    const sprite = spriteToShow();

    this._cardWidth = sprite.width;
    this._cardHeight = sprite.height;

    sprite.destroy();

    const offsetX = (Number(gameConfig.width) - this._cardWidth * cols) / 2;
    const offsetY = (Number(gameConfig.height) - this._cardHeight * rows) / 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const card = new Card({
          positionX: offsetX + col * (this._cardWidth + this._gap),
          positionY: offsetY + row * (this._cardHeight + this._gap),
          spriteToShow,
        });
      }
    }
  }
}

export { CardsGrid };
