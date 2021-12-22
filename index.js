const stage = new createjs.Stage('canvas');

createjs.Ticker.addEventListener('tick', () => {
  stage.update();
});

class CanvasImage extends createjs.Bitmap {
  constructor() {
    super();

    this.image = new Image();
    this.image.onload = () => {
      this.regX = this.image.width / 2;
      this.regY = this.image.height / 2;
      this.x = this.image.width / 2;
      this.y = this.image.height / 2;
    };
    stage.addChild(this);
  }
}

const canvasImage = new CanvasImage();

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

const translate = (canvas, x, y) => {
  canvas.x += x;
  canvas.y += y;
};

const rotate = (canvas, degrees) => {
  canvas.rotation += degrees;
};

const scale = (canvas, magnification) => {
  canvas.scaleX += magnification;
  canvas.scaleY += magnification;
  if (canvas.scaleX < 0.1 && canvas.scaleY < 0.1) {
    canvas.scaleX = 0.1;
    canvas.scaleY = 0.1;
  }
};

const translateButtons = [...document.querySelectorAll('[data-translate]')];
const rotateButtons = [...document.querySelectorAll('[data-rotate]')];
const scaleButtons = [...document.querySelectorAll('[data-scale]')];

translateButtons.forEach((translateButton) => {
  translateButton.addEventListener('click', (event) => {
    const target = event.currentTarget;
    const direction = target.dataset.translate;
    const distance = 10;

    switch (direction) {
      case 'up':
        translate(canvasImage, 0, -distance);
        break;
      case 'down':
        translate(canvasImage, 0, distance);
        break;
      case 'left':
        translate(canvasImage, -distance, 0);
        break;
      case 'right':
        translate(canvasImage, distance, 0);
        break;
      default:
        alert('エラー');
    }
  });
});

rotateButtons.forEach((rotateButton) => {
  rotateButton.addEventListener('click', (event) => {
    const target = event.currentTarget;
    const direction = target.dataset.rotate;
    const degees = 15;

    if (direction === 'right') {
      rotate(canvasImage, degees);
    } else if (direction === 'left') {
      rotate(canvasImage, -degees);
    } else {
      alert('エラー');
    }
  });
});

scaleButtons.forEach((scaleButton) => {
  scaleButton.addEventListener('click', (event) => {
    const target = event.currentTarget;
    const direction = target.dataset.scale;
    const magnification = 0.2;

    if (direction === 'up') {
      scale(canvasImage, magnification);
    } else if (direction === 'down') {
      scale(canvasImage, -magnification);
    } else {
      alert('エラー');
    }
  });
});
