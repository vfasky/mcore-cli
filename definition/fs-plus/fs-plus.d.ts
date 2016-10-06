/// <reference types="node" />

declare module 'fs-plus' {
  export * from 'fs';
  
  export function isFileSync(path: string): boolean;
}