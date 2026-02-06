export default function Cell(key){
    
    this.key = key;
    this.x = key%9;
    this.y = Math.floor(key/9);
    this.guessedValue = 0;
    this.actualValue = 0;
    this.solvedValue = 0;
    this.isGiven = false;
    this.highlighted = false;
    this.possibleValues = [];



    this.printCellInfo = function(){
        console.table(this);
    };

    this.setPossibleValues = function(array){
        this.possibleValues = array;
    };

    this.clearCell = function(){
        this.guessedValue = 0;
        this.actualValue = 0;
        this.solvedValue = 0;
        this.isGiven = false;
        this.highlighted = false;
        this.possibleValues = [];
    };

    this.setGivenValue = function(val){
        this.actualValue = val;
        this.isGiven = true;
    };

    this.setGuessedValue = function (val) {
        this.guessedValue = val;
    };

    this.setSolvedValue =  function (val) {
        this.solvedValue = val;
    };

    this.setHovered = function (hovered){
        this.highlighted = hovered;
    }



    
    this.getCellInfo = function(){
        return{
            key:this.key,
            x:this.x,
            y:this.y,
            guessedValue:this.guessedValue,
            actualValue:this.actualValue,
            isGiven:this.isGiven,
            highlighted:this.highlighted,
            possibleValues:this.possibleValues,
        }
    };

}
