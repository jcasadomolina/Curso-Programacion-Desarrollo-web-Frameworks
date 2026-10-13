import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

interface DojoEvent { id: string; title: string; category: string; date: string; time: string; location: string; instructor: string; capacity: number; registered: number; status: 'Publicado' | 'Borrador'; }
interface AuthResponse { token: string; user: { id: string; name: string; email: string; role: string }; }

@Component({ imports: [CommonModule, ReactiveFormsModule], selector: 'app-root', styleUrl: './app.css', templateUrl: './app.html' })
export class App {
  private readonly formBuilder = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api';
  protected readonly token = signal(''); protected readonly authMode = signal<'login' | 'register'>('login'); protected readonly searchTerm = signal(''); protected readonly editingId = signal<string | null>(null); protected readonly showForm = signal(false); protected readonly notice = signal(''); protected readonly error = signal(''); protected readonly events = signal<DojoEvent[]>([]);
  protected readonly authForm = this.formBuilder.nonNullable.group({ name: [''], email: ['', [Validators.required, Validators.email]], password: ['', [Validators.required, Validators.minLength(8)]] });
  protected readonly eventForm = this.formBuilder.nonNullable.group({ title: ['', Validators.required], category: ['Entrenamiento', Validators.required], date: ['', Validators.required], time: ['18:30', Validators.required], location: ['Tatami principal', Validators.required], instructor: ['', Validators.required], capacity: [20, [Validators.required, Validators.min(1)]], registered: [0, [Validators.required, Validators.min(0)]], status: ['Publicado' as DojoEvent['status'], Validators.required] });
  protected readonly filteredEvents = computed(() => { const search = this.searchTerm().toLowerCase().trim(); return this.events().filter((event) => [event.title, event.category, event.instructor, event.location].some((value) => value.toLowerCase().includes(search))); });

  protected submitAuth(): void {
    if (this.authForm.invalid || (this.authMode() === 'register' && !this.authForm.controls.name.value.trim())) { this.authForm.markAllAsTouched(); return; }
    const value = this.authForm.getRawValue(); const endpoint = this.authMode() === 'login' ? '/auth/login' : '/auth/register';
    const body = this.authMode() === 'login' ? { email: value.email, password: value.password } : value;
    this.http.post<AuthResponse>(`${this.apiUrl}${endpoint}`, body).subscribe({ next: (response) => { this.token.set(response.token); this.error.set(''); this.authForm.reset(); this.loadEvents(); }, error: () => this.error.set('No se pudo autenticar. Comprueba tus datos y que el backend esté iniciado.') });
  }
  protected loadEvents(): void { this.http.get<DojoEvent[]>(`${this.apiUrl}/events`, { headers: this.authHeaders() }).subscribe({ next: (events) => this.events.set(events), error: () => this.error.set('No se pudieron cargar los eventos.') }); }
  protected openCreate(): void { this.editingId.set(null); this.eventForm.reset({ title: '', category: 'Entrenamiento', date: '', time: '18:30', location: 'Tatami principal', instructor: '', capacity: 20, registered: 0, status: 'Publicado' }); this.showForm.set(true); }
  protected editEvent(event: DojoEvent): void { this.editingId.set(event.id); this.eventForm.setValue({ title: event.title, category: event.category, date: event.date, time: event.time, location: event.location, instructor: event.instructor, capacity: event.capacity, registered: event.registered, status: event.status }); this.showForm.set(true); }
  protected closeForm(): void { this.showForm.set(false); }
  protected saveEvent(): void {
    if (this.eventForm.invalid) { this.eventForm.markAllAsTouched(); return; }
    const id = this.editingId(); const request = id ? this.http.put<DojoEvent>(`${this.apiUrl}/events/${id}`, this.eventForm.getRawValue(), { headers: this.authHeaders() }) : this.http.post<DojoEvent>(`${this.apiUrl}/events`, this.eventForm.getRawValue(), { headers: this.authHeaders() });
    request.subscribe({ next: () => { this.showForm.set(false); this.loadEvents(); this.showNotice(id ? 'Evento actualizado correctamente' : 'Evento guardado en MongoDB'); }, error: () => this.error.set('No se pudo guardar el evento. Inicia sesión de nuevo si el token ha caducado.') });
  }
  protected deleteEvent(event: DojoEvent): void { if (!window.confirm(`¿Eliminar "${event.title}"?`)) return; this.http.delete(`${this.apiUrl}/events/${event.id}`, { headers: this.authHeaders() }).subscribe({ next: () => { this.loadEvents(); this.showNotice('Evento eliminado'); }, error: () => this.error.set('No se pudo eliminar el evento.') }); }
  protected logout(): void { this.token.set(''); this.events.set([]); }
  protected formatDate(date: string): string { return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short' }).format(new Date(`${date}T12:00:00`)); }
  private authHeaders(): HttpHeaders { return new HttpHeaders({ Authorization: `Bearer ${this.token()}` }); }
  private showNotice(message: string): void { this.error.set(''); this.notice.set(message); window.setTimeout(() => this.notice.set(''), 2800); }
}