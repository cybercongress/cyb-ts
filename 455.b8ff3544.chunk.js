!function(){var t,e,n,r,s={27188:function(t,e,n){"use strict";var r=n(99870),s=n(89546),a=n(91026),i=n(38161);const o=t=>i.k0.parse(t),c=t=>`/ipfs/${t}`,u="QmUgmRxoLtGERot7Y6G7UyF6fwvnusQZfGR15PuE6pY3aB",d=`/dns4/swarm.io.cybernode.ai/tcp/443/wss/p2p/${u}`,l=`/ip4/88.99.105.146/tcp/4001/p2p/${u}`,p="https://gateway.ipfs.cybernode.ai";var h=class{constructor(){this.nodeType="external",this._config={},this._isStarted=!1}get config(){return this._config}get isStarted(){return this._isStarted}async initConfig(){const t=await this.node.config.get("Addresses.Gateway");if(!t)return{gatewayUrl:p};const e=(0,a.HM)(t).nodeAddress();return{gatewayUrl:`http://${e.address}:${e.port}`}}async init(t){this.node=(0,s.Ue)(t),this._config=await this.initConfig(),"undefined"!=typeof window&&(window.node=this.node,window.toCid=o),this._isStarted=!0}async stat(t,e={}){return this.node.files.stat(c(t),{...e,withLocal:!0,size:!0}).then((t=>{const{type:e,size:n,sizeLocal:r,local:s,blocks:a}=t;return{type:e,size:n||-1,sizeLocal:r||-1,blocks:a}}))}cat(t,e={}){return this.node.cat(o(t),e)}async add(t,e={}){return(await this.node.add(t,e)).cid.toString()}async pin(t,e={}){return(await this.node.pin.add(o(t),e)).toString()}async getPeers(){return(await this.node.swarm.peers()).map((t=>t.peer.toString()))}async stop(){}async start(){}async connectPeer(t){const e=(0,a.HM)(t);return await this.node.bootstrap.add(e),await this.node.swarm.connect(e),!0}ls(){return this.node.pin.ls()}async info(){const{repoSize:t}=await this.node.stats.repo(),e=await this.node.id(),{agentVersion:n,id:r}=e;return{id:r.toString(),agentVersion:n,repoSize:t}}},f=n(21771),y=n(33634),g=n(55472),w=n(63718),m=n(99644),b=n(79071),v=n(69850),x=n(53184),S=n(44913),P=n(46177),T=n(57392),C=n(21141),$=n(25108);(0,a.a_)("webrtc").code;const z={cidVersion:0,rawLeaves:!1};var k=class{constructor(){this.nodeType="helia",this._isStarted=!1}get config(){return{gatewayUrl:p}}get isStarted(){return this._isStarted}async init(){const t=new y.Y("helia-bs");await t.open();const e=new g.s("helia-ds");await e.open();const n=await(async(t,e=[])=>await(0,w.N)({datastore:t,transports:[(0,T.E)(),(0,P.Z)({rtcConfiguration:{iceServers:[{urls:["stun:stun.l.google.com:19302","stun:global.stun.twilio.com:3478","STUN:freestun.net:3479","STUN:stun.bernardoprovenzano.net:3478","STUN:stun.aa.net.uk:3478"]},{credential:"free",username:"free",urls:["TURN:freestun.net:3479","TURNS:freestun.net:5350"]}]}}),(0,P.R)(),(0,v.f)({discoverRelays:1})],connectionEncryption:[(0,m.t)()],streamMuxers:[(0,b.P)()],connectionGater:{denyDialMultiaddr:()=>!1},peerDiscovery:[(0,S.U)({list:e})],services:{identify:(0,C.HA)()}}))(e,["/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN","/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa","/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb","/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt","/dns4/swarm.io.cybernode.ai/tcp/443/wss/p2p/QmUgmRxoLtGERot7Y6G7UyF6fwvnusQZfGR15PuE6pY3aB"]);this.node=await(0,f.F)({blockstore:t,datastore:e,libp2p:n}),this.fs=(0,x.Y4)(this.node),"undefined"!=typeof window&&(window.libp2p=n,window.node=this.node,window.fs=this.fs,window.toCid=o),n.addEventListener("peer:connect",(t=>{const e=t.detail.toString();$.log(`Connected to ${e}`)})),n.addEventListener("peer:disconnect",(t=>{$.log(`Disconnected from ${t.detail.toString()}`)})),this._isStarted=!0}async stat(t,e={}){return this.fs.stat(o(t),e).then((t=>{const{type:e,fileSize:n,localFileSize:r,blocks:s,dagSize:a,mtime:i}=t;return{type:e,size:n||-1,sizeLocal:r||-1,blocks:s}}))}cat(t,e={}){return this.fs.cat(o(t),e)}async add(t,e={}){const n={...e,...z};let r;if(t instanceof File){const e=t.name,s=await t.arrayBuffer(),a=new Uint8Array(s);r=await this.fs.addFile({path:e,content:a},n)}else{const e=(new TextEncoder).encode(t);r=await this.fs.addBytes(e,n)}return $.log("----added to helia",r.toString()),this.pin(r.toString(),e),r.toString()}async pin(t,e={}){const n=o(t);if(!await(this.node?.pins.isPinned(n,e))){(await(this.node?.pins.add(n,e)))?.cid.toString()}}async getPeers(){return this.node.libp2p.getConnections().map((t=>t.remotePeer.toString()))}async stop(){await(this.node?.stop())}async start(){await(this.node?.start())}async connectPeer(t){await this.node.libp2p.dial((0,a.HM)(t));return!0}async*mapToLsResult(t){for await(const e of t){const{cid:t,metadata:n}=e;yield{cid:t.toV0(),metadata:n,type:"recursive"}}}ls(){return this.mapToLsResult(this.node.pins.ls())}async info(){return{id:this.node.libp2p.peerId.toString(),agentVersion:this.node.libp2p.services.identify.host.agentVersion,repoSize:-1}}},E=n(27864),A=n(38134);var O=()=>({start:!0,repo:"ipfs-repo-cyber-v2",relay:{enabled:!1,hop:{enabled:!1}},preload:{enabled:!1},config:{API:{HTTPHeaders:{"Access-Control-Allow-Methods":["PUT","POST"],"Access-Control-Allow-Origin":["http://localhost:3000","http://127.0.0.1:5001","http://127.0.0.1:8888","http://localhost:8888"]}},Addresses:{Gateway:"/ip4/127.0.0.1/tcp/8080",Swarm:[],Delegates:[]},Discovery:{MDNS:{Enabled:!0,Interval:10},webRTCStar:{Enabled:!1}},Bootstrap:[],Pubsub:{Enabled:!1},Swarm:{ConnMgr:{HighWater:300,LowWater:50},DisableNatPortMap:!1},Routing:{Type:"dhtclient"}},libp2p:{transports:[(0,T.E)({filter:A.FR})],nat:{enabled:!1}},EXPERIMENTAL:{ipnsPubsub:!1}});var N=class{constructor(){this.nodeType="embedded",this._isStarted=!1}get config(){return{gatewayUrl:p}}get isStarted(){return this._isStarted}async init(){this.node=await(0,E.Ue)(O()),"undefined"!=typeof window&&(window.node=this.node,window.toCid=o),this._isStarted=!0}async stat(t,e={}){return this.node.files.stat(c(t),{...e,withLocal:!0,size:!0}).then((t=>{const{type:e,size:n,sizeLocal:r,local:s,blocks:a}=t;return{type:e,size:n||-1,sizeLocal:r||-1,blocks:a}}))}cat(t,e={}){return this.node.cat(o(t),e)}async add(t,e={}){return(await this.node.add(t,e)).cid.toString()}async pin(t,e={}){return(await this.node.pin.add(o(t),e)).toString()}async getPeers(){return(await this.node.swarm.peers()).map((t=>t.peer.toString()))}async stop(){}async start(){}async connectPeer(t){const e=(0,a.HM)(t);return await this.node.bootstrap.add(e),await this.node.swarm.connect(e),!0}ls(){return this.node.pin.ls()}async info(){const t=await this.node.stats.repo(),e=Number(t.repoSize),n=await this.node.id(),{agentVersion:r,id:s}=n;return{id:s.toString(),agentVersion:r,repoSize:e}}},_=n(49784),D=n(41487),q=n.n(D),I=n(95034),M=n(41690),L=n(25108);const U=async t=>{if(!t)return"unknown";const e=await(0,I.pM)(t);return e?.mime||"text/plain"};var j=n(23085).lW,R=n(25108);const B=/^Qm[a-zA-Z0-9]{44}$/g,Q=/^https:\/\/|^http:\/\//g;function F(t,e){return`data:${e};base64,${(0,_.B)(t,"base64")}`}const W=/\s?<!doctype html>|(<html\b[^>]*>|<body\b[^>]*>|<x-[^>]+>)+/i;const G=async(t,e,n)=>{try{const r=t?.meta?.mime,s={link:`/ipfs/${e}`,gateway:!1,cid:e},a=(t=>{if(t){if(t.includes("video"))return"video";if(t.includes("audio"))return"audio"}return"other"})(r);if(["video","audio"].indexOf(a)>-1)return{...s,type:a};const i=t?.result?await(async(t,e)=>{let n=0;try{if(t instanceof Uint8Array)return e&&e(t.byteLength),t;const r=[];if(t instanceof ReadableStream){const s=t.getReader(),a=async({done:t,value:i})=>t?(0,M.z)(r):(r.push(i),n+=i.byteLength,e&&e(n),s.read().then(a));return await s.read().then(a)}const s=t[Symbol.asyncIterator]();for await(const t of s)t instanceof Uint8Array&&(r.push(t),n+=t.byteLength,e&&e(n));return(0,M.z)(r)}catch(t){return void L.error("Error reading stream/iterable.\r\n Probably Hot reload error!",t)}})(t.result,n):void 0;if(r)if(-1!==r.indexOf("text/plain")||-1!==r.indexOf("application/xml"))if(q()(j.from(i)))s.type="image",s.content=F(i,"image/svg+xml");else{const t=(0,_.B)(i);s.link=t.length>42?`/ipfs/${e}`:`/search/${t}`,t.match(B)?(s.gateway=!0,s.type="other",s.content=t,s.link=`/ipfs/${e}`):t.match(Q)?(s.type="link",s.gateway=!1,s.content=t,s.link=`/ipfs/${e}`):!function(t){const e=t.trim().slice(0,1e3);return W.test(e)}(t)?(s.type="text",s.content=t,s.text=t.length>300?`${t.slice(0,300)}...`:t):(s.type="other",s.gateway=!0,s.content=e.toString())}else-1!==r.indexOf("image")?(s.content=F(i,r),s.type="image",s.gateway=!1):-1!==r.indexOf("application/pdf")&&(s.type="pdf",s.content=function(t,e){const n=new Blob([t],{type:e});return URL.createObjectURL(n)}(i,r),s.gateway=!0);else s.text=`Can't detect MIME for ${e.toString()}`,s.gateway=!0;return s}catch(t){return void R.log("----parseRawIpfsData",t,e)}},Z=(t,e,n=150)=>t&&e&&"text/plain"===e?(0,_.B)(t).slice(0,n):void 0;const V=new(n(39387).ZP)("cyber-page-cash");V.version(3).stores({cid:"cid",following:"cid"});var H=V;var J={add:async(t,e)=>{if(!await H.table("cid").get({cid:t})){const n={cid:t,data:e};H.table("cid").add(n)}},get:async t=>{const e=await H.table("cid").get({cid:t});return e?.data||e?.content}},Y=n(86107);var X=(()=>{const t=new Y.vu("https://io.cybernode.ai");return{add:async e=>{const n="string"==typeof e?new File([e],"file.txt"):e;return t.add(n,{cidVersion:0,rawLeaves:!1})},status:async e=>t.status(e)}})(),K=n(25108);const tt=async t=>{const e=await J.get(t);if(e&&e.length){const n=await U(e),r=Z(e,n);return{result:e,cid:t,meta:{type:"file",size:e.length,sizeLocal:e.length,mime:n},source:"db",textPreview:r}}},et={type:"file",size:-1,local:void 0,sizeLocal:-1},nt=async(t,e,n)=>{if(e){return await e.stat(t,{signal:n})}return et},rt=async(t,e,n)=>{const r=n||new AbortController,{signal:s}=r;let a;if(e){n||(a=setTimeout((()=>{r.abort()}),6e4));try{const n=Date.now(),r=await nt(t,e,s),i=Date.now();r.statsTime=i-n;const o=r.size<2e7;if(a&&clearTimeout(a),"directory"===r.type)return{cid:t,availableDownload:!0,source:"node",meta:r};{const{value:n,done:a}=await e.cat(t,{signal:s,length:2048,offset:0})[Symbol.asyncIterator]().next(),c=await U(n),u=r.size>-1&&n.length>=r.size,d=Z(n,c),l=u?n:o?e.cat(t,{signal:s}):void 0;return r.catTime=Date.now()-i,!r.local&&o?(e.pin(t),r.pinTime=Date.now()-r.catTime):r.pinTime=-1,{result:l,textPreview:d,cid:t,meta:{...r,mime:c},source:"node"}}}catch(e){return K.log("error fetch stat",e),{cid:t,availableDownload:!0,source:"node",meta:et}}}else K.log("--------fetchIPFSContentFromNode NO NODE INTIALIZED--------")},st=async(t,e,n)=>{const r="external"===e?.nodeType,s=r?await nt(t,e,n?.signal):et,a=`${p}/ipfs/${t}`,i=await fetch(a,{method:"GET",signal:n?.signal});if(i&&i.body){const e=e=>r?Promise.resolve():J.add(t,(0,M.z)(e)),{mime:n,result:o,firstChunk:c}=await async function(t,e){const[n,r]=t.tee(),s=[],a=n.getReader(),{value:i}=await a.read(),o=i?await U(i):void 0,c=r.getReader(),u={async*[Symbol.asyncIterator](){for(;;){const{done:t,value:n}=await c.read();if(t)return void(e&&e(s,o));e&&s.push(n),yield n}}};return{mime:o,result:u,firstChunk:i}}(i.body,e),u=Z(c,n);return{cid:t,textPreview:u,meta:{...s,mime:n},result:o,source:"gateway",contentUrl:a}}};const at=async(t,e,n,r)=>{const s=await tt(t);if(void 0!==s)return s;if(e){r&&r("trying to get with a node");return await rt(t,e,n)}r&&r("trying to get with a gatway");return await st(t,e,n)},it=async(t,e)=>{let n;t&&(n=await t.add(e));const r=await X.add(e);return n=n??r?.cid,n&&await J.add(n,await(async t=>new Uint8Array("string"==typeof t?j.from(t):await t.arrayBuffer()))(e)),n};var ot=n(25108);var ct=n(25108);const ut={helia:k,embedded:N,external:h};async function dt(t){const{ipfsNodeType:e,...n}=t,r=function(t,e){return class extends t{async fetchWithDetails(t,e){const n=await at(t,this),r=n?.result?await G(n,t):void 0;return e?r?.type===e?r:void 0:r}async addContent(t){return it(this,t)}async isConnectedToSwarm(){return!!(await super.getPeers()).find((t=>t===e.swarmPeerId))}async reconnectToSwarm(t){await this.isConnectedToSwarm()||super.connectPeer(e.swarmPeerAddress).then((()=>(ot.log(`🐝 connected to swarm - ${e.swarmPeerAddress}`),!0))).catch((t=>(ot.log(`Can't connect to swarm ${e.swarmPeerAddress}: ${t.message}`),!1)))}}}(ut[e],{swarmPeerId:u,swarmPeerAddress:"external"===e?l:d}),s=new r;return await s.init({url:n.urlOpts}),ct.log("----init",e),await s.reconnectToSwarm(),s}var lt=n(37386),pt=n(51706),ht=n(94975),ft=n(42965),yt=n(29127),gt=n(87877),wt=n(31751),mt=n(1545),bt=n(25211),vt=n(28368),xt=n(79878),St=n(32817),Pt=n(34243),Tt=n(81480),Ct=n(25108);class $t{constructor(t,e){this.settings=t,this.order=e}getNextSource(t){const e=this.order.indexOf(t);return e<this.order.length?this.order[e+1]:void 0}}class zt extends Error{constructor(t){super(`Timeout after ${t}`),Object.setPrototypeOf(this,zt.prototype)}}function kt(t){return(t.priority||0)+(t.viewPortPriority||0)}const Et=new $t({db:{timeout:5e3,maxConcurrentExecutions:999},gateway:{timeout:21e3,maxConcurrentExecutions:11},node:{timeout:6e4,maxConcurrentExecutions:21}},["db","gateway","node"]),At={external:new $t({db:{timeout:5e3,maxConcurrentExecutions:999},node:{timeout:6e4,maxConcurrentExecutions:21},gateway:{timeout:21e3,maxConcurrentExecutions:11}},["db","node","gateway"]),embedded:Et,helia:Et};var Ot=class{constructor(t=At.embedded,e=33){this.queue$=new lt.X(new Map),this.node=void 0,this.postProcessItem=void 0,this.lastNodeCallTime=Date.now(),this.executing={db:new Set,node:new Set,gateway:new Set},this.strategy=t,this.queueDebounceMs=e,(0,pt.F)(5e3).pipe((0,ht.h)((()=>this.queue$.value.size>0&&!!this.node))).subscribe((()=>this.node.reconnectToSwarm(this.lastNodeCallTime))),this.queue$.pipe((0,ft.b)(this.queueDebounceMs),(0,yt.U)((t=>this.cancelDeprioritizedItems(t))),(0,gt.z)((t=>{const e=this.getItemBySourceAndPriority(t);return e.length>0?(this.node?.reconnectToSwarm(this.lastNodeCallTime),(0,wt.T)(...e.map((t=>this.fetchData$(t))))):mt.E}))).subscribe((({item:t,status:e,source:n,result:r})=>{const{cid:s}=t,a=this.queue$.value.get(s)?.callbacks||[];if(a.map((t=>t(s,e,n,r))),"node"===n&&(this.lastNodeCallTime=Date.now()),this.executing[n].delete(s),"completed"===e||"cancelled"===e)this.removeAndNext(s);else{const e=this.strategy.getNextSource(n);e?this.switchSourceAndNext(t,e):(this.removeAndNext(s),a.map((t=>t(s,"not_found",n,r))))}}))}switchStrategy(t){this.strategy=t}setPostProcessor(t){this.postProcessItem=t}async setNode(t,e){this.node=t,this.switchStrategy(e||At[t.nodeType])}getItemBySourceAndPriority(t){const e=[...t.values()].filter((t=>"pending"===t.status)),n=Pt.vMG((t=>t.source),e),r=[];for(const[t,e]of Object.entries(n)){const n=this.strategy.settings[t].maxConcurrentExecutions-this.executing[t].size,s=e.sort(((t,e)=>kt(e)-kt(t))).slice(0,n);r.push(...s)}return r}fetchData$(t){const{cid:e,source:n,controller:r,callbacks:s}=t,a=this.strategy.settings[n];this.executing[n].add(e);const i=this.queue$.value.get(e);return this.queue$.value.set(e,{...i,status:"executing",executionTime:Date.now(),controller:new AbortController}),s.map((t=>t(e,"executing",n))),(o=async()=>async function(t,e,n){const{node:r,controller:s}=n;try{switch(e){case"db":return tt(t);case"node":return rt(t,r,s);case"gateway":return st(t,r,s);default:return}}catch(t){return void K.log("----fetchIpfsContent error",t)}}(e,n,{controller:r,node:this.node}).then((t=>this.postProcessItem?this?.postProcessItem(t):t)),new Tt.y((t=>{o().then((e=>{t.next(e),t.complete()})).catch((e=>{Ct.log("----promiseToObservable error",e),t.error(e)}))}))).pipe((0,bt.V)({each:a.timeout,with:()=>(0,vt._)((()=>(r?.abort("timeout"),new zt(a.timeout))))}),(0,yt.U)((e=>({item:t,status:e?"completed":"error",source:n,result:e}))),(0,xt.K)((e=>e instanceof zt?(0,St.of)({item:t,status:"timeout",source:n}):"AbortError"===e?.name?(0,St.of)({item:t,status:"cancelled",source:n}):(0,St.of)({item:t,status:"error",source:n}))));var o}mutateQueueItem(t,e){const n=this.queue$.value,r=n.get(t);return r&&n.set(t,{...r,...e}),this.queue$.next(n)}removeAndNext(t){const e=this.queue$.value;e.delete(t),this.queue$.next(e)}switchSourceAndNext(t,e){t.callbacks.map((n=>n(t.cid,"pending",e))),this.mutateQueueItem(t.cid,{status:"pending",source:e})}cancelDeprioritizedItems(t){return["node","gateway"].forEach((e=>{Array.from(this.executing[e]).forEach((n=>{const r=t.get(n);r&&kt(r)<0&&r.controller&&(r.controller.abort("cancelled"),r.callbacks.map((t=>t(r.cid,"pending",r.source))),t.set(n,{...r,status:"pending"}),this.executing[e].delete(n))}))})),t}releaseExecution(t){Object.keys(this.executing).forEach((e=>this.executing[e].delete(t)))}enqueue(t,e,n={}){const r=this.queue$.value,s=r.get(t);if(s)this.mutateQueueItem(t,{callbacks:[...s.callbacks,e]});else{const s=n.initialSource||this.strategy.order[0],a={cid:t,callbacks:[e],source:s,status:"pending",postProcessing:!0,...n};e(t,"pending",s),r.set(t,a),this.queue$.next(r)}}enqueueAndWait(t,e={}){return new Promise((n=>{this.enqueue(t,((t,e,r,s)=>{"completed"!==e&&"not_found"!==e||n({status:e,source:r,result:s})}),e)}))}updateViewPortPriority(t,e){this.mutateQueueItem(t,{viewPortPriority:e})}cancel(t){const e=this.queue$.value.get(t);e&&(e.controller?e.controller.abort("cancelled"):this.removeAndNext(t))}cancelByParent(t){const e=this.queue$.value;e.forEach(((n,r)=>{n.parent===t&&(this.releaseExecution(r),n.controller?.abort("cancelled"),e.delete(r))})),this.queue$.next(e)}clear(){const t=this.queue$.value;t.forEach(((e,n)=>{this.releaseExecution(n),e.controller?.abort("cancelled"),t.delete(n)})),this.queue$.next(new Map)}getQueueMap(){return this.queue$.value}getQueueList(){return Array.from(this.queue$.value.values())}getStats(){return Pt.zGw(Pt.VFc(Pt.vgT("status")),Pt.Zpf,Pt.UID(Pt._Qy(["status","count"])))(this.getQueueList())}};const Nt={indirect:-1,direct:0,recursive:1};var _t=class{constructor(t){this.channel=new BroadcastChannel("cyb-broadcast-channel"),t&&(this.channel.onmessage=e=>t(e))}post(t){this.channel.postMessage(t)}};async function Dt(t,e,n=10){let r=[];for await(const s of t)r.push(s),r.length===n&&(await e(r),r=[]);r.length>0&&await e(r)}const qt=t=>{const{cid:e,result:n,meta:r,textPreview:s}=t,{size:a,mime:i,type:o,blocks:c,sizeLocal:u}=r;return{cid:e,size:a,mime:i||"unknown",type:o,text:s?.replace(/"/g,"'")||"",sizeLocal:u||-1,blocks:c||0}},It=t=>({cid:t.cid.toString(),type:Nt[t.type]}),Mt=t=>{const{transaction_hash:e,transaction:n,type:r,value:s}=t;return{hash:e,type:r,timestamp:new Date(n.block.timestamp).getTime(),value:JSON.stringify(s),success:n.success}};var Lt=n(25108);const Ut=async(t,e)=>{try{const n=qt(t);return(await e.executePutCommand("particle",[n])).ok}catch(t){return Lt.error("importParicleContent",t),!1}};var jt=n(1707),Rt=n(31230),Bt=n(25108);const Qt=(0,Rt.ZP)('\n  query MyQuery($address: _text, $limit: bigint, $offset: bigint) {\n  messages_by_address(args: {addresses: $address, limit: $limit, offset: $offset, types: "{}"},\n    order_by: {transaction: {block: {height: desc}}}) {\n    transaction_hash\n    value\n    transaction {\n      success\n      block {\n        timestamp\n      }\n    }\n    type\n  }\n}\n'),Ft=async(t,e,n=0)=>(await(0,jt.WY)(e,Qt,{address:`{${t}}`,limit:"100",offset:n})).messages_by_address;const Wt=async(t,e,n,r,s)=>{Bt.log("---importTransactions");let a=0;const i=async function*(t,e){let n=0;for(;;){const r=await Ft(t,e,n);if(0===r.length)break;const s=r.map((t=>Mt(t)));yield s,n+=s.length}}(e,n);for await(const e of i)a+=e.length,await t.executeBatchPutCommand("transaction",e,e.length),r&&r(a);s&&s(a)};var Gt=n(25108);function Zt(t){return{async*[Symbol.asyncIterator](){let e=!1;for(;!e;){const n=new Promise((n=>{t.onmessage=t=>{null===t.data?(e=!0,n(null)):n(t.data)}})),r=await n;null!==r&&(yield r)}}}}const Vt={canHandle:t=>t&&t.result&&"function"==typeof t.result[Symbol.asyncIterator],serialize(t){if(void 0===t)return[null,[]];const{result:e,...n}=t,{port1:r,port2:s}=new MessageChannel;return e&&(async()=>{for await(const t of e)r.postMessage(t);r.postMessage(null),r.close()})(),[{...n,port:s},[s]]},deserialize(t){if(!t)return;const{port:e,...n}=t;return{...n,result:Zt(e)}}};var Ht=n(34155),Jt=n(25108);"undefined"!=typeof SharedWorker&&Ht.env.IS_DEV;function Yt(){r.Y6.set("IPFSContent",Vt)}function Xt(t){const e={log:{original:Jt.log},error:{original:Jt.error},warn:{original:Jt.warn}},n=n=>{const{original:r}=e[n];e[n].original=Jt[n],Jt[n]=(...e)=>{r.apply(Jt,e);const s=e.map((t=>function(t){try{return JSON.stringify(t)}catch(e){return String(t)}}(t)));t.postMessage({type:"console",method:n,args:s})}};Object.keys(e).forEach((t=>n(t)))}var Kt=n(25108);const te=(()=>{let t,e;const n=new Ot,s=new _t;Kt.log("----backendApi worker constructor!");const a=(t,e)=>s.post({type:"worker_status",value:{status:t,lastError:e}}),i=(t,e)=>s.post({type:"sync_entry",value:{entry:t,state:e}}),o={importParicleContent:async t=>Ut(t,e),importCyberlinks:async t=>(async(t,e)=>{try{await e.executeBatchPutCommand("link",t.map((t=>({...t,neuron_address:""}))),100)}catch(t){Gt.error("importCyberlinks",t)}})(t,e),importParticle:async n=>(async(t,e,n)=>at(t,e).then((t=>!!t&&Ut(t,n))))(n,t,e)},c={start:async e=>{try{return t&&(Kt.log("Ipfs node already started!"),await t.stop()),t=await dt(e),n.setNode(t),(0,r.sj)(t)}catch(t){throw Kt.log("----ipfs node init error ",t),Error(t instanceof Error?t.message:t)}},stop:async()=>{t&&await t.stop()},config:async()=>t?.config,info:async()=>t?.info(),fetchWithDetails:async(e,n)=>t?.fetchWithDetails(e,n),enqueue:async(t,e,r)=>n.enqueue(t,e,r),enqueueAndWait:async(t,e)=>n.enqueueAndWait(t,e),dequeue:async t=>n.cancel(t),dequeueByParent:async t=>n.cancelByParent(t),clearQueue:async()=>n.clear()};return{installDbApi:async t=>{e=t,n.setPostProcessor((async t=>(t&&o.importParicleContent({...t,result:void 0}),t))),a("idle")},syncDrive:async(n,r)=>{try{if(!n)return void a("error","Wallet is not connected");if(!t)return void a("error","IPFS node is not initialized");if(!e)return void a("error","CozoDb is not initialized");a("syncing"),["transaction","pin","particle"].forEach((t=>i(t,{progress:0,done:!1,error:void 0})));const s=async()=>{Kt.log("-----import ipfs"),await(async(t,e,n,r)=>{let s=0;await Dt(t.ls(),(async t=>{const r=t.map(It);s+=t.length,await e.executeBatchPutCommand("pin",r,t.length),n&&n(s)}),10),r&&r(s)})(t,e,(async t=>i("pin",{progress:t})),(async()=>i("pin",{done:!0})));const n=await e.executeGetCommand("pin",[`type = ${Nt.recursive}`],["cid"]);if(!1===n.ok)return void a("error",n.message);const r=n.rows.map((t=>t[0]));await(async(t,e,n,r,s)=>{let a=0;await Dt(async function*(t){for(const e of t)yield e}(e),(async e=>{const s=await Promise.all(e.map((e=>at(e,t)))),i=s.filter((t=>!!t)).map((t=>qt(t)));a+=i.length,await n.executeBatchPutCommand("particle",i,i.length),r&&r(a)}),10),s&&s(a)})(t,r,e,(async t=>i("particle",{progress:t})),(async()=>i("particle",{done:!0}))),Kt.log("-----import ipfs done")},o=Wt(e,n,r,(async t=>i("transaction",{progress:t})),(async t=>i("transaction",{done:!0}))),c=s();await Promise.all([o,c]),a("idle")}catch(t){Kt.error("syncDrive",t),a("error",t.toString())}},ipfsApi:(0,r.sj)(c),importApi:(0,r.sj)(o)}})();var ee,ne;ee=self,ne=te,Yt(),void 0!==ee.onconnect?ee.onconnect=t=>{const e=t.ports[0];Xt(e),(0,r.Jj)(ne,e)}:(0,r.Jj)(ne)},67064:function(){},81949:function(){},95856:function(){},35883:function(){},66778:function(){},10465:function(){},52596:function(){},63897:function(){},85104:function(){},83886:function(){},52:function(){},25819:function(){},81265:function(){},35539:function(){},99283:function(){},43838:function(){}},a={};function i(t){var e=a[t];if(void 0!==e)return e.exports;var n=a[t]={exports:{}};return s[t].call(n.exports,n,n.exports,i),n.exports}i.m=s,i.x=function(){var t=i.O(void 0,[630,748,970,326],(function(){return i(27188)}));return t=i.O(t)},t=[],i.O=function(e,n,r,s){if(!n){var a=1/0;for(d=0;d<t.length;d++){n=t[d][0],r=t[d][1],s=t[d][2];for(var o=!0,c=0;c<n.length;c++)(!1&s||a>=s)&&Object.keys(i.O).every((function(t){return i.O[t](n[c])}))?n.splice(c--,1):(o=!1,s<a&&(a=s));if(o){t.splice(d--,1);var u=r();void 0!==u&&(e=u)}}return e}s=s||0;for(var d=t.length;d>0&&t[d-1][2]>s;d--)t[d]=t[d-1];t[d]=[n,r,s]},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,{a:e}),e},n=Object.getPrototypeOf?function(t){return Object.getPrototypeOf(t)}:function(t){return t.__proto__},i.t=function(t,r){if(1&r&&(t=this(t)),8&r)return t;if("object"==typeof t&&t){if(4&r&&t.__esModule)return t;if(16&r&&"function"==typeof t.then)return t}var s=Object.create(null);i.r(s);var a={};e=e||[null,n({}),n([]),n(n)];for(var o=2&r&&t;"object"==typeof o&&!~e.indexOf(o);o=n(o))Object.getOwnPropertyNames(o).forEach((function(e){a[e]=function(){return t[e]}}));return a.default=function(){return t},i.d(s,a),s},i.d=function(t,e){for(var n in e)i.o(e,n)&&!i.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:e[n]})},i.f={},i.e=function(t){return Promise.all(Object.keys(i.f).reduce((function(e,n){return i.f[n](t,e),e}),[]))},i.u=function(t){return t+"."+{326:"9d5003e0",630:"0212b885",748:"d4ec4127",827:"89ce62da",970:"897c9db2"}[t]+".chunk.js"},i.miniCssF=function(t){},i.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.p="/",function(){var t={455:1};i.f.i=function(e,n){t[e]||importScripts(i.p+i.u(e))};var e=self.webpackChunkcyb=self.webpackChunkcyb||[],n=e.push.bind(e);e.push=function(e){var r=e[0],s=e[1],a=e[2];for(var o in s)i.o(s,o)&&(i.m[o]=s[o]);for(a&&a(i);r.length;)t[r.pop()]=1;n(e)}}(),r=i.x,i.x=function(){return Promise.all([630,748,970,326].map(i.e,i)).then(r)};i.x()}();
//# sourceMappingURL=455.b8ff3544.chunk.js.map