const stage = new createjs.Stage('canvas');

createjs.Ticker.addEventListener('tick', () => {
  stage.update();
});

class CanvasImage extends createjs.Bitmap {
  constructor() {
    super();

    this.image = new Image();
    this.x = 0;
    this.y = 0;

    this.init();
  }

  init() {
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
