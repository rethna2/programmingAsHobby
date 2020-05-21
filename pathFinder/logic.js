let data;
let startPt;
let endPt;
let step = 0;

document.getElementById('createBtn').addEventListener('click', () => {
  data = document.getElementById('inputArr').value.split('\n');
  data = data.map(row => row.split(',').map(cell => Number(cell)));

  startPt = document.getElementById('startPt').value.split(',').map(value => value.trim()).map(value => Number(value));
  endPt = document.getElementById('endPt').value.split(',').map(value => value.trim()).map(value => Number(value));
  step = 0;
  document.querySelector('#solutionPath').setAttribute('d', '');
  try{
    validate(data);
    validatePt(startPt, data);
    validatePt(endPt, data);
    printBoard(data);
    highlightPts(startPt, endPt);
  }catch(e){
    alert(e.message);
  }

})

function printBoard(data){
  const htmlStr =
    `<table>
    ${
      data.map((row, rowIndex) => `<tr>
        ${
          row.map((cell, cellIndex) => 
            `<td id = ${rowIndex + '~' + cellIndex} class = ${ cell===0 ? 'closed' : 'open' } > 
              ${cellIndex},${rowIndex}
            </td>`
            ).join('')
        }
      </tr>`).join('')
     }
    </table>`;
    document.querySelector('.tableWrapper').innerHTML = htmlStr;
}

function highlightPts(startPt, endPt){
  let stPtDom = document.getElementById(`${startPt[1]}~${startPt[0]}`);
  let endPtDom = document.getElementById(`${endPt[1]}~${endPt[0]}`);
  stPtDom.style.backgroundColor = "#bfb";
  endPtDom.style.backgroundColor = "#fbb";

  stPtDom.innerText = 'A';
  endPtDom.innerText ='B'
}

document.getElementById('solveBtn').addEventListener('click', () => {
  const solution = solve(data,startPt, endPt);
  if(!solution){
    alert('No possible solution!');
    return;
  }
  printSolution(solution);
});



document.getElementById('nextStepBtn').addEventListener('click', () => {
  step++;
  const solution = solve(data,startPt, endPt, step);
  if(Array.isArray(solution)){
    if(!Array.isArray(solution[0])){
      return printSolution(solution)
    }
    let path=""
    for(let z = 0; z < solution.length; z++){
      path += `M ${transform(solution[z][0].x)} ${transform(solution[z][0].y)} `
      for(var i = 1; i < solution[z].length; i++){
        path += `L ${transform(solution[z][i].x)} ${transform(solution[z][i].y)} `
      }
    }
    document.querySelector('#solutionPath').setAttribute('d', path);
  }
  

  function transform(coOrd){
    return coOrd * 40 + 20;
  }
});




function solve(data, startPt, endPt, tillStep){
  if(Array.isArray(startPt)){
    startPt = {
      x: startPt[0],
      y: startPt[1]
    }
  }
  if(Array.isArray(endPt)){
    endPt = {
      x: endPt[0],
      y: endPt[1]
    }
  }

  let currentPt = startPt;
  let paths = [[startPt]];

  let colCount = data[0].length;
  let rowCount = data.length;
  let answer;
  let stepCount = 0;
  solve:
  while(true){
    stepCount++
    var arr = [];
    for(let i = 0; i < paths.length; i++){
      const path = paths[i];
      const lastPt = path[path.length - 1];
      const prevPt = path.length > 1 ? path[path.length - 2] : null;

      const moveLeftPt = { x: lastPt.x - 1, y: lastPt.y };
      const moveRightPt = { x: lastPt.x + 1, y: lastPt.y };
      const moveUpPt = { x: lastPt.x, y: lastPt.y - 1 };
      const moveDownPt = { x: lastPt.x, y: lastPt.y + 1 };

      [moveLeftPt, moveRightPt, moveUpPt, moveDownPt].forEach(pt => {
        if(pt.x === endPt.x && pt.y === endPt.y){
          answer = [...path, pt];
        } else if(prevPt && (pt.x === prevPt.x && pt.y === prevPt.y)){
          return;
        } else if(pt.x < 0 || pt.x >= colCount || pt.y < 0 || pt.y >= rowCount){
          return;
        } else if(data[pt.y][pt.x] === 0 ){
          return;
        }
        arr.push([...path, pt])
      })
      if(answer){
        break solve;
      }
    };
    if(answer || arr.length === 0){
      break;
    }
    paths = arr;
    if(tillStep && stepCount === tillStep){
      return paths;
    }
  }
  return answer;
}

function solveOld(data, startPt, endPt){
  
  let paths = [[startPt]];

  let colCount = data[0].length;
  let rowCount = data.length;
  let answer;
  let stepCount = 0;
  solve:
  while(true){
    stepCount++
    var arr = [];
    for(let i = 0; i < paths.length; i++){
      const path = paths[i];
      const lastPt = path[path.length - 1];
      const prevPt = path.length > 1 ? path[path.length - 2] : null;

      const moveLeftPt = { x: lastPt.x - 1, y: lastPt.y };
      const moveRightPt = { x: lastPt.x + 1, y: lastPt.y };
      const moveUpPt = { x: lastPt.x, y: lastPt.y - 1 };
      const moveDownPt = { x: lastPt.x, y: lastPt.y + 1 };

      [moveLeftPt, moveRightPt, moveUpPt, moveDownPt].forEach(pt => {
        if(pt.x === endPt.x && pt.y === endPt.y){
          answer = [...path, pt];
        } else if(prevPt && (pt.x === prevPt.x && pt.y === prevPt.y)){
          return;
        } else if(pt.x < 0 || pt.x >= colCount || pt.y < 0 || pt.y >= rowCount){
          return;
        } else if(data[pt.y][pt.x] === 0 ){
          return;
        }
        arr.push([...path, pt])
      })
      if(answer){
        break solve;
      }
    };
    if(answer || arr.length === 0){
      break;
    }
    paths = arr;
    if(tillStep && stepCount === tillStep){
      return paths;
    }
  }
  return answer;
}



function printSolution(solution){
  var path = `M ${transform(solution[0].x)} ${transform(solution[0].y)} `
  for(var i = 1; i < solution.length; i++){
    path += `L ${transform(solution[i].x)} ${transform(solution[i].y)} `
  }
  document.querySelector('#solutionPath').setAttribute('d', path);

  function transform(coOrd){
    return coOrd * 40 + 20;
  }
}

function printWIP(solution){

}

function validate(data){
  if(!Array.isArray(data)){
    throw new Error('Input is not an array');
  }
  if( data.length < 5 || data.length > 30 ){
    throw new Error('Number of rows should be in the range 5 to 30');
  }

  let columnLength;
  data.forEach((row, index) => {
    if(!Array.isArray(row)){
      throw new Error(`Input line ${index} is not an array`);
    }

    if(index === 0){
      columnLength = row.length;
    }else{
      if(columnLength !== row.length){
        throw new Error(`Input line ${index} : count is wrong`);
      }
    }

    row.forEach(cell => {
      if(cell !== 0 && cell !== 1){
        throw new Error(`Input line ${index} : invalid input (only 1 and 0 are allowed`);
      }
    })
  })
  if( columnLength < 5 || columnLength > 30 ){
    throw new Error('Number of columns should be in the range 5 to 30');
  }
}

function validatePt(pt, data){
  console.dir(pt);
  console.log(data.length + ',' + data[0].length)
  if(pt.length !== 2){
    throw new Error ('Invalid Point');
  }
  if(!Number.isInteger(pt[0]) || !Number.isInteger(pt[1]) ){
    throw new Error ('Point co-ordinates should only be number');
  }
  if( pt[0] < 0 || pt[0] >= data[0].length){
    throw new Error ('Point is out of range');
  }
  if( pt[1] < 0 || pt[1] >= data.length){
    throw new Error ('Point is out of range');
  }

  if(data[pt[1]][pt[0]] !== 1 ){
    throw new Error('The given Point is a closed point');
  }
}