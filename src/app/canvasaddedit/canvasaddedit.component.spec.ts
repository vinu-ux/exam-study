import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasaddeditComponent } from './canvasaddedit.component';

describe('CanvasaddeditComponent', () => {
  let component: CanvasaddeditComponent;
  let fixture: ComponentFixture<CanvasaddeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanvasaddeditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanvasaddeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
