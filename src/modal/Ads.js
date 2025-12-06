// src/modal/Ads.js
class Ads {
  static modelName = "ads";

  constructor(
    id,
    title,
    description,
    price,
    status = "active",
    owner = null,
    activationDate = null,
    expirationDate = null
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.price = price;
    this.status = status;
    this.owner = owner;
    this.activationDate = activationDate;
    this.expirationDate = expirationDate;

    this.modelName = Ads.modelName;
  }

  // Toggle status in the UI (backend status change is still via API)
  toggleStatus() {
    this.status = this.status === "active" ? "inactive" : "active";
  }

  static fromJSON(json) {
    if (!json) return null;

    return new Ads(
      json._id || json.id,
      json.title,
      json.description,
      json.price,
      json.status || "active",
      json.owner || null,
      json.activationDate || null,
      json.expirationDate || null
    );
  }

  toJSON() {
    return {
      title: this.title,
      description: this.description,
      price: this.price,
      status: this.status,
      owner: this.owner,
      activationDate: this.activationDate,
      expirationDate: this.expirationDate,
    };
  }
}

export default Ads;
