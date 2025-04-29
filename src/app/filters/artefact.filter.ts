import { ArtefactType } from "../enums/ArtefactType.enum"

export class ArtefactFilter{
    Title? =''
    OwnerId = ''
    ArtefactType?: ArtefactType = ArtefactType.DOCUMENT
    Public? : boolean
    CreationDate?: Date = null
    UpdateDate?: Date = null
}