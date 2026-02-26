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

type GasLaw =
  | 'Boyle'
  | 'Charles'
  | 'Gay-Lussac'
  | 'Avogadro'
  | 'Ideal';

interface Region {
  id: string;
  label: string;
  law: GasLaw;
  code: string;
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

type LawCode = 'Bo' | 'Ch' | 'GL' | 'Av' | 'IG';

const LAW_CODES: Record<GasLaw, LawCode> = {
  Boyle: 'Bo',
  Charles: 'Ch',
  'Gay-Lussac': 'GL',
  Avogadro: 'Av',
  Ideal: 'IG'
};

const detectState = (pair: [GasVar, GasVar]): '1' | '2' | '' => {
  if (pair.some(v => v.includes('₁'))) return '1';
  if (pair.some(v => v.includes('₂'))) return '2';
  return '';
};

const detectLaw = (pair: [GasVar, GasVar]): GasLaw => {
  const key = pair.join(',');

  if (key === 'P₁,V₁' || key === 'P₂,V₂') return 'Boyle';
  if (key === 'V₁,1/T₁' || key === 'V₂,1/T₂') return 'Charles';
  if (key === 'P₁,1/T₁' || key === 'P₂,1/T₂') return 'Gay-Lussac';
  if (key === 'V₁,1/n₁' || key === 'V₂,1/n₂') return 'Avogadro';

  return 'Ideal';
};

const LAW_COLORS: Record<GasLaw,string> = {
  Boyle: 'hsl(210,70%,80%)',
  Charles: 'hsl(0,70%,80%)',
  'Gay-Lussac': 'hsl(120,60%,75%)',
  Avogadro: 'hsl(280,60%,80%)',
  Ideal: 'hsl(40,80%,80%)'
};

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

        const law = detectLaw(chosen[i]);
        const state = detectState(chosen[i]);
        const code = LAW_CODES[law] + state;

        regions.push({
          id: `R${i}`,
          label: code,
          law,
          code,
          cells,
          required: chosen[i],
          color: LAW_COLORS[law]
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

export default function HardPips(){

  const [game,setGame]=useState<GameState | null>(null);
  const [dominos,setDominos]=useState<Domino[]>([]);
  const [selectedId,setSelectedId]=useState<number|null>(null);
  const [result, setResult] = useState<'correct'|'wrong'|null>(null);

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

  const checkSolution = () => {
    const correct = game.regions.every(r => {
      const placed = dominos.filter(d =>
        d.x !== null && r.cells.some(c => c.x === d.x && c.y === d.y)
      );
      if (placed.length === 0) return false;
      const d = placed[0];
      const dominoCells = occupied(d);
      const coversRegion =
        dominoCells.length === 2 &&
        r.cells.every(rc => dominoCells.some(dc => dc.x === rc.x && dc.y === rc.y));
      const sidesMatch =
        d.sides.every(s => r.required.includes(s)) &&
        r.required.every(s => d.sides.includes(s));
      return coversRegion && sidesMatch;
    });
    setResult(correct ? 'correct' : 'wrong');
  };

  const rotate=(id:number)=>{
    setDominos(prev=>{
      const d=prev.find(d=>d.id===id);
      if(!d) return prev;
      const newRot=((d.rotation+1)%4) as Rotation;
      if(d.x===null) return prev.map(dom=>dom.id===id?{...dom,rotation:newRot}:dom);
      let tx=d.x!,ty=d.y!;
      if(newRot===0) tx++;
      else if(newRot===1) ty++;
      else if(newRot===2) tx--;
      else ty--;
      const otherOccupied=prev.filter(od=>od.id!==id).flatMap(od=>{
        if(od.x===null||od.y===null) return [];
        let ox=od.x,oy=od.y;
        if(od.rotation===0) ox++;
        else if(od.rotation===1) oy++;
        else if(od.rotation===2) ox--;
        else oy--;
        return [{x:od.x,y:od.y},{x:ox,y:oy}];
      });
      const overlaps=(x:number,y:number)=>otherOccupied.some(c=>c.x===x&&c.y===y);
      const valid=inside(game.mapCells,d.x!,d.y!)&&inside(game.mapCells,tx,ty)&&!overlaps(d.x!,d.y!)&&!overlaps(tx,ty);
      if(valid) return prev.map(dom=>dom.id===id?{...dom,rotation:newRot}:dom);
      return prev;
    });
  };

  const handleMapCellClick=(cx:number,cy:number)=>{
    if(selectedId===null) return;
    const d=dominos.find(d=>d.id===selectedId);
    if(!d) return;
    let tx=cx,ty=cy;
    if(d.rotation===0) tx++;
    else if(d.rotation===1) ty++;
    else if(d.rotation===2) tx--;
    else ty--;
    const otherOccupied=dominos.filter(od=>od.id!==selectedId).flatMap(od=>{
      if(od.x===null||od.y===null) return [];
      let ox=od.x,oy=od.y;
      if(od.rotation===0) ox++;
      else if(od.rotation===1) oy++;
      else if(od.rotation===2) ox--;
      else oy--;
      return [{x:od.x,y:od.y},{x:ox,y:oy}];
    });
    const overlaps=(x:number,y:number)=>otherOccupied.some(c=>c.x===x&&c.y===y);
    const valid=inside(game.mapCells,cx,cy)&&inside(game.mapCells,tx,ty)&&!overlaps(cx,cy)&&!overlaps(tx,ty);
    if(valid){
      setDominos(prev=>prev.map(dom=>dom.id===selectedId?{...dom,x:cx,y:cy}:dom));
      setSelectedId(null);
    }
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
    setResult(null);
    setSelectedId(null);
  };

  return(
  <div className="flex flex-col items-center p-6 bg-white min-h-screen">

    <h1 className="text-xl font-bold mb-4">Gas Laws Pips</h1>

    <div className="mb-6 flex gap-3 items-center">
      <button onClick={newGame} className="px-4 py-2 bg-blue-600 text-white rounded">
        New Game
      </button>
      <button
        onClick={checkSolution}
        disabled={dominos.some(d=>d.x===null)}
        className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Check Solution
      </button>
      {result==='correct' && <span className="text-green-600 font-bold">🎉 Correct!</span>}
      {result==='wrong' && <span className="text-red-500 font-bold">❌ Try again!</span>}
    </div>

    <div className="flex gap-8 items-start">

      {/* MAP */}
      <div
        className="relative border-4 border-gray-600 bg-[#e5e7eb]"
        style={{width:GRID*CELL,height:GRID*CELL}}
      >

        {game.mapCells.map((c,i)=>(
          <div key={i}
            className="absolute border cursor-pointer"
            style={{
              left:c.x*CELL,
              top:c.y*CELL,
              width:CELL,
              height:CELL,
              background: selectedId!==null?"#c9b89e":"#b7a99a"
            }}
            onClick={()=>handleMapCellClick(c.x,c.y)}
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
                border:"2px solid black",
                pointerEvents: selectedId!==null ? 'auto' : 'none'
              }}
              onClick={()=>handleMapCellClick(c.x,c.y)}>
              {i===0 && (
                <div className="text-sm font-bold">
                  {r.label}
                </div>
              )}
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
            onDoubleClick={()=>rotate(d.id)}
            onClick={()=>setSelectedId(prev=>prev===d.id?null:d.id)}
            className="absolute cursor-pointer"
            style={{
              left:baseX*CELL,top:baseY*CELL,
              zIndex:selectedId===d.id?20:10
            }}>
            {cells.map((o,i)=>(
              <div key={i}
                className="absolute bg-white flex items-center justify-center font-bold text-sm"
                style={{
                  width:CELL-4,height:CELL-4,
                  left:(o.x-baseX)*CELL+2,top:(o.y-baseY)*CELL+2,
                  border: selectedId===d.id?'2px solid #2563eb':'2px solid #555'
                }}>
                {d.sides[i]}
              </div>
            ))}
          </div>
          );
        })}

      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-col gap-4">

        {/* TRAY + INFO side by side */}
        <div className="flex gap-4 items-start">

          {/* DOMINO TRAY */}
          <div
            className="border p-4 flex flex-wrap gap-4"
            style={{width:220, minHeight:80}}
            onClick={()=>{if(selectedId!==null){returnToTray(selectedId);setSelectedId(null);}}}
          >
            {dominos.map(d=>d.x===null&&(
              <div key={d.id}
                onDoubleClick={()=>rotate(d.id)}
                onClick={e=>{e.stopPropagation();setSelectedId(prev=>prev===d.id?null:d.id);}}
                className={`bg-white flex cursor-pointer ${
                  d.rotation%2===1?'flex-col w-12 h-24':'flex-row w-24 h-12'
                }`}
                style={{border:selectedId===d.id?'2px solid #2563eb':'2px solid #555'}}>
                <div className="flex-1 flex items-center justify-center font-bold">
                  {d.sides[0]}
                </div>
                <div className="flex-1 flex items-center justify-center font-bold border-l">
                  {d.sides[1]}
                </div>
              </div>
            ))}
          </div>

          {/* INFO COLUMN */}
          <div className="flex flex-col gap-4 w-64">

            {/* REGION CODE KEY */}
            <div className="text-sm border p-3 bg-gray-50">
              <h2 className="font-bold mb-2">Region Code Key</h2>

              <p style={{color:'hsl(210,70%,50%)'}}><strong>Bo</strong> = Boyle's Law</p>
              <p style={{color:'hsl(0,70%,50%)'}}><strong>Ch</strong> = Charles's Law</p>
              <p style={{color:'hsl(120,60%,40%)'}}><strong>GL</strong> = Gay-Lussac's Law</p>
              <p style={{color:'hsl(280,60%,50%)'}}><strong>Av</strong> = Avogadro's Law</p>
              <p style={{color:'hsl(40,80%,50%)'}}><strong>IG</strong> = Ideal Gas Law</p>

              <hr className="my-2"/>

              <p><strong>1</strong> = Initial state</p>
              <p><strong>2</strong> = Final state</p>

              <hr className="my-2"/>

              <p className="italic">Example: Ch1 → V₁ · 1/T₁</p>
            </div>

            {/* COLLAPSIBLE FULL LAW REFERENCE */}
            <details className="border bg-gray-50 text-sm">
              <summary className="cursor-pointer font-bold px-3 py-2 bg-gray-200">
                Full Gas Law Reference
              </summary>

              <div className="p-3 space-y-3">

                <div style={{color:'hsl(210,70%,50%)'}}>
                  <p className="font-semibold">Boyle's Law</p>
                  <p>P₁V₁ = P₂V₂</p>
                  <p className="italic">Constant Temperature</p>
                </div>

                <div style={{color:'hsl(0,70%,50%)'}}>
                  <p className="font-semibold">Charles's Law</p>
                  <p>V₁ / T₁ = V₂ / T₂</p>
                  <p className="italic">Constant Pressure</p>
                </div>

                <div style={{color:'hsl(120,60%,40%)'}}>
                  <p className="font-semibold">Gay-Lussac's Law</p>
                  <p>P₁ / T₁ = P₂ / T₂</p>
                  <p className="italic">Constant Volume</p>
                </div>

                <div style={{color:'hsl(280,60%,50%)'}}>
                  <p className="font-semibold">Avogadro's Law</p>
                  <p>V₁ / n₁ = V₂ / n₂</p>
                  <p className="italic">Constant Pressure & Temperature</p>
                </div>

                <div style={{color:'hsl(40,80%,50%)'}}>
                  <p className="font-semibold">Ideal Gas Law</p>
                  <p>PV = nRT</p>
                </div>

              </div>
            </details>

          </div>
        </div>
      </div>

    </div>
  </div>
  );
}