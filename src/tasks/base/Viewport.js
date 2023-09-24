import {Container, Graphics} from "pixi.js";

export default class Viewport extends Container {
  constructor(app) {
    super();
    this.app = app;
    this.sortableChildren = true;
    this.originalWidth = 1024;
    this.originalHeight = 340;
    this.bounds = new Graphics();
    this.bounds.zIndex = 100000;
    this.addChild(this.bounds);
    this.bounds.visible = false;
    this.sortableChildren = true;
    this.resize = this.resize.bind(this)
    window.addEventListener('resize', this.resize)
  }

  resize() {
    this.drawBounds();
    this.app.view.style.transform = `translate(-50%, -50%) scale(${this.getScaleFactor() / this.app.renderer.resolution})`;
    const x = (1024 - this.getVw() / this.getScaleFactor()) / 2;
    const y = (1024 - this.getVh() / this.getScaleFactor()) / 2;
    this.bounds.x = x > 0 ? x : 0;
    this.bounds.y = y > 0 ? y : 0;
    console.log('viewport resize')
    this.app.resizeScene()
  }

  drawBounds() {
    const w = Math.min(this.getVw() / this.getScaleFactor(), 2048);
    const h = Math.min(window.innerHeight / this.getScaleFactor(), 2048);
    this.bounds.clear();
    this.bounds.beginFill(0xff0000, 0.1);
    this.bounds.lineStyle(10)
    this.bounds.drawRect(0, 0, w, h);
  }

  getScaleFactor() {
    const width = this.getVw();
    const height = this.getVh();

    if (!this.isLandscape) {
      return Math.min(height / this.originalWidth, width / this.originalHeight);
    }

    return Math.min(width / this.originalWidth, height / this.originalHeight);
  }

  get isLandscape() {
    return matchMedia('(orientation: landscape)').matches;
  }

  getVw() {
    return document.body.querySelector('.content').clientWidth
  }

  getVh() {
    return document.body.querySelector('.content').clientHeight
  }

  destroy(_options) {
    super.destroy(_options);
    window.removeEventListener('resize', this.resize)
  }
}
