import { Artefact } from "./artefact.model"

export class Owner{
    id : string = ""
    profileName = ""
    image =""
    description =""
    profile: Artefact = new Artefact
    artefacts: Artefact[] = []
}