import type { GameObjects, Scene } from "phaser";

interface CardProps {
  id: string;
  value: string;
  positionX: number;
  positionY: number;
  backFaceSprite: GameObjects.Sprite;
  frontFaceSprite: GameObjects.Sprite;
  scene: Scene;
}

class Card {
  private _id: string;
  private _value: string;
  private _cardFrontFace: GameObjects.Sprite;
  private _cardBackFace: GameObjects.Sprite;
  private _callbacks: (() => void)[] = [];
  private _scene: Scene;

  private _cardCurrentSide: GameObjects.Sprite;

  constructor({
    id,
    value,
    positionX,
    positionY,
    backFaceSprite,
    frontFaceSprite,
    scene,
  }: CardProps) {
    this._id = id;
    this._value = value;

    this._scene = scene;

    this._cardBackFace = backFaceSprite;
    this._cardFrontFace = frontFaceSprite;
    this._cardCurrentSide = this._cardBackFace;

    this._cardBackFace.setX(positionX);
    this._cardBackFace.setY(positionY);

    this._cardFrontFace.setX(positionX);
    this._cardFrontFace.setY(positionY);

    this._cardFrontFace.setVisible(false);

    this._cardCurrentSide.setInteractive();

    this._cardCurrentSide.on("pointerdown", this._pointerDownHandler, this);
  }

  public set setInteractive(value: boolean) {
    if (value) {
      this._cardCurrentSide.setInteractive();
    } else {
      this._cardCurrentSide.disableInteractive();
    }
  }

  public set value(value: string) {
    this._value = value;
  }

  public get cardFrontFace() {
    return this._cardFrontFace;
  }

  public get id() {
    return this._id;
  }

  public get value() {
    return this._value;
  }

  private _pointerDownHandler() {
    this._flip(() => {
      this._cardCurrentSide.setTexture(this._value);
    });

    this._callbacks.forEach((cb) => cb());
  }

  private _flip(onComplete: () => void) {
    this._scene.tweens.add({
      targets: this._cardCurrentSide,
      scaleX: 0,
      ease: "Linear",
      duration: 150,
      onComplete: () => {
        onComplete();

        this._scene.tweens.add({
          targets: this._cardCurrentSide,
          scaleX: 1,
          ease: "Linear",
          duration: 150,
        });
      },
    });
  }

  public close() {
    this._flip(() => {
      this._cardCurrentSide.setTexture("card");
    });
  }

  public onClick(cb: () => void) {
    this._callbacks.push(cb);
  }
}

export { Card };
