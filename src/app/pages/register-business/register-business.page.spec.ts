import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RegisterBusinessPage } from './register-business.page';

describe('RegisterBusinessPage', () => {
  let component: RegisterBusinessPage;
  let fixture: ComponentFixture<RegisterBusinessPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterBusinessPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterBusinessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
