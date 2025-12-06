import Ads from "./Ad";

class Questions {
  constructor(id,text,answer=null,ad= null,  answeredAt = null) {
    this.id = id;
    this.text = text;
    this.answer = answer;
    this.ad = ad;
    this.answeredAt = answeredAt;
  
  }

 

    static fromJSON(json) {
        if (!json) {
            return null;
        }
        return new Questions(
            json.id,
            json.text,
            json.answer,
            Ad.fromJSON(json.ad),
            json.answeredAt
        );
    }
    toJSON() {
        return {
            id: this.id,
            text: this.text,
            answer: this.answer,
            ad: this.ad,
            answeredAt: this.answeredAt 
        };
    }       
  }