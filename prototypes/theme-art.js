const ThemeArt = (() => {
 const styles={
  classroom:{bg:'#eef3ff',ink:'#15213a',panel:'#ffffff',accent:'#3567e8',muted:'#53627d',stroke:'#b8c8ed',name:'챌린지 스타디움',icon:'⚡',tagline:'선명한 미션과 연속 정답',motif:'에너지 게이지·미션 배지·별 보상'},
  space:{bg:'#0b1026',ink:'#f3f6ff',panel:'#182448',accent:'#7c8cff',muted:'#bec9ec',stroke:'#43578f',name:'갤럭시 미션',icon:'🚀',tagline:'우주선을 움직이는 탐사 임무',motif:'행성 궤도·연료 게이지·임무 단계'},
  forest:{bg:'#dff5df',ink:'#17382b',panel:'#f8fff5',accent:'#1f8b59',muted:'#486b59',stroke:'#9fc9aa',name:'정글 어드벤처',icon:'🌿',tagline:'길을 열며 전진하는 탐험',motif:'정글 경로·탐험 배지·보물 조각'},
  ocean:{bg:'#d9f4ff',ink:'#10384d',panel:'#f4fcff',accent:'#0085b5',muted:'#3f687a',stroke:'#8cc8dc',name:'딥씨 트레저',icon:'💎',tagline:'보물을 찾는 바닷속 원정',motif:'잠수정·산소 게이지·보물 상자'},
  pixel:{bg:'#19152f',ink:'#fff3ff',panel:'#302651',accent:'#d05cff',muted:'#d9c5e8',stroke:'#765b95',name:'픽셀 퀘스트',icon:'👾',tagline:'스테이지를 깨는 레트로 모험',motif:'픽셀 하트·스테이지 숫자·코인'},
  sports:{bg:'#073d35',ink:'#f4fff8',panel:'#145548',accent:'#c5f04d',muted:'#c2e7d8',stroke:'#579b83',name:'챔피언 아레나',icon:'🏆',tagline:'점수판이 살아 있는 경기장',motif:'경기장·팀 게이지·챔피언 배지'},
  paper:{bg:'#fff0cb',ink:'#3b291e',panel:'#fffaf0',accent:'#d96822',muted:'#755b45',stroke:'#d7b987',name:'보물섬 탐험',icon:'🧭',tagline:'지도를 완성하는 보물찾기',motif:'나침반·점선 경로·보물 상자'},
  block:{bg:'#e9ecff',ink:'#202c55',panel:'#fbfcff',accent:'#5a56e8',muted:'#596582',stroke:'#b5bde8',name:'블록 팩토리',icon:'🧩',tagline:'정답으로 기계를 조립하는 공장',motif:'조립 블록·생산 게이지·완성 로봇'},
  dessert:{bg:'#fff0f5',ink:'#4b2942',panel:'#fffafd',accent:'#ed4f91',muted:'#76566e',stroke:'#e5b5cb',name:'캔디 팝',icon:'🍬',tagline:'콤보가 터지는 달콤한 세계',motif:'캔디 조각·콤보 숫자·별 폭발'},
  dinosaur:{bg:'#f5e7bc',ink:'#34351d',panel:'#fffbed',accent:'#6f8f27',muted:'#68694a',stroke:'#c5bc83',name:'다이노 원정대',icon:'🦕',tagline:'화석을 모으는 공룡 탐사',motif:'발자국 경로·화석 조각·탐사 단계'},
  robot:{bg:'#dff6ff',ink:'#16384f',panel:'#f7fcff',accent:'#087dac',muted:'#486d80',stroke:'#94c7da',name:'로봇 커맨드',icon:'🤖',tagline:'회로를 깨우는 미래 미션',motif:'회로·전력 게이지·시스템 배지'},
  fantasy:{bg:'#24183f',ink:'#fff4dc',panel:'#3b2a59',accent:'#ffc857',muted:'#e0cfdf',stroke:'#7f69a0',name:'매직 킹덤',icon:'✨',tagline:'마법을 모아 왕국을 구하는 모험',motif:'마법 수정·퀘스트 단계·빛나는 별'}
 };
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
 function render(id,players=4,game='퀴즈'){const direction=typeof ArtDirection!=='undefined'?ArtDirection:require('./art-direction.js');return direction.render({...styles[id]||styles.classroom,id:styles[id]?id:'classroom'},players,game);}
 return {styles,render};
})();
if(typeof module!=='undefined')module.exports=ThemeArt;
