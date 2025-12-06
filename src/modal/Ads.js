class Ads {
    static modelName = 'ads';

    constructor(id, title, description, price, status = 'active') {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.status = status;
        this.modelName = Ads.modelName;
    }

    // Method to toggle the status between 'active' and 'disabled'
    toggleStatus() {
        this.status = this.status === 'active' ? 'disabled' : 'active';
    }

    static fromJSON(json) {
        if (!json) {
            return null;
        }
        return new Ads(
            json.id || json._id,
            json.title,
            json.description,
            json.price,
            json.status
        );
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            price: this.price,
            status: this.status
        };
    }
}

export default Ads;
