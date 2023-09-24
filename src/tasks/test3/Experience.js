import {Application, Assets, Sprite, Texture, Text, BLEND_MODES} from "pixi.js";
import Viewport from "../base/Viewport.js";
import gsap from 'gsap';
import {Emitter} from "@pixi/particle-emitter";

const SPAWN_PERIOD = 1000;
const FIRE_CONF = {
  "lifetime": {
    "min": 0.5,
    "max": 1
  },
  "frequency": 0.1,
  "spawnChance": 1,
  "emitterLifetime": 0,
  "maxParticles": 10,
  "addAtBack": false,
  "pos": {
    "x": 505,
    "y": 530
  },
  "behaviors": [
    {
      "type": "alpha",
      "config": {
        "alpha": {
          "list": [
            {
              "time": 0,
              "value": 0.62
            },
            {
              "time": 1,
              "value": 0
            }
          ]
        }
      }
    },
    {
      "type": "moveSpeedStatic",
      "config": {
        "min": 100,
        "max": 100
      }
    },
    {
      "type": "scale",
      "config": {
        "scale": {
          "list": [
            {
              "time": 0,
              "value": 0.5
            },
            {
              "time": 1,
              "value": 0.75
            }
          ]
        },
        "minMult": 1
      }
    },
    {
      "type": "color",
      "config": {
        "color": {
          "list": [
            {
              "value": "fff191",
              "time": 0
            },
            {
              "value": "ff622c",
              "time": 0.7
            },
            {
              "value": "eeeeee",
              "time": 0.8
            },
            {
              "value": "ffffff",
              "time": 1
            }
          ],
          "isStepped": false
        }
      }
    },
    {
      "type": "rotation",
      "config": {
        "accel": 0,
        "minSpeed": 50,
        "maxSpeed": 50,
        "minStart": 265,
        "maxStart": 275
      }
    },
    {
      "type": "textureRandom",
      "config": {
        "textures": [
          // "particle",
          "fire"
        ]
      }
    },
    {
      "type": "spawnShape",
      "config": {
        "type": "torus",
        "data": {
          "x": 0,
          "y": 0,
          "radius": 10,
          "innerRadius": 0,
          "affectRotation": false
        }
      }
    }
  ]
}

export default class Experience extends Application {
  constructor() {
    super({width: 1024, height: 1024});
    this.viewport = new Viewport(this);
    this.stage.addChild(this.viewport);
    this.time = 0;
    this.frames = 0;
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
    await Assets.loadBundle('fire')
  }

  create() {
    const bg = new Sprite(Texture.WHITE)
    bg.tint = 0x000000;
    bg.width = 1024;
    bg.height = 1024;
    this.viewport.addChild(bg)

    this.fps = new Text('fps: 0', {fill: '#ffffff'});
    this.viewport.addChild(this.fps)

    this.viewport.resize();

    const sprite = new Sprite(Assets.get('particle'))
    sprite.x = 512;
    sprite.y = 512;
    sprite.anchor.set(0.5);
    sprite.alpha = 0.3
    sprite.scale.set(3)
    sprite.tint = 0xfff191
    this.viewport.addChild(sprite);

    const spriteAdd = new Sprite(Assets.get('particle'))
    spriteAdd.x = 0;
    spriteAdd.y = 0;
    spriteAdd.anchor.set(0.5);
    spriteAdd.alpha = 1
    spriteAdd.scale.set(0.1)
    spriteAdd.blendMode = BLEND_MODES.ADD
    spriteAdd.tint = 0xfff191
    sprite.addChild(spriteAdd);

    this.fireEmitter = new Emitter(this.viewport, FIRE_CONF)
    this.fireEmitter.emit = true;

    gsap.ticker.add(this.updateTimer.bind(this));
  }

  updateTimer(time, deltaTime, frame) {
    this.fireEmitter.update(deltaTime * 0.001);
    this.time += deltaTime;
    this.frames++;
    if (this.time >= 1000) {
      this.fps.text = 'fps: ' + this.frames
      this.frames = 0;
    }
    if (this.time >= SPAWN_PERIOD) {
      this.time = 0;
    }
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
