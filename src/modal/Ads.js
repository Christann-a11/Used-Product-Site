class Ads {
    static modelName = "ads";

constructor(id, title, description, price, status = 'active', expirationDate = null, userId = null) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.price = price;
    this.status = status;
    this.expirationDate = expirationDate;
    this.userId = userId;
}

    toggleStatus() {
        this.status = this.status === "active" ? "disabled" : "active";
    }

static fromJSON(json) 
{
    return new Ads(
        json.id || json._id,
        json.title,
        json.description,
        json.price,
        json.status,
        json.expirationDate,
        json.userId
    );
}
toJSON() 
{
    return {
        id: this.id,
        title: this.title,
        description: this.description,
        price: this.price,
        status: this.status,
        expirationDate: this.expirationDate,
        userId: this.userId
    };
}
}

export default Ads;
