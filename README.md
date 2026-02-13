# 🧩 Find the Word (Puzzle Maker)

나만의 단어 찾기(Word Search) 퍼즐을 만들고 친구들에게 URL로 공유하는 웹 애플리케이션입니다.
서버 없이 URL에 모든 퍼즐 정보를 담아 공유하는 **Serverless Architecture**로 설계되었습니다.

🔗 **데모 사이트**: [Vercel 배포 URL]

## ✨ 주요 기능

*   **퍼즐 생성**: 제목, 단어 목록(최대 10개), 완료 메시지를 입력하여 퍼즐 자동 생성
*   **스마트 알고리즘**: 가로, 세로, 대각선(↙, ↘) 방향으로 단어 랜덤 배치
*   **간편한 공유**: **별도의 로그인/DB 없이** 생성된 URL만 복사해서 친구에게 전송 (카카오톡, 문자 등)
*   **모바일 완벽 지원**:
    *   터치 드래그로 단어 선택 (`Move` 이벤트 지원)
    *   게임 중 화면 스크롤 방지 (`touch-action: none`)
    *   깔끔한 모바일 전용 UI
*   **히스토리 관리**: 내가 만든 퍼즐은 로컬 스토리지에 자동 저장되어 언제든 다시 확인/삭제 가능

## 🛠️ 기술 스택

*   **Frontend**: React, TypeScript, Vite
*   **Styling**: CSS Modules (Custom Design System), Responsive Design
*   **Deployment**: Vercel
*   **Storage**: LocalStorage (Puzzle History), URL Parameter (Puzzle Data)

## 🚀 로컬 실행 방법

1.  **프로젝트 클론**
    ```bash
    git clone https://github.com/team-datapopcorn/find-the-word.git
    cd find-the-word
    ```

2.  **의존성 설치**
    ```bash
    npm install
    # 또는
    yarn install
    ```

3.  **개발 서버 실행**
    ```bash
    npm run dev
    ```
    브라우저에서 `http://localhost:5173` 접속

## 📦 Vercel 배포 방법

1.  [Vercel](https://vercel.com) 회원가입 및 로그인
2.  **Add New Project** 클릭 -> **GitHub Import** 선택
3.  `find-the-word` 리포지토리 선택
4.  설정 변경 없이 **Deploy** 클릭
5.  (선택 사항) **Settings > Domains** 메뉴에서 원하는 URL로 변경

## 📝 라이선스

This project is open source and available under the [MIT License](LICENSE).
