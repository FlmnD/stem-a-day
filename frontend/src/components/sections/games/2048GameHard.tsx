'use client'
import React, { useState } from "react";


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


const GRID = 10;
const CELL = 55;

const MAP = [
  {x:2,y:2},{x:3,y:2},{x:4,y:2},{x:5,y:2},{x:6,y:2},
  {x:2,y:3},{x:3,y:3},{x:4,y:3},{x:5,y:3},{x:6,y:3},
  {x:2,y:4},{x:3,y:4},{x:4,y:4},{x:5,y:4},{x:6,y:4},
  {x:3,y:5},{x:4,y:5},{x:5,y:5},{x:4,y:6},{x:5,y:6}
];

const insideMap = (x:number,y:number)=>
  MAP.some(c=>c.x===x&&c.y===y);


const REGIONS: Region[] = [
  { id:"B1", label:"B1", color:"#fca5a5",
    cells:[{x:2,y:2},{x:3,y:2}],
    required:['P₁','V₁']
  },
  { id:"B2", label:"B2", color:"#f87171",
    cells:[{x:4,y:2},{x:5,y:2}],
    required:['P₂','V₂']
  },
  { id:"Ch1", label:"Ch1", color:"#93c5fd",
    cells:[{x:2,y:3},{x:3,y:3}],
    required:['V₁','1/T₁']
  },
  { id:"Ch2", label:"Ch2", color:"#60a5fa",
    cells:[{x:4,y:3},{x:5,y:3}],
    required:['V₂','1/T₂']
  },
  { id:"GL1", label:"GL1", color:"#c4b5fd",
    cells:[{x:2,y:4},{x:3,y:4}],
    required:['P₁','1/T₁']
  },
  { id:"GL2", label:"GL2", color:"#a78bfa",
    cells:[{x:4,y:4},{x:5,y:4}],
    required:['P₂','1/T₂']
  },
  { id:"A1", label:"A1", color:"#86efac",
    cells:[{x:3,y:5},{x:4,y:5}],
    required:['V₁','1/n₁']
  },
  { id:"A2", label:"A2", color:"#4ade80",
    cells:[{x:5,y:5},{x:4,y:6}],
    required:['V₂','1/n₂']
  },
];


const INITIAL: Domino[] = [
  {id:1,sides:['P₁','V₁'],rotation:0,x:null,y:null},
  {id:2,sides:['P₂','V₂'],rotation:0,x:null,y:null},
  {id:3,sides:['V₁','1/T₁'],rotation:0,x:null,y:null},
  {id:4,sides:['V₂','1/T₂'],rotation:0,x:null,y:null},
  {id:5,sides:['P','V'],rotation:0,x:null,y:null},
  {id:6,sides:['n','R'],rotation:0,x:null,y:null},
  {id:7,sides:['1/n₁','1/n₂'],rotation:0,x:null,y:null},
  {id:8,sides:['T','n'],rotation:0,x:null,y:null},
];


export default function GasLawPips(){

  const [dominos,setDominos]=useState(INITIAL);
  const [dragId,setDragId]=useState<number|null>(null);
  const [msg]=useState("Drag and rotate dominoes into the grey map.");

  const occupied=(d:Domino)=>{
    if(d.x===null||d.y===null) return [];
    let tx=d.x, ty=d.y;
    if(d.rotation===0) tx++;
    else if(d.rotation===1) ty++;
    else if(d.rotation===2) tx--;
    else ty--;
    return [
      {x:d.x,y:d.y,val:d.sides[0]},
      {x:tx,y:ty,val:d.sides[1]}
    ];
  };

  const drop=(e:React.DragEvent,x:number,y:number)=>{
    e.preventDefault();
    if(dragId===null) return;

    const d=dominos.find(d=>d.id===dragId);
    if(!d) return;

    let tx=x, ty=y;
    if(d.rotation===0) tx++;
    else if(d.rotation===1) ty++;
    else if(d.rotation===2) tx--;
    else ty--;

    if(insideMap(x,y)&&insideMap(tx,ty)){
      setDominos(prev=>prev.map(dom=>
        dom.id===dragId?{...dom,x,y}:dom
      ));
    }
    setDragId(null);
  };

  const rotate=(id:number)=>{
    setDominos(prev=>
      prev.map(d=>
        d.id===id
          ? {...d,rotation:((d.rotation+1)%4)as Rotation}
          : d
      )
    );
  };

  return(
  <div className="flex flex-col items-center p-6 bg-white min-h-screen">

    <h1 className="text-xl font-bold mb-6">Gas Laws PIPS</h1>

    <div className="flex gap-8">

      <div className="relative border"
        style={{width:GRID*CELL,height:GRID*CELL}}>

        {MAP.map((c,i)=>(
          <div key={i}
            className="absolute bg-gray-200 border"
            style={{
              left:c.x*CELL,
              top:c.y*CELL,
              width:CELL,
              height:CELL
            }}
          />
        ))}

        {REGIONS.map(r=>
          r.cells.map((c,i)=>(
            <div key={r.id+i}
              className="absolute text-[10px] font-bold flex items-end justify-end p-1"
              style={{
                left:c.x*CELL,
                top:c.y*CELL,
                width:CELL,
                height:CELL,
                background:r.color
              }}
            >
              {i===0&&r.label}
            </div>
          ))
        )}

        <div className="absolute inset-0 grid"
          style={{gridTemplateColumns:`repeat(${GRID},1fr)`}}>
          {Array.from({length:GRID*GRID}).map((_,i)=>(
            <div key={i}
              onDragOver={e=>e.preventDefault()}
              onDrop={e=>drop(e,i%GRID,Math.floor(i/GRID))}
            />
          ))}
        </div>

        {dominos.map(d=>{
          if(d.x===null||d.y===null) return null;

          const baseX=d.x;
          const baseY=d.y;
          const cells=occupied(d);

          return(
          <div key={d.id}
            draggable
            onDragStart={()=>setDragId(d.id)}
            onClick={()=>rotate(d.id)}
            className="absolute cursor-move"
            style={{left:baseX*CELL,top:baseY*CELL}}
          >
            {cells.map((o,i)=>(
              <div key={i}
                className="absolute bg-white border flex items-center justify-center font-bold"
                style={{
                  width:CELL-4,
                  height:CELL-4,
                  left:(o.x-baseX)*CELL+2,
                  top:(o.y-baseY)*CELL+2
                }}>
                {o.val}
              </div>
            ))}
          </div>
          );
        })}

      </div>

      <div className="w-60 border p-4 flex flex-wrap gap-4">
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

    <div className="mt-6 font-semibold">{msg}</div>

  </div>
  );
}