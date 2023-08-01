import type { GameObjects } from "phaser";

interface CardProps {
  positionX: number;
  positionY: number;
  spriteToShow: () => GameObjects.Sprite;
}

class Card {
  constructor({ positionX, positionY, spriteToShow }: CardProps) {
    const cardSprite = spriteToShow();
    cardSprite.setX(positionX);
    cardSprite.setY(positionY);
  }
}

export { Card };
