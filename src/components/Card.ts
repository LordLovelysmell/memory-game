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
  private _callbacks: any[] = [];
  private _scene: Scene;

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

    this._cardBackFace.setX(positionX);
    this._cardBackFace.setY(positionY);

    this._cardFrontFace.setX(positionX);
    this._cardFrontFace.setY(positionY);

    this._cardFrontFace.setVisible(false);

    this._cardBackFace.setInteractive();

    this._cardBackFace.on("pointerdown", this._pointerDownHandler, this);
  }

  public set setInteractive(value: boolean) {
    if (value) {
      this._cardBackFace.setInteractive();
    } else {
      this._cardBackFace.disableInteractive();
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
    this._cardFrontFace.setVisible(true);

    this._callbacks.forEach((cb) => cb());
  }

  public close() {
    this._cardFrontFace.setVisible(false);
  }

  public onClick(cb: () => any) {
    this._callbacks.push(cb);
  }
}

export { Card };
