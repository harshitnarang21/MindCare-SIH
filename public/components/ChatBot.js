import {useState, useEffect, useRef} from "react";
import "../App.css";

const responses = [
 {tag:"greeting", patterns:["hi","hello"], reply:"Hello! How can I help with stress, anxiety, low mood or sleep today?"},
 {tag:"anxiety", patterns:["panic","anxious","worry"], reply:"Deep breathing, 5-4-3-2-1 grounding and scheduling breaks often reduce anxiety."},
 {tag:"depression", patterns:["sad","depressed","worthless"], reply:"Writing three positive things nightly and breaking tasks into small goals helps lift mood."},
 {tag:"burnout", patterns:["burnout","exhausted"], reply:"Try the Pomodoro study cycle and short walks; if exhaustion lasts >2 weeks talk to a counsellor."},
 {tag:"sleep", patterns:["insomnia","sleep"], reply:"Keep a fixed bedtime, limit caffeine after 3 PM and avoid screens 30 min before bed."},
 {tag:"social", patterns:["lonely","isolation"], reply:"Consider clubs on campus or join the Peer-Support room from the menu."},
 {tag:"suicide", patterns:["suicide","harm","kill myself","better off dead"], reply:"I’m concerned about safety. Please call 988 (US) or 199 (India) now, and book the crisis slot immediately."},
];

const riskWords = ["suicide","kill myself","better off dead","worthless","no reason"];
export default function ChatBot(){
  const [chat,setChat]=useState([{from:"bot",text:"Hi 👋 I’m MindCare Bot. Tell me what’s bothering you."}]);
  const [input,setInput]=useState("");
  const bottom = useRef(null);

  useEffect(()=>bottom.current?.scrollIntoView({behavior:"smooth"}),[chat]);

  const send=()=>{
    if(!input.trim())return;
    const msg=input.trim();
    setChat(c=>[...c,{from:"user",text:msg}]);
    setInput("");

    // Simple matcher
    const lower=msg.toLowerCase();
    const found=responses.find(r=>r.patterns.some(p=>lower.includes(p)));
    const reply=found?found.reply:"Could you say more about that?";
    setChat(c=>[...c,{from:"user",text:msg},{from:"bot",text:reply}]);

    // Crisis detection
    if(riskWords.some(w=>lower.includes(w))){
      setChat(c=>[...c,{from:"alert",
        text:"⚠️  You may need immediate professional help. Please call emergency services or your campus helpline."}]);
    }
  };

  return(
    <div className="chat-container">
      <header className="chat-header">AI First-Aid Chat</header>
      <div className="chat-messages">
        {chat.map((m,i)=>(
          <div key={i} className={`message ${m.from}`}>
            <div className={`message-content ${m.from==="alert"?"alert":""}`}>{m.text}</div>
          </div>
        ))}
        <div ref={bottom}/>
      </div>

      <div className="chat-input-container">
        <input value={input} onChange={e=>setInput(e.target.value)}
               onKeyDown={e=>e.key==='Enter'&&send()}
               placeholder="Type your message…" className="chat-input"/>
        <button onClick={send} className="send-button">Send</button>
      </div>
    </div>
  );
}
