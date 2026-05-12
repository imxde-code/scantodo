export type TodoType = 'TODO' | 'FIXME' | 'HACK' | 'NOTE' | 'XXX';
export type OutputFormat = 'table' | 'json' | 'markdown';

export interface TodoMatch {
  file: string;
  line: number;
  type: TodoType;
  comment: string;
  author?: string;
}

export interface ScanOptions {
  ignore: string[];
  types: TodoType[];
}
