# 수학 게임 프롬프트 생성기

수학 공작소는 초등 수학 활동지를 바탕으로 전자칠판용 게임 제작 프롬프트를 구성하는 단일 페이지 웹 도구입니다.

## 사용하기

GitHub Pages 주소로 접속해 게임 유형, 수업 조건, 게임 분위기를 선택한 뒤 **프롬프트 복사**를 누릅니다. 복사한 프롬프트와 수학 활동지를 ChatGPT에 함께 입력하면 됩니다.

이 사이트는 외부 라이브러리나 서버 없이 `index.html` 하나로 실행됩니다.

현재 버전은 **2.0**입니다. 제작 프롬프트는 영어로 출력하며, 생성될 게임의 문제·버튼·안내·해설은 한국어로 작성하도록 지시합니다. 답안과 궤도·경로 선택의 순서, 다음 문제, 오답 재도전, 다중 터치, 종료·재시작과 자체 점검 요구를 포함합니다.

프롬프트의 상세함만으로 모든 생성 게임의 무오류를 보장하지 않습니다. 실제 게임은 수업 전에 교사 메뉴의 문제·진행 점검과 정답·오답 후 다음 문제를 확인하세요.

## 로컬에서 열기

`index.html`을 브라우저에서 열면 됩니다.

## 수정 후 빌드

처음 한 번 아이콘 패키지를 설치한 뒤, 원본 파일을 수정하고 배포 파일을 다시 만듭니다.

```text
npm install
npm run build
```

배포 파일인 루트 `index.html`과 미리보기 파일이 함께 갱신됩니다.

영문 본문 원본은 `prototypes/prompt-en.txt`, 선택 장르·테마의 영문 지시는 `prototypes/prompt-contracts.js`, 설정 조립은 `prototypes/compiler.js`입니다. `prompt-base.txt`, 카탈로그, HTML과 예시 프롬프트는 빌드 결과이므로 직접 편집하지 않습니다.

```text
node scripts/verify-prompt-contract.cjs
node scripts/verify-compiler.cjs
node scripts/verify-design.cjs
```

앞의 두 검사는 Node.js만 필요합니다. 브라우저 검사는 현재 로컬 Playwright 런타임과 Microsoft Edge를 사용합니다. [검증 범위](docs/prompt-reliability-v2.md)와 [배포 안내](docs/GitHub-Pages-배포안내.md)를 참고하세요.
