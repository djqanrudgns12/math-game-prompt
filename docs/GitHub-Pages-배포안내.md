# GitHub Pages에 올리기

배포할 파일은 프로젝트 맨 위의 `index.html` 하나입니다. CSS, JavaScript, 테마, 프롬프트가 모두 포함되어 있어 다른 폴더를 업로드할 필요가 없습니다. 파일을 더블클릭하면 인터넷 없이도 사용할 수 있습니다.

1. GitHub에 로그인하고 오른쪽 위 **+ → New repository**를 누릅니다.
2. 저장소 이름을 `math-game-prompt`처럼 정하고 **Public**, **Add a README file**을 선택해 생성합니다.
3. 저장소의 **Add file → Upload files**에서 이 프로젝트의 `index.html`을 올리고 **Commit changes**를 누릅니다. 폴더 안에 넣지 말고 저장소 맨 위에 둡니다.
4. **Settings → Pages → Build and deployment**에서 **Source: Deploy from a branch**, **Branch: main**, **Folder: /(root)**를 선택하고 **Save**를 누릅니다.
5. 배포 완료 후 같은 화면의 **Visit site**를 누릅니다. 주소는 `https://본인아이디.github.io/math-game-prompt/` 형태입니다.

수정할 때는 같은 위치의 `index.html`을 교체하고 저장하면 다시 배포됩니다. 페이지가 아직 안 보이면 Actions에서 Pages 배포가 완료됐는지 확인합니다.

현재 이 폴더에는 연결된 Git 저장소가 없고, 로컬 GitHub CLI의 로그인 토큰이 만료되어 자동 배포는 실행하지 않았습니다. 위 절차는 브라우저 로그인만으로 진행할 수 있습니다.

개발 파일을 수정한 뒤에는 `node scripts/build-prototypes.cjs`를 실행하면 루트 `index.html`과 `prototypes/generator-design.html`이 함께 갱신됩니다.

공식 안내:
- https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
