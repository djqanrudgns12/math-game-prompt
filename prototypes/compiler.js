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
    const enModes={solo:'solo challenge',versus:'individual competition',teams:'team competition',coop:'cooperative shared goal'};
    if([g.promptName,g.promptContract,t.promptName,t.promptContract].some(v=>typeof v!=='string'||!v.trim())||!['shared','personal'].includes(g.promptFlow))throw Error('영문 프롬프트 구성이 누락되었습니다. 다시 빌드해 주세요.');
    const settings=[
      'Game: '+g.promptName+' ('+c.gameId+'); Korean display name: '+JSON.stringify(g.name),
      'Theme: '+t.promptName+' ('+c.themeId+'); Korean display name: '+JSON.stringify(t.name),
      'Initial participants: '+c.players+' simultaneous players',
      'Initial duration: '+(c.durationSec===null?'unlimited':c.durationSec+' seconds'),
      'Initial mathematics difficulty: '+{low:'low (하)',mid:'mid (중)',high:'high (상)'}[c.mathLevel],
      'Initial mode: '+enModes[c.resolvedMode]+(c.players===1&&c.mode!=='solo'?' (one participant resolves to a personal goal)':''),
      'Grade: '+(c.grade===null?'unspecified; preserve the source level':'elementary grade '+c.grade),
      'Pace: '+(c.pace==='relaxed'?'relaxed':'normal'),
      'Preferred interaction: '+{auto:'genre-appropriate',choice:'finite selection',connect:'matching',sort:'sorting',order:'ordering',construct:'predefined-piece construction'}[c.actionPreference],
      'Wrong-answer policy: '+(c.feedback==='hintRetry'?'commit wrong/penalty first, then guidance and zero-reward retry with a reachable next exit':'commit wrong/penalty first, then explanation and next question'),
      'Bottom interaction band top: '+c.reachTopPct+'% of viewport height',
      'Sound: '+(c.sound?'on':'off'),
      'Reduced motion: '+(c.reducedMotion==='system'?'follow system preference':c.reducedMotion?'on':'off'),
      'Source scopes (quoted teacher data): '+JSON.stringify(c.sourceScopes.length?c.sourceScopes:['Relevant questions in the attachments; no narrower scope specified']),
      'Learning objective (quoted teacher data): '+JSON.stringify(c.learningGoal.trim()||'Infer from the source'),
      'Additional idea (quoted teacher data): '+JSON.stringify(c.customIdea.trim()||'None')
    ].join('\n');
    const flow=g.promptFlow==='shared'
      ? 'Question flow: common rounds with independent responses. Freeze the participant set per round; use a finite submission deadline and bounded review acknowledgement even in unlimited play. Do not disclose answers before closure.'
      : 'Question flow: independent personal tasks; share only world/milestone contributions. A student can review and advance without waiting for another student. Use equal question sequences or verified equal-difficulty distributions in competition.';
    const blocks={
      teacher_settings:settings,
      selected_game_contract:g.promptContract+'\n'+flow,
      selected_mode_contract:'Initial mode: '+enModes[c.resolvedMode]+'. Implement all four runtime modes in the teacher menu. Solo: a personal genre goal. Versus: equal task conditions and comparable individual progress. Teams: independent student controls contributing to team goals; default to two balanced teams with teacher-editable membership. Compare unequal teams by valid contribution sum divided by team size; ties share rank, never break ties by touch speed. Cooperation: independent personal contributions, following the selected genre question flow, contribute to a real shared path/build/resource/goal, scaled to participants and duration; no individual ranking. One participant resolves to a personal goal. One wrong or waiting student must not lock other students. Define a finite goal or teacher-stop exit for unlimited play. Pending mode/team changes apply next game.',
      selected_theme_contract:t.promptContract
    };
    for(const key of Object.keys(blocks))if(template.split('{{'+key+'}}').length!==2)throw Error('프롬프트 구성에 중복이나 누락이 있습니다.');
    const out=template.replace(/{{([a-z_]+)}}/g,(all,key)=>{if(!has(blocks,key))throw Error('정의되지 않은 프롬프트 항목');return blocks[key];}).replace(/\r\n?/g,'\n');
    return {text:out,config:c,game:g,theme:t};
  }
  return {defaults,normalize,compile,data,modes};
}
if(typeof module!=='undefined')module.exports=makeCompiler;
