import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNumComponent } from './admin-num.component';

describe('AdminNumComponent', () => {
  let component: AdminNumComponent;
  let fixture: ComponentFixture<AdminNumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminNumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminNumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
