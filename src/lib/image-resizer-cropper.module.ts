import { NgModule } from "@angular/core";
import { ImageResizerCropperComponent } from "./image-resizer-cropper.component";
import { CommonModule } from "@angular/common";

@NgModule({
  imports: [CommonModule],
  declarations: [ImageResizerCropperComponent],
  exports: [ImageResizerCropperComponent]
})
export class ImageResizerCropperModule {}
