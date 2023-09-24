import {Application, Assets, Container, Sprite, Texture, Text} from "pixi.js";
import Viewport from "../base/Viewport.js";
import {OutlineFilter} from "pixi-filters";
import gsap from 'gsap';

const SPAWN_PERIOD = 1000;
const FLYING_DURATION = 2;
const EMOTICONS = [
  0x1F600,
  0x1F603,
  0x1F604,
  0x1F601,
  0x1F606,
  0x1F605,
  0x1F923,
  0x1F602,
  0x1F642,
  0x1F643,
  0x1FAE0,
  0x1F609,
  0x1F60A,
  0x1F607
].map(code => `${String.fromCodePoint(code)}`);

const STRINGS = [
  'YOU',
  'WIN',
  '$',
  'Random',
  'Text'
]

export default class Experience extends Application {
  constructor() {
    super({width: 1024, height: 1024});
    this.viewport = new Viewport(this);
    this.stage.addChild(this.viewport);
    this.time = 0;
    this.frames = 0;
    this.containers = [];
    this.animations = [];
    this.run()
  }

  run() {
    this.create()
  }

  create() {
    const bg = new Sprite(Texture.WHITE)
    bg.tint = 0xededed
    bg.width = 1024;
    bg.height = 1024;
    this.viewport.addChild(bg)

    this.fps = new Text('fps: 0');
    this.viewport.addChild(this.fps)

    this.viewport.resize();

    gsap.ticker.add(this.updateTimer.bind(this));
  }

  updateTimer(time, deltaTime, frame) {
    this.time += deltaTime;
    this.frames++;
    if (this.time >= 1000) {
      this.fps.text = 'fps: ' + this.frames
      this.frames = 0;
    }
    if (this.time >= SPAWN_PERIOD) {
      this.time = 0;
      this.spawnText()
    }
  }

  spawnText() {
    const firstString = this.getRandomString();
    const secondString = this.getRandomString();
    const thirdString = this.getRandomString();
    const fontSize = 100 - Math.floor(Math.random() * 60);
    const text = new Text(`${firstString} ${secondString} ${thirdString}`, {fontSize})
    text.x = 512;
    text.y = 512;
    text.scale.set(0)
    text.anchor.set(0.5)
    this.viewport.addChild(text)

    gsap.timeline()
      .to(text.scale, {x: 1, y: 1, duration: 0.3, ease: 'back.out'})
      .to(text, {y: '-=100', duration: FLYING_DURATION})
      .to(text, {alpha: 0, duration: FLYING_DURATION}, 0)
      .eventCallback('onComplete', ()=> {
        text.destroy()
      })
  }

  getRandomString() {
    const srcs = [STRINGS, EMOTICONS];
    const src = this.getRandomItem(srcs);
    return this.getRandomItem(src)
  }

  getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
  }

  resizeScene() {
    const {x, y, width, height} = this.viewport.bounds;
    this.fps.x = x + 30;
    this.fps.y = y + 30;
  }

  destroy(removeView, stageOptions) {
    super.destroy(removeView, stageOptions);
    gsap.ticker.remove(this.updateTimer)
  }
}
