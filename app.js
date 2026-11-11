(() => {
  "use strict";
  const KEY = "deskflow-tickets-v1";
  const seed = [
    {id:"DSK-1042",title:"Laptop not connecting to Wi-Fi",requester:"Maya Chen",category:"Network",priority:"High",status:"Open",assignee:"Unassigned",description:"The laptop can see the office network but cannot connect. The user has restarted the device and still sees the same issue.",createdAt:ago(0)},
    {id:"DSK-1041",title:"Microsoft 365 sign-in issue",requester:"Noah Williams",category:"Access",priority:"Medium",status:"In Progress",assignee:"Obaloluwa",description:"User receives an authentication error when signing in to Outlook and Teams.",createdAt:ago(1)},
    {id:"DSK-1040",title:"Replace damaged keyboard",requester:"Ava Patel",category:"Hardware",priority:"Low",status:"Resolved",assignee:"IT Support",description:"Several keys stopped responding. The keyboard was replaced and tested successfully.",createdAt:ago(2)},
    {id:"DSK-1039",title:"Request access to shared drive",requester:"Liam Thompson",category:"Access",priority:"Medium",status:"Open",assignee:"Unassigned",description:"A new team member needs access to the Finance shared folder.",createdAt:ago(3)},
    {id:"DSK-1038",title:"Application crashes on startup",requester:"Sophia Martin",category:"Software",priority:"High",status:"In Progress",assignee:"Obaloluwa",description:"The inventory application closes immediately after launch. The issue started after the latest update.",createdAt:ago(4)}
  ];
  function ago(days){const d=new Date();d.setDate(d.getDate()-days);return d.toISOString();}
  const $ = s => document.querySelector(s);
  const esc = v => String(v ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const initials = name => String(name || "?").trim().split(/\s+/).map(x=>x[0] || "").join("").slice(0,2).toUpperCase();
  const statusClass = s => s==="In Progress"?"progress":s.toLowerCase();
  const dateText = d => new Intl.DateTimeFormat(undefined,{month:"short",day:"numeric",year:"numeric"}).format(new Date(d));
  let tickets = readTickets(), view = "all", selectedId = null, toastTimer;
  function readTickets(){try{const data=localStorage.getItem(KEY);return data?JSON.parse(data):seed;}catch(e){console.warn("DeskFlow storage read failed",e);return seed;}}
  function persist(){try{localStorage.setItem(KEY,JSON.stringify(tickets));}catch(e){console.error(e);toast("Unable to save in this browser.");}}
  function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2600);}
  function counts(){return {all:tickets.length,open:tickets.filter(t=>t.status==="Open").length,progress:tickets.filter(t=>t.status==="In Progress").length,resolved:tickets.filter(t=>t.status==="Resolved").length};}
  function matching(){
    const q=$("#search").value.trim().toLowerCase(),p=$("#priority").value;
    return tickets.filter(t=>(view==="all"||statusClass(t.status)===view)&&(!q||[t.id,t.title,t.requester,t.category,t.assignee,t.description].join(" ").toLowerCase().includes(q))&&(p==="all"||t.priority===p)).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
  }
  function render(){
    const c=counts(),names={all:"All tickets",open:"Open tickets",progress:"In progress",resolved:"Resolved tickets"};
    $("#total").textContent=c.all;$("#open").textContent=c.open;$("#progress").textContent=c.progress;$("#resolved").textContent=c.resolved;$("#nav-total").textContent=c.all;
    $("#heading").textContent=names[view];$("#crumb").textContent=names[view];
    document.querySelectorAll(".nav").forEach(b=>b.classList.toggle("active",b.dataset.view===view));
    const list=matching();
    $("#rows").innerHTML=list.map(t=>`<tr>
      <td><span class="ticket-title" tabindex="0" role="button" data-id="${esc(t.id)}">${esc(t.title)}</span><span class="ticket-id">${esc(t.id)}</span></td>
      <td><div class="person"><i>${esc(initials(t.requester))}</i><span>${esc(t.requester)}</span></div></td>
      <td>${esc(t.category)}</td><td><span class="tag ${t.priority.toLowerCase()}">${esc(t.priority)}</span></td>
      <td><span class="tag s-${statusClass(t.status)}">${esc(t.status)}</span></td><td>${dateText(t.createdAt)}</td>
      <td><button class="view" data-id="${esc(t.id)}" aria-label="View ${esc(t.id)}">•••</button></td></tr>`).join("");
    $("#empty").style.display=list.length?"none":"block";$("table").style.display=list.length?"table":"none";
    $("#count").textContent=`Showing ${list.length} of ${tickets.length} ticket${tickets.length===1?"":"s"}`;
  }
  function nextId(){const max=tickets.reduce((n,t)=>Math.max(n,Number(String(t.id).split("-")[1])||0),1000);return "DSK-"+(max+1);}
  function closeModals(){if($("#create-modal").open)$("#create-modal").close();if($("#detail-modal").open)$("#detail-modal").close();}
  function newTicket(){ $("#ticket-form").reset();$("#create-modal").showModal();$("#ticket-form").elements.title.focus(); }
  function create(event){
    event.preventDefault();const f=new FormData(event.currentTarget);
    const t={id:nextId(),title:String(f.get("title")).trim(),requester:String(f.get("requester")).trim(),category:f.get("category"),priority:f.get("priority"),status:"Open",assignee:String(f.get("assignee")).trim()||"Unassigned",description:String(f.get("description")).trim()||"No additional details provided.",createdAt:new Date().toISOString()};
    tickets.unshift(t);persist();view="all";$("#search").value="";$("#priority").value="all";render();closeModals();toast(t.id+" created successfully.");
  }
  function openDetail(id){
    const t=tickets.find(x=>x.id===id);if(!t)return;selectedId=id;
    $("#detail").innerHTML=`<div class="detail"><div class="detail-top"><div><small class="muted">TICKET DETAILS · ${esc(t.id)}</small><h2>${esc(t.title)}</h2></div><button class="x" id="detail-close" aria-label="Close">×</button></div>
    <span class="tag ${t.priority.toLowerCase()}">${esc(t.priority)} priority</span> <span class="tag s-${statusClass(t.status)}">${esc(t.status)}</span>
    <div class="description">${esc(t.description)}</div><div class="detail-grid"><div><span>Requester</span><b>${esc(t.requester)}</b></div><div><span>Category</span><b>${esc(t.category)}</b></div><div><span>Assigned to</span><b>${esc(t.assignee)}</b></div><div><span>Created</span><b>${dateText(t.createdAt)}</b></div></div>
    <div class="detail-controls"><label>Update status<select id="edit-status"><option ${t.status==="Open"?"selected":""}>Open</option><option ${t.status==="In Progress"?"selected":""}>In Progress</option><option ${t.status==="Resolved"?"selected":""}>Resolved</option></select></label><label>Update priority<select id="edit-priority"><option ${t.priority==="High"?"selected":""}>High</option><option ${t.priority==="Medium"?"selected":""}>Medium</option><option ${t.priority==="Low"?"selected":""}>Low</option></select></label></div>
    <div class="actions"><button class="danger" id="delete">Delete ticket</button><button class="primary" id="save">Save changes</button></div></div>`;
    $("#detail-modal").showModal();$("#detail-close").addEventListener("click",closeModals);
    $("#save").addEventListener("click",()=>{const target=tickets.find(x=>x.id===selectedId);if(!target)return;target.status=$("#edit-status").value;target.priority=$("#edit-priority").value;persist();render();closeModals();toast("Ticket updated.");});
    $("#delete").addEventListener("click",()=>{if(!confirm("Delete "+t.id+"? This cannot be undone."))return;tickets=tickets.filter(x=>x.id!==selectedId);persist();render();closeModals();toast("Ticket deleted.");});
  }
  document.querySelectorAll(".nav").forEach(b=>b.addEventListener("click",()=>{view=b.dataset.view;render();}));
  $("#new-btn").addEventListener("click",newTicket);$("#empty-new").addEventListener("click",newTicket);
  $("#close").addEventListener("click",closeModals);$("#cancel").addEventListener("click",closeModals);
  $("#ticket-form").addEventListener("submit",create);$("#search").addEventListener("input",render);$("#priority").addEventListener("change",render);
  $("#rows").addEventListener("click",e=>{const b=e.target.closest("[data-id]");if(b)openDetail(b.dataset.id);});
  $("#rows").addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.matches("[data-id]")){e.preventDefault();openDetail(e.target.dataset.id);}});
  $("#today").textContent=new Intl.DateTimeFormat(undefined,{weekday:"short",month:"short",day:"numeric"}).format(new Date());
  render();
})();