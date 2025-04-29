import { Component, OnInit } from '@angular/core';
import { ArtefactService } from '../services/artefact.service';
import { Artefact } from '../models/artefact.model';
import { ButtonModule } from 'primeng/button';
import { Owner } from '../models/owner.model';
import { OwnerService } from '../services/owner.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ArtefactFilter } from '../filters/artefact.filter';
import { ArtefactType } from '../enums/ArtefactType.enum';
import { TranslatorComponent } from '../translator/translator.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [TranslatorComponent, ButtonModule, CommonModule, TableModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.less'
})
export class ProfileComponent implements OnInit  {

  constructor(
    private artefactService: ArtefactService,
    public ownerService :OwnerService
    
  ){}

  markdownText = ''
  loadingText = false
  artefacts: Artefact[]= []
  blogView = false
  profileView = true
  owner: Owner = new Owner();
  loadingStart = false
  selectedProduct!: Artefact;
  metaKey: boolean = true;


  async ngOnInit() {
    await this.getOwner()
    await this.getOwnerArtefacts()
    this.markdownText = this.owner.profile.text
    this.loadingText = true
  }

 
  async getOwner(){
    let owners = await this.ownerService.getAll()
    this.owner = owners[0]
  }

  async getOwnerArtefacts(){
    let filter = new ArtefactFilter()
    filter.OwnerId = this.owner.id
    filter.Public = true
    filter.ArtefactType = ArtefactType.DOCUMENT
    this.artefacts = await this.artefactService.externalGetByFilter(filter)
  }

  setBlogView(){
    this.blogView = true
  }

  setAboutView(){
    this.blogView = false
    this.loadingText = false
    this.markdownText = this.owner.profile.text;
    setTimeout(() => {
        this.loadingText = true
    }, 1);
  }

  async getArtefact(artefactId: string){
    this.loadingStart = false
    let artefact = await this.artefactService.findById(artefactId)
    this.markdownText = artefact.text
    this.loadingStart = true
    this.blogView = false
  }
}
