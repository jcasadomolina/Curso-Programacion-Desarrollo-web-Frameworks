import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Note } from './note.model';
import { NotesFirebaseService } from './notes-firebase.service';

type View = 'notes' | 'calendar' | 'board';

interface CalendarDay {
  date: string;
  day: number;
  inMonth: boolean;
  isToday: boolean;
}

@Component({
  imports: [FormsModule],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly notesService = inject(NotesFirebaseService);
  protected readonly activeView = signal<View>('notes');
  protected readonly searchTerm = signal('');
  protected readonly editingId = signal<string | null>(null);
  protected readonly selectedDate = signal(new Date().toISOString().slice(0, 10));
  protected readonly calendarMonth = signal(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  protected readonly notes = this.notesService.notes;
  protected readonly draft = signal<Note>(this.emptyNote());

  constructor() {
    this.notesService.initialize([
      { id: 'demo-1', title: 'Diseñar portada', content: 'Definir una portada clara y con personalidad.', tag: 'Diseño', color: 'coral', date: new Date().toISOString().slice(0, 10), column: 'doing' },
      { id: 'demo-2', title: 'Ideas para la newsletter', content: 'Recopilar referencias y preparar el primer borrador.', tag: 'Trabajo', color: 'mint', date: '', column: 'ideas' },
      { id: 'demo-3', title: 'Revisar presupuesto', content: 'Comprobar los gastos del último trimestre.', tag: 'Personal', color: 'lavender', date: '', column: 'done' },
    ]);
  }

  protected readonly filteredNotes = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    return this.notes().filter((note) => !term || `${note.title} ${note.content} ${note.tag}`.toLowerCase().includes(term));
  });

  protected readonly calendarTitle = computed(() => new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(this.calendarMonth()));
  protected readonly calendarDays = computed(() => this.buildCalendarDays(this.calendarMonth()));

  protected setView(view: View): void {
    this.activeView.set(view);
  }

  protected updateDraft(field: keyof Note, value: string): void {
    this.draft.update((draft) => ({ ...draft, [field]: value }));
  }

  protected saveNote(): void {
    const note = this.draft();
    if (!note.title.trim()) return;
    if (this.editingId() !== null) {
      void this.notesService.update(this.editingId()!, this.noteData({ ...note, title: note.title.trim() }));
    } else {
      void this.notesService.create(this.noteData({ ...note, title: note.title.trim() }));
    }
    this.resetEditor();
  }

  protected editNote(note: Note): void {
    if (!note.id) return;
    this.editingId.set(note.id);
    this.draft.set({ ...note });
    this.activeView.set('notes');
  }

  protected deleteNote(id: string | undefined): void {
    if (!id) return;
    void this.notesService.delete(id);
    if (this.editingId() === id) this.resetEditor();
  }

  protected resetEditor(): void {
    this.editingId.set(null);
    this.draft.set(this.emptyNote());
  }

  protected moveNote(id: string | undefined, column: Note['column']): void {
    if (id) void this.notesService.update(id, { column });
  }

  protected addToCalendar(note: Note): void {
    if (note.id) void this.notesService.update(note.id, { date: this.selectedDate() });
  }

  protected changeCalendarMonth(offset: number): void {
    const month = this.calendarMonth();
    this.calendarMonth.set(new Date(month.getFullYear(), month.getMonth() + offset, 1));
  }

  protected goToToday(): void {
    const today = new Date();
    this.calendarMonth.set(new Date(today.getFullYear(), today.getMonth(), 1));
    this.selectedDate.set(this.dateKey(today));
  }

  protected selectCalendarDate(date: string): void {
    this.selectedDate.set(date);
  }

  protected notesForDate(date: string): Note[] {
    return this.notes().filter((note) => note.date === date);
  }

  protected columnNotes(column: Note['column']): Note[] {
    return this.notes().filter((note) => note.column === column);
  }

  private emptyNote(): Note {
    return { title: '', content: '', tag: 'Personal', color: 'coral', date: '', column: 'ideas' };
  }

  private noteData(note: Note): Omit<Note, 'id'> {
    return { title: note.title, content: note.content, tag: note.tag, color: note.color, date: note.date, column: note.column };
  }

  private buildCalendarDays(month: Date): CalendarDay[] {
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const today = this.dateKey(new Date());
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(month.getFullYear(), month.getMonth(), index - startOffset + 1);
      return { date: this.dateKey(date), day: date.getDate(), inMonth: date.getMonth() === month.getMonth(), isToday: this.dateKey(date) === today };
    });
  }

  private dateKey(date: Date): string {
    return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
  }
}
