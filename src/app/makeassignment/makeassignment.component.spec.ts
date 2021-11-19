import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeassignmentComponent } from './makeassignment.component';

describe('MakeassignmentComponent', () => {
  let component: MakeassignmentComponent;
  let fixture: ComponentFixture<MakeassignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakeassignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeassignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
