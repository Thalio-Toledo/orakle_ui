import { Component, HostListener, OnInit, ViewChild} from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { OwnerService } from '../services/owner.service';
import { Owner } from '../models/owner.model';
import { MorpheusComponent } from "../morpheus/morpheus.component";
import { ArtefactService } from '../services/artefact.service';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Artefact } from '../models/artefact.model';
import { ArtefactCreateDTO, ArtefactUpdateDTO } from '../DTOs/artefact.dto';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl } from '@angular/forms';
import { debounceTime, tap } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectButton } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { ArtefactFilter } from '../filters/artefact.filter';
import { ArtefactType } from '../enums/ArtefactType.enum';
import { TooltipModule } from 'primeng/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { EditorModule } from 'primeng/editor';


@Component({
  selector: 'app-owner',
  standalone: true,
  imports: [TooltipModule,
    FormsModule,
    SelectButton,
    ReactiveFormsModule,
    MenuModule,
    BadgeModule,
    RippleModule,
    AvatarModule,
    ButtonModule,
    CommonModule,
    MorpheusComponent,
    ProgressSpinner,
    InputTextModule,
    EditorModule],

  templateUrl: './owner.component.html',
  styleUrl: './owner.component.less'
})
export class OwnerComponent implements OnInit {

  @ViewChild(MorpheusComponent) morpheus!: MorpheusComponent;

  @HostListener('document:keydown',['$event'])
  handlerKeyboardEvent(event: KeyboardEvent){
   if((event.ctrlKey || event.metaKey) && event.key.toLowerCase() == 's'){
      event.preventDefault();
      this.save()
   }
  }

  morpheusMarkdown = '';
  editView: boolean = true;
  items: MenuItem[] | undefined;
  owner: Owner = new Owner();
  markdownText = ""
  loadingStart = false
  artefacts: Artefact[] = []
  artefact: Artefact = new Artefact()
  artefactTitle = new FormControl('')
  text: string | undefined;
  isDevMode = true

  publicOptions: any[] = [
    { label: 'Public', value: true },
    { label: 'Private', value: false }
  ];

  constructor(
    private artefactService: ArtefactService,
    public ownerService :OwnerService,
    protected route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private messageService: MessageService
  ){

    this.artefactTitle.valueChanges
    .pipe(
      debounceTime(500),
      tap(() => this.getArtefactsBytitle())
    )
    .subscribe()
  }
   
  async ngOnInit() {
    await this.getOwner()
    await this.getOwnerArtefact()

    if(this.owner.profile){
      this.artefact = this.owner.profile
      this.markdownText = this.artefact.text;
    }
    this.loadingStart = true
  }

  async getOwner(){
    let token = sessionStorage.getItem('auth_token')
    if(token){
      let user = this.authService.getUserFromToken(token)
      let tokenExpired = this.authService.tokenExpired(token)

      this.owner = await this.ownerService.findbyId(user.id)
      
      if(tokenExpired)
        this.router.navigate([`/login`]);
    }else{
      this.router.navigate([`/login`]);
    }

  }

  async getOwnerArtefact(){
    let filter = new ArtefactFilter()
    filter.OwnerId = this.owner.id
    filter.ArtefactType = ArtefactType.DOCUMENT
    this.artefacts = await this.artefactService.getByFilter(filter)
  }

  async getArtefactsBytitle(){
    this.artefacts = await this.artefactService.getByTitle(this.artefactTitle.value)
  }

  async getArtefact(artefactId: string){
    this.loadingStart = false
    this.artefact = await this.artefactService.findById(artefactId)
    this.markdownText = this.artefact.text
    this.loadingStart = true
  }

  createArtefact(){
    this.artefact = new Artefact()
    this.loadingStart = false
    this.markdownText = this.artefact.text;
    
    setTimeout(() => {
        this.loadingStart = true
    }, 50);
  }

  createProfile(){
    this.artefact = new Artefact()
    this.artefact.artefactType = ArtefactType.PROFILE
    this.loadingStart = false
    this.markdownText = this.artefact.text;
    
    setTimeout(() => {
        this.loadingStart = true
    }, 50);
  }

  showProfile(){
    if(!this.owner.profile){
      this.createProfile()
    }

    this.loadingStart = false
    this.markdownText = this.owner.profile.text;
    this.artefact = this.owner.profile
    setTimeout(() => {
        this.loadingStart = true
    }, 50);
  }

  async save(){
    this.artefact.text = this.morpheus.getMarkdown();
    this.artefact.ownerId = this.owner.id


    const regex = /^(?:# (.+))|<h1>(.*?)<\/h1>/gm;

    let match;
    let firstH1Text = null;
    
    while ((match = regex.exec(this.artefact.text)) !== null) {
      firstH1Text = match[1] || match[2];
      if (firstH1Text) break; // para no primeiro H1 encontrado
    }
    this.artefact.title = firstH1Text || "Artefact"


    if(this.artefact.artefactId){
      let dto = new ArtefactUpdateDTO()
      dto.artefactId = this.artefact.artefactId!
      dto.artefactType = this.artefact.artefactType
      dto.ownerId = this.artefact.ownerId
      dto.text = this.artefact.text
      dto.title = this.artefact.title
      dto.public = this.artefact.public

      let artefact = await this.artefactService.update(this.artefact)
      this.artefacts = this.artefacts.map(artfactMap => {
        if(artfactMap.artefactId == artefact.artefactId)
          return artefact
        else 
          return artfactMap
      })

      this.toastService.showSuccess("Artefact update with success!")
    }
    else{
      let dto = new ArtefactCreateDTO()
      dto.artefactType = this.artefact.artefactType
      dto.ownerId = this.artefact.ownerId
      dto.text = this.artefact.text
      dto.title = this.artefact.title
      dto.public = this.artefact.public

      let artefact = await this.artefactService.create(this.artefact)
      this.artefacts.push(artefact)
      this.toastService.showSuccess("Artefact created with success!")
    }
  }

  showPreview(){
    this.editView = !this.editView
    this.morpheus.showPreview()
  }

  async deleteArtefact(artefactId: string){
    let res = await this.artefactService.delete(artefactId)
    if(res){
      this.artefacts = this.artefacts.filter(artefact => artefact.artefactId != artefactId)
      this.toastService.showSuccess("Artefact deleted with success!")
    }
  }

  shortArtefactTitle(artefactTitle: string){
    if(artefactTitle.length > 25){
      return artefactTitle.slice(0,20).concat('...')
    }
    else  
      return artefactTitle
  }

  setDevMode(){
    this.isDevMode = !this.isDevMode
  }

  logout(){
    this.authService.logout()
  }
}