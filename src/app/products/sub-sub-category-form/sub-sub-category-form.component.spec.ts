import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubSubCategoryFormComponent } from './sub-sub-category-form.component';

describe('SubSubCategoryFormComponent', () => {
  let component: SubSubCategoryFormComponent;
  let fixture: ComponentFixture<SubSubCategoryFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubSubCategoryFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubSubCategoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
