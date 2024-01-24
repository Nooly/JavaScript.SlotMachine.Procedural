// Procedural

// 1. Deposit some money
// 2. Deteminate number of lines to be on
// 3. Collect a bet amount
// 4. Spin the slot machine
// 5. Check if the user won
// 6. Provide P&L (profit and losses) to user
// 7. Spin again? yes? => return to step 2

const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    A: 20,
    B: 40,
    C: 60,
    D: 80,
};

const SYMBOL_VALUES = {
    A: 20,
    B: 15,
    C: 10,
    D: 5,
}

const deposit = () =>{
    
    while(true){

    let depositAmount = prompt("Enter a deposit amount[100]: ");
    if (depositAmount.length === 0)
        depositAmount = 100;

    const numberDepositAMount = parseFloat(depositAmount);

    if (!isNaN(numberDepositAMount) && numberDepositAMount > 0){
        console.log(`Your initial balance is ${numberDepositAMount}`);
        return numberDepositAMount;
    }
    
    // if we got here - invalid input ask again
    console.log("invalid deposit amount, try again.");
    
    };
};

const getNumberOfLines = () =>{
    
    while(true){

    let lines = prompt("Enter the number of lines to bet on (1-3) [3]:  ");
    if (lines.length === 0)
        lines = 3;

    const numberOfLines = parseFloat(lines);

    if (!isNaN(numberOfLines) && numberOfLines > 0 && numberOfLines <= 3){
        console.log(`You're betting on ${numberOfLines} row(s).`);
        return numberOfLines;
    }
    
    // if we got here - invalid input ask again
    console.log("invalid number of lines, try again.");
    
    };
};

const getBet = (balance,lines) =>{
    
    while(true){

    let bet = prompt("Enter the bet per line [$5]: ");
    if (bet.length === 0)
        bet = 5;

    const betAmount = parseFloat(bet);

    if (!isNaN(betAmount) && betAmount > 0 && betAmount <= balance / lines){
        console.log(`You're betting ${betAmount}$ per line(s).`);
        return betAmount;
    }
    
    // if we got here - invalid input ask again
    console.log("invalid bet amount, try again.");
    
    };
};

const spin = () => {
    const symbols = []; //[A,A,A,*20, B,B,B,*40, C,C,C,*60, D,D,D,*80]
    for (const [symbol,count] of Object.entries(SYMBOLS_COUNT)){
        for (let i = 0; i < count; i++){
            symbols.push(symbol);
        }
    }

    const rows = []; // [[A,A,A],[A,B,B],[D,D,D]]
    for (let i = 0; i < COLS; i++){
        rows.push([]);
        const rowSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++){
            const randomIndex = Math.floor(Math.random() * rowSymbols.length);
            const selectedSymbol = rowSymbols[randomIndex];;
            rows[i].push(selectedSymbol);
            rowSymbols.splice(randomIndex, 1);
        }
    }

    return rows;
};

const printRows = (rows) =>{
    for (const row of rows) {
        let rowString ="";
        for (const [i, symbol] of row.entries()){
            rowString += symbol;
            if (i != row.length  - 1){
                rowString += " ! "
            }
        }
        console.log(rowString);
    }
}

const calcPnL = (rows, bet, lines) => {
    let pnl = 0;
    for (let row = 0; row < lines; row++){
        pnl -= bet;
        const symbols = rows[row];
        let allSame = true;

        for (const symbol of symbols){
            if (symbol != symbols[0]){
                allSame = false;
                break;
            }
        }

        if (allSame){
            pnl += bet * (SYMBOL_VALUES[symbols[0]] + 1);
        }
    }

    return pnl;
}

const game = () => {
    let balance = deposit();

    while (true){
        const numberOfLines = getNumberOfLines();
        const bet = getBet(balance,numberOfLines);
        const rows = spin();
        printRows(rows);
        const pnl = calcPnL(rows,bet,numberOfLines);
        balance += pnl;
        console.log(`Your profit/loss in this round is ${pnl}`);
        console.log(`Your balance is: ${balance}`);

        if(balance <= 0){
          console.log("You ran out of money loser :)");
            //
         }

        let playAgain = prompt("Do you want to play again (y/n) [y]? ");
        if (playAgain.length ===0)
             playAgain = "y";

        if (playAgain != "y")
            break;
    }

}

game();
