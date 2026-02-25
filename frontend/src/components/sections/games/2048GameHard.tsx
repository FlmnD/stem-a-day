'use client'
import React, { useEffect, useState } from "react";


type GasVar =
  | 'P₁' | 'V₁' | 'T₁'
  | 'P₂' | 'V₂' | 'T₂'
  | 'n₁' | 'n₂'
  | '1/T₁' | '1/T₂'
  | '1/n₁' | '1/n₂'
  | 'P' | 'V' | 'T' | 'n' | 'R';

type Rotation = 0 | 1 | 2 | 3;

interface Domino {
  id: number;
  sides: [GasVar, GasVar];
  rotation: Rotation;
  x: number | null;
  y: number | null;
}

interface Region {
  id: string;
  label: string;
  cells: { x: number; y: number }[];
  required: GasVar[];
  color: string;
}

interface GameState {
  mapCells:{x:number,y:number}[];
  regions:Region[];
  dominos:Domino[];
}


const GRID = 10;
const CELL = 55;

const VAR_POOL: [GasVar,GasVar][] = [
  ['P₁','V₁'],['P₂','V₂'],
  ['V₁','1/T₁'],['V₂','1/T₂'],
  ['P₁','1/T₁'],['P₂','1/T₂'],
  ['V₁','1/n₁'],['V₂','1/n₂'],
  ['P','V'],['V','T'],['P','R'],
];

const shuffle = <T,>(arr:T[]) =>
  [...arr].sort(()=>Math.random()-0.5);

const inside = (cells:{x:number,y:number}[],x:number,y:number)=>
  cells.some(c=>c.x===x&&c.y===y);


const generateGame = ():GameState => {

  const dominoCount = Math.floor(Math.random()*4)+5;
  const chosen = shuffle(VAR_POOL).slice(0,dominoCount);

  const mapCells:{x:number,y:number}[]=[];
  const regions:Region[]=[];
  const dominos:Domino[]=[];

  let cursor = {x:4,y:4};
  const used = new Set<string>();
  const dirs = [{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}];

  for(let i=0;i<dominoCount;i++){
    let placed=false;
    let attempts=0;

    while(!placed && attempts<200){
      attempts++;
      const dir=dirs[Math.floor(Math.random()*4)];
      const nx=cursor.x+dir.x;
      const ny=cursor.y+dir.y;

      const k1=`${cursor.x},${cursor.y}`;
      const k2=`${nx},${ny}`;

      if(nx>1 && nx<GRID-2 && ny>1 && ny<GRID-2 &&
         !used.has(k1)&&!used.has(k2)){

        used.add(k1);
        used.add(k2);

        const cells=[{x:cursor.x,y:cursor.y},{x:nx,y:ny}];
        mapCells.push(...cells);

        regions.push({
          id:`R${i}`,
          label:`R${i+1}`,
          cells,
          required:chosen[i],
          color:`hsl(${Math.random()*360},70%,75%)`
        });

        dominos.push({
          id:i+1,
          sides:chosen[i],
          rotation:0,
          x:null,
          y:null
        });

        cursor={x:nx,y:ny};
        placed=true;
      }else{
        cursor={
          x:Math.floor(Math.random()*6)+2,
          y:Math.floor(Math.random()*6)+2
        };
      }
    }
  }

  return{
    mapCells,
    regions,
    dominos:shuffle(dominos)
  };
};


export default function GasLawPips(){

  const [game,setGame]=useState<GameState | null>(null);
  const [dominos,setDominos]=useState<Domino[]>([]);
  const [dragId,setDragId]=useState<number|null>(null);

  useEffect(()=>{
    const g = generateGame();
    setGame(g);
    setDominos(g.dominos);
  },[]);

  if(!game) return null;

  const occupied=(d:Domino)=>{
    if(d.x===null||d.y===null) return [];
    let tx=d.x, ty=d.y;
    if(d.rotation===0) tx++;
    else if(d.rotation===1) ty++;
    else if(d.rotation===2) tx--;
    else ty--;
    return [{x:d.x,y:d.y},{x:tx,y:ty}];
  };

  const isOccupied=(x:number,y:number)=>{
    return dominos.some(d=>
      occupied(d).some(c=>c.x===x&&c.y===y)
    );
  };

  const drop=(e:React.DragEvent)=>{
    e.preventDefault();
    if(dragId===null) return;

    const rect=(e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const gridX=Math.round((e.clientX-rect.left)/CELL);
    const gridY=Math.round((e.clientY-rect.top)/CELL);

    const d=dominos.find(d=>d.id===dragId);
    if(!d) return;

    let tx=gridX, ty=gridY;
    if(d.rotation===0) tx++;
    else if(d.rotation===1) ty++;
    else if(d.rotation===2) tx--;
    else ty--;

    const valid=
      inside(game.mapCells,gridX,gridY)&&
      inside(game.mapCells,tx,ty)&&
      !isOccupied(gridX,gridY)&&
      !isOccupied(tx,ty);

    if(valid){
      setDominos(prev=>
        prev.map(dom=>
          dom.id===dragId?{...dom,x:gridX,y:gridY}:dom
        )
      );
    }

    setDragId(null);
  };

  const rotate=(id:number)=>{
    setDominos(prev=>
      prev.map(d=>
        d.id===id?{...d,rotation:((d.rotation+1)%4)as Rotation}:d
      )
    );
  };

  const returnToTray=(id:number)=>{
    setDominos(prev=>
      prev.map(d=>d.id===id?{...d,x:null,y:null}:d)
    );
  };

  const newGame=()=>{
    const g=generateGame();
    setGame(g);
    setDominos(g.dominos);
  };

  return(
  <div className="flex flex-col items-center p-6 bg-white min-h-screen">

    <h1 className="text-xl font-bold mb-4">Gas Laws PIPS</h1>

    <button
      onClick={newGame}
      className="mb-6 px-4 py-2 bg-blue-600 text-white rounded"
    >
      New Game
    </button>

    <div className="flex gap-8">

      <div
        className="relative border-4 border-gray-600 bg-[#e5e7eb]"
        style={{width:GRID*CELL,height:GRID*CELL}}
        onDragOver={e=>e.preventDefault()}
        onDrop={drop}
      >

        {game.mapCells.map((c,i)=>(
          <div key={i}
            className="absolute border"
            style={{
              left:c.x*CELL,
              top:c.y*CELL,
              width:CELL,
              height:CELL,
              background:"#b7a99a"
            }}
          />
        ))}

        {game.regions.map(r=>
          r.cells.map((c,i)=>(
            <div key={r.id+i}
              className="absolute text-[10px] font-bold flex items-end justify-end p-1"
              style={{
                left:c.x*CELL,
                top:c.y*CELL,
                width:CELL,
                height:CELL,
                background:r.color,
                border:"2px solid black"
              }}>
              {i===0&&r.label}
            </div>
          ))
        )}

        {dominos.map(d=>{
          if(d.x===null||d.y===null) return null;
          const baseX=d.x;
          const baseY=d.y;
          const cells=occupied(d);

          return(
          <div key={d.id}
            draggable
            onDragStart={()=>setDragId(d.id)}
            onDoubleClick={()=>returnToTray(d.id)}
            onClick={()=>rotate(d.id)}
            className="absolute cursor-move"
            style={{left:baseX*CELL,top:baseY*CELL}}>
            {cells.map((o,i)=>(
              <div key={i}
                className="absolute bg-white border flex items-center justify-center font-bold text-sm"
                style={{
                  width:CELL-4,
                  height:CELL-4,
                  left:(o.x-baseX)*CELL+2,
                  top:(o.y-baseY)*CELL+2
                }}>
                {d.sides[i]}
              </div>
            ))}
          </div>
          );
        })}

      </div>

      <div className="w-64 border p-4 flex flex-wrap gap-4"
           onDragOver={e=>e.preventDefault()}
           onDrop={()=>dragId!==null&&returnToTray(dragId)}>
        {dominos.map(d=>d.x===null&&(
          <div key={d.id}
            draggable
            onDragStart={()=>setDragId(d.id)}
            onClick={()=>rotate(d.id)}
            className={`border bg-white flex cursor-pointer ${
              d.rotation%2===1?'flex-col w-12 h-24':'flex-row w-24 h-12'
            }`}>
            <div className="flex-1 flex items-center justify-center font-bold">
              {d.sides[0]}
            </div>
            <div className="flex-1 flex items-center justify-center font-bold border-l">
              {d.sides[1]}
            </div>
          </div>
        ))}
      </div>

    </div>
  </div>
  );
}