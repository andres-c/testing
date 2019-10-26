import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreCountDownComponent } from './pre-count-down.component';

describe('PreCountDownComponent', () => {
  let component: PreCountDownComponent;
  let fixture: ComponentFixture<PreCountDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreCountDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreCountDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
