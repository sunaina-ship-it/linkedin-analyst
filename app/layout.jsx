'use client'
import { useState } from 'react'
const S={'1. HOOK MECHANICS':{n:'01',t:'Hook mechanics'},'2. NARRATIVE ARC':{n:'02',t:'Narrative arc'},'3. PACING AND RHYTHM':{n:'03',t:'Pacing and rhythm'},'4. PSYCHOLOGICAL JOURNEY':{n:'04',t:'Psychological journey'},'5. STEAL VS ADAPT':{n:'05',t:'Steal vs adapt'}}
function parse(text){return text.split(/##\s+/).filter(s=>s.trim()).map(p=>{const ls=p.split('\n'),r=ls[0].trim();return{raw:r,num:S[r]?.n||'--',title:S[r]?.t||r,body:ls.slice(1).join('\n').trim()}})}
function pts(body){const out=[];body.split(/\n(?=\*\*[^*]+\*\*)/).forEach(b=>{b=b.trim();if(!b)return;const m=b.match(/^\*\*(.+?)\*\*[:\s]*(.*)$/s);if(m)out.push({l:m[1].trim(),t:m[2].trim()});else b.split('\n\n').forEach(p=>{if(p.trim())out.push({l:null,t:p.trim()})})});if(!out.length)body.split('\n\n').forEach(p=>{if(p.trim())out.push({l:null,t:p.trim()})});return out}
function Card({sec}){
  const[open,setOpen]=useState(true)
  const isS=sec.raw==='5. STEAL VS ADAPT'
  const ls=sec.body.split('\n').filter(l=>l.trim())
  const ex=p=>(ls.find(l=>l.toLowerCase().startsWith(p.toLowerCase()))||'').replace(new RegExp('^'+p+'\\s*','i'),'').trim()
  return(<div style={{background:'#fff',border:'1px solid rgba(13,13,13,.13)',borderRadius:6,marginBottom:12,overflow:'hidden'}}>
    <div onClick={()=>setOpen(o=>!o)} style={{display:'flex',alignItems:'center',gap:14,padding:'16px 22px',cursor:'pointer',background:open?'#efeae3':'#fff',borderBottom:open?'1px solid rgba(13,13,13,.13)':'none',userSelect:'none'}}>
      <span style={{fontFamily:'monospace',fontSize:10,color:'#e8420a'}}>{sec.num}</span>
      <span style={{fontFamily:'sans-serif',fontSize:15,fontWeight:800,flex:1}}>{sec.title}</span>
      <span style={{fontSize:11,color:'#8a857e',transform:open?'none':'rotate(-90deg)',transition:'transform .2s'}}>▾</span>
    </div>
    {open&&(isS?(<div style={{padding:'22px 24px'}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
        <div style={{background:'#edf5e8',borderRadius:4,padding:'14px 16px'}}><span style={{display:'block',fontFamily:'monospace',fontSize:9,textTransform:'uppercase',color:'#3a7a2a',marginBottom:6}}>Steal directly</span><p style={{fontSize:13,lineHeight:1.65}}>{ex('What to steal directly:')}</p></div>
        <div style={{background:'#fdf8ec',borderRadius:4,padding:'14px 16px'}}><span style={{display:'block',fontFamily:'monospace',fontSize:9,textTransform:'uppercase',color:'#8a6a10',marginBottom:6}}>What to adapt</span><p style={{fontSize:13,lineHeight:1.65}}>{ex('What to adapt:')}</p></div>
      </div>
      <div style={{background:'#fdf0ec',borderLeft:'3px solid #e8420a',borderRadius:4,padding:'14px 16px',marginBottom:12}}><span style={{display:'block',fontFamily:'monospace',fontSize:9,textTransform:'uppercase',color:'#e8420a',marginBottom:6}}>Do not copy</span><p style={{fontSize:13,lineHeight:1.65}}>{ex('What not to copy:')}</p></div>
      <div style={{background:'#0d0d0d',borderRadius:4,padding:'20px 22px'}}><span style={{display:'block',fontFamily:'monospace',fontSize:9,textTransform:'uppercase',color:'#ff6b3d',marginBottom:8}}>3-sentence writer summary</span><p style={{fontSize:14,lineHeight:1.7,color:'rgba(255,255,255,.85)'}}>{(ls.find(l=>l.toLowerCase().startsWith('3-sentence'))||'').replace(/^3-sentence writer summary.*?:\s*/i,'')}</p></div>
    </div>):(<div style={{padding:'22px 24px'}}>{pts(sec.body).map((p,j)=>(<div key={j} style={{marginBottom:16}}>{p.l&&<span style={{display:'block',fontFamily:'monospace',fontSize:10,textTransform:'uppercase',color:'#e8420a',marginBottom:4}}>{p.l}</span>}<p style={{fontSize:15,lineHeight:1.75,color:'#2a2825'}}>{p.t}</p></div>))}</div>))}
  </div>)
}
export default function Home(){
  const[post,setPost]=useState('')
  const[loading,setLoading]=useState(false)
  const[sections,setSections]=useState([])
  const[error,setError]=useState('')
  const[stream,setStream]=useState('')
  async function analyse(){
    if(post.trim().length<20){setError('Post too short.');return}
    setError('');setSections([]);setStream('');setLoading(true)
    try{
      const res=await fetch('/api/analyse',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({post})})
      if(!res.ok){const e=await res.json();throw new Error(e.error||'Error')}
      const reader=res.body.getReader(),decoder=new TextDecoder()
      let full=''
      while(true){const{done,value}=await reader.read();if(done)break;full+=decoder.decode(value,{stream:true});setStream(full)}
      setSections(parse(full));setStream('')
    }catch(e){setError(e.message||'Something went wrong.')}
    finally{setLoading(false)}
  }
  return(<>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@800&family=DM+Mono&family=Newsreader:ital,wght@0,400;1,400&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}body{background:#f5f2ed}@keyframes pulse{0%,100%{opacity:.2;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    <div style={{maxWidth:780,margin:'0 auto',padding:'56px 32px 100px'}}>
      <div style={{marginBottom:36,paddingBottom:28,borderBottom:'1.5px solid #0d0d0d'}}>
        <h1 style={{fontFamily:'Syne,sans-serif',fontSize:'clamp(26px,5vw,38px)',fontWeight:800,letterSpacing:'-.02em',lineHeight:1.1,marginBottom:14}}>LinkedIn Post <span style={{color:'#e8420a'}}>Analyst</span></h1>
        <p style={{fontFamily:'Newsreader,Georgia,serif',fontSize:16,color:'#3a3632',lineHeight:1.7}}>Paste any LinkedIn post and get a structured breakdown of why it works — hook, narrative, pacing, psychology, and exactly what to steal or leave behind. Built for ghostwriters who need to move fast without losing what makes a post land.</p>
      </div>
      <div style={{background:'#fff',border:'1px solid rgba(13,13,13,.13)',borderRadius:6,padding:24,marginBottom:14}}>
        <span style={{fontFamily:'DM Mono,monospace',fontSize:9,letterSpacing:'.12em',textTransform:'uppercase',color:'#8a857e',display:'block',marginBottom:10}}>LinkedIn post</span>
        <textarea value={post} onChange={e=>setPost(e.target.value)} placeholder="Paste the full LinkedIn post here..." style={{width:'100%',minHeight:180,padding:'12px 14px',border:'1px solid rgba(13,13,13,.13)',borderRadius:4,background:'#f5f2ed',fontFamily:'Newsreader,Georgia,serif',fontSize:15,color:'#0d0d0d',lineHeight:1.65,resize:'vertical',outline:'none'}}/>
        <div style={{fontFamily:'DM Mono,monospace',fontSize:11,color:'#8a857e',marginTop:8,textAlign:'right'}}>{post.length} characters</div>
      </div>
      <button onClick={analyse} disabled={loading} style={{width:'100%',padding:14,background:loading?'#555':'#0d0d0d',color:'#fff',fontFamily:'Syne,sans-serif',fontSize:15,fontWeight:700,border:'none',borderRadius:4,cursor:loading?'not-allowed':'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:10}}>
        {loading?<>Analysing {[0,1,2].map(i=><span key={i} style={{width:6,height:6,borderRadius:'50%',background:'#fff',display:'inline-block',animation:`pulse 1.2s ${i*.2}s infinite`}}/>)}</>:'Analyse post →'}
      </button>
      {error&&<div style={{marginTop:12,padding:'10px 14px',background:'#fdf0ec',border:'1px solid #e8420a',borderRadius:4,fontFamily:'DM Mono,monospace',fontSize:12,color:'#e8420a'}}>{error}</div>}
      {stream&&!sections.length&&<div style={{marginTop:24,padding:'20px 24px',background:'#fff',border:'1px solid rgba(13,13,13,.13)',borderRadius:6,fontFamily:'DM Mono,monospace',fontSize:13,lineHeight:1.75,color:'#2a2825',whiteSpace:'pre-wrap',maxHeight:320,overflowY:'auto'}}>{stream}<span style={{display:'inline-block',width:8,height:15,background:'#e8420a',marginLeft:2,animation:'blink .7s infinite',verticalAlign:'text-bottom'}}/></div>}
      {sections.length>0&&<div style={{marginTop:40}}><div style={{marginBottom:24,paddingBottom:16,borderBottom:'1.5px solid #0d0d0d'}}><h3 style={{fontFamily:'Syne,sans-serif',fontSize:20,fontWeight:800,letterSpacing:'-.02em'}}>Ghostwriter brief</h3></div>{sections.map((s,i)=><Card key={i} sec={s}/>)}</div>}
    </div>
  </>)
}
