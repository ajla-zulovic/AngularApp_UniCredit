import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostDocumentationComponent } from './post-documentation.component';

describe('PostDocumentationComponent', () => {
  let component: PostDocumentationComponent;
  let fixture: ComponentFixture<PostDocumentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostDocumentationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostDocumentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
