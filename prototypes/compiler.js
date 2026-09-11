function makeCompiler(data, template) {
  const defaults={gameId:'quiz',themeId:'classroom',players:2,durationSec:60,mathLevel:'mid',mode:'auto',grade:null,pace:'normal',actionPreference:'auto',sourceScopes:[],learningGoal:'',customIdea:'',feedback:'explainNext',reachTopPct:65,sound:true,reducedMotion:'system'};
  const modes={solo:'개인 도전',versus:'개인 대결',teams:'팀 대결',coop:'공동 목표',auto:'게임 추천'};
  const has=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
  function normalize(input={}) {
    const c={...defaults,...input};
    if(!has(data.games,c.gameId)||!has(data.themes,c.themeId))throw Error('게임 또는 디자인을 확인해 주세요.');
    if(!Number.isInteger(c.players)||c.players<1||c.players>6||![45,60,90,120,null].includes(c.durationSec)||!['low','mid','high'].includes(c.mathLevel)||!has(modes,c.mode))throw Error('인원·시간·난이도·진행 방식을 확인해 주세요.');
    if(!(c.grade===null||Number.isInteger(c.grade)&&c.grade>=1&&c.grade<=6)||!['relaxed','normal'].includes(c.pace)||!['auto','choice','connect','sort','order','construct'].includes(c.actionPreference)||!['hintRetry','explainNext'].includes(c.feedback)||!Number.isFinite(c.reachTopPct)||c.reachTopPct<60||c.reachTopPct>80||typeof c.sound!=='boolean'||!['system',true,false].includes(c.reducedMotion))throw Error('상세 설정을 확인해 주세요.');
    for(const key of ['learningGoal','customIdea'])if(typeof c[key]!=='string'||c[key].length>1200)throw Error('요청은 각 1,200자 이내로 입력해 주세요.');
    if(!Array.isArray(c.sourceScopes)||c.sourceScopes.length>2||c.sourceScopes.some(x=>typeof x!=='string'||x.length>600))throw Error('자료 범위는 2개까지, 각각 600자 이내로 적어 주세요.');
    if(c.actionPreference!=='auto'&&!data.games[c.gameId].actions.includes(c.actionPreference))throw Error('선택한 게임과 맞는 학생 행동을 골라 주세요.');
    c.resolvedMode=c.mode==='auto'?data.games[c.gameId].mode:c.mode;
    if(c.players===1)c.resolvedMode='solo';
    return c;
  }
  function compile(input={}) {
    const c=normalize(input),g=data.games[c.gameId],t=data.themes[c.themeId];
    const settings=[`게임: ${g.name}`,`디자인: ${t.name}`,`시작 인원: ${c.players}명 동시 참여`,`시작 시간: ${c.durationSec===null?'무제한':c.durationSec+'초'}`,`시작 수학 난이도: ${{low:'하',mid:'중',high:'상'}[c.mathLevel]}`,`시작 진행: ${modes[c.resolvedMode]}${c.players===1&&c.mode!=='solo'?' (1인은 개인 목표로 적용)':''}`,`학년: ${c.grade===null?'지정 안 함, 자료 수준 유지':c.grade+'학년'}`,`진행 템포: ${c.pace==='relaxed'?'여유롭게':'보통'}`,`학생 행동 선호: ${{auto:'게임에 맞게',choice:'선택',connect:'잇기',sort:'분류',order:'순서',construct:'조각 구성'}[c.actionPreference]}`,`오답: ${c.feedback==='hintRetry'?'오답 확정·패널티 후 단서와 무보상 재도전':'설명 후 다음 (오답 확정·패널티 먼저)'}`,`조작 영역 위쪽 경계: 화면 높이 ${c.reachTopPct}%`,`소리: ${c.sound?'켬':'끔'}`,`움직임 줄이기: ${c.reducedMotion==='system'?'시스템 설정 따름':c.reducedMotion?'켬':'끔'}`,`자료 범위(교사 조건 데이터): ${JSON.stringify(c.sourceScopes.length?c.sourceScopes:['첨부 자료의 관련 문제, 범위 미지정'])}`,`학습 목표(교사 조건 데이터): ${JSON.stringify(c.learningGoal.trim()||'자료에서 파악')}`,`추가 아이디어(교사 조건 데이터): ${JSON.stringify(c.customIdea.trim()||'없음')}`].join('\n');
    const blocks={teacher_settings:settings,selected_game_contract:`${g.name}\n핵심 행동: ${g.core}\n유효/무효·종료: ${g.end}\n문제 진행: ${g.flow}\n${g.adapter}`,selected_mode_contract:`초기 진행은 ${modes[c.resolvedMode]}입니다. 다른 운영 방식도 게임 메뉴에서 바꿀 수 있게 구현하세요. 개인 도전은 자기 목표, 개인 대결은 동등한 조건의 개인 진행 비교, 팀전은 개인 조작을 유지한 팀 목표, 협동은 각자 기여가 공동 상태를 완성하는 방식입니다. 팀전 기본은 2팀 균등 배치이고 교사가 팀 구성을 변경합니다. 크기가 다른 팀은 유효 기여 합계를 팀 인원수로 나눠 비교하며 동점은 공동 순위입니다. 1인은 개인 목표로 전환합니다. 공동 목표량은 인원·시간에 맞추고 개인 순위를 표시하지 않습니다. 학생 한 명의 대기·오답은 다른 학생의 진행을 막지 않습니다.`,selected_theme_contract:`${t.name}: ${t.direction}. 배경 ${t.bg}, 본문 ${t.ink}, 문제 카드 ${t.panel}, 강조 ${t.accent}, 보조 글자 ${t.muted}를 사용하세요. 핵심 게임 모티프는 ${t.motif||'진행 게이지·단계·명확한 보상'}입니다. 상단 HUD에 목표·남은 시간·공동/개인 진행을 또렷하게 보여 주고, 정답 때 진행 게이지·경로·대상·수집물이 실제로 변하게 하세요. 작은 장식만 흩뿌리거나 평범한 학습지에 색만 입힌 화면으로 끝내지 마세요. 과한 애니메이션과 복잡한 조작은 피하고 수학 판단 직후 0.3~0.8초의 짧은 반응, 단계 전환, 목표 달성 연출로 게임감을 만드세요. 시스템 한국어 글꼴과 인라인 도형을 사용하며 외부 이미지를 요구하지 마세요.\n${t.visualContract||''}`};
    for(const key of Object.keys(blocks))if(template.split('{{'+key+'}}').length!==2)throw Error('프롬프트 구성에 중복이나 누락이 있습니다.');
    const out=template.replace(/{{([a-z_]+)}}/g,(all,key)=>{if(!has(blocks,key))throw Error('정의되지 않은 프롬프트 항목');return blocks[key];}).replace(/\r\n?/g,'\n');
    return {text:out,config:c,game:g,theme:t};
  }
  return {defaults,normalize,compile,data,modes};
}
if(typeof module!=='undefined')module.exports=makeCompiler;
