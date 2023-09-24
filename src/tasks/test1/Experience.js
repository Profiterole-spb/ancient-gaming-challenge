import {Application, Assets, Container, Sprite, Texture} from "pixi.js";
import Viewport from "../base/Viewport.js";
import {OutlineFilter} from "pixi-filters";
import gsap from 'gsap';

const QUANTITY = 144;
const SHIFT_PERIOD = 1000;
const FLYING_DURATION = 2;

export default class Experience extends Application {
  constructor() {
    super({width: 1024, height: 1024});
    this.viewport = new Viewport(this);
    this.stage.addChild(this.viewport);
    this.time = 0;
    this.containers = [];
    this.animations = [];
    this.run()
  }

  run() {
    this.init()
      .then(this.load.bind(this))
      .then(this.create.bind(this))
  }

  async init() {
    await Assets.init({manifest: '../../manifest.json'})
  }

  async load() {
    await Assets.loadBundle('cards')
  }

  create() {
    const bg = new Sprite(Texture.WHITE)
    bg.tint = 0xededed
    bg.width = 1024;
    bg.height = 1024;
    this.viewport.addChild(bg)

    const filter = new OutlineFilter(2, '#755206')

    const textures = Object.values(Assets.get('cards').textures);

    const sprites = new Array(QUANTITY).fill(null).map(() => {
      const sprite = new Sprite(textures[Math.floor(Math.random() * textures.length)]);
      sprite.anchor.set(0.5);
      sprite.filters = [filter]
      sprite.cacheAsBitmap = true;
      return sprite;
    })

    const containerA = new Container();
    containerA.addChild(...sprites);
    // containerA.cacheAsBitmap = true;

    const containerB = new Container();
    // containerB.cacheAsBitmap = true;

    this.containers = [containerA, containerB];

    this.viewport.addChild(containerA, containerB);
    this.viewport.resize();
    this.updateSprites();

    gsap.ticker.add(this.updateTimer.bind(this));
  }

  shiftCard() {
    if (this.animations.length !== 0 && this.containers[0].children.length === 0) {
      return;
    }
    if (this.containers[0].children.length === 0) {
      this.containers.reverse();
    }
    const {x, y, width, height} = this.viewport.bounds;
    const [contA, contB] = this.containers;
    const index = contA.children.length - 1;
    const lastSprite = contA.children[index];
    lastSprite.getGlobalPosition(lastSprite.position);
    const sprite = contA.removeChildAt(index);

    const position = {x: contB.position.x, y: contB.position.y};
    const cardsMoving = QUANTITY - contA.children.length - contB.children.length;
    position.y -= contB.children.length + cardsMoving

    const t = gsap.timeline()
      .to(sprite, {x: position.x, duration: FLYING_DURATION})
      .to(sprite, {y: y + height / 2 - 100, duration: FLYING_DURATION / 2, ease: "power1.out"}, 0)
      .to(sprite, {y: position.y, duration: FLYING_DURATION / 2, ease: "power1.in"}, FLYING_DURATION / 2)
      .eventCallback('onStart', () => {
        contA.cacheAsBitmap = false;
        this.updateSprites()
        contA.cacheAsBitmap = true;
        this.viewport.addChild(sprite)
      })
      .eventCallback('onComplete', () => {
        contB.addChild(sprite)
        contB.cacheAsBitmap = false;
        this.updateSprites()
        contB.cacheAsBitmap = true;
        this.animations.splice(this.animations.indexOf(t), 1)
      })
    this.animations.push(t)
  }

  updateTimer(time, deltaTime) {
    this.time += deltaTime;
    if (this.time >= SHIFT_PERIOD) {
      this.time = 0;
      this.shiftCard();
    }
  }

  updateSprites() {
    this.containers[0].children.forEach((sprite, i) => {
      sprite.x = 0
      sprite.y = -i
    })
    this.containers[1].children.forEach((sprite, i) => {
      sprite.x = 0
      sprite.y = -i
    })
  }

  resizeScene() {
    console.log('resize')
    const {x, y, width, height} = this.viewport.bounds
    if (this.viewport.isLandscape) {
      this.containers[0].position.set(x + width / 2 - 350, y + height / 2 + 80)
      this.containers[1].position.set(x + width / 2 + 350, y + height / 2 + 80)
    } else {
      this.containers[0].position.set(x  + width / 2 - 140, y + height / 2 + 300)
      this.containers[1].position.set(x  + width / 2 + 130, y + height / 2 + 300)
    }
    this.animations.forEach((animation) => {
      animation.seek(animation.duration(), false)
    })
  }
}
