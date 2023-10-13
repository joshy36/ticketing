(()=>{var e={};e.id=805,e.ids=[805],e.modules={72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},55403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},94749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},14300:e=>{"use strict";e.exports=require("buffer")},6113:e=>{"use strict";e.exports=require("crypto")},82361:e=>{"use strict";e.exports=require("events")},57147:e=>{"use strict";e.exports=require("fs")},13685:e=>{"use strict";e.exports=require("http")},95687:e=>{"use strict";e.exports=require("https")},41808:e=>{"use strict";e.exports=require("net")},22037:e=>{"use strict";e.exports=require("os")},71017:e=>{"use strict";e.exports=require("path")},85477:e=>{"use strict";e.exports=require("punycode")},12781:e=>{"use strict";e.exports=require("stream")},76224:e=>{"use strict";e.exports=require("tty")},57310:e=>{"use strict";e.exports=require("url")},73837:e=>{"use strict";e.exports=require("util")},59796:e=>{"use strict";e.exports=require("zlib")},40370:(e,s,t)=>{"use strict";t.r(s),t.d(s,{GlobalError:()=>l.a,__next_app__:()=>p,originalPathname:()=>x,pages:()=>u,routeModule:()=>g,tree:()=>d});var r=t(76427),i=t(7953),a=t(35145),l=t.n(a),n=t(15288),c={};for(let e in n)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(c[e]=()=>n[e]);t.d(s,c);let o=r.AppPageRouteModule,d=["",{children:["user",{children:["[id]",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(t.bind(t,1984)),"/Users/joshuabender/Documents/GitHub/ticketing/apps/web/app/user/[id]/page.tsx"]}]},{}]},{}]},{layout:[()=>Promise.resolve().then(t.bind(t,47442)),"/Users/joshuabender/Documents/GitHub/ticketing/apps/web/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(t.bind(t,23310)),"/Users/joshuabender/Documents/GitHub/ticketing/apps/web/app/not-found.tsx"]}],u=["/Users/joshuabender/Documents/GitHub/ticketing/apps/web/app/user/[id]/page.tsx"],x="/user/[id]/page",p={require:t,loadChunk:()=>Promise.resolve()},g=new o({definition:{kind:i.x.APP_PAGE,page:"/user/[id]/page",pathname:"/user/[id]",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},38388:(e,s,t)=>{Promise.resolve().then(t.bind(t,11946)),Promise.resolve().then(t.t.bind(t,14433,23)),Promise.resolve().then(t.t.bind(t,16508,23))},1984:(e,s,t)=>{"use strict";t.r(s),t.d(s,{default:()=>Home});var r=t(63326),i=t(71959),a=t(23943),l=t(72467),n=t.n(l),c=t(48154),o=t.n(c),d=t(9507),u=t(342);async function ProfileView({params:e}){let s=await d.u.getUserProfile({id:e.id}),t=await d.u.getTicketsForUser({user_id:s?.id}),l=(0,i.Z)(),{data:{user:c}}=await l.auth.getUser();return r.jsx("div",{className:"bg-background",children:(0,r.jsxs)("div",{className:"pt-6",children:[r.jsx("div",{className:"flex justify-center",children:r.jsx(u.qE,{className:"h-40 w-40",children:s?.profile_image?r.jsx(u.F$,{src:s?.profile_image,alt:"pfp"}):r.jsx(u.Q5,{})})}),(0,r.jsxs)("div",{className:"mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16",children:[r.jsx("div",{className:"lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8",children:r.jsx("h1",{className:"text-2xl font-bold tracking-tight text-accent-foreground sm:text-3xl",children:`@${s?.username}`})}),r.jsx("div",{className:"mt-4 lg:row-span-3 lg:mt-0",children:c&&c.id===e.id?r.jsx("form",{className:"mt-10",children:r.jsx(n(),{href:`/user/edit/${e.id}`,children:r.jsx(a.z,{variant:"default",className:"flex w-full",children:"Edit Profile"})})}):r.jsx("div",{})}),r.jsx("div",{className:"py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6",children:(0,r.jsxs)("div",{children:[r.jsx("h3",{className:"sr-only",children:"Description"}),(0,r.jsxs)("div",{className:"inline-block space-y-6",children:[s?.first_name?r.jsx("p",{className:"inline text-base text-accent-foreground",children:`${s.first_name} `}):r.jsx("p",{}),s?.last_name?r.jsx("p",{className:"inline text-base text-accent-foreground",children:`${s.last_name}`}):r.jsx("p",{})]}),r.jsx("div",{className:"space-y-6",children:r.jsx("p",{className:"text-base text-accent-foreground",children:s?.bio})})]})}),r.jsx("h1",{className:"text-2xl font-bold tracking-tight text-accent-foreground sm:text-3xl",children:"Upcoming Events"})]}),(0,r.jsxs)("div",{className:"mx-auto max-w-2xl px-4 pb-16 sm:px-6 lg:max-w-7xl lg:px-8",children:[r.jsx("h2",{className:"sr-only",children:"Tickets"}),r.jsx("div",{className:"grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8",children:t?r.jsx(r.Fragment,{children:t.map(e=>(0,r.jsxs)("a",{className:"group",children:[r.jsx("div",{className:"xl:aspect-h-8 xl:aspect-w-7 aspect-square w-full overflow-hidden rounded-lg bg-background",children:e.events?.image?r.jsx(o(),{src:e.events?.image,alt:"Ticket Image",width:500,height:500,className:"h-full w-full object-cover object-center group-hover:opacity-75"}):r.jsx(o(),{src:"/fallback.jpeg",alt:"image",width:500,height:500,className:"h-full w-full object-cover object-center group-hover:opacity-75"})}),r.jsx("h1",{className:"mt-4 text-lg text-accent-foreground",children:e.events?.name}),r.jsx("p",{className:"font-sm mt-1 text-sm text-muted-foreground",children:`Seat: ${e.seat}`})]},e.id))}):r.jsx("div",{children:"No upcoming events!"})})]})]})})}function Home({params:e}){return r.jsx("main",{children:r.jsx(ProfileView,{params:{id:e.id}})})}},80346:(e,s)=>{"use strict";s._=s._interop_require_default=function(e){return e&&e.__esModule?e:{default:e}}}};var s=require("../../../webpack-runtime.js");s.C(e);var __webpack_exec__=e=>s(s.s=e),t=s.X(0,[8293,5105,3326,1094,8154,5867,7059,278,3053,844],()=>__webpack_exec__(40370));module.exports=t})();