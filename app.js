import { questions } from "./questions.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9BrYEnGuMPBT3_JhJAH1alEFUFiZ9bfQ",
  authDomain: "navodaya-survey.firebaseapp.com",
  projectId: "navodaya-survey",
  storageBucket: "navodaya-survey.firebasestorage.app",
  messagingSenderId: "686048593802",
  appId: "1:686048593802:web:9eac70ce31ab545f556a73"
};

let db=null;
try {
  if(firebaseConfig.apiKey !== "PASTE_API_KEY"){
    db=getFirestore(initializeApp(firebaseConfig));
  }
} catch(e){ console.error(e); }

const $=id=>document.getElementById(id);
let step=0, answers={};

$("startBtn").onclick=()=>{ $("intro").classList.add("hidden"); $("survey").classList.remove("hidden"); render(); };
$("backBtn").onclick=()=>{ if(step>0){step--;render();} };
$("nextBtn").onclick=next;

function render(){
  const q=questions[step];
  $("counter").textContent=`${step+1} / ${questions.length}`;
  $("bar").style.width=`${((step+1)/questions.length)*100}%`;
  $("backBtn").style.visibility=step===0?"hidden":"visible";
  $("nextBtn").textContent=step===questions.length-1?"Submit ✓":"Next →";
  $("error").textContent="";
  let body="";
  if(q.type==="text") body=`<textarea class="text" id="answer" placeholder="${q.placeholder||""}">${answers[q.key]||""}</textarea>`;
  else if(q.type==="single") body=`<div class="options">${q.options.map(x=>`<button class="option ${answers[q.key]===x?"selected":""}" data-v="${esc(x)}">${esc(x)}</button>`).join("")}</div>`;
  else if(q.type==="multi"||q.type==="multi3"){
    const selected=answers[q.key]||[];
    body=`<div class="options">${q.options.map(x=>`<button class="option ${selected.includes(x)?"selected":""}" data-v="${esc(x)}">${esc(x)}</button>`).join("")}</div>`;
    if(q.type==="multi3") body+=`<p class="hint">Choose up to 3.</p>`;
  }
  $("question").innerHTML=`<div class="qwrap"><h2 class="question-title">${q.title}</h2>${q.type!=="text"&&q.type!=="multi3"?'<p class="hint">Choose what feels useful to you.</p>':""}${body}</div>`;
  if(q.type!=="text"){
    document.querySelectorAll(".option").forEach(b=>b.onclick=()=>select(q,b));
  } else $("answer").oninput=e=>answers[q.key]=e.target.value;
}
function select(q,b){
  const v=b.dataset.v;
  if(q.type==="single"){answers[q.key]=v;render();}
  else{
    let arr=answers[q.key]||[];
    if(arr.includes(v)) arr=arr.filter(x=>x!==v);
    else {if(q.type==="multi3"&&arr.length>=3)return; arr.push(v);}
    answers[q.key]=arr; render();
  }
}
function next(){
  const q=questions[step];
  if(q.required && (!answers[q.key] || (Array.isArray(answers[q.key])&&!answers[q.key].length))){
    $("error").textContent="Please choose an answer before continuing."; return;
  }
  if(step<questions.length-1){step++;render();} else submit();
}
async function submit(){
  $("nextBtn").disabled=true; $("error").textContent="";
  const payload={...answers,submittedAt:new Date().toISOString(),source:"navodaya-forever-survey-v1"};
  try{
    if(!db) throw new Error("Firebase not configured");
    await addDoc(collection(db,"surveyResponses"),{...payload,createdAt:serverTimestamp()});
    $("survey").classList.add("hidden"); $("done").classList.remove("hidden");
  }catch(e){
    console.error(e);
    $("nextBtn").disabled=false;
    $("error").textContent="Could not submit right now. Please check the connection and try again.";
  }
}
function esc(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
