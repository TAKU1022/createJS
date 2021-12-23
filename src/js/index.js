const stage = new createjs.Stage('canvas');

createjs.Ticker.addEventListener('tick', () => {
  stage.update();
});

class CanvasBackground extends createjs.Shape {
  constructor() {
    super();

    this.graphics.beginFill('#fff');
    this.graphics.drawRect(0, 0, stage.canvas.width, stage.canvas.height);
    stage.addChild(this);
  }
}

class CanvasImage extends createjs.Bitmap {
  constructor() {
    super();

    this.image = new Image();
    this.isDrawn = false;

    this.onLoadImage();
    this.handleDown();
    this.handleMove();
    stage.addChild(this);
  }

  onLoadImage() {
    this.image.onload = () => {
      this.isDrawn = true;
      this.regX = this.image.width / 2;
      this.regY = this.image.height / 2;
      this.x = this.regX;
      this.y = this.regY;
    };
  }
}

class CanvasText extends createjs.Text {
  constructor() {
    super();

    this.isDrawn = false;
    this.text = '';
    this.fontSize = 30;
    this.fontFamily = 'sans-serif';
    this.font = `${this.fontSize}px ${this.fontFamily}`;
    this.dx = 0;
    this.dy = 0;

    this.handleDown();
    this.handleMove();
    stage.addChild(this);
  }

  chageFont(fontFamily) {
    this.fontFamily = fontFamily;
    this.font = `${this.fontSize}px ${this.fontFamily}`;
  }
}

class CanvasTextGroup extends createjs.Container {
  constructor() {
    super();

    this.text = new CanvasText();
    stage.addChild(this);
  }
}

const canvasOperation = {
  dragPointX: null,
  dragPointY: null,

  handleDown() {
    this.addEventListener('mousedown', () => {
      this.dragPointX = stage.mouseX - this.x;
      this.dragPointY = stage.mouseY - this.y;
    });
  },

  handleMove() {
    this.addEventListener('pressmove', () => {
      this.x = stage.mouseX - this.dragPointX;
      this.y = stage.mouseY - this.dragPointY;
      this.dx = this.x - this.regX;
      this.dy = this.y - this.regY;
    });
  },
};

Object.assign(CanvasImage.prototype, canvasOperation);
Object.assign(CanvasText.prototype, canvasOperation);

const canvasBackground = new CanvasBackground();
const canvasImage = new CanvasImage();
const canvasText = new CanvasText();
const canvasTextGroup = new CanvasTextGroup();

const loadImage = (file) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (event) => {
    canvasImage.image.src = event.target.result;
  };
};

const fileInput = document.getElementById('file');
fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];

  if (!file) return;

  loadImage(file);
});

const downloadCanvasImage = () => {
  const a = document.createElement('a');
  a.href = this.canvas.toDataURL('image/jpeg', 0.85);
  a.download = 'download.jpeg';
  a.click();
};

const downloadButton = document.getElementById('download-button');
downloadButton.addEventListener('click', () => {
  downloadCanvasImage();
});

const translateButtons = [...document.querySelectorAll('[data-translate]')];
const rotateButtons = [...document.querySelectorAll('[data-rotate]')];
const scaleButtons = [...document.querySelectorAll('[data-scale]')];

translateButtons.forEach((translateButton) => {
  translateButton.addEventListener('click', (event) => {
    const target = event.currentTarget;
    const canvas = target.dataset.canvas === 'image' ? canvasImage : canvasText;

    if (!canvas.isDrawn) return;

    const direction = target.dataset.translate;
    const distance = 10;

    switch (direction) {
      case 'up':
        canvas.dy -= distance;
        canvas.y -= distance;
        break;
      case 'down':
        canvas.dy += distance;
        canvas.y += distance;
        break;
      case 'left':
        canvas.dx -= distance;
        canvas.x -= distance;
        break;
      case 'right':
        canvas.dx += distance;
        canvas.x += distance;
        break;
      default:
        alert('エラー');
    }
  });
});

rotateButtons.forEach((rotateButton) => {
  rotateButton.addEventListener('click', (event) => {
    const target = event.currentTarget;
    const canvas = target.dataset.canvas === 'image' ? canvasImage : canvasText;

    if (!canvas.isDrawn) return;

    const direction = target.dataset.rotate;
    const degees = 15;

    if (direction === 'right') {
      canvas.rotation += degees;
    } else if (direction === 'left') {
      canvas.rotation -= degees;
    } else {
      alert('エラー');
    }
  });
});

scaleButtons.forEach((scaleButton) => {
  scaleButton.addEventListener('click', (event) => {
    const target = event.currentTarget;
    const canvas = target.dataset.canvas === 'image' ? canvasImage : canvasText;

    if (!canvas.isDrawn) return;

    const direction = target.dataset.scale;
    const magnification = 0.2;

    if (direction === 'up') {
      canvas.scaleX += magnification;
      canvas.scaleY += magnification;
    } else if (direction === 'down') {
      canvas.scaleX -= magnification;
      canvas.scaleY -= magnification;
      if (canvas.scaleX < 0.1 && canvas.scaleY < 0.1) {
        canvas.scaleX = 0.1;
        canvas.scaleY = 0.1;
      }
    } else {
      alert('エラー');
    }
  });
});

const textarea = document.getElementById('textarea');
const fontRadioButtons = [...document.getElementsByName('fonts')];

textarea.addEventListener('input', (event) => {
  event.currentTarget.value === ''
    ? (canvasText.isDrawn = false)
    : (canvasText.isDrawn = true);
  canvasText.text = event.currentTarget.value;
  canvasText.regX = canvasText.getBounds().width / 2;
  canvasText.regY = canvasText.getBounds().height / 2;
  canvasText.x = canvasText.regX + canvasText.dx;
  canvasText.y = canvasText.regY + canvasText.dy;
});

fontRadioButtons.forEach((radio) => {
  radio.addEventListener('change', (event) => {
    const fontFamilyName = event.currentTarget.value;
    canvasText.chageFont(fontFamilyName);
  });
});
