!function(){var t,e,n,r,s={27188:function(t,e,n){"use strict";var r=n(99870),s=n(89546),a=n(91026),i=n(38161);const o=t=>i.k0.parse(t),c=t=>`/ipfs/${t}`,u="QmUgmRxoLtGERot7Y6G7UyF6fwvnusQZfGR15PuE6pY3aB",d=`/dns4/swarm.io.cybernode.ai/tcp/443/wss/p2p/${u}`,l=`/ip4/88.99.105.146/tcp/4001/p2p/${u}`,p="https://gateway.ipfs.cybernode.ai";var h=class{constructor(){this.nodeType="external",this._config={},this._isStarted=!1}get config(){return this._config}get isStarted(){return this._isStarted}async initConfig(){const t=await this.node.config.get("Addresses.Gateway");if(!t)return{gatewayUrl:p};const e=(0,a.HM)(t).nodeAddress();return{gatewayUrl:`http://${e.address}:${e.port}`}}async init(t){this.node=(0,s.Ue)(t),this._config=await this.initConfig(),"undefined"!=typeof window&&(window.node=this.node,window.toCid=o),this._isStarted=!0}async stat(t,e={}){return this.node.files.stat(c(t),{...e,withLocal:!0,size:!0}).then((t=>{const{type:e,size:n,sizeLocal:r,local:s,blocks:a}=t;return{type:e,size:n||-1,sizeLocal:r||-1,blocks:a}}))}cat(t,e={}){return this.node.cat(o(t),e)}async add(t,e={}){return(await this.node.add(t,e)).cid.toString()}async pin(t,e={}){return(await this.node.pin.add(o(t),e)).toString()}async getPeers(){return(await this.node.swarm.peers()).map((t=>t.peer.toString()))}async stop(){}async start(){}async connectPeer(t){const e=(0,a.HM)(t);return await this.node.bootstrap.add(e),await this.node.swarm.connect(e),!0}ls(){return this.node.pin.ls()}async info(){const{repoSize:t}=await this.node.stats.repo(),e=await this.node.id(),{agentVersion:n,id:r}=e;return{id:r.toString(),agentVersion:n,repoSize:t}}},y=n(21771),f=n(33634),g=n(55472),w=n(63718),m=n(99644),b=n(79071),v=n(53184),x=n(44913),S=n(57392),P=n(21141),C=n(25108);const T={cidVersion:0,rawLeaves:!1};var $=class{constructor(){this.nodeType="helia",this._isStarted=!1}get config(){return{gatewayUrl:p}}get isStarted(){return this._isStarted}async init(){const t=new f.Y("helia-bs");await t.open();const e=new g.s("helia-ds");await e.open();const n=await(async(t,e=[])=>await(0,w.N)({datastore:t,transports:[(0,S.E)()],connectionEncryption:[(0,m.t)()],streamMuxers:[(0,b.P)()],peerDiscovery:[(0,x.U)({list:e})],services:{identify:(0,P.HA)()}}))(e,["/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN","/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa","/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb","/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt","/dns4/swarm.io.cybernode.ai/tcp/443/wss/p2p/QmUgmRxoLtGERot7Y6G7UyF6fwvnusQZfGR15PuE6pY3aB"]);this.node=await(0,y.F)({blockstore:t,datastore:e,libp2p:n}),this.fs=(0,v.Y4)(this.node),"undefined"!=typeof window&&(window.libp2p=n,window.node=this.node,window.fs=this.fs,window.toCid=o),n.addEventListener("peer:connect",(t=>{C.log(`Connected to ${t.detail.toString()}`)})),n.addEventListener("peer:disconnect",(t=>{C.log(`Disconnected from ${t.detail.toString()}`)})),this._isStarted=!0}async stat(t,e={}){return this.fs.stat(o(t),e).then((t=>{const{type:e,fileSize:n,localFileSize:r,blocks:s,dagSize:a,mtime:i}=t;return{type:e,size:n||-1,sizeLocal:r||-1,blocks:s}}))}cat(t,e={}){return this.fs.cat(o(t),e)}async add(t,e={}){const n={...e,...T};let r;if(t instanceof File){const e=t.name,s=await t.arrayBuffer(),a=new Uint8Array(s);r=await this.fs.addFile({path:e,content:a},n)}else{const e=(new TextEncoder).encode(t);r=await this.fs.addBytes(e,n)}return C.log("----added to helia",r.toString()),this.pin(r.toString(),e),r.toString()}async pin(t,e={}){const n=o(t);if(!await(this.node?.pins.isPinned(n,e))){(await(this.node?.pins.add(n,e)))?.cid.toString()}}async getPeers(){return this.node.libp2p.getConnections().map((t=>t.remotePeer.toString()))}async stop(){await(this.node?.stop())}async start(){await(this.node?.start())}async connectPeer(t){await this.node.libp2p.dial((0,a.HM)(t));return!0}async*mapToLsResult(t){for await(const e of t){const{cid:t,metadata:n}=e;yield{cid:t.toV0(),metadata:n,type:"recursive"}}}ls(){return this.mapToLsResult(this.node.pins.ls())}async info(){return{id:this.node.libp2p.peerId.toString(),agentVersion:this.node.libp2p.services.identify.host.agentVersion,repoSize:-1}}},z=n(27864),k=n(38134);var E=()=>({start:!0,repo:"ipfs-repo-cyber-v2",relay:{enabled:!1,hop:{enabled:!1}},preload:{enabled:!1},config:{API:{HTTPHeaders:{"Access-Control-Allow-Methods":["PUT","POST"],"Access-Control-Allow-Origin":["http://localhost:3000","http://127.0.0.1:5001","http://127.0.0.1:8888","http://localhost:8888"]}},Addresses:{Gateway:"/ip4/127.0.0.1/tcp/8080",Swarm:[],Delegates:[]},Discovery:{MDNS:{Enabled:!0,Interval:10},webRTCStar:{Enabled:!1}},Bootstrap:[],Pubsub:{Enabled:!1},Swarm:{ConnMgr:{HighWater:300,LowWater:50},DisableNatPortMap:!1},Routing:{Type:"dhtclient"}},libp2p:{transports:[(0,S.E)({filter:k.FR})],nat:{enabled:!1}},EXPERIMENTAL:{ipnsPubsub:!1}});var A=class{constructor(){this.nodeType="embedded",this._isStarted=!1}get config(){return{gatewayUrl:p}}get isStarted(){return this._isStarted}async init(){this.node=await(0,z.Ue)(E()),"undefined"!=typeof window&&(window.node=this.node,window.toCid=o),this._isStarted=!0}async stat(t,e={}){return this.node.files.stat(c(t),{...e,withLocal:!0,size:!0}).then((t=>{const{type:e,size:n,sizeLocal:r,local:s,blocks:a}=t;return{type:e,size:n||-1,sizeLocal:r||-1,blocks:a}}))}cat(t,e={}){return this.node.cat(o(t),e)}async add(t,e={}){return(await this.node.add(t,e)).cid.toString()}async pin(t,e={}){return(await this.node.pin.add(o(t),e)).toString()}async getPeers(){return(await this.node.swarm.peers()).map((t=>t.peer.toString()))}async stop(){}async start(){}async connectPeer(t){const e=(0,a.HM)(t);return await this.node.bootstrap.add(e),await this.node.swarm.connect(e),!0}ls(){return this.node.pin.ls()}async info(){const t=await this.node.stats.repo(),e=Number(t.repoSize),n=await this.node.id(),{agentVersion:r,id:s}=n;return{id:s.toString(),agentVersion:r,repoSize:e}}},O=n(49784),_=n(41487),D=n.n(_),q=n(95034),I=n(41690),N=n(25108);const M=async t=>{if(!t)return"unknown";const e=await(0,q.pM)(t);return e?.mime||"text/plain"};var L=n(23085).lW,j=n(25108);const U=/^Qm[a-zA-Z0-9]{44}$/g,B=/^https:\/\/|^http:\/\//g;function Q(t,e){return`data:${e};base64,${(0,O.B)(t,"base64")}`}const R=/\s?<!doctype html>|(<html\b[^>]*>|<body\b[^>]*>|<x-[^>]+>)+/i;const F=async(t,e,n)=>{try{const r=t?.meta?.mime,s={link:`/ipfs/${e}`,gateway:!1,cid:e},a=(t=>{if(t){if(t.includes("video"))return"video";if(t.includes("audio"))return"audio"}return"other"})(r);if(["video","audio"].indexOf(a)>-1)return{...s,type:a};const i=t?.result?await(async(t,e)=>{let n=0;try{if(t instanceof Uint8Array)return e&&e(t.byteLength),t;const r=[];if(t instanceof ReadableStream){const s=t.getReader(),a=async({done:t,value:i})=>t?(0,I.z)(r):(r.push(i),n+=i.byteLength,e&&e(n),s.read().then(a));return await s.read().then(a)}const s=t[Symbol.asyncIterator]();for await(const t of s)t instanceof Uint8Array&&(r.push(t),n+=t.byteLength,e&&e(n));return(0,I.z)(r)}catch(t){return void N.error("Error reading stream/iterable.\r\n Probably Hot reload error!",t)}})(t.result,n):void 0;if(r)if(-1!==r.indexOf("text/plain")||-1!==r.indexOf("application/xml"))if(D()(L.from(i)))s.type="image",s.content=Q(i,"image/svg+xml");else{const t=(0,O.B)(i);s.link=t.length>42?`/ipfs/${e}`:`/search/${t}`,t.match(U)?(s.gateway=!0,s.type="other",s.content=t,s.link=`/ipfs/${e}`):t.match(B)?(s.type="link",s.gateway=!1,s.content=t,s.link=`/ipfs/${e}`):!function(t){const e=t.trim().slice(0,1e3);return R.test(e)}(t)?(s.type="text",s.content=t,s.text=t.length>300?`${t.slice(0,300)}...`:t):(s.type="other",s.gateway=!0,s.content=e.toString())}else-1!==r.indexOf("image")?(s.content=Q(i,r),s.type="image",s.gateway=!1):-1!==r.indexOf("application/pdf")&&(s.type="pdf",s.content=function(t,e){const n=new Blob([t],{type:e});return URL.createObjectURL(n)}(i,r),s.gateway=!0);else s.text=`Can't detect MIME for ${e.toString()}`,s.gateway=!0;return s}catch(t){return void j.log("----parseRawIpfsData",t,e)}},W=(t,e,n=150)=>t&&e&&"text/plain"===e?(0,O.B)(t).slice(0,n):void 0;const G=new(n(39387).ZP)("cyber-page-cash");G.version(3).stores({cid:"cid",following:"cid"});var V=G;var Z={add:async(t,e)=>{if(!await V.table("cid").get({cid:t})){const n={cid:t,data:e};V.table("cid").add(n)}},get:async t=>{const e=await V.table("cid").get({cid:t});return e?.data||e?.content}},H=n(86107);var J=(()=>{const t=new H.vu("https://io.cybernode.ai");return{add:async e=>{const n="string"==typeof e?new File([e],"file.txt"):e;return t.add(n,{cidVersion:0,rawLeaves:!1})},status:async e=>t.status(e)}})(),Y=n(25108);const X=async t=>{const e=await Z.get(t);if(e&&e.length){const n=await M(e),r=W(e,n);return{result:e,cid:t,meta:{type:"file",size:e.length,sizeLocal:e.length,mime:n},source:"db",textPreview:r}}},K={type:"file",size:-1,local:void 0,sizeLocal:-1},tt=async(t,e,n)=>{if(e){return await e.stat(t,{signal:n})}return K},et=async(t,e,n)=>{const r=n||new AbortController,{signal:s}=r;let a;if(e){n||(a=setTimeout((()=>{r.abort()}),6e4));try{const n=Date.now(),r=await tt(t,e,s),i=Date.now();r.statsTime=i-n;const o=r.size<2e7;if(a&&clearTimeout(a),"directory"===r.type)return{cid:t,availableDownload:!0,source:"node",meta:r};{const{value:n,done:a}=await e.cat(t,{signal:s,length:2048,offset:0})[Symbol.asyncIterator]().next(),c=await M(n),u=r.size>-1&&n.length>=r.size,d=W(n,c),l=u?n:o?e.cat(t,{signal:s}):void 0;return r.catTime=Date.now()-i,!r.local&&o?(e.pin(t),r.pinTime=Date.now()-r.catTime):r.pinTime=-1,{result:l,textPreview:d,cid:t,meta:{...r,mime:c},source:"node"}}}catch(e){return Y.log("error fetch stat",e),{cid:t,availableDownload:!0,source:"node",meta:K}}}else Y.log("--------fetchIPFSContentFromNode NO NODE INTIALIZED--------")},nt=async(t,e,n)=>{const r="external"===e?.nodeType,s=r?await tt(t,e,n?.signal):K,a=`${p}/ipfs/${t}`,i=await fetch(a,{method:"GET",signal:n?.signal});if(i&&i.body){const e=e=>r?Promise.resolve():Z.add(t,(0,I.z)(e)),{mime:n,result:o,firstChunk:c}=await async function(t,e){const[n,r]=t.tee(),s=[],a=n.getReader(),{value:i}=await a.read(),o=i?await M(i):void 0,c=r.getReader(),u={async*[Symbol.asyncIterator](){for(;;){const{done:t,value:n}=await c.read();if(t)return void(e&&e(s,o));e&&s.push(n),yield n}}};return{mime:o,result:u,firstChunk:i}}(i.body,e),u=W(c,n);return{cid:t,textPreview:u,meta:{...s,mime:n},result:o,source:"gateway",contentUrl:a}}};const rt=async(t,e,n,r)=>{const s=await X(t);if(void 0!==s)return s;if(e){r&&r("trying to get with a node");return await et(t,e,n)}r&&r("trying to get with a gatway");return await nt(t,e,n)},st=async(t,e)=>{let n;t&&(n=await t.add(e));const r=await J.add(e);return n=n??r?.cid,n&&await Z.add(n,await(async t=>new Uint8Array("string"==typeof t?L.from(t):await t.arrayBuffer()))(e)),n};var at=n(25108);var it=n(25108);const ot={helia:$,embedded:A,external:h};async function ct(t){const{ipfsNodeType:e,...n}=t,r=function(t,e){return class extends t{async fetchWithDetails(t,e){const n=await rt(t,this),r=n?.result?await F(n,t):void 0;return e?r?.type===e?r:void 0:r}async addContent(t){return st(this,t)}async isConnectedToSwarm(){return!!(await super.getPeers()).find((t=>t===e.swarmPeerId))}async reconnectToSwarm(t){await this.isConnectedToSwarm()||super.connectPeer(e.swarmPeerAddress).then((()=>(at.log(`🐝 connected to swarm - ${e.swarmPeerAddress}`),!0))).catch((t=>(at.log(`Can't connect to swarm ${e.swarmPeerAddress}: ${t.message}`),!1)))}}}(ot[e],{swarmPeerId:u,swarmPeerAddress:"external"===e?l:d}),s=new r;return await s.init({url:n.urlOpts}),it.log("----init",e),await s.reconnectToSwarm(),s}var ut=n(37386),dt=n(51706),lt=n(94975),pt=n(42965),ht=n(29127),yt=n(87877),ft=n(31751),gt=n(1545),wt=n(25211),mt=n(28368),bt=n(79878),vt=n(32817),xt=n(34243),St=n(81480),Pt=n(25108);class Ct{constructor(t,e){this.settings=t,this.order=e}getNextSource(t){const e=this.order.indexOf(t);return e<this.order.length?this.order[e+1]:void 0}}class Tt extends Error{constructor(t){super(`Timeout after ${t}`),Object.setPrototypeOf(this,Tt.prototype)}}function $t(t){return(t.priority||0)+(t.viewPortPriority||0)}const zt=new Ct({db:{timeout:5e3,maxConcurrentExecutions:999},gateway:{timeout:21e3,maxConcurrentExecutions:11},node:{timeout:6e4,maxConcurrentExecutions:21}},["db","gateway","node"]),kt={external:new Ct({db:{timeout:5e3,maxConcurrentExecutions:999},node:{timeout:6e4,maxConcurrentExecutions:21},gateway:{timeout:21e3,maxConcurrentExecutions:11}},["db","node","gateway"]),embedded:zt,helia:zt};var Et=class{constructor(t=kt.embedded,e=33){this.queue$=new ut.X(new Map),this.node=void 0,this.postProcessItem=void 0,this.lastNodeCallTime=Date.now(),this.executing={db:new Set,node:new Set,gateway:new Set},this.strategy=t,this.queueDebounceMs=e,(0,dt.F)(5e3).pipe((0,lt.h)((()=>this.queue$.value.size>0&&!!this.node))).subscribe((()=>this.node.reconnectToSwarm(this.lastNodeCallTime))),this.queue$.pipe((0,pt.b)(this.queueDebounceMs),(0,ht.U)((t=>this.cancelDeprioritizedItems(t))),(0,yt.z)((t=>{const e=this.getItemBySourceAndPriority(t);return e.length>0?(this.node?.reconnectToSwarm(this.lastNodeCallTime),(0,ft.T)(...e.map((t=>this.fetchData$(t))))):gt.E}))).subscribe((({item:t,status:e,source:n,result:r})=>{const{cid:s}=t,a=this.queue$.value.get(s)?.callbacks||[];if(a.map((t=>t(s,e,n,r))),"node"===n&&(this.lastNodeCallTime=Date.now()),this.executing[n].delete(s),"completed"===e||"cancelled"===e)this.removeAndNext(s);else{const e=this.strategy.getNextSource(n);e?this.switchSourceAndNext(t,e):(this.removeAndNext(s),a.map((t=>t(s,"not_found",n,r))))}}))}switchStrategy(t){this.strategy=t}setPostProcessor(t){this.postProcessItem=t}async setNode(t,e){this.node=t,this.switchStrategy(e||kt[t.nodeType])}getItemBySourceAndPriority(t){const e=[...t.values()].filter((t=>"pending"===t.status)),n=xt.vMG((t=>t.source),e),r=[];for(const[t,e]of Object.entries(n)){const n=this.strategy.settings[t].maxConcurrentExecutions-this.executing[t].size,s=e.sort(((t,e)=>$t(e)-$t(t))).slice(0,n);r.push(...s)}return r}fetchData$(t){const{cid:e,source:n,controller:r,callbacks:s}=t,a=this.strategy.settings[n];this.executing[n].add(e);const i=this.queue$.value.get(e);return this.queue$.value.set(e,{...i,status:"executing",executionTime:Date.now(),controller:new AbortController}),s.map((t=>t(e,"executing",n))),(o=async()=>async function(t,e,n){const{node:r,controller:s}=n;try{switch(e){case"db":return X(t);case"node":return et(t,r,s);case"gateway":return nt(t,r,s);default:return}}catch(t){return void Y.log("----fetchIpfsContent error",t)}}(e,n,{controller:r,node:this.node}).then((t=>this.postProcessItem?this?.postProcessItem(t):t)),new St.y((t=>{o().then((e=>{t.next(e),t.complete()})).catch((e=>{Pt.log("----promiseToObservable error",e),t.error(e)}))}))).pipe((0,wt.V)({each:a.timeout,with:()=>(0,mt._)((()=>(r?.abort("timeout"),new Tt(a.timeout))))}),(0,ht.U)((e=>({item:t,status:e?"completed":"error",source:n,result:e}))),(0,bt.K)((e=>e instanceof Tt?(0,vt.of)({item:t,status:"timeout",source:n}):"AbortError"===e?.name?(0,vt.of)({item:t,status:"cancelled",source:n}):(0,vt.of)({item:t,status:"error",source:n}))));var o}mutateQueueItem(t,e){const n=this.queue$.value,r=n.get(t);return r&&n.set(t,{...r,...e}),this.queue$.next(n)}removeAndNext(t){const e=this.queue$.value;e.delete(t),this.queue$.next(e)}switchSourceAndNext(t,e){t.callbacks.map((n=>n(t.cid,"pending",e))),this.mutateQueueItem(t.cid,{status:"pending",source:e})}cancelDeprioritizedItems(t){return["node","gateway"].forEach((e=>{Array.from(this.executing[e]).forEach((n=>{const r=t.get(n);r&&$t(r)<0&&r.controller&&(r.controller.abort("cancelled"),r.callbacks.map((t=>t(r.cid,"pending",r.source))),t.set(n,{...r,status:"pending"}),this.executing[e].delete(n))}))})),t}releaseExecution(t){Object.keys(this.executing).forEach((e=>this.executing[e].delete(t)))}enqueue(t,e,n={}){const r=this.queue$.value,s=r.get(t);if(s)this.mutateQueueItem(t,{callbacks:[...s.callbacks,e]});else{const s=n.initialSource||this.strategy.order[0],a={cid:t,callbacks:[e],source:s,status:"pending",postProcessing:!0,...n};e(t,"pending",s),r.set(t,a),this.queue$.next(r)}}enqueueAndWait(t,e={}){return new Promise((n=>{this.enqueue(t,((t,e,r,s)=>{"completed"!==e&&"not_found"!==e||n({status:e,source:r,result:s})}),e)}))}updateViewPortPriority(t,e){this.mutateQueueItem(t,{viewPortPriority:e})}cancel(t){const e=this.queue$.value.get(t);e&&(e.controller?e.controller.abort("cancelled"):this.removeAndNext(t))}cancelByParent(t){const e=this.queue$.value;e.forEach(((n,r)=>{n.parent===t&&(this.releaseExecution(r),n.controller?.abort("cancelled"),e.delete(r))})),this.queue$.next(e)}clear(){const t=this.queue$.value;t.forEach(((e,n)=>{this.releaseExecution(n),e.controller?.abort("cancelled"),t.delete(n)})),this.queue$.next(new Map)}getQueueMap(){return this.queue$.value}getQueueList(){return Array.from(this.queue$.value.values())}getStats(){return xt.zGw(xt.VFc(xt.vgT("status")),xt.Zpf,xt.UID(xt._Qy(["status","count"])))(this.getQueueList())}};const At={indirect:-1,direct:0,recursive:1};var Ot=class{constructor(t){this.channel=new BroadcastChannel("cyb-broadcast-channel"),t&&(this.channel.onmessage=e=>t(e))}post(t){this.channel.postMessage(t)}};async function _t(t,e,n=10){let r=[];for await(const s of t)r.push(s),r.length===n&&(await e(r),r=[]);r.length>0&&await e(r)}const Dt=t=>{const{cid:e,result:n,meta:r,textPreview:s}=t,{size:a,mime:i,type:o,blocks:c,sizeLocal:u}=r;return{cid:e,size:a,mime:i||"unknown",type:o,text:s?.replace(/"/g,"'")||"",sizeLocal:u||-1,blocks:c||0}},qt=t=>({cid:t.cid.toString(),type:At[t.type]}),It=t=>{const{transaction_hash:e,transaction:n,type:r,value:s}=t;return{hash:e,type:r,timestamp:new Date(n.block.timestamp).getTime(),value:JSON.stringify(s),success:n.success}};var Nt=n(25108);const Mt=async(t,e)=>{try{const n=Dt(t);return(await e.executePutCommand("particle",[n])).ok}catch(t){return Nt.error("importParicleContent",t),!1}};var Lt=n(1707),jt=n(31230),Ut=n(25108);const Bt=(0,jt.ZP)('\n  query MyQuery($address: _text, $limit: bigint, $offset: bigint) {\n  messages_by_address(args: {addresses: $address, limit: $limit, offset: $offset, types: "{}"},\n    order_by: {transaction: {block: {height: desc}}}) {\n    transaction_hash\n    value\n    transaction {\n      success\n      block {\n        timestamp\n      }\n    }\n    type\n  }\n}\n'),Qt=async(t,e,n=0)=>(await(0,Lt.WY)(e,Bt,{address:`{${t}}`,limit:"100",offset:n})).messages_by_address;const Rt=async(t,e,n,r,s)=>{Ut.log("---importTransactions");let a=0;const i=async function*(t,e){let n=0;for(;;){const r=await Qt(t,e,n);if(0===r.length)break;const s=r.map((t=>It(t)));yield s,n+=s.length}}(e,n);for await(const e of i)a+=e.length,await t.executeBatchPutCommand("transaction",e,e.length),r&&r(a);s&&s(a)};var Ft=n(25108);function Wt(t){return{async*[Symbol.asyncIterator](){let e=!1;for(;!e;){const n=new Promise((n=>{t.onmessage=t=>{null===t.data?(e=!0,n(null)):n(t.data)}})),r=await n;null!==r&&(yield r)}}}}const Gt={canHandle:t=>t&&t.result&&"function"==typeof t.result[Symbol.asyncIterator],serialize(t){if(void 0===t)return[null,[]];const{result:e,...n}=t,{port1:r,port2:s}=new MessageChannel;return e&&(async()=>{for await(const t of e)r.postMessage(t);r.postMessage(null),r.close()})(),[{...n,port:s},[s]]},deserialize(t){if(!t)return;const{port:e,...n}=t;return{...n,result:Wt(e)}}};var Vt=n(34155),Zt=n(25108);"undefined"!=typeof SharedWorker&&Vt.env.IS_DEV;function Ht(){r.Y6.set("IPFSContent",Gt)}function Jt(t){const e={log:{original:Zt.log},error:{original:Zt.error},warn:{original:Zt.warn}},n=n=>{const{original:r}=e[n];e[n].original=Zt[n],Zt[n]=(...e)=>{r.apply(Zt,e);const s=e.map((t=>function(t){try{return JSON.stringify(t)}catch(e){return String(t)}}(t)));t.postMessage({type:"console",method:n,args:s})}};Object.keys(e).forEach((t=>n(t)))}var Yt=n(25108);const Xt=(()=>{let t,e;const n=new Et,s=new Ot;Yt.log("----backendApi worker constructor!");const a=(t,e)=>s.post({type:"worker_status",value:{status:t,lastError:e}}),i=(t,e)=>s.post({type:"sync_entry",value:{entry:t,state:e}}),o={importParicleContent:async t=>Mt(t,e),importCyberlinks:async t=>(async(t,e)=>{try{await e.executeBatchPutCommand("link",t.map((t=>({...t,neuron_address:""}))),100)}catch(t){Ft.error("importCyberlinks",t)}})(t,e),importParticle:async n=>(async(t,e,n)=>rt(t,e).then((t=>!!t&&Mt(t,n))))(n,t,e)},c={start:async e=>{try{return t&&(Yt.log("Ipfs node already started!"),await t.stop()),t=await ct(e),n.setNode(t),(0,r.sj)(t)}catch(t){throw Yt.log("----ipfs node init error ",t),Error(t instanceof Error?t.message:t)}},stop:async()=>{t&&await t.stop()},config:async()=>t?.config,info:async()=>t?.info(),fetchWithDetails:async(e,n)=>t?.fetchWithDetails(e,n),enqueue:async(t,e,r)=>n.enqueue(t,e,r),enqueueAndWait:async(t,e)=>n.enqueueAndWait(t,e),dequeue:async t=>n.cancel(t),dequeueByParent:async t=>n.cancelByParent(t),clearQueue:async()=>n.clear()};return{installDbApi:async t=>{e=t,n.setPostProcessor((async t=>(t&&o.importParicleContent({...t,result:void 0}),t))),a("idle")},syncDrive:async(n,r)=>{try{if(!n)return void a("error","Wallet is not connected");if(!t)return void a("error","IPFS node is not initialized");if(!e)return void a("error","CozoDb is not initialized");a("syncing"),["transaction","pin","particle"].forEach((t=>i(t,{progress:0,done:!1,error:void 0})));const s=async()=>{Yt.log("-----import ipfs"),await(async(t,e,n,r)=>{let s=0;await _t(t.ls(),(async t=>{const r=t.map(qt);s+=t.length,await e.executeBatchPutCommand("pin",r,t.length),n&&n(s)}),10),r&&r(s)})(t,e,(async t=>i("pin",{progress:t})),(async()=>i("pin",{done:!0})));const n=await e.executeGetCommand("pin",[`type = ${At.recursive}`],["cid"]);if(!1===n.ok)return void a("error",n.message);const r=n.rows.map((t=>t[0]));await(async(t,e,n,r,s)=>{let a=0;await _t(async function*(t){for(const e of t)yield e}(e),(async e=>{const s=await Promise.all(e.map((e=>rt(e,t)))),i=s.filter((t=>!!t)).map((t=>Dt(t)));a+=i.length,await n.executeBatchPutCommand("particle",i,i.length),r&&r(a)}),10),s&&s(a)})(t,r,e,(async t=>i("particle",{progress:t})),(async()=>i("particle",{done:!0}))),Yt.log("-----import ipfs done")},o=Rt(e,n,r,(async t=>i("transaction",{progress:t})),(async t=>i("transaction",{done:!0}))),c=s();await Promise.all([o,c]),a("idle")}catch(t){Yt.error("syncDrive",t),a("error",t.toString())}},ipfsApi:(0,r.sj)(c),importApi:(0,r.sj)(o)}})();var Kt,te;Kt=self,te=Xt,Ht(),void 0!==Kt.onconnect?Kt.onconnect=t=>{const e=t.ports[0];Jt(e),(0,r.Jj)(te,e)}:(0,r.Jj)(te)},67064:function(){},81949:function(){},95856:function(){},35883:function(){},66778:function(){},10465:function(){},52596:function(){},63897:function(){},85104:function(){},83886:function(){},52:function(){},25819:function(){},81265:function(){},35539:function(){},99283:function(){},43838:function(){}},a={};function i(t){var e=a[t];if(void 0!==e)return e.exports;var n=a[t]={exports:{}};return s[t].call(n.exports,n,n.exports,i),n.exports}i.m=s,i.x=function(){var t=i.O(void 0,[630,748,970,326],(function(){return i(27188)}));return t=i.O(t)},t=[],i.O=function(e,n,r,s){if(!n){var a=1/0;for(d=0;d<t.length;d++){n=t[d][0],r=t[d][1],s=t[d][2];for(var o=!0,c=0;c<n.length;c++)(!1&s||a>=s)&&Object.keys(i.O).every((function(t){return i.O[t](n[c])}))?n.splice(c--,1):(o=!1,s<a&&(a=s));if(o){t.splice(d--,1);var u=r();void 0!==u&&(e=u)}}return e}s=s||0;for(var d=t.length;d>0&&t[d-1][2]>s;d--)t[d]=t[d-1];t[d]=[n,r,s]},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,{a:e}),e},n=Object.getPrototypeOf?function(t){return Object.getPrototypeOf(t)}:function(t){return t.__proto__},i.t=function(t,r){if(1&r&&(t=this(t)),8&r)return t;if("object"==typeof t&&t){if(4&r&&t.__esModule)return t;if(16&r&&"function"==typeof t.then)return t}var s=Object.create(null);i.r(s);var a={};e=e||[null,n({}),n([]),n(n)];for(var o=2&r&&t;"object"==typeof o&&!~e.indexOf(o);o=n(o))Object.getOwnPropertyNames(o).forEach((function(e){a[e]=function(){return t[e]}}));return a.default=function(){return t},i.d(s,a),s},i.d=function(t,e){for(var n in e)i.o(e,n)&&!i.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:e[n]})},i.f={},i.e=function(t){return Promise.all(Object.keys(i.f).reduce((function(e,n){return i.f[n](t,e),e}),[]))},i.u=function(t){return t+"."+{326:"9d5003e0",630:"0212b885",748:"d4ec4127",827:"89ce62da",970:"897c9db2"}[t]+".chunk.js"},i.miniCssF=function(t){},i.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.p="/",function(){var t={455:1};i.f.i=function(e,n){t[e]||importScripts(i.p+i.u(e))};var e=self.webpackChunkcyb=self.webpackChunkcyb||[],n=e.push.bind(e);e.push=function(e){var r=e[0],s=e[1],a=e[2];for(var o in s)i.o(s,o)&&(i.m[o]=s[o]);for(a&&a(i);r.length;)t[r.pop()]=1;n(e)}}(),r=i.x,i.x=function(){return Promise.all([630,748,970,326].map(i.e,i)).then(r)};i.x()}();
//# sourceMappingURL=455.c36299c8.chunk.js.map