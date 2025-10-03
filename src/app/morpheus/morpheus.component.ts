import { AfterViewInit, Component, ElementRef, Input, input, OnInit, ViewChild} from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { marked, Renderer } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { ArtefactService } from '../services/artefact.service';
import { Artefact } from '../models/artefact.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

import { ButtonModule } from 'primeng/button';

import { ProgressSpinner } from 'primeng/progressspinner';
import { Ripple } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { EditorModule } from 'primeng/editor';

@Component({
  selector: 'app-morpheus',
  standalone: true,
  imports: [FormsModule, ButtonModule,ProgressSpinner, Ripple, MonacoEditorModule, CommonModule, EditorModule],
  templateUrl: './morpheus.component.html',
  styleUrl: './morpheus.component.less'
})
export class MorpheusComponent implements OnInit{
  code = 'function hello() {\n  console.log("Hello world!");\n}';
  editorOptions = {
    language: 'markdown',
    theme: 'vs-dark'
  };

  @ViewChild('editor', { static: false }) editorRef!: ElementRef;
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;

  //editor!: monaco.editor.IStandaloneCodeEditor;
  @Input() markdownText: string = '# Olá, Markdown!\n\nEscreva aqui...';
  editMode: boolean = true;
  markdownTextT: string = '';
  saveLoading = false
  loaginStart = false
  htmlContent!: SafeHtml;
  title =''
  titlesToSummary : string[] = []
  convertedHtml = '';
  titleConvertedHtml = '';
  isDevMode = true

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
      return `<h1 id="${this.generateIds(text)}">${text}</h1>`;
    };
    
    marked.setOptions({ renderer});
  }

  async ngOnInit() {
    this.code = this.markdownText
  }


  getMarkdown() {
    return this.code; 
  }

  generateIds(text : string, isLink: boolean = false){
    let id = text.toLowerCase().replace(/[^\w]+/g, '-');

    if(isLink) 
      return `artefac#${id}`
    else 
      return id
  }

  onInput(event: Event) {
    const target = event.target as HTMLElement;
    this.markdownText = target.innerText; 
  }

 
  async showPreview(){
    this.editMode = !this.editMode
    this.convertedHtml = await marked.parse(this.getMarkdown(), { gfm: true, breaks: true });
    this.titleConvertedHtml = await marked.parse(this.title, { gfm: true, breaks: true });
    const parser = new DOMParser();
    const doc = parser.parseFromString(this.convertedHtml, 'text/html');
    const h1Elements = doc.querySelectorAll('h1');
    this.titlesToSummary = Array.from(h1Elements).map((h1: Element) => h1.textContent || '');
  }

  get sanitizedHtml() {
    return this.sanitizer.bypassSecurityTrustHtml(this.convertedHtml);
  }

  async save(){
    this.saveLoading = true
    let document = new Artefact()
    document.text = this.getMarkdown();
    document.title = this.title
    let res = await this.documentService.create(document)
    this.saveLoading = false
  }

  setDevMode(){
    this.isDevMode = !this.isDevMode
  }
}
