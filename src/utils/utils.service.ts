import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })

export class UtilsService{
    
   public static formatTextForJson(text: string): string {
        let formattedText = text.replace(/\n/g, '\\n');
        formattedText = formattedText.replace(/"/g, '\\"').replace(/\\/g, '\\\\');
        return formattedText;
    }

    public static cleanMarkdown(raw: string): string {


          return raw
          .replace(/\\n/g, '\n')     // quebra de linha
          .replace(/\\"/g, '"')      // aspas duplas
          .replace(/\\t/g, '\t')     // tabulação (se houver)
          .replace(/ {2,}/g, ' ')    // múltiplos espaços → um espaço
          .trim();                           // Remove espaços no início/fim
      }
}