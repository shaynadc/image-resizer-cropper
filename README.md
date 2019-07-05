# Image Resizer Cropper

This is a simple image resizing cropper, built for Angular 7, compatible with Angular Universal (SSR).

## Demo

[https://stackblitz.com/edit/angular-yjncog](https://stackblitz.com/edit/angular-yjncog)

## Installing

Install from npm

```
npm i --save image-resizer-cropper
```

Import into your module. Can be the root module or any other.

```
import { ImageResizerCropperModule } from "image-resizer-cropper";

@NgModule({
  declarations: [AppComponent],
  imports: [ImageResizerCropperModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

Add to your html.

```
<input type="file" id="file-upload" (input)="receiveFile($event)" />

<irc-image-resizer-cropper
  [sourceImage]="fileReceived"
  [lensHeight]="150"
  [lensWidth]="150"
  [autoCrop]="false"
  [roundCrop]="false"
  [previewCrop]="true"
  [borderColor]="'#333'"
  [backgroundOpacity]="0.3"
  (croppedImage)="receiveCroppedImage($event)"
  (error)="receiveError($event)"
></irc-image-resizer-cropper>
```

Connect the file to the cropper

```
export class AppComponent implements OnInit {
  title = "image-resizer-cropper";
  fileReceived: any;

  constructor() {}

  ngOnInit() {}

  receiveFile(event: any) {
    this.fileReceived = event;
  }

  receiveError(event: any) {
    console.log(event);
  }

  receiveCroppedImage(event: any){
    console.log(event);
  }
}
```

## Configuration

### sourceImage

This can be either the path to an image or it can be the event from a file input.

### lensHeight

This receives a number value that specifies the height of the cropping area

### lensWidth

This receives a number value that specifies the width of the cropping area.

### autoCrop

This receives a boolean value. If set to true, your image will be cropped every time the mouse click is released. If set to false, the image will crop when you click the crop button.

### roundCrop

This receives a boolean value. If set to true, the cropping area will be circular.

### previewCrop

This receives a boolean value. If set to true, the cropped image will appear.

### borderColor

This receives a string hexdecimal value, preceded by a _#_. Example: #333.

### backgroundOpacity

This receives a decimal number from 0.0 to 1.0, which sets the opacity of the background covering the image outside of the cropping area.

### croppedImage

This is an event which will deliver to you the cropped image in base 64 format (data uri). This is the only format the cropper will deliver. If you'd like to create an image file with this value, you can convert it to a blob (createObjectUrl()) upon reception

### error

This is an event which will notify you on a file type error. The current valid file types are image/png, image/jpeg, image/gif, and image/tiff

## Built With

- [Angular](https://angular.io/)

## Author

- **Shayna Dunn** \*

## License

This project is licensed under the MIT License. Use as you see fit! If you'd like to make any changes, fork the project and submit a pull request. If you'd like to see some functionality added or have an issue, I'll try to get it done (no promises though -- this isn't my day job!).
