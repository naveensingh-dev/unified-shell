import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateDirective } from '../../../core/directives/translate.directive';
import { TranslationService } from '../../../services/translation.service';

@Component({
  selector: 'app-scheduler',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateDirective],
  template: `
    <div class="sch-container">
      <div class="sch-header">
        <h1 [appTranslate]="'scheduler.title'"></h1>
        <p class="sch-desc" [appTranslate]="'scheduler.desc'"></p>
        
        <div class="sch-progress">
          <div class="p-step" [class.act]="activeStep() >= 1" [appTranslate]="'scheduler.steps.s1'"></div>
          <div class="p-line" [class.act]="activeStep() >= 2"></div>
          <div class="p-step" [class.act]="activeStep() >= 2" [appTranslate]="'scheduler.steps.s2'"></div>
          <div class="p-line" [class.act]="activeStep() >= 3"></div>
          <div class="p-step" [class.act]="activeStep() >= 3" [appTranslate]="'scheduler.steps.s3'"></div>
          <div class="p-line" [class.act]="activeStep() >= 4"></div>
          <div class="p-step" [class.act]="activeStep() >= 4" [appTranslate]="'scheduler.steps.s4'"></div>
        </div>
      </div>

      <div class="sch-content">
        <!-- STEP 1: CALENDAR -->
        @if (activeStep() === 1) {
          <div class="cal-wrapper fadeIn">
            <div class="cal-header">
              <button class="cal-btn" (click)="prevMonth()">←</button>
              <div class="cal-month">{{monthYearString()}}</div>
              <button class="cal-btn" (click)="nextMonth()">→</button>
            </div>
            <div class="cal-grid header">
              @for (day of weekDays(); track day) { <div class="cal-dw">{{day}}</div> }
            </div>
            <div class="cal-grid body">
              @for (cell of calendarGrid(); track $index) {
                <button class="cal-cell" 
                        [class.dim]="!cell.current" 
                        [class.disabled]="cell.disabled"
                        [class.today]="cell.isToday"
                        [class.selected]="selectedDate()?.toDateString() === cell.date.toDateString()"
                        [disabled]="cell.disabled"
                        (click)="selectDate(cell.date)">
                  {{cell.date.getDate()}}
                </button>
              }
            </div>
          </div>
        }

        <!-- STEP 2: TIME SLOTS -->
        @if (activeStep() === 2) {
          <div class="time-wrapper fadeIn">
            <h3 class="step-lbl">{{ slotsLabel() }}</h3>
            <div class="sch-slots">
              @for (slot of timeSlots; track slot) {
                <button class="sch-slot" [class.act]="selectedTime() === slot" (click)="selectTime(slot)">
                  {{slot}}
                </button>
              }
            </div>
            <button class="back-btn" (click)="activeStep.set(1)" [appTranslate]="'scheduler.back_to_cal'"></button>
          </div>
        }

        <!-- STEP 3: AGENDA -->
        @if (activeStep() === 3) {
          <div class="agenda-wrapper fadeIn">
            <h3 class="step-lbl" [appTranslate]="'scheduler.sync_agenda'"></h3>
            <textarea class="sch-textarea" [appTranslateAttr]="{ placeholder: 'scheduler.agenda_placeholder' }" [(ngModel)]="agenda" rows="4"></textarea>
            <div class="btn-row">
              <button class="back-btn" (click)="activeStep.set(2)" [appTranslate]="'scheduler.back'"></button>
              <button class="fwd-btn" [disabled]="!agenda()" (click)="activeStep.set(4)" [appTranslate]="'scheduler.finalize'"></button>
            </div>
          </div>
        }

        <!-- STEP 4: SCHEDULE / INTEGRATION -->
        @if (activeStep() === 4) {
          <div class="final-wrapper fadeIn">
            <h3 class="step-lbl" [appTranslate]="'scheduler.lock_title'"></h3>
            <div class="final-card">
              <div class="fc-row"><span class="fc-l" [appTranslate]="'scheduler.date_label'"></span> <span class="fc-v">{{formattedSelectedDate()}}</span></div>
              <div class="fc-row"><span class="fc-l" [appTranslate]="'scheduler.time_label'"></span> <span class="fc-v">{{selectedTime()}} (30 mins)</span></div>
              <div class="fc-row"><span class="fc-l" [appTranslate]="'scheduler.guest_label'"></span> <span class="fc-v">n_aveen&#64;outlook.com</span></div>
            </div>
            
            <p class="fc-hint" [appTranslate]="'scheduler.fc_hint'"></p>
            <div class="cal-links">
              <a [href]="getGoogleCalLink()" target="_blank" class="provider-btn gcal">
                <span class="p-ico">G</span> <span [appTranslate]="'scheduler.gcal'"></span>
              </a>
              <a [href]="getOutlookLink()" target="_blank" class="provider-btn outlook">
                <span class="p-ico">O</span> <span [appTranslate]="'scheduler.outlook'"></span>
              </a>
              <a [href]="getYahooLink()" target="_blank" class="provider-btn yahoo">
                <span class="p-ico">Y</span> <span [appTranslate]="'scheduler.yahoo'"></span>
              </a>
            </div>
            <button class="back-btn" style="margin-top:2rem;" (click)="activeStep.set(3)" [appTranslate]="'scheduler.edit'"></button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100%; width: 100%; overflow: hidden; }
    .sch-container { display: flex; flex-direction: column; height: 100%; width: 100%; background: #03040e; padding: 2rem; color: #fff; }
    .sch-header { flex-shrink: 0; margin-bottom: 2rem; }
    .sch-desc { color: var(--text3); font-size: 0.95rem !important; max-width: 600px; line-height: 1.5; margin-bottom: 2rem; }

    .sch-progress { display: flex; align-items: center; max-width: 500px; }
    .p-step { font-family: var(--font-m); font-size: 0.65rem !important; color: var(--text3); text-transform: uppercase; font-weight: 700; transition: color 0.3s; }
    .p-step.act { color: var(--ice); }
    .p-line { flex: 1; height: 2px; background: rgba(255,255,255,0.1); margin: 0 10px; transition: background 0.3s; }
    .p-line.act { background: var(--ice); }

    .sch-content { flex: 1; overflow-y: auto; padding-right: 1.5rem; min-height: 0; scrollbar-width: thin; scrollbar-color: var(--ice) transparent; }
    .sch-content::-webkit-scrollbar { width: 8px; }
    .sch-content::-webkit-scrollbar-thumb { background: rgba(86, 205, 250, 0.3); border-radius: 10px; }

    .fadeIn { animation: fadeIn 0.4s ease forwards; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    /* CALENDAR UI */
    .cal-wrapper { max-width: 400px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 1.5rem; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
    .cal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .cal-month { font-family: var(--font-d); font-size: 1.2rem !important; font-weight: 800; color: #fff; text-transform: uppercase; letter-spacing: 0.05em; }
    .cal-btn { width: 32px; height: 32px; border-radius: 8px; background: rgba(255,255,255,0.05); color: #fff; font-weight: bold; border: 1px solid transparent; transition: all 0.2s; cursor: pointer; }
    .cal-btn:hover { background: rgba(86,205,250,0.1); border-color: rgba(86,205,250,0.3); color: var(--ice); }
    
    .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }
    .cal-grid.header { margin-bottom: 10px; }
    .cal-dw { text-align: center; font-family: var(--font-m); font-size: 0.65rem !important; color: var(--text3); font-weight: 700; }
    
    .cal-cell { 
      aspect-ratio: 1; border-radius: 8px; background: transparent; color: #fff; font-family: var(--font-b); font-weight: 600; font-size: 0.9rem !important;
      border: 1px solid transparent; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center;
    }
    .cal-cell.dim { opacity: 0.3; }
    .cal-cell.today { border-color: rgba(86,205,250,0.5); color: var(--ice); }
    .cal-cell:hover:not(.disabled) { background: rgba(86,205,250,0.1); border-color: rgba(86,205,250,0.3); }
    .cal-cell.selected { background: var(--ice); color: #000; font-weight: 800; border-color: var(--ice); box-shadow: 0 0 15px rgba(86,205,250,0.4); }
    .cal-cell.disabled { 
      color: var(--rose); text-decoration: line-through; opacity: 0.5; cursor: not-allowed; background: rgba(255,107,122,0.05);
    }

    .step-lbl { font-family: var(--font-m); font-size: 0.8rem !important; color: var(--ice); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1.5rem; }

    /* TIME SLOTS */
    .time-wrapper { max-width: 500px; }
    .sch-slots { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 10px; margin-bottom: 2rem; }
    .sch-slot { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); padding: 14px; border-radius: 8px; font-family: var(--font-m); font-size: 0.85rem !important; color: var(--text2); transition: all 0.2s; text-align: center; cursor: pointer; }
    .sch-slot:hover { border-color: var(--ice); color: #fff; background: rgba(86,205,250,0.05); }
    .sch-slot.act { background: var(--ice); color: #000; border-color: var(--ice); font-weight: 800; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(86,205,250,0.2); }

    /* AGENDA */
    .agenda-wrapper { max-width: 500px; }
    .sch-textarea { width: 100%; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.1); padding: 1rem; border-radius: 12px; color: #fff; font-family: var(--font-b); font-size: 0.95rem !important; resize: vertical; outline: none; transition: border-color 0.3s; margin-bottom: 2rem; }
    .sch-textarea:focus { border-color: var(--ice); background: rgba(255,255,255,0.04); }

    /* FINAL */
    .final-wrapper { max-width: 500px; }
    .final-card { background: rgba(86,205,250,0.05); border: 1px solid rgba(86,205,250,0.2); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem; }
    .fc-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 0.95rem !important; }
    .fc-row:last-child { margin-bottom: 0; }
    .fc-l { color: var(--text3); font-family: var(--font-m); text-transform: uppercase; font-size: 0.7rem !important; }
    .fc-v { font-weight: 700; color: #fff; }
    .fc-hint { font-size: 0.85rem !important; color: var(--text3); margin-bottom: 1rem; }

    .cal-links { display: flex; flex-direction: column; gap: 12px; }
    .provider-btn { display: flex; align-items: center; gap: 12px; padding: 14px 20px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 0.9rem !important; transition: all 0.2s; color: #fff; cursor: pointer; }
    .provider-btn.gcal { background: #4285F4; border: 1px solid #4285F4; }
    .provider-btn.outlook { background: #0078D4; border: 1px solid #0078D4; }
    .provider-btn.yahoo { background: #6001D2; border: 1px solid #6001D2; }
    .provider-btn:hover { filter: brightness(1.2); transform: translateX(5px); }
    .p-ico { font-family: var(--font-d); font-weight: 900; font-size: 1.2rem; background: rgba(255,255,255,0.2); width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 6px; }

    /* BUTTONS */
    .btn-row { display: flex; justify-content: space-between; align-items: center; }
    .back-btn { font-family: var(--font-m); font-size: 0.75rem !important; color: var(--text3); text-transform: uppercase; letter-spacing: 0.05em; transition: color 0.2s; cursor: pointer; background: transparent; border: none;}
    .back-btn:hover { color: #fff; }
    .fwd-btn { background: var(--ice); color: #000; font-weight: 800; padding: 12px 24px; border-radius: 8px; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.75rem !important; transition: all 0.2s; border: none; cursor: pointer;}
    .fwd-btn:disabled { opacity: 0.3; cursor: not-allowed; }
    .fwd-btn:not(:disabled):hover { background: #fff; box-shadow: 0 5px 15px rgba(86,205,250,0.3); }

    @media (max-width: 768px) {
      .sch-container { padding: 1.5rem; }
      .sch-progress { display: none; }
    }
  `]
})
export class SchedulerComponent {
  private ts = inject(TranslationService);
  currentDate = new Date();
  displayDate = signal(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1));
  
  selectedDate = signal<Date | null>(null);
  selectedTime = signal<string>('');
  agenda = signal<string>('');
  
  activeStep = signal<1 | 2 | 3 | 4>(1);

  weekDays = computed(() => {
    return this.ts.translate('scheduler.weekdays') as unknown as string[];
  });

  timeSlots = ['11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM'];

  calendarGrid = computed(() => {
    const d = this.displayDate();
    const year = d.getFullYear();
    const month = d.getMonth();
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const grid = [];
    
    for (let i = firstDay - 1; i >= 0; i--) {
      grid.push({ date: new Date(year, month - 1, daysInPrevMonth - i), current: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      grid.push({ date: new Date(year, month, i), current: true });
    }
    const remaining = 42 - grid.length;
    for (let i = 1; i <= remaining; i++) {
      grid.push({ date: new Date(year, month + 1, i), current: false });
    }
    
    return grid.map(cell => ({
      ...cell,
      disabled: this.isDisabled(cell.date),
      isToday: this.isToday(cell.date)
    }));
  });

  monthYearString = computed(() => {
    return this.displayDate().toLocaleString(this.ts.lang().toLowerCase(), { month: 'long', year: 'numeric' });
  });

  formattedSelectedDate = computed(() => {
    const date = this.selectedDate();
    if (!date) return '';
    return date.toLocaleDateString(this.ts.lang().toLowerCase(), { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  });

  slotsLabel = computed(() => {
    const date = this.selectedDate();
    const dateStr = date ? date.toLocaleDateString(this.ts.lang().toLowerCase()) : '';
    return this.ts.translate('scheduler.slots_for').replace('{{date}}', dateStr);
  });

  nextMonth() {
    const d = this.displayDate();
    this.displayDate.set(new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }
  
  prevMonth() {
    const d = this.displayDate();
    this.displayDate.set(new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  isSameDate(d1: Date, d2: Date) {
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  }

  isToday(date: Date) { return this.isSameDate(date, this.currentDate); }
  
  isDisabled(date: Date) {
    const today = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (date < today) return true;
    if (date.getDay() === 0) return true;
    if (this.isSameDate(date, today) || this.isSameDate(date, tomorrow)) return true;
    
    return false;
  }

  selectDate(date: Date) {
    this.selectedDate.set(date);
    this.selectedTime.set('');
    this.activeStep.set(2);
  }

  selectTime(slot: string) {
    this.selectedTime.set(slot);
    this.activeStep.set(3);
  }

  getEventDates() {
    const date = this.selectedDate();
    const time = this.selectedTime();
    if (!date || !time) return { start: '', end: '' };
    
    const [timeStr, modifier] = time.split(' ');
    let [hours, minutes] = timeStr.split(':').map(Number);
    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    
    const startDate = new Date(date);
    startDate.setHours(hours, minutes, 0);
    
    const endDate = new Date(startDate);
    endDate.setMinutes(startDate.getMinutes() + 30);
    
    const format = (d: Date) => {
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
    };
    return { start: format(startDate), end: format(endDate) };
  }

  getGoogleCalLink() {
    const dates = this.getEventDates();
    if (!dates.start) return '#';
    const title = encodeURIComponent(this.ts.translate('scheduler.event_title'));
    const details = encodeURIComponent(this.agenda());
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates.start}/${dates.end}&details=${details}&add=n_aveen@outlook.com`;
  }

  getOutlookLink() {
    const dates = this.getEventDates();
    if (!dates.start) return '#';
    const title = encodeURIComponent(this.ts.translate('scheduler.event_title'));
    const details = encodeURIComponent(this.agenda());
    return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&body=${details}&startdt=${dates.start}&enddt=${dates.end}&to=n_aveen@outlook.com`;
  }

  getYahooLink() {
    const dates = this.getEventDates();
    if (!dates.start) return '#';
    const title = encodeURIComponent(this.ts.translate('scheduler.event_title'));
    const details = encodeURIComponent(this.agenda());
    return `https://calendar.yahoo.com/?v=60&title=${title}&st=${dates.start}&et=${dates.end}&desc=${details}&inv_list=n_aveen@outlook.com`;
  }
}
