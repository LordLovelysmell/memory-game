import { Scene } from "phaser";
import type { Sound, Types } from "phaser";
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
  private _sounds: {
    theme: Sound.WebAudioSound | Sound.NoAudioSound | Sound.HTML5AudioSound;
    card: Sound.WebAudioSound | Sound.NoAudioSound | Sound.HTML5AudioSound;
    complete: Sound.WebAudioSound | Sound.NoAudioSound | Sound.HTML5AudioSound;
    success: Sound.WebAudioSound | Sound.NoAudioSound | Sound.HTML5AudioSound;
    timeout: Sound.WebAudioSound | Sound.NoAudioSound | Sound.HTML5AudioSound;
  };

  constructor(config: Types.Core.GameConfig) {
    super(config);

    this._config = config;

    this._preloadFonts();
  }

  preload() {
    this.load.image(this._backgroundName, this._backgroundURL);
    this.load.image(this._cardName, this._cardURL);

    for (let i = 1; i <= this._cols; i++) {
      const cardKey = `${this._cardName}-${i}`;

      this._cardFaceKeys.push(cardKey);

      this.load.image(cardKey, `${this._assetsURL}/card${i}.png`);
    }

    this.load.audio("theme", "assets/sounds/theme.mp3");
    this.load.audio("card", "assets/sounds/card.mp3");
    this.load.audio("complete", "assets/sounds/complete.mp3");
    this.load.audio("success", "assets/sounds/success.mp3");
    this.load.audio("timeout", "assets/sounds/timeout.mp3");
  }

  create() {
    this._createSounds();

    this.add.sprite(0, 0, this._backgroundName).setOrigin(0, 0);

    const timeoutText = this.add.text(10, 330, "", {
      fontFamily: "JingleStar",
      fontSize: "28px",
    });

    const totalTime = this._rows * this._cols * 2;
    let timeRemaining = totalTime;

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        timeoutText.setText(`Time: ${timeRemaining--}`);

        if (timeRemaining < 0) {
          timeRemaining = totalTime;

          this._sounds.timeout.play();

          cardsGrid._rebuildGrid();
        }
      },
      loop: true,
    });

    const cardsGrid = new CardsGrid({
      rows: this._rows,
      cols: this._cols,
      gameConfig: this._config,
      cardBackPreloadKey: this._cardName,
      cardFacePreloadKeys: this._cardFaceKeys,
      onAllPairsFound: () => {
        timeRemaining = totalTime;
        this._sounds.complete.play();
      },
      onOnePairFound: () => {
        this._sounds.success.play();
      },
      onCardClick: () => {
        this._sounds.card.play();
      },
      scene: this,
    });
  }

  private _createSounds() {
    this._sounds = {
      theme: this.sound.add("theme"),
      card: this.sound.add("card"),
      complete: this.sound.add("complete"),
      success: this.sound.add("success"),
      timeout: this.sound.add("timeout"),
    };

    this._sounds.theme.play({
      volume: 0.05,
      loop: true,
    });
  }

  private _preloadFonts() {
    const div = document.createElement("div");
    div.innerText = ".";
    div.style.fontFamily = "JingleStar";
    div.style.position = "absolute";
    div.style.visibility = "hidden";
    document.body.insertAdjacentElement("afterbegin", div);
  }
}

export { MainScene };
