const fs=require('node:fs'),path=require('node:path');const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8').replace(/^\uFEFF/,'');
const prd=read('docs/PRD-interview-draft.md'),arch=read('docs/generator-architecture.md'),contract=read('docs/prompt-contract-draft.md');
const ids=['quiz','race','tug','boss','defense','target','bingo','match','memory','sort','path','sequence','build','merge','territory','balance','estimate','rhythm','resource','code'];
const themeIds=['classroom','space','forest','ocean','pixel','sports','paper','block','dessert','dinosaur','robot','fantasy'];
const row=(text,id)=>{const match=text.split(/\r?\n/).find(l=>l.startsWith('| '+id+' |'));if(!match)throw Error(id);return match.split('|').slice(1,-1).map(x=>x.trim());};
const copy=JSON.parse(read('prototypes/genre-copy.json'));
const modes={tug:'teams',boss:'coop',sort:'coop',territory:'teams',rhythm:'coop',resource:'coop'};
const actions={match:['connect'],memory:['choice'],sort:['sort','choice'],sequence:['order'],build:['construct'],merge:['construct','choice'],balance:['construct','choice'],path:['choice'],rhythm:['choice'],resource:['construct','choice'],code:['choice']};
const shared=['race','tug','boss','defense','territory'];const processing=['quiz','target','sort','resource'];
const games={};for(const id of ids){const p=row(prd,id),a=row(arch,id);games[id]={id,name:p[1],summary:copy[id].join(" "),studentAction:copy[id][0],progressDescription:copy[id][1],core:a[1],end:a[2],mode:modes[id]||'versus',actions:actions[id]||['choice'],group:['match','memory','sequence','build','merge','balance'].includes(id)?'연결·구성':shared.includes(id)||['path','resource'].includes(id)?'전략·협동':'판단',flow:['quiz','bingo','estimate'].includes(id)?'공통 라운드, 각자 응답, 모두 응답하거나 라운드 한도 후 다음. 전체 마감 시각을 넘지 않음.':'개인 과제는 각자 진행, 공동 단계만 함께 반영. 동등한 문제 순서 또는 난도 분포를 사용.',adapter:shared.includes(id)?'개인 모드는 각자 또는 각 진영의 대상, 팀전은 팀 대상, 협동은 공동 경로/목표/상태로 구현하세요.':processing.includes(id)?'개인 판단과 항목 처리는 독립, 묶음 완성은 개인/팀/공동 수집·주문 목표에 반영하세요.':'개인 조작판은 분리하고 완성이 개인 기록/팀 진행/공동 작품의 일부로 반영되게 하세요.'};}
games.novel={id:'novel',name:'자료에 맞는 새 게임',summary:'활동지를 읽은 ChatGPT가 수학 판단에 맞는 게임 한 가지를 구상합니다.',core:contract.match(/## 3\.[\s\S]*?```text\r?\n([\s\S]*?)\r?\n```/)[1],end:'수학적으로 유효한 행동과 종료·재시작을 정의하고 핵심 의도를 바꿔야 하는 충돌만 질문하세요.',mode:'coop',actions:['choice','connect','sort','order','construct'],group:'새 구상',flow:'수학 목표와 장르에 맞는 개인 진행을 설계하세요.',adapter:'개인·팀·공동 목표의 변환을 구현하세요.'};
const art=require('../prototypes/theme-art.js'),direction=require('../prototypes/art-direction.js');const themes={};themeIds.forEach(id=>{const p=row(prd,id);themes[id]={id,name:p[1],direction:p[2],...art.styles[id],color:art.styles[id].accent};themes[id].visualContract=direction.contract(themes[id]);});
const data={games,themes};const template=contract.match(/```text\r?\n([\s\S]*?)\r?\n```/)[1];
fs.writeFileSync(path.join(root,'prototypes/catalog.json'),JSON.stringify(data,null,2));
fs.writeFileSync(path.join(root,'prototypes/prompt-base.txt'),template);
const safe=o=>JSON.stringify(o).replace(/</g,'\\u003c');
const bundle=read('prototypes/art-direction.js')+'\n'+read('prototypes/theme-art.js')+'\n'+read('prototypes/compiler.js')+`\nconst compiler=makeCompiler(${safe(data)},${safe(template)});`;
const html=read('prototypes/generator-design.template.html').replace(/<style>[\s\S]*?<\/style>/,()=>'<style>'+read('prototypes/generator-design.css')+'</style>').replace('/*COMPILER*/',()=>bundle);
fs.writeFileSync(path.join(root,'prototypes/generator-design.html'),html);
fs.writeFileSync(path.join(root,'index.html'),html);
const make=require('../prototypes/compiler.js');const example=make(data,template).compile({gameId:'match',themeId:'forest',players:4,durationSec:90,mode:'coop'});
fs.writeFileSync(path.join(root,'docs/example-prompt-coop-match.txt'),example.text+'\n');
const reference=read('prototypes/input-kernel.js').replace(/if \(typeof module[^\n]*/,'');
const assisted=example.text+'\n\n[입력 상태 참조 코드: 비교 시험용]\n아래 코드는 로컬 순수 로직·Chromium 접점 시험을 통과한 공통 입력 상태 참조입니다. 완성 게임이나 물리 기기 인증이 아닙니다. HTML 내부에 포함해 사용하고 외부 파일로 참조하지 마세요. 화면·수학·모드·보상 규칙은 별도로 완성하세요. down에는 실제로 누른 개인 구역과 행동, up에는 손을 뗀 좌표로 찾은 대상 구역과 행동을 전달하세요. 유효한 연결/완성 제출에만 commit을 호출하고, 잘못된 선택 또는 미완성 연결은 장르 규칙에 따라 처리하세요. commit 후 next는 새 과제 또는 재시도 revision을 시작하며 늦은 콜백은 예약 당시 round/revision을 전달해야 합니다. 일시정지·재시작 때 DOM 포인터 캡처와 선택 중 카드도 정리하세요. 도우미 사용이 문제 생성·실제 DOM 이벤트 연결·화면 검증을 대신하지 않습니다.\n```javascript\n'+reference+'\n```\n';
fs.writeFileSync(path.join(root,'docs/example-prompt-coop-match-reference.txt'),assisted);
console.log(JSON.stringify({genres:ids.length,themes:themeIds.length,exampleCharacters:example.text.length,htmlBytes:Buffer.byteLength(html)}));

