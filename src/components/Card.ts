import type { GameObjects } from "phaser";

interface CardProps {
  positionX: number;
  positionY: number;
  backFaceSprite: GameObjects.Sprite;
  frontFaceSprite: GameObjects.Sprite;
}

class Card {
  private _cardFrontFace: GameObjects.Sprite;
  private _cardBackFace: GameObjects.Sprite;

  constructor({
    positionX,
    positionY,
    backFaceSprite,
    frontFaceSprite,
  }: CardProps) {
    this._cardBackFace = backFaceSprite;
    this._cardFrontFace = frontFaceSprite;

    this._cardBackFace.setOrigin(0, 0);
    this._cardBackFace.setX(positionX);
    this._cardBackFace.setY(positionY);

    this._cardFrontFace.setOrigin(0, 0);
    this._cardFrontFace.setX(positionX);
    this._cardFrontFace.setY(positionY);

    this._cardFrontFace.setVisible(false);

    this._cardBackFace.setInteractive();

    this._cardBackFace.on("pointerdown", this._open, this);
  }

  private _open() {
    console.log(this);
    this._cardFrontFace.setVisible(true);
  }
}

export { Card };
