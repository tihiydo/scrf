export interface Actors {
    data:
    {
        title: Title
    }
  }
  
  export interface Title {
    principalCredits: PrincipalCredit[]
    credits: Credits
  }
  
  export interface PrincipalCredit {
    credits: Credit[]
  }
  
  export interface Credit {
    __typename: string
    characters: Character[]
    name: Name
  }
  
  export interface Character {
    id: string
    name: string
  }
  
  export interface Name {
    __typename: string
    id: string
    nameText: NameText
    primaryImage: PrimaryImage
  }
  
  export interface NameText {
    text: string
  }
  
  export interface PrimaryImage {
    __typename: string
    id: string
    url: string
    height: number
    width: number
  }
  
  export interface Credits {
    edges: Edge[]
  }
  
  export interface Edge {
    node: Node
  }
  
  export interface Node {
    __typename: string
    characters: Character2[]
    name: Name2
  }
  
  export interface Character2 {
    id: string
    name: string
  }
  
  export interface Name2 {
    __typename: string
    id: string
    nameText: NameText2
    primaryImage: PrimaryImage2
  }
  
  export interface NameText2 {
    text: string
  }
  
  export interface PrimaryImage2 {
    __typename: string
    id: string
    url: string
    height: number
    width: number
  }
  