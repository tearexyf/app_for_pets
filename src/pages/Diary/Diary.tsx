
import {useState} from 'react';
import BottomMenu from '../../components/BottomMenu/BottomMenu';
import {getDiaryEntries,saveDiaryEntry,updateDiaryEntry,deleteDiaryEntry} from '../../services/storage';

export default function Diary(){
 const [entries,setEntries]=useState(getDiaryEntries());
 const [title,setTitle]=useState(''); const [text,setText]=useState('');
 const refresh=()=>setEntries(getDiaryEntries());
 const add=(img:any)=>{saveDiaryEntry({id:Date.now(),title,text,image:img,createdAt:new Date().toISOString()});setTitle('');setText('');refresh();}
 return 
    <div>
        <h1>Diary & Album</h1>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title"/>
        <textarea value={text} onChange={e=>setText(e.target.value)} />
        <input type="file" accept="image/*" onChange={e=>{const f=e.target.files?.[0]; if(!f)return; const r=new FileReader(); r.onload=()=>add(r.result); r.readAsDataURL(f);}}/>
        {entries.map((e:any)=>
        <div key={e.id}><h3>{e.title}</h3><p>{e.text}</p>{e.image&&<img src={e.image} style={{width:120,borderRadius:12}}/>}
        <button onClick={()=>{const t=prompt('Edit text',e.text); 
            if(t!=null){updateDiaryEntry(e.id,{text:t});refresh();}}}>Edit</button>
        <button onClick={()=>{deleteDiaryEntry(e.id);refresh();}}>Delete</button>
    </div>)}
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(120px,1fr))',gap:'10px'}}>{entries.filter((e:any)=>e.image).map((e:any)=><img key={e.id} src={e.image} style={{width:'100%',borderRadius:16}}/>)}</div>
    <BottomMenu/>
    </div>
}
