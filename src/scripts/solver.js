import * as GridFunc from './gridFunctions.js';

let loopCount;
const maxLoop = 300;
export const generateAGrid = (_cells, addToHistory, stepByStep, nbOfCellToHide = 10) => {
    let newCells = [];
    
    let tentatives = 0;
    while(tentatives < 3){
        tentatives ++;
        loopCount = 0;
        newCells = GridFunc.cloneGrid(_cells);
        const cellsToHide = getRandomCellKeysToHide(nbOfCellToHide);
        const res = generatorStepByStep(newCells, 0, addToHistory, cellsToHide, stepByStep);
        console.log("loop count : ", loopCount, "tentatives : ", tentatives, cellsToHide.length);
        if(loopCount > maxLoop || !res){
            addToHistory(-1)
        } //retry
        else{
            console.log("loop count : ", loopCount, "tentatives : ", tentatives, "res : ", res);
            return
        } // success
    }
    return newCells;
}


export const solveGrid = (_cells, addToHistory = null, stepByStep = false) =>{
    let newCells = GridFunc.cloneGrid(_cells);
    let res = false;

    if(!checkIfGridIsValid(_cells)){console.log('grid not valid')};

    let tentatives = 0;

    while(!res && tentatives < 50){
        loopCount = 0;
        tentatives++;
        newCells = GridFunc.cloneGrid(_cells);
        res = generatorStepByStep(newCells, 0, addToHistory, [], stepByStep);
    }
    console.log("loop count : ", loopCount ,"tentatives : ", tentatives, "res : ", res);

    if(!res){GridFunc.saveGrid(newCells)}
    const resString = res ? "Success" : "Error"
    return [newCells, resString];
}


export const generatorStepByStep = (_cells, key, addToHistory, cellsToHide, stepByStep) => {
    loopCount ++;
    if(loopCount > maxLoop) {
        return false;
    }
    if(!checkIfGridIsValid(_cells)){console.log('grid not valid')};
    if (loopCount > maxLoop + 100 )throw new Error("Error while generating the grid");
    const useGuessedValues = true;

    if (key >= 9 * 9) { return true }  //Solving finished

    const currentCell = _cells[key];
    const cellValue = (
        currentCell.solvedValue > 0 
        || currentCell.actualValue > 0 
        || (useGuessedValues && currentCell.guessedValue > 0)
    )

    

    // this cell is already solved, go to next cell
    if (cellValue) {return generatorStepByStep(_cells, key + 1, addToHistory, cellsToHide, stepByStep); }

    const pValues = getPossibleValuesForCell(_cells, currentCell);
    let shuffledVal = shuffle([1,2,3,4,5,6,7,8,9]);
    for (let v = 1; v <= 9; v++) {
        if (pValues.some(e=> e === shuffledVal[v-1])){
            updateValue(currentCell, shuffledVal[v-1], stepByStep, cellsToHide, addToHistory, key);
            
            // try to resolve the rest of the array with this value for the current cell
            if ( generatorStepByStep (_cells, key+1, addToHistory, cellsToHide, stepByStep) ) return true; 
        }
    }

    updateValue(currentCell, 0, stepByStep, cellsToHide, addToHistory, key);

    return false // this grill is not solvable, going back to previous recursion.
}




export const checkIfGridIsValid = (_cells) => {
    let res = true;
    _cells.forEach(cell =>{
        const pValues = getPossibleValuesForCell(_cells, cell,  true);
        /*
        if (pValues.length === 0 ) {
            console.log("No possible value for cell : ", cell.key);
            res = false;
        }*/
      
        let cellValue = 0;
        if (cell.actualValue > 0) {cellValue = cell.actualValue}
        else if (cell.solvedValue > 0) {cellValue = cell.solvedValue}
        else if (cell.guessedValue > 0) {cellValue = cell.guessedValue}
        if (cellValue > 0 && pValues.indexOf(cellValue) === -1){ // if there is more than one cell with the same value
            console.log("Wrong grid values for cell : ", cell.key);
            res = false;
        
        }
    })

    return res;
}


//**********************   Utilities  **************************************/

const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}


const getRandomCellKeysToHide = (nbOfCellToHide) => {
    if(!nbOfCellToHide || nbOfCellToHide >= 9*9-1) {return}
    const hide = [];
    while(hide.length < nbOfCellToHide){
        let r = Math.floor(Math.random() * (9*9-1)) ;
        if(hide.indexOf(r) === -1) hide.push(r);
    }
    return hide;
}


const updateValue = (_cell, _val, stepByStep, cellsToHide, addToHistory, key) => {
    if(cellsToHide.indexOf(key) !== -1){_cell.actualValue = _val; }
    else {
        _cell.setSolvedValue(_val)
        if (stepByStep) {
            addToHistory({
                key: _cell.key,
                solvedValue: _val,
            })
        }
    }
}


export const getPossibleValuesForCell = (cells, cell, considerGuessedValues = true) => {
    const valuesAvailability = new Array(9).fill(1);
    
    //get all the cells in range of the selected one
    let cellsInRange = []
    cellsInRange = cellsInRange.concat(GridFunc.returnSquareCells(cells, cell));
    cellsInRange = cellsInRange.concat(GridFunc.returnEntireRowCells(cells, cell));
    cellsInRange = cellsInRange.concat(GridFunc.returnEntireColCells(cells, cell));

    //filter out the selected cell
    cellsInRange = cellsInRange.filter((item)=>item.key !== cell.key);

    //find which values are already used among all the cells in range
    cellsInRange.forEach((el)=>{
        if(el.actualValue > 0) valuesAvailability[el.actualValue-1] = 0; 
        else if(el.solvedValue > 0) valuesAvailability[el.solvedValue-1] = 0; 
        else if(considerGuessedValues && el.guessedValue > 0) valuesAvailability[el.guessedValue-1] = 0;
    })

    // create an array with only the available values
    const possibleValues = [];
    valuesAvailability.forEach((el,i) => {
        if(el){possibleValues.push(i+1)}
        //index goes from 0 to 8, but we want to return 1 to 9
    });

    return possibleValues;
}




/** 

export const solverLoop = (solvedCells, nbOfGuessAllowed) =>{
    let nbOfValueFound = 0;
    let nbOfCellWithSeveralPossibilites = 0;

    solvedCells.forEach(row => {
        row.forEach(cell => {
            //console.log(cell.key);
            if (cell.actualValue === 0) {
                const possibleValues = getPossibleValuesForCell(solvedCells, cell);
                if (possibleValues.length === 0) {
                    console.log("Can't solve cell ", cell.key);
                    return;
                }
                if (possibleValues.length === 1) {
                    cell.actualValue = possibleValues[0];
                    //console.log("new value for cell " , cell.key);
                    nbOfValueFound ++;
                }
                if (possibleValues.length > 1){
                    nbOfCellWithSeveralPossibilites ++;
                }
            }
        })
    })

    return [nbOfValueFound, nbOfCellWithSeveralPossibilites];
}

export const solver = (cells) => {
    let solvedCells = [ ...cells]
    let nbOfValueFound = 0;
    let nbOfCellRemaining = 9*9;
    let nbOfGuessAllowed = 0;
    let status = "";

    let loopCount = 0;
    while (nbOfCellRemaining > 0 && loopCount < 100){
        
        const loopRes = solverLoop(solvedCells, nbOfGuessAllowed);
        nbOfValueFound = loopRes[0]
        if( nbOfValueFound ===0) 
        {
            console.log("break");
            status = "Couldn't resolve with simple solver."
            break;
        }
        nbOfCellRemaining = loopRes[1];

        console.log("loop count : " , loopCount);
        loopCount ++;

    }
    if(nbOfCellRemaining === 0) status = "Solved in " + loopCount + " loops.";
    
    return [solvedCells, status];
}


**/



/*
export const recursiveValidation = (_cells, key, addToHistory, cellsToHide, stepByStep) => {
    const useGuessedValues = true;
    if (key >= 9 * 9) { return true }  //Solving finished

    const currentCell = _cells[key];
    const cellValue = currentCell.solvedValue > 0 
        || currentCell.actualValue > 0 
        || (useGuessedValues && currentCell.guessedValue > 0)
    if (cellValue) {
        // this cell is already solved, go to next cell
        return recursiveValidation(_cells, key + 1, addToHistory,cellsToHide, stepByStep);
    }

    const pValues = getPossibleValuesForCell(_cells, currentCell);
    for (let v = 0; v <= 8; v++) {
        let shuffledVal = shuffle([1,2,3,4,5,6,7,8,9]);
        //console.log("key : ", currentCell.key, "v :  ", v, "pValues : ", pValues);
        if (pValues.some(e=> e === shuffledVal[v])){
            updateValue(currentCell, shuffledVal[v], stepByStep, [], addToHistory, key)
            

            // try to resolve the rest of the array with this value for the current cell
            if ( recursiveValidation (_cells, key+1, addToHistory, cellsToHide,stepByStep) )
                return true; 
        }

    }
    currentCell.setSolvedValue(0) // no value possible for this cell, reset it to 0.
    if(stepByStep){
        addToHistory( {
            key:currentCell.key,
            solvedValue:0
        } )
    }
    return false // this grill is not solvable, going back to previous recursion.
}
*/





/*
// return -1 if nothing to solve
// 0->80 if key found
export const getNextCellToSolve = (_cells, _cell) => {
    let keyToFind = _cell.key+1 >= 9*9 ? 0 : _cell.key+1;
    console.log(_cell.key, keyToFind);
    const maxLoop = 9*9;
    let i = 0;
    while(i < maxLoop){
        const coords = GridFunc.KeyToCoord(keyToFind);
        console.log("coords : "+ coords);
        const cellToCheck = _cells[coords[1]][coords[0]];
        
        if(cellToCheck.actualValue <= 0){
            return cellToCheck
        }

        keyToFind = keyToFind+1 >= 9*9 ? 0 : keyToFind+1;
        i++;
    }
    return -1;
}
*/