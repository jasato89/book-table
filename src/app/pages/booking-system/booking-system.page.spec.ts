import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BookingSystemPage } from './booking-system.page';

describe('BookingSystemPage', () => {
  let component: BookingSystemPage;
  let fixture: ComponentFixture<BookingSystemPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingSystemPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BookingSystemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
