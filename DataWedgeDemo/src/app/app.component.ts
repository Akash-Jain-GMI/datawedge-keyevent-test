import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'DataWedge Demo';
  keyboardEventsLog: KeyboardEvent[] = [];
  private keyboardEvents$: BehaviorSubject<KeyboardEvent> = new BehaviorSubject<KeyboardEvent>(null);
  get keyboardEvents(): Observable<KeyboardEvent> { return this.keyboardEvents$.asObservable(); }
  keyBoardEventSubscription: Subscription;
  @ViewChild('barcodeInput', {static: false}) barcodeInput: ElementRef;
  inputIsFocused = false;
  barcode = '';

  @HostListener('document:keydown', ['$event'])
  handleScanEvent(event: KeyboardEvent): void {
    this.keyboardEvents$.next(event);
    // This is a unique condition which enables us to get the scan input captured when input field is not focused
    // We would skip this condition when input field is focused and capture the input scan directly from ngModel
    // tslint:disable-next-line: deprecation
    if (!this.inputIsFocused && event.keyCode >= 48 && event.keyCode <= 57 ) {
      this.barcode += event.key;
    // tslint:disable-next-line: deprecation
    } else if (event.which === 13) {
      // This will only work if the DataWedge Profile is configured to send Enter Key after every scan
      // under KeyStroke Output Plugin > Basic Data Formatting
      this.scanEvent();
    }
  }

  scanEvent(): void {
    this.barcodeInput.nativeElement.focus();
    this.barcodeChange();
  }

  clearBarcode(): void {
    this.barcode = '';
  }

  barcodeChange(): void {
    alert('Scanned Value is - ' + this.barcode);
    this.clearBarcode();
    this.barcodeInput.nativeElement.blur();
  }


  constructor() { }

  ngOnDestroy(): void {
    if (this.keyBoardEventSubscription) {
      this.keyBoardEventSubscription.unsubscribe();
    }
    this.keyboardEvents$.next(null);
    this.keyboardEventsLog  = [];
  }

  ngOnInit(): void {
    this.keyBoardEventSubscription = this.keyboardEvents.subscribe((ev: KeyboardEvent) => {
      if (ev) {
        this.keyboardEventsLog.push(ev);
      }
    });
  }

}
