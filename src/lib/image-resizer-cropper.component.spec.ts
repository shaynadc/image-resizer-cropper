import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ImageResizerCropperComponent } from "./image-resizer-cropper.component";

describe("ImageResizerCropperComponent", () => {
  let component: ImageResizerCropperComponent;
  let fixture: ComponentFixture<ImageResizerCropperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImageResizerCropperComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageResizerCropperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
