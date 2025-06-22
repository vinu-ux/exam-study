import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvaslistComponent } from './canvaslist.component';

describe('CanvaslistComponent', () => {
  let component: CanvaslistComponent;
  let fixture: ComponentFixture<CanvaslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanvaslistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanvaslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
