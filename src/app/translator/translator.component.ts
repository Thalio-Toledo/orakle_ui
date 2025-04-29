import { Component, Input, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { marked, Renderer } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { ArtefactService } from '../services/artefact.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';


import { ProgressSpinner } from 'primeng/progressspinner';


@Component({
  selector: 'app-translator',
  standalone: true,
  imports: [FormsModule, ButtonModule, InputTextModule, ProgressSpinner],
  templateUrl: './translator.component.html',
  styleUrl: './translator.component.less'
})
export class TranslatorComponent implements OnInit {
  @Input() markdownText: string = '# Olá, Markdown!\n\nEscreva aqui...';
  convertedHtml = '';
  titleConvertedHtml = '';
  loaginStart = false
  htmlContent!: SafeHtml;
  title =''
  titlesToSummary : string[] = []

  constructor(
    private documentService: ArtefactService,
    private sanitizer: DomSanitizer  ) {
    const renderer = new Renderer();

    renderer.code = ({ text, lang }) => {
      const langToUse = lang && hljs.getLanguage(lang) ? lang : 'plaintext';
      const highlighted = hljs.highlight(text, { language: langToUse }).value;
      return `<pre><code class="hljs ${langToUse}">${highlighted}</code></pre>`;
    };

    renderer.heading = ({ tokens }: { tokens: any[] }) => {
      const text = tokens.map(token => token.text).join('');
      return `<h1>${text}</h1>`;
    };
    
    marked.setOptions({ renderer});
  }

  async ngOnInit() {
    this.showPreview()
  }

  async showPreview(){
    this.convertedHtml = await marked.parse(this.markdownText, { gfm: true, breaks: true });
    const parser = new DOMParser();
    const doc = parser.parseFromString(this.convertedHtml, 'text/html');
    const h1Elements = doc.querySelectorAll('h1');
    this.titlesToSummary = Array.from(h1Elements).map((h1: Element) => h1.textContent || '');
  }

  get sanitizedHtml() {
    return this.sanitizer.bypassSecurityTrustHtml(this.convertedHtml);
  }

}
