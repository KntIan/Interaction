import{v as s,x as a,q as t,c as e,a as o,i as l,b as r,d as n,e as c,y as i,z as p,C as m,F as u,t as d,n as _,A as g,l as f,m as h}from"./index-B-dpguDl.js";import{u as x,_ as y}from"./store.C53TceNa.js";import{o as b}from"./uni-app.es.D1-l22Qc.js";import{_ as w,g as j,a as k}from"./_plugin-vue_export-helper.q9aTn_51.js";const v=w({__name:"logs",setup(w){const v=x(),F=j("param")||s("param");return b((async()=>{if(F)try{a("param",F),console.log("param存储成功");const s=await(async s=>{try{return(await k({param:s})).data||[]}catch(a){throw console.error("获取打卡记录失败:",a),new Error("获取数据出错")}})(F);v.setLogs(s),console.log("获取打卡记录成功:",v.logs)}catch(s){t({title:s.message||"获取打卡记录失败",icon:"none"})}else console.warn("未找到param参数"),t({title:"缺少param参数",icon:"none"})})),(s,a)=>{const t=l,x=f,b=h;return r(),e(t,{class:"box"},{default:o((()=>[n(t,{class:"title"},{default:o((()=>[c("打卡记录")])),_:1}),n(t,{class:"logs_box"},{default:o((()=>[(r(!0),i(u,null,p(m(v).logs,((s,a)=>(r(),e(t,{class:"item",key:a},{default:o((()=>[n(x,{style:{height:"165px"},class:"log-image",src:s.thumb,mode:""},null,8,["src"]),n(t,{class:"product-name"},{default:o((()=>[c(d(s.title),1)])),_:2},1024),n(t,{class:_(["status",{"checked-in":s.is_point,"not-checked-in":!s.is_point}])},{default:o((()=>[s.is_point?(r(),e(x,{key:0,style:{width:"16px",height:"16px"},src:y,mode:"aspectFill"})):g("",!0),n(b,null,{default:o((()=>[c(d(s.is_point?"已打卡":"未打卡"),1)])),_:2},1024)])),_:2},1032,["class"])])),_:2},1024)))),128))])),_:1})])),_:1})}}},[["__scopeId","data-v-b376d566"]]);export{v as default};