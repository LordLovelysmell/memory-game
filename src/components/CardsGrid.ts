import { type Types, type Scene, Utils, type Input } from "phaser";
import { Card } from "./Card";

interface CardsGridProps {
  rows: number;
  cols: number;
  gameConfig: Types.Core.GameConfig;
  cardBackPreloadKey: string;
  cardFacePreloadKeys: string[];
  onAllPairsFound?: () => void;
  onOnePairFound?: () => void;
  onCardClick?: () => void;
  scene: Scene;
}

class CardsGrid {
  private _rows: number;
  private _cols: number;
  private _gameConfig: Types.Core.GameConfig;
  private _cardBackPreloadKey: string;
  private _cardFaces: string[];
  private _onAllPairsFound: () => void;
  private _onOnePairFound: () => void;
  private _onCardClick: () => void;
  private _scene: Scene;

  private _cardWidth: number;
  private _cardHeight: number;
  private _offsetX: number;
  private _offsetY: number;
  private _gap = 4;

  private _prevCard: Card | null;
  private _prevCardValue: string = "";
  private _openedCardsCount: number;
  private _cards: Card[] = [];

  constructor({
    rows,
    cols,
    gameConfig,
    cardBackPreloadKey,
    cardFacePreloadKeys,
    onAllPairsFound,
    onOnePairFound,
    onCardClick,
    scene,
  }: CardsGridProps) {
    this._rows = rows;
    this._cols = cols;
    this._gameConfig = gameConfig;
    this._cardBackPreloadKey = cardBackPreloadKey;
    this._scene = scene;

    this._openedCardsCount = 0;

    const backFaceSprite = scene.add.sprite(0, 0, this._cardBackPreloadKey);

    this._cardWidth = backFaceSprite.width;
    this._cardHeight = backFaceSprite.height;

    backFaceSprite.destroy();

    this._offsetX =
      (Number(this._gameConfig.width) - this._cardWidth * this._cols) / 2;
    this._offsetY =
      (Number(this._gameConfig.height) - this._cardHeight * this._rows) / 2;

    this._cardFaces = cardFacePreloadKeys.concat(cardFacePreloadKeys);
    this._cardFaces = this._getShuffledCards(this._cardFaces);

    this._createGrid();

    this._onAllPairsFound = onAllPairsFound;
    this._onOnePairFound = onOnePairFound;
    this._onCardClick = onCardClick;
  }

  private _getShuffledCards(cardFacePreloadKeys: string[]) {
    return Utils.Array.Shuffle<string>(cardFacePreloadKeys);
  }

  private _createGrid() {
    const cardFacesCopy = this._cardFaces.map((card) => card);

    for (let row = 0; row < this._rows; row++) {
      for (let col = 0; col < this._cols; col++) {
        const lastCard = cardFacesCopy.pop();

        const card = new Card({
          id: `${row}-${col}`,
          value: lastCard,
          positionX:
            this._offsetX +
            col * (this._cardWidth + this._gap) +
            this._cardWidth / 2,
          positionY:
            this._offsetY +
            row * (this._cardHeight + this._gap) +
            +this._cardHeight / 2,
          backFaceSprite: this._scene.add.sprite(
            0,
            0,
            this._cardBackPreloadKey
          ),
          frontFaceSprite: this._scene.add.sprite(0, 0, lastCard),
          scene: this._scene,
        });

        card.onClick(() => onCardClickHandler(card));

        this._cards.push(card);
      }
    }

    this._flyTheCardsIn();

    const onCardClickHandler = (card: Card) => {
      // to prevent clicking on the same card
      if (this._prevCard && this._prevCard.id === card.id) {
        return;
      }

      if (this._onCardClick) {
        this._onCardClick();
      }

      if (this._prevCard && this._prevCardValue === card.value) {
        // pair was found
        this._openedCardsCount += 2;
        this._prevCard.setInteractive = false;
        card.setInteractive = false;
        this._prevCard = null;
        this._prevCardValue = null;

        if (this._onOnePairFound) {
          this._onOnePairFound();
        }
      } else if (this._prevCard) {
        // not a pair card was clicked
        this._prevCard.close();
        this._prevCard = card;
        this._prevCardValue = card.value;
      } else {
        // for initial click (or after pair was found)
        this._prevCard = card;
        this._prevCardValue = card.value;
      }

      // if all pairs were found
      if (this._openedCardsCount === this._rows * this._cols) {
        if (this._onAllPairsFound) {
          this._onAllPairsFound();
        }
        this.rebuildGrid();
      }
    };
  }

  private _flyTheCardsIn() {
    this._cards.forEach((card, index) => {
      if (card.isOpen) {
        card.close();
      }

      card.cardCurrentSide.setPosition(
        -(this._cardWidth + this._gap),
        -(this._cardHeight + this._gap)
      );

      this._startFlyTheCardsInTween(card, ++index);
    });
  }

  private _flyTheCardsOut(cb: () => void) {
    let cardsCount = 0;
    const onComplete = () => {
      cardsCount++;

      if (cardsCount >= this._cards.length) {
        cb();
      }
    };

    this._cards
      .slice()
      .reverse()
      .forEach((card, index) => {
        this._scene.tweens.add({
          targets: card.cardCurrentSide,
          x: this._scene.sys.canvas.width + this._cardWidth + this._gap,
          y: this._scene.sys.canvas.width + this._cardHeight + this._gap,
          ease: "Linear",
          duration: 200,
          delay: index * 100,
          onComplete,
        });
      });
  }

  private _startFlyTheCardsInTween(card: Card, index: number) {
    this._scene.tweens.add({
      targets: card.cardCurrentSide,
      x: card.position.x,
      y: card.position.y,
      ease: "Linear",
      duration: 200,
      delay: index * 100,
    });
  }

  public rebuildGrid() {
    this._cardFaces = this._getShuffledCards(this._cardFaces);
    const cardFacesCopy = this._cardFaces.map((card) => card);

    this._flyTheCardsOut(this._flyTheCardsIn.bind(this));

    this._prevCard = null;
    this._prevCardValue = null;

    this._cards.forEach((card) => {
      card.setInteractive = true;
      if (card.isOpen) {
        // card.close();
      }

      const lastCard = cardFacesCopy.pop();
      card.value = lastCard;
    });

    this._openedCardsCount = 0;
  }
}

export { CardsGrid };
