
let X = 8, Y = 8;
const board = document.getElementById('board');
const knight = document.getElementsByTagName('img')[0];

const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas'));
canvas.width = 70*X
canvas.height = 70*Y
const ctx = canvas.getContext('2d');

let timeDelay = 200;

let warndorff = true;

let isRefreshing = false;

const pathLines = [];


let visited = new Array(Y).fill([]);
for (let i = 0; i < Y; i++) {
   visited[i] = new Array(X).fill(false)
}

function createBoard(){
    for (let y = 0; y < Y; y++) {
    const row = document.createElement('div');
    row.classList.add(y%2?'even':'odd');
            for (let x = 0; x < X; x++) {
            const div = document.createElement('div');
            div.setAttribute('cord',`${x} ${y}`)
            row.appendChild(div);            
        }
        board.appendChild(row);
    }
}

function rangeSlide(value) {
    timeDelay =1000 - value*10;
}

function refresh(){
    isRefreshing = true;
    setTimeout(()=>isRefreshing=false,1000)
    X = +document.getElementById('xCord').value;
    Y = +document.getElementById('yCord').value;
    board.innerHTML = ''
    createBoard();
    knight.style.display = "none";
    pathLines.length = 0;
    visited = new Array(Y).fill([]);
    for (let i = 0; i < Y; i++) {
      visited[i] = new Array(X).fill(false);
    }
    canvas.width = 70 * X;
  canvas.height = 70 * Y;
  }

createBoard()

board.addEventListener('click',(e)=>{
    const [x,y] = e.target.getAttribute('cord').split(' ').map(e=>+e);
    moveKnight({x,y});
    knight.style.display = 'block';
    knightTour({x,y})
})

async function knightTour(currNode,i=1){
    if(isRefreshing) return;
    if(i>X*Y-1){
        // canvas
        // canvas.style.position = 'static'
        // document.getElementById('result').src= canvas.toDataURL('image/jpg')
        return true;
    }
    const nexts = nextNode(currNode);
    // const nexts = [];
    drawCanva()
    while(nexts.length){
        if(isRefreshing) return;
        ctx.save()
        let nextIndex =selection(nexts);
        const next = nexts[nextIndex]
        nexts.splice(nextIndex,1);
        if(!next) return false; 
        moveKnight(next,i);
        drawPath(currNode,next)
        visited[currNode.y][currNode.x] = true;
        await new Promise((r,_)=>setTimeout(r,timeDelay));
        if(await knightTour(next,i+1)) return true;
        // ctx.clearRect(0,0, canvas.width,canvas.height)
        visited[currNode.y][currNode.x] = false;
        pathLines.pop()
        // pathLines.pop()
        // return false;
    }
    return false;
}

function nextNode(curr){
    const arr = [];
    if(curr.x+2 < X){
        if(curr.y+1<Y && !isVisited(curr.x+2,curr.y+1)) arr.push({x:curr.x+2,y:curr.y+1});
        if(curr.y-1>=0 && !isVisited(curr.x+2,curr.y-1)) arr.push({x:curr.x+2,y:curr.y-1});
    }
    if(curr.x-2 >= 0){
        if(curr.y+1<Y && !isVisited(curr.x-2,curr.y+1)) arr.push({x:curr.x-2,y:curr.y+1});
        if(curr.y-1>=0 && !isVisited(curr.x-2,curr.y-1)) arr.push({x:curr.x-2,y:curr.y-1});
    }
    if(curr.y+2 < Y){
        if(curr.x+1<X && !isVisited(curr.x+1,curr.y+2)) arr.push({x:curr.x+1,y:curr.y+2});
        if(curr.x-1>=0 && !isVisited(curr.x-1,curr.y+2)) arr.push({x:curr.x-1,y:curr.y+2});
    }
    if(curr.y-2 >= 0){
        if(curr.x+1<X && !isVisited(curr.x+1,curr.y-2)) arr.push({x:curr.x+1,y:curr.y-2});
        if(curr.x-1>=0 && !isVisited(curr.x-1,curr.y-2)) arr.push({x:curr.x-1,y:curr.y-2});
    }
return arr;
// return arr[Math.floor(Math.random()*arr.length)];
}

function moveKnight(pos,i){
    knight.style.top = (board.clientHeight/Y)*pos.y + 'px';
    knight.style.left = (board.clientWidth/X)*pos.x + 'px';
    // board.children[pos.y].children[pos.x].innerHTML = i
}

function isVisited(x,y){
    return visited[y][x]
}

function drawPath(curr,next){
    let cellWidth = board.clientWidth/X;
    pathLines.push({
        x1:(curr.x*cellWidth)+cellWidth/2,
        y1:(curr.y*cellWidth)+cellWidth/2,
        x2:(next.x*cellWidth)+cellWidth/2,
        y2:(next.y*cellWidth)+cellWidth/2
    })
}

function drawCanva(){
    ctx.strokeStyle = '#0f0'
    ctx.clearRect(0,0, canvas.width,canvas.height)
    pathLines.forEach(e=>{
        ctx.beginPath();
        ctx.moveTo(e.x1,e.y1);
        ctx.lineTo(e.x2,e.y2);
        ctx.lineWidth = 2
        ctx.stroke();
    })
    requestAnimationFrame(drawCanva)
}

function selection(nexts){
    let nextIndex = 0;
    if(warndorff){
    let min = nextNode(nexts[nextIndex]).length
    nexts.forEach((node,i)=>{
        const l = nextNode(node).length;
        if(min>l){ min = l;
        nextIndex = i;}
    })
    return nextIndex
}
else{
    return Math.floor(Math.random()*nexts.length);
}
}

function selectionType(){
    warndorff = !warndorff;
    refresh()
}