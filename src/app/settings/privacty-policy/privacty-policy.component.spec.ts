import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivactyPolicyComponent } from './privacty-policy.component';

describe('PrivactyPolicyComponent', () => {
  let component: PrivactyPolicyComponent;
  let fixture: ComponentFixture<PrivactyPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivactyPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivactyPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
