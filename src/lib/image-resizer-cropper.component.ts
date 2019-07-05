import {
  Component,
  OnInit,
  Input,
  ElementRef,
  Renderer2,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from "@angular/core";
import { isPlatformBrowser } from "@angular/common";

@Component({
  selector: "irc-image-resizer-cropper",
  templateUrl: "./image-resizer-cropper.component.html",
  styleUrls: ["./image-resizer-cropper.component.css"]
})
export class ImageResizerCropperComponent
  implements OnInit, AfterViewInit, OnChanges {
  isBrowser: boolean;

  @Input() sourceImage: any;
  @Input() lensHeight: number;
  @Input() lensWidth: number;
  @Input() autoCrop: boolean;
  @Input() previewCrop: boolean;
  @Input() roundCrop: boolean;
  @Input() borderColor: string;
  @Input() backgroundOpacity: string;

  @Output() croppedImage: EventEmitter<any> = new EventEmitter<any>(null);
  @Output() error: EventEmitter<string> = new EventEmitter<string>(null);
  cropAvailable: boolean;
  loadedSourceImage: any;

  errorMessage: string;
  isDown = false;
  offSet: Array<number> = [];

  imgOne: HTMLImageElement;
  imgTwo: HTMLImageElement;

  canvasOne: HTMLCanvasElement;
  contextOne: any;

  canvasTwo: HTMLCanvasElement;
  contextTwo: any;

  canvasThree: HTMLCanvasElement;
  contextThree: any;

  canvasFour: HTMLCanvasElement;
  contextFour: any;

  constructor(
    private _el: ElementRef,
    private _renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      this.canvasOne = this._renderer.createElement("canvas");
      this.contextOne = this.canvasOne.getContext("2d");

      this.canvasTwo = this._renderer.createElement("canvas");
      this.contextTwo = this.canvasTwo.getContext("2d");

      this.canvasThree = this._renderer.createElement("canvas");
      this.contextThree = this.canvasThree.getContext("2d");

      this.canvasFour = this._renderer.createElement("canvas");
      this.contextFour = this.canvasFour.getContext("2d");

      this.imgOne = this._renderer.createElement("img");
      this.imgTwo = this._renderer.createElement("img");
    }
  }

  get crContainer() {
    return this._el.nativeElement.querySelector(".cr-container");
  }

  get crRange() {
    return this._el.nativeElement.querySelector("#cr-range");
  }

  get crImage() {
    return this._el.nativeElement.querySelector("#cr-image");
  }

  get crLens() {
    return this._el.nativeElement.querySelector("#cr-lens");
  }

  get btn() {
    return this._el.nativeElement.querySelector("#crop");
  }

  get testImg() {
    return this._el.nativeElement.querySelector("#test-img");
  }

  get finalCrop() {
    return this._el.nativeElement.querySelector("#final-crop");
  }

  get fileUpload() {
    return this._el.nativeElement.querySelector("#file-upload");
  }

  ngOnInit() {
    if (this.sourceImage) {
      if (this.sourceImage.target && this.sourceImage.target.files) {
        this.parseFile(this.sourceImage);
      }
    }
  }

  ngAfterViewInit() {
    if (this.sourceImage) {
      if (this.imgOne) {
        this._renderer.setProperty(
          this.imgOne,
          "src",
          this.crImage.getAttribute("src")
        );
      }
      this.setUpListeners();
      this.setUpConfigurations();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.sourceImage &&
      !changes.sourceImage.firstChange &&
      changes.sourceImage.currentValue
    ) {
      this.clearImagePosition();

      if (
        changes.sourceImage.currentValue.target &&
        changes.sourceImage.currentValue.target.files
      ) {
        this.parseFile(this.sourceImage);
      } else {
        if (this.imgOne) {
          this._renderer.setProperty(
            this.imgOne,
            "src",
            this.crImage.getAttribute("src")
          );

          this.setUpListeners();
          this.setUpConfigurations();
        }
      }
    }
  }

  setUpListeners() {
    if (this.isBrowser) {
      this._renderer.listen(this.crRange, "input", event => {
        this.linkImageToRangeInput(event.target.value);
      });

      this._renderer.listen(this.crImage, "mousedown", event => {
        this.mouseDownOnImage(event);
      });

      this._renderer.listen(this.crImage, "mouseup", event => {
        this.mouseUpOnImage();

        if (this.autoCrop) {
          this.resizeAndCropImage();
        }
      });

      this._renderer.listen(this.crImage, "mousemove", event => {
        event.preventDefault();
        this.mouseMoveOnImage(event);
      });

      this._renderer.listen(this.crContainer, "mouseout", event => {
        this.keepMouseMoveInsideContainer();
      });

      this._renderer.listen(this.btn, "click", event => {
        this.resizeAndCropImage();
      });
    }
  }

  setUpConfigurations() {
    this.setBorderColor();
    this.setBackgroundOpacity();
    this.setLensHeightAndWidth();
  }

  linkImageToRangeInput(value: any) {
    const val = value / 100;
    this.crImage.style.transform = `scale(${val})`;
  }

  mouseDownOnImage(event: any) {
    this.isDown = true;
    this.offSet = [
      event.target.offsetLeft - event.clientX,
      event.target.offsetTop - event.clientY
    ];
  }

  mouseUpOnImage() {
    this.isDown = false;
  }

  mouseMoveOnImage(event: any) {
    if (this.isDown) {
      const mousePosition = {
        x: event.clientX,
        y: event.clientY
      };
      this.crImage.style.left = mousePosition.x + this.offSet[0] + "px";
      this.crImage.style.top = mousePosition.y + this.offSet[1] + "px";
    }
  }

  keepMouseMoveInsideContainer() {
    this.isDown = false;
  }

  checkForOverlap(e1, e2) {
    if (e1.length && e1.length > 1) {
      e1 = e1[0];
    }
    if (e2.length && e2.length > 1) {
      e2 = e2[0];
    }
    const rect1 = e1 instanceof Element ? e1.getBoundingClientRect() : false;
    const rect2 = e2 instanceof Element ? e2.getBoundingClientRect() : false;

    let overlap = null;
    if (rect1 && rect2) {
      overlap = !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
      );
      return [overlap, rect1, rect2];
    } else {
      return [overlap, rect1, rect2];
    }
  }

  getResizeRatio() {
    const transform = this.crImage.style.transform;
    const matrix = transform
      .substring(transform.indexOf("(") + 1, transform.indexOf(")"))
      .split(",");
    return matrix.length > 0 ? matrix[0] : null;
  }

  drawImageResize() {
    const ratio = this.getResizeRatio();
    this.canvasTwo.width = this.imgOne.width;
    this.canvasTwo.height = this.imgOne.height;
    this.contextTwo.drawImage(this.imgOne, 0, 0);
    this.canvasOne.width = this.imgOne.width * ratio;
    this.canvasOne.height = this.imgOne.height * ratio;
    this.contextOne.drawImage(
      this.canvasTwo,
      0,
      0,
      this.canvasTwo.width,
      this.canvasTwo.height,
      0,
      0,
      this.canvasOne.width,
      this.canvasOne.height
    );

    const i = this.canvasOne.toDataURL("image/png", 100);

    if (this.testImg) {
      this._renderer.setProperty(this.testImg, "src", i);
    }
    return i;
  }

  drawImageCrop(src: string) {
    const overlap = this.checkForOverlap(this.crLens, this.crImage);

    if (this.imgTwo) {
      this._renderer.setProperty(this.imgTwo, "src", src);

      return new Promise((resolve, reject) => {
        this._renderer.listen(this.imgTwo, "load", event => {
          this.canvasThree.width = event.target.width;
          this.canvasThree.height = event.target.height;
          this.contextThree.drawImage(this.imgTwo, 0, 0);
          this.canvasFour.width = this.lensWidth;
          this.canvasFour.height = this.lensHeight;

          if (overlap) {
            const xCrop = overlap[1]["x"] - overlap[2]["x"];
            const yCrop = overlap[1]["y"] - overlap[2]["y"];

            this.contextFour.drawImage(
              this.canvasThree,
              xCrop,
              yCrop,
              this.lensWidth,
              this.lensHeight,
              0,
              0,
              this.lensWidth,
              this.lensHeight
            );

            if (this.roundCrop) {
              this.contextFour.globalCompositeOperation = "destination-in";
              this.contextFour.beginPath();
              this.contextFour.arc(
                this.lensWidth / 2,
                this.lensHeight / 2,
                this.lensHeight / 2,
                0,
                Math.PI * 2
              );
              this.contextFour.closePath();
              this.contextFour.fill();
            }

            const b = this.canvasFour.toDataURL("image/png", 100);
            this.cropAvailable = true;

            setTimeout(() => {
              if (this.finalCrop) {
                this._renderer.setProperty(this.finalCrop, "src", b);
              }
            });

            resolve(b);
          }
        });
      });
    }
  }

  resizeAndCropImage() {
    const imgSrc = this.drawImageResize();
    this.drawImageCrop(imgSrc).then(result => {
      this.croppedImage.emit(result);
      console.log(result);
    });
  }

  setLensHeightAndWidth() {
    if (this.lensHeight && this.lensHeight !== 150) {
      this._renderer.setStyle(this.crLens, "height", this.lensHeight + "px");
    }
    if (this.lensWidth && this.lensWidth !== 150) {
      this._renderer.setStyle(this.crLens, "width", this.lensWidth + "px");
    }
    if (this.roundCrop) {
      this._renderer.addClass(this.crLens, "rounded");
    }
  }

  setBorderColor() {
    if (this.borderColor) {
      this._renderer.setStyle(
        this.crContainer,
        "border-color",
        this.borderColor
      );

      this._renderer.setStyle(this.crLens, "border-color", this.borderColor);

      const spans = this.crLens.querySelectorAll("span");
      spans.forEach(element => {
        this._renderer.setStyle(element, "border-color", this.borderColor);
      });
    }
  }

  setBackgroundOpacity() {
    if (this.backgroundOpacity && this.crLens) {
      this._renderer.setStyle(
        this.crLens,
        "box-shadow",
        "0 0 0 200000px rgba(0, 0, 0, " + this.backgroundOpacity + ")"
      );
    }
  }

  parseFile(event: any) {
    const file = event.target.files[0];

    if (
      file.type === "image/png" ||
      file.type === "image/jpeg" ||
      file.type === "image/gif" ||
      file.type === "image/tiff"
    ) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.addEventListener("load", e => {
        const val = reader.result.toString();

        this._renderer.setProperty(this.crImage, "src", val);
        this.loadedSourceImage = this.crImage.getAttribute("src");

        this._renderer.setProperty(
          this.imgOne,
          "src",
          this.crImage.getAttribute("src")
        );

        this.setUpListeners();
        this.setUpConfigurations();
      });
      reader.onerror = function() {
        console.log("there are some problems");
      };
    } else {
      this.loadedSourceImage = null;
      if (this.crContainer) {
        this._renderer.addClass(this.crContainer, "error");
      }
      this.errorMessage = "Invalid file type.";
      this.error.emit(this.errorMessage);
    }
  }

  clearImagePosition() {
    if (this.crImage) {
      this.crImage.style.left = "auto";
      this.crImage.style.top = "auto";
    }
  }
}
