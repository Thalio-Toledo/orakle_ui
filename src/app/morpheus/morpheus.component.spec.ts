import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MorpheusComponent } from './morpheus.component';

describe('MorpheusComponent', () => {
  let component: MorpheusComponent;
  let fixture: ComponentFixture<MorpheusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MorpheusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MorpheusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
