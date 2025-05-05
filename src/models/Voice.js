export class Voice {
  constructor(id, name) {
    this.id = id; // must match the subdirectory name in the sounds directory (/sounds/${lang}/${id})
    this.name = name;
  }
}
