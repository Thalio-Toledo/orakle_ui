export class ArtefactCreateDTO{
    title : string = ""
    text : string = '# Olá, Markdown!\n\nEscreva aqui...'
    ownerId: string =''
    artefactType: number = 0
    public = true;
}
export class ArtefactUpdateDTO{
    artefactId: string = ""
    title : string = ""
    text : string = '# Olá, Markdown!\n\nEscreva aqui...'
    ownerId: string =''
    artefactType: number = 0
    public = true;
}