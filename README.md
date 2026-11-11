# DA-FI · XRPL Hackathon 2025

DA-FI는 보험 상품 가입부터 계약 조회, 증빙 제출까지의 흐름에 XRP Ledger를 연결한 해커톤 프로토타입입니다. 가입 화면에서는 XRPL Credential을 발급·수락하고, 상품 가입 시 외부 서비스에서 받은 Escrow ID를 계약과 함께 기록합니다.

[GitHub Pages 주소 (`package.json` 기준, 운영 여부 미확인)](https://sein12.github.io/XRPL_Hackathon_2025) · [XRPL Credential 참고 문서](backend/src/services/Credential/README.md)

## 주요 흐름

| 단계 | 화면과 API가 하는 일 |
| --- | --- |
| 지갑 및 계정 등록 | 외부 Faucet API에서 데모 지갑과 세션을 받습니다. 회원가입 화면에서 `KYC` Credential을 발급·수락한 뒤 계정을 등록합니다. |
| 상품 가입 | 보험 상품과 보장 내용을 조회합니다. 가입을 확정하면 외부 Escrow 생성 API를 호출하고, 응답의 `escrow_id`를 계약에 저장합니다. |
| 계약 및 지갑 조회 | 내 계약 목록과 상세를 확인합니다. 프로필에서는 데모 지갑의 잔액과 Credential을 조회할 수 있습니다. |
| 보험금 청구 | 사고 일자, 설명, 증빙 파일(PDF·PNG·JPEG)을 입력합니다. 외부 심사 API에 사고 설명·상품 설명·증빙을 보내고 반환된 판정과 사유를 청구 기록에 저장합니다. |

## 코드 구성

| 경로 | 역할 |
| --- | --- |
| [`frontend/`](frontend/) | React 19, TypeScript, Vite 7, Tailwind CSS 4 기반 웹 UI |
| [`backend/src/routes/`](backend/src/routes/) | Express 5 API. JWT 인증, 상품·계약·청구 조회 및 등록, 외부 API 프록시 |
| [`backend/prisma/`](backend/prisma/) | Prisma 6과 SQLite로 사용자, 상품, 계약, 청구 데이터 관리 |
| [`backend/src/services/Credential/`](backend/src/services/Credential/) | `xrpl` SDK로 Credential 발급·수락·조회·삭제 처리 |

## 로컬 개발

Node.js 22.12.0 이상의 22.x 버전과 npm을 사용합니다. 브라우저에서 로그인과 회원가입을 진행하려면 외부 Faucet API가 필요하며, Escrow와 청구 심사도 같은 외부 서비스에 의존합니다.

```bash
git clone https://github.com/sein12/XRPL_Hackathon_2025.git
cd XRPL_Hackathon_2025
```

### 백엔드 설정

저장소 루트 기준으로 `backend/.env`를 만들고 예시 값을 로컬 환경에 맞게 바꿉니다.

```dotenv
PORT=3000
DATABASE_URL=file:./local.db
JWT_SECRET=replace-with-a-local-secret
PARTNER_BASE_URL=http://localhost:8000
ADMIN_SEED=replace-with-a-devnet-issuer-seed
```

- `JWT_SECRET`은 API 시작에 필요합니다. SQLite 파일 경로는 `backend/prisma/` 기준입니다.
- `PARTNER_BASE_URL`에는 `/ext` 프록시가 호출할 외부 서버 주소를 입력합니다. 외부 서버 소스는 이 저장소에 포함되어 있지 않습니다.
- `PARTNER_API_URL`과 `PARTNER_API_KEY`는 별도 OCR·지급 헬퍼의 설정입니다. 화면의 `/ext` 연동은 `PARTNER_BASE_URL`을 사용합니다.
- `ADMIN_SEED`는 Credential 발급·수락에 필요합니다. 발급·수락·조회는 기본적으로 XRPL Devnet에 연결하며 `XRPL_WS`로 노드를 지정할 수 있습니다. 삭제 API는 Devnet과 서버의 `USER_SEED`를 사용합니다.

백엔드 의존성을 설치하고 기존 마이그레이션을 적용합니다.

```bash
cd backend
npm ci
npx prisma migrate deploy
```

개발 서버 실행 전 [`backend/tsconfig.json`](backend/tsconfig.json)의 `module: "commonjs"`와 `moduleResolution: "bundler"` 조합을 수정해야 합니다. 이 조합은 `npm run build`에서도 TypeScript 설정 오류를 일으킵니다.

[`backend/package.json`](backend/package.json)에 정의된 상품 데이터 초기화 및 개발 서버 명령은 다음과 같습니다.

```bash
npm run seed
npm run dev
```

`npm run seed`는 예시 상품 한 건을 추가합니다. 서버가 뜨면 `http://localhost:3000/health`에서 `{"ok":true}`를 확인할 수 있습니다.

### 프런트엔드 실행

새 터미널에서 저장소 루트 기준으로 실행합니다.

```bash
cd frontend
npm ci
npm run dev
```

Vite가 출력하는 주소(기본 `http://localhost:5173`)로 접속합니다. 프런트엔드 API 주소는 [`axios.ts`](frontend/src/api/axios.ts)와 [`ext.ts`](frontend/src/api/ext.ts)에 `localhost:3000`으로 지정되어 있습니다. 현재 코드로 생성한 정적 빌드에도 이 설정이 포함됩니다.

## 구현 범위

- Credential 데모는 지갑 시드를 브라우저에서 서버로 전달합니다. 별도로 만든 Devnet 지갑으로 이 흐름을 확인합니다.
- 청구 기록에는 외부 심사 결과가 저장되며, 청구 상태는 `SUBMITTED`로 생성됩니다. 청구 화면에서 지급을 완료하거나 지급 결과로 상태를 갱신하는 흐름은 구현되어 있지 않습니다.
- 증빙 처리 함수는 예시 URL을 반환합니다. 업로드한 파일을 보존하려면 실제 스토리지 연결이 필요합니다.
- 상품 가입 화면은 `premiumDrops` 값을 외부 API의 `amount_krw`에 전달합니다. 실제 금액을 다루려면 두 API의 금액 단위를 맞춰야 합니다.

이 문서는 `main` 브랜치의 코드를 기준으로 작성했습니다. 서버 기동, 외부 API 응답, 원장 트랜잭션은 별도 검증이 필요합니다.
