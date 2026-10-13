export type NoteColumn = 'ideas' | 'doing' | 'done';

export interface Note {
  id?: string;
  title: string;
  content: string;
  tag: string;
  color: string;
  date: string;
  column: NoteColumn;
}
