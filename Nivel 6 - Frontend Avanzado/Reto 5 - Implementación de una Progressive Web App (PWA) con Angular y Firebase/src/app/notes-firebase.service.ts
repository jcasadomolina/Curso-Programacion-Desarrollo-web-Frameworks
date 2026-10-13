import { Injectable, PLATFORM_ID, inject, isDevMode, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Database, listVal, ref, remove, set, update } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { Note } from './note.model';

type PendingOperation =
  | { type: 'create'; id: string; note: Omit<Note, 'id'> }
  | { type: 'update'; id: string; changes: Partial<Omit<Note, 'id'>> }
  | { type: 'delete'; id: string };

@Injectable({ providedIn: 'root' })
export class NotesFirebaseService {
  private readonly database = inject(Database);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly notesReference = ref(this.database, 'notes');
  private readonly storageKey = 'noto-notes';
  private readonly pendingKey = 'noto-notes-pending';
  private pendingOperations: PendingOperation[] = this.readStorage(this.pendingKey, []);

  readonly notes$: Observable<Note[]> = listVal<Note>(this.notesReference, { keyField: 'id' });
  readonly notes = signal<Note[]>(this.readStorage<Note[]>(this.storageKey, []));
  readonly online = signal(this.isOnline());

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;

    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', () => this.online.set(false));
    this.notes$.subscribe((remoteNotes) => {
      if (this.pendingOperations.length === 0) {
        this.setNotes(remoteNotes);
      } else {
        this.setNotes(this.applyPendingOperations(remoteNotes));
      }
    });
    void this.flushPendingOperations();
  }

  initialize(initialNotes: Note[]): void {
    if (this.notes().length === 0 && this.pendingOperations.length === 0) {
      this.setNotes(initialNotes);
    }
  }

  async create(note: Omit<Note, 'id'>): Promise<string> {
    const id = this.createId();
    this.setNotes([{ ...note, id }, ...this.notes()]);
    this.enqueue({ type: 'create', id, note });
    await this.flushPendingOperations();
    return id;
  }

  async update(id: string, changes: Partial<Omit<Note, 'id'>>): Promise<void> {
    this.setNotes(this.notes().map((note) => note.id === id ? { ...note, ...changes, id } : note));
    this.enqueue({ type: 'update', id, changes });
    await this.flushPendingOperations();
  }

  async delete(id: string): Promise<void> {
    this.setNotes(this.notes().filter((note) => note.id !== id));
    this.enqueue({ type: 'delete', id });
    await this.flushPendingOperations();
  }

  private readonly handleOnline = (): void => {
    this.online.set(true);
    void this.flushPendingOperations();
  };

  private async flushPendingOperations(): Promise<void> {
    if (!this.isOnline() || this.pendingOperations.length === 0) return;

    while (this.pendingOperations.length > 0) {
      const operation = this.pendingOperations[0];
      try {
        if (operation.type === 'create') {
          await set(ref(this.database, `notes/${operation.id}`), operation.note);
        } else if (operation.type === 'update') {
          await update(ref(this.database, `notes/${operation.id}`), operation.changes);
        } else {
          await remove(ref(this.database, `notes/${operation.id}`));
        }
        this.pendingOperations.shift();
        this.writeStorage(this.pendingKey, this.pendingOperations);
      } catch {
        this.online.set(false);
        return;
      }
    }
  }

  private enqueue(operation: PendingOperation): void {
    this.pendingOperations.push(operation);
    this.writeStorage(this.pendingKey, this.pendingOperations);
  }

  private applyPendingOperations(remoteNotes: Note[]): Note[] {
    return this.pendingOperations.reduce((notes, operation) => {
      if (operation.type === 'create') return [{ ...operation.note, id: operation.id }, ...notes];
      if (operation.type === 'update') return notes.map((note) => note.id === operation.id ? { ...note, ...operation.changes, id: operation.id } : note);
      return notes.filter((note) => note.id !== operation.id);
    }, remoteNotes);
  }

  private setNotes(notes: Note[]): void {
    this.notes.set(notes);
    this.writeStorage(this.storageKey, notes);
  }

  private isOnline(): boolean {
    return !isPlatformBrowser(this.platformId) || navigator.onLine;
  }

  private createId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  private readStorage<T>(key: string, fallback: T): T {
    if (!isPlatformBrowser(this.platformId)) return fallback;
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) as T : fallback;
    } catch {
      return fallback;
    }
  }

  private writeStorage<T>(key: string, value: T): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      if (isDevMode()) console.warn(`No se pudo guardar ${key} en localStorage`);
    }
  }
}
