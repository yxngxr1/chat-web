import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatDetailsDialogComponent } from './chat-details-dialog.component';

describe('ChatDetailsDialogComponent', () => {
  let component: ChatDetailsDialogComponent;
  let fixture: ComponentFixture<ChatDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatDetailsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
