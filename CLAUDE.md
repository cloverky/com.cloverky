LLM의 일반적인 코딩 실수를 줄이기 위한 행동 지침이다. 프로젝트별 지침이 있을 경우 본 가이드라인과 병합하여 사용한다.

트레이드오프: 본 지침은 속도보다 신중함에 우선순위를 둔다. 사소한 작업은 상황에 맞게 판단한다.

---

## Top-Level Architecture Mandate (binding — English)

> **Priority:** This section is the highest-level architecture contract for this repository.  
> Claude and all coding agents MUST read, internalize, and obey it before writing or refactoring code.  
> When this section conflicts with ad-hoc suggestions, **this section wins** unless the user explicitly overrides it in the current message.

### Mission

You are building **clover** using **Karpathy-style harness engineering**: treat the LLM as a component inside a reliable system, not as the system itself. Progress flows through **structured context**, **explicit contracts**, **verifiable steps**, and **durable project memory** — not through one-off prompts or implicit conventions.

Implement a **Wiki + LLM PKS (Project Knowledge System)**:

| Pillar | Responsibility |
|--------|----------------|
| **Wiki** | Human-readable source of truth: architecture decisions, domain glossary, API contracts, folder rules, ADRs. Update the wiki when behavior or structure changes. |
| **LLM** | Executes tasks only within retrieved context from the wiki, `CLAUDE.md`, `AGENTS.md`, and the codebase. Do not invent architecture that contradicts written project knowledge. |
| **PKS** | Persistent, queryable project knowledge that bridges wiki docs and code: stable naming, bounded contexts, ports/adapters map, and handoff notes so the next agent session can continue without rediscovery. |

Before non-trivial work: **retrieve relevant wiki/PKS context → state assumptions → implement → verify → update wiki/PKS if the system changed.**

### Mandatory architecture stack

Combine these three models **at every bounded context** (e.g. `fridge`, `titanic`). Do not pick one and ignore the others.

1. **DDD (Domain-Driven Design)**  
   - Identify bounded contexts, ubiquitous language, aggregates, and domain rules.  
   - Domain logic lives in the center; infrastructure stays at the edges.  
   - No anemic domain: business rules belong in domain/use-case layers, not in routers or ORM models.

2. **Clean Architecture**  
   - Dependencies point **inward only**.  
   - Outer layers (frameworks, DB, HTTP, LLM SDKs) depend on inner abstractions — never the reverse.  
   - Use explicit boundaries: entities/domain rules → use cases → interface adapters → frameworks.

3. **Hexagonal Architecture (Ports & Adapters)**  
   - **Inbound adapters**: HTTP routers, CLI, message consumers.  
   - **Outbound adapters**: repositories, ORM, external APIs, file/LLM gateways.  
   - **Ports**: ABC interfaces (`UseCase`, `Repository`, etc.) that adapters and application core share.  
   - **Composition root**: `dependencies/` (DI factories) wires concrete adapters to ports.

### SOLID (non-negotiable)

| Principle | Rule in this repo |
|-----------|-------------------|
| **S** — Single Responsibility | One reason to change per module/class: router = HTTP, interactor = orchestration, repository = persistence, ORM = table mapping. |
| **O** — Open/Closed | Extend via new port implementations and adapters; avoid modifying stable core contracts without explicit request. |
| **L** — Liskov Substitution | Inject and type-hint **ports**, not concrete adapters. |
| **I** — Interface Segregation | Small, slice-specific ports (`InventoryUseCase`, `JamesDirectorRepository`); no god interfaces. |
| **D** — Dependency Inversion | High-level modules depend on abstractions; concretes are assembled only in `dependencies/` or `main.py`. |

### Module path conventions (clover)

Use these import/path rules consistently in docs, new code, and agent explanations:

| Scope | Convention | Example |
|-------|------------|---------|
| **App / bounded context** | Start paths **without** `clover` and **without** `apps`. The runtime root already includes them. | `fridge/adapter/inbound/...`, import `fridge.app.use_cases...` |
| **Core / shared infrastructure** | Always prefix with **`clover.core.`** | `clover.core.database`, `clover.core.matrix.oracle_database` |
| **Forbidden in new code** | Do not introduce redundant prefixes like `clover.apps.fridge` or `apps.fridge` unless an existing compat layer explicitly requires it. | — |

When documenting file locations for another agent, write: `fridge/dependencies/inventory.py`, not `clover/apps/fridge/...`.  
When importing shared core utilities, write: `from clover.core.<module> import ...`.

### Harness engineering workflow (agent checklist)

1. **Read** `CLAUDE.md`, `AGENTS.md`, and relevant wiki/PKS notes.  
2. **Locate** the bounded context and slice (adapter / app / domain / dependencies).  
3. **Design** ports first, then interactors, then adapters — never start from ORM or router fat handlers.  
4. **Implement** with minimal diff; match existing naming and folder layout.  
5. **Verify** with import/run checks and stated success criteria.  
6. **Record** durable changes in wiki/PKS (or flag what the user should commit to docs).

### Anti-patterns (reject immediately)

- Business logic in FastAPI routers or SQLAlchemy models  
- Adapters imported directly inside interactors  
- New `domain/` top-level folders that break the established app layout without user approval  
- Skipping ports “because the slice is small”  
- Path prefixes that violate the `fridge.*` / `clover.core.*` convention  
- One-shot LLM context with no wiki/PKS update after architectural change

---

### 1. 구현 전 사고 (Think Before Coding)
가정하지 않는다. 모호함을 숨기지 않는다. 트레이드오프를 명확히 밝힌다.

구현을 시작하기 전 다음을 준수한다:

- 자신의 가정을 명시적으로 기술한다. 불확실한 경우 질문한다.

- 해석의 여지가 여러 가지라면 임의로 선택하지 말고 대안들을 제시한다.

- 더 간단한 접근 방식이 있다면 제안한다. 정당한 사유가 있다면 사용자의 요청에 반대 의견을 제시한다.

- 불분명한 부분이 있다면 작업을 중단한다. 혼란스러운 부분을 구체적으로 언급하며 질문한다.

### 2. 단순성 우선 (Simplicity First)
- 문제를 해결하는 최소한의 코드만 작성한다. 추측에 기반한 코드는 배제한다.

- 요청되지 않은 기능은 추가하지 않는다.

- 일회성 코드를 위해 추상화 계층을 만들지 않는다.

- 요청되지 않은 유연성이나 설정 가능성을 고려하지 않는다.

- 발생 불가능한 시나리오에 대한 예외 처리를 하지 않는다.

- 200줄의 코드를 50줄로 줄일 수 있다면 코드를 다시 작성한다.

- "시니어 엔지니어가 보기에 이 코드가 지나치게 복잡한가?"라고 자문한다. 그렇다면 단순화한다.

### 3. 정밀한 수정 (Surgical Changes)
필요한 부분만 수정한다. 본인이 만든 코드의 뒷정리만 수행한다.

기존 코드를 편집할 때 다음을 준수한다:

- 인접한 코드, 주석, 포맷을 임의로 개선하지 않는다.
- 망가지지 않은 부분을 리팩토링하지 않는다.
- 본인의 스타일과 다르더라도 기존 스타일을 따른다.
- 작업과 무관한 데드 코드를 발견하면 보고하되 직접 삭제하지 않는다.

수정으로 인해 사용되지 않게 된 요소가 발생할 경우:

- 본인의 수정으로 인해 불필요해진 임포트, 변수, 함수는 제거한다.
- 기존에 존재하던 데드 코드는 요청이 없는 한 그대로 둔다.
- 테스트 기준: 변경된 모든 라인은 사용자의 요청사항과 직접적으로 연결되어야 한다.

### 4. 목표 중심 실행 (Goal-Driven Execution)
성공 기준을 정의한다. 검증될 때까지 반복한다.
작업을 검증 가능한 목표로 변환한다:

- "유효성 검사 추가" → "잘못된 입력에 대한 테스트 작성 후 통과 확인"
- "버그 수정" → "버그를 재현하는 테스트 작성 후 통과 확인"
- "X 리팩토링" → "리팩토링 전후의 테스트 통과 확인"

다단계 작업의 경우 간략한 계획을 수립한다:

1. [단계] → 검증: [확인 사항]
2. [단계] → 검증: [확인 사항]
3. [단계] → 검증: [확인 사항]
성공 기준이 명확해야 독립적인 작업이 가능하다. "작동하게 만들기"와 같은 모호한 기준은 불필요한 재질의를 야기한다.

지침 작동 확인: Diff 내 불필요한 변경 감소, 복잡성으로 인한 재작성 빈도 감소, 구현 전 질문을 통한 명확한 의사결정 증대.

---

## 프로젝트 아키텍처 (인수인계)

백엔드 앱(`fridge`, `titanic`) 작업 시 아래 규칙을 따른다. DB 경로·테이블명 고정은 [`AGENTS.md`](./AGENTS.md)를 병행한다.

### 저장소 개요

| 항목 | 내용 |
|------|------|
| 형태 | 모노레포 (`backend/` + `frontend/`) |
| 백엔드 진입점 | `backend/main.py` (FastAPI) |
| 앱 패키지 위치 | `backend/apps/` (`fridge`, `titanic`, `secom`, `matrix` 등) |
| `sys.path` | `main.py`가 `backend/`·`backend/apps/`를 삽입 — import는 `fridge.*`, `titanic.*` 형태 |
| DB | Neon PostgreSQL, SQLAlchemy 2.x async (`psycopg`) |
| Windows | `main.py`에서 `WindowsSelectorEventLoopPolicy` 설정 (async DB 멈춤 방지) |

### 헥사고날 아키텍처 (Ports & Adapters)

도메인 앱(`fridge`, `titanic`)은 **헥사고날**을 기준으로 폴더를 나눈다.

```
{app}/
├── adapter/
│   ├── inbound/          # 외부 → 앱 (HTTP API, Pydantic schema)
│   └── outbound/         # 앱 → 외부 (DB, 외부 API, 파일)
│       ├── orm/          # SQLAlchemy 엔티티
│       ├── pg/           # Repository 구현체 (*PgRepository)
│       └── gemini/       # (fridge) 외부 AI 연동
├── app/
│   ├── dtos/             # 유스케이스 입출력 데이터
│   ├── ports/
│   │   ├── input/        # 인바운드 포트 (UseCase ABC)
│   │   └── output/       # 아웃바운드 포트 (Repository ABC)
│   └── use_cases/        # Interactor — 비즈니스 로직
├── dependencies/         # DIP 팩토리 (FastAPI Depends 조립)
└── models/
    └── database.py       # (fridge만) DB compat re-export — 옮기지 말 것
```

**`domain/` 폴더는 사용하지 않는다.** titanic에 `domain/`이 없고, fridge도 동일하게 맞췄다. 순수 보조 로직은 `app/use_cases/_*.py` (예: `_shelf_life.py`)에 둔다.

### 클린 아키텍처와의 대응

| 클린 레이어 | 이 프로젝트 위치 |
|------------|-----------------|
| Entities / Domain rules | `app/use_cases/_*.py`, interactor 내부 순수 함수 |
| Use Cases | `app/use_cases/*_interactor.py` |
| Interface Adapters | `adapter/inbound`, `adapter/outbound` |
| Frameworks & Drivers | FastAPI, SQLAlchemy, Gemini SDK |
| DI / Composition Root | `dependencies/*.py`, `main.py` |

**의존 방향 (안쪽으로만):**

```
adapter/inbound  →  app/ports/input, app/dtos
adapter/outbound →  app/ports/output, app/dtos
app/use_cases    →  app/ports/*, app/dtos, app/use_cases/_*
dependencies     →  adapter/outbound, app/use_cases, app/ports
```

- `adapter`는 `app/ports`의 **인터페이스**만 안다.
- `use_cases`는 `adapter` 구현체를 **직접 import하지 않는다**.
- 구현체 조립은 **`dependencies/`** 에서만 한다.

### SOLID 적용

| 원칙 | 적용 방식 |
|------|----------|
| **SRP** | 라우터=HTTP 위임, Interactor=비즈니스, PgRepository=영속화, ORM=테이블 매핑 각각 분리 |
| **OCP** | 새 저장소·외부 연동은 `ports/output` ABC + `adapter/outbound` 구현 추가 |
| **LSP** | `InventoryUseCase` 등 포트 타입으로 주입; 구현체 교체 가능 |
| **ISP** | 슬라이스별 UseCase·Repository 분리 (`inventory`, `food_catalog`, `receipt_scan` …) |
| **DIP** | `dependencies/get_*_use_case`가 구현체를 조립하고 **포트 타입**으로 반환 |

### 주요 디자인 패턴

| 패턴 | 위치 | 역할 |
|------|------|------|
| **Port (Interface)** | `app/ports/input`, `app/ports/output` | ABC로 계약 정의 |
| **Interactor (Use Case)** | `app/use_cases/*_interactor.py` | 포트 구현 + 오케스트레이션 |
| **Repository** | `*PgRepository` | `ports/output` 구현, ORM↔DTO 변환 |
| **DTO** | `app/dtos/` | 레이어 간 데이터 (ORM/Pydantic과 분리) |
| **Adapter** | `adapter/inbound/api/schemas` | HTTP 요청/응답 Pydantic + `mappers.py` |
| **Factory / Composition Root** | `dependencies/*.py` | `Depends(get_db)` + Repository + Interactor 조립 |
| **Thin Controller** | `adapter/inbound/api/v1/*_router.py` | 파싱·위임·응답 매핑만 |

### FastAPI 규칙

#### 라우터 (Thin Delegation)

라우터는 **얇게** 유지한다. 비즈니스 로직·DB 접근 금지.

```python
# ✅ 올바른 패턴
@inventory_router.get("")
async def list_inventory(
    x_user_email: str = Header(..., alias="X-User-Email"),
    inventory: InventoryUseCase = Depends(get_inventory_use_case),
) -> InventoryListResponse:
    return to_inventory_list_response(await inventory.list_inventory(x_user_email))
```

- `Depends` 인자 타입: **구현체가 아닌 포트** (`InventoryUseCase`, `JamesDirectorUseCase`)
- 팩토리: `dependencies/` 모듈의 `get_*_use_case`
- HTTP 스키마: `adapter/inbound/api/schemas/`
- DTO ↔ Response 변환: `schemas/mappers.py`

#### 라우터 조립

- **fridge**: `adapter/inbound/api/fridge_router.py` — `__init__.py`에 로직 넣지 않음
- **titanic**: `adapter/inbound/api/__init__.py`에 `titanic_router` 조립 (titanic만 예외)
- `main.py`: `app.include_router(fridge_router)`, `app.include_router(titanic_router)`

#### 슬라이스별 API (fridge)

| 슬라이스 | prefix | UseCase | dependencies |
|---------|--------|---------|--------------|
| inventory | `/inventory` | `InventoryInteractor` | `dependencies/inventory.py` |
| food catalog | `/foods` | `FoodCatalogInteractor` | `dependencies/food_catalog.py` |
| category catalog | `/categories` | `CategoryCatalogInteractor` | `dependencies/category_catalog.py` |
| receipt scan | `/receipts` | `ReceiptScanInteractor` | `dependencies/receipt_scan.py` |

### DIP 팩토리 템플릿

`dependencies/` 모듈은 **유일한 조립 지점**이다. titanic `james_director.py`, fridge `inventory.py`와 동일 패턴.

```python
def get_inventory_use_case(
    db: AsyncSession = Depends(get_db),
) -> InventoryUseCase:
    users: UserRepository = UserPgRepository(session=db)
    inventory: InventoryRepository = InventoryPgRepository(session=db)
    # ...
    return InventoryInteractor(users=users, inventory=inventory, ...)
```

규칙:

- `get_db`는 **`core.matrix.oracle_database`** 에서 import (단일 소스)
- 지역 변수 타입 힌트: **포트(ABC)** 로 선언
- 반환 타입: **input 포트** (`*UseCase`)
- 라우터·Interactor는 `*PgRepository`를 **직접 import하지 않음**

### 새 기능 추가 체크리스트

슬라이스 하나를 추가할 때 (titanic·fridge 공통):

1. `app/dtos/` — Command/Result DTO
2. `app/ports/input/` — `*UseCase` ABC
3. `app/ports/output/` — `*Repository` ABC (필요 시)
4. `app/use_cases/` — `*Interactor`
5. `adapter/outbound/orm/` — ORM (테이블 있을 때)
6. `adapter/outbound/pg/` — `*PgRepository`
7. `adapter/inbound/api/schemas/` — Request/Response Pydantic
8. `adapter/inbound/api/v1/` — `*_router.py`
9. `dependencies/` — `get_*_use_case`
10. 상위 라우터에 `include_router`
11. `main.py` / `alembic/env.py`에 ORM `# noqa: F401` import (create_all·autogenerate)

검증: `cd backend && python -c "import main"`

### `__init__.py` 규칙

**fridge의 모든 `__init__.py`는 비어 있어야 한다** (0바이트).

- 패키지 마커 역할만
- re-export·라우터 조립·`__all__` 정의 금지
- 조립 로직은 `fridge_router.py` 같은 **명명된 모듈**에 둔다

(titanic은 `adapter/inbound/api/__init__.py`에 `titanic_router` 조립이 남아 있음 — fridge와의 차이점)

### DB·ORM 규칙 (필수, AGENTS.md)

#### 옮기지 말 것

| 경로 | 역할 |
|------|------|
| `backend/apps/database.py` | 실제 `Base`, engine, `get_db` 구현 (→ `core/database.py` re-export) |
| `backend/apps/fridge/models/database.py` | `from database import …` compat — Alembic·레거시 import 유지 |

#### Neon 테이블명 (fridge)

접두사 `fridge_` **없음**:

| 테이블 | 용도 |
|--------|------|
| `users` | 회원 (`default_storage` 컬럼) |
| `categories` | 식품 카테고리 |
| `foods` | 식품 마스터 |
| `inventory` | 회원별 재고 (`food_id` FK) |
| `receipts`, `receipt_lines` | 영수증 스캔 |

**삭제된 레거시:** `ingredient_manager`, `inventory_items`, `fridge_*` 접두사 테이블 — `main.py` `_drop_legacy_fridge_tables`에서 DROP.

#### ORM 규칙

- 위치: `adapter/outbound/orm/*_orm.py`
- `from database import Base` (titanic·fridge 동일)
- fridge 엔티티: `EntityIdMixin` + `*Orm` 클래스명 (`InventoryOrm` 등)
- compat alias: `FridgeInventory = InventoryOrm` (선택)
- ORM은 DTO/스키마로 변환하지 않고 **Repository**에서 DTO로 매핑

#### DB 세션

- 앱 코드: `from core.matrix.oracle_database import get_db`
- `main.py` lifespan: `fridge.models.database`의 `engine`, `Base.metadata.create_all`
- Alembic: `fridge.models.database.Base` + ORM F401 import

### fridge 도메인 결정 사항

#### A안: `inventory` + `foods` 통합

- 회원 재고는 `inventory` 테이블 + `foods` 마스터 조인
- `ingredient_manager` 단일 테이블 방식 **폐기** (모델·마이그레이션·API 모두 제거)
- `InventoryInteractor`가 `FoodRepository`로 `food_id` resolve/create

#### 보조 로직 `_shelf_life.py`

유통기한 추정·재고 상태(`양호`/`임박`/`긴급`/`부족`) 순수 함수.

- 위치: `app/use_cases/_shelf_life.py` (titanic의 `_james_command.py`와 동일 취지)
- 사용처: `inventory_interactor`, `receipt_scan_interactor`, `schemas/mappers.py`

#### 삭제된 레거시 (재도입 금지)

```
fridge/controllers/
fridge/services/
fridge/repositories/
fridge/schemas/          # → adapter/inbound/api/schemas/
fridge/domain/           # → use_cases/_shelf_life.py
fridge/models/category.py 등 re-export
models/ingredient_manager.py
```

### titanic 참고

- 구조는 fridge와 **동일한 헥사고날** 레이아웃
- `app/domain/` 없음
- 슬라이스: james, walter, rose, titanic_query, … 각각 router + interactor + dependencies
- James 라우터: CSV 업로드 → `JamesDirectorUseCase.upload_titanic_csv` 위임 (thin)
- `get_db` → `core.matrix.oracle_database`

### secom (레거시 MVC)

`backend/apps/secom`은 **아직 MVC** (`controllers`, `services`, `repositories`).

| 항목 | 내용 |
|------|------|
| 인증 | `secom/app/utils/auth_password.py` (hash/verify) — **fridge에 두지 않음** |
| 회원 ORM | `models/user.py` (`users` 테이블) |
| fridge 연동 | 재고 API는 `X-User-Email` 헤더로 사용자 식별 |

secom을 fridge/titanic 구조로 옮기는 작업은 **별도 요청 시** 진행. 임의로 섞지 않는다.

### 자주 하는 실수 (하지 말 것)

| 실수 | 올바른 방향 |
|------|------------|
| `app/domain/` 또는 `fridge/domain/` 생성 | `app/use_cases/_*.py` 사용 |
| `__init__.py`에 라우터·re-export | 명명된 `.py` 모듈로 분리 |
| 라우터에서 `PgRepository` 직접 사용 | `Depends(get_*_use_case)` + 포트 타입 |
| Interactor에서 ORM import | Repository 포트만 의존 |
| `fridge_users`, `fridge_inventory` 테이블명 | `users`, `inventory` (AGENTS.md) |
| `database.py` / `fridge/models/database.py` 이동 | 경로 고정 (AGENTS.md) |
| `ingredient_manager` 재도입 | A안 `inventory`+`foods` 유지 |
| fridge 비밀번호 로직을 fridge에 둠 | `secom/app/utils/auth_password.py` |
| 요청 없는 리팩터·포맷 변경 | 본 문서 §3 Surgical Changes |

### 요청 흐름 (fridge inventory 예시)

```
Client
  → inventory_router          [adapter/inbound]
      Depends(InventoryUseCase)
  → get_inventory_use_case    [dependencies — DIP]
      InventoryPgRepository + InventoryInteractor 조립
  → InventoryInteractor       [app/use_cases]
      InventoryRepository, FoodRepository 포트 호출
      _shelf_life 순수 함수
  → InventoryPgRepository     [adapter/outbound/pg]
      InventoryOrm + FoodOrm  [adapter/outbound/orm]
  → mappers.to_*_response     [adapter/inbound/schemas]
  → JSON Response
```

### 검증·기동

```bash
cd backend
python -c "import main"
python main.py
```

- fridge 라우트 수: `fridge_router` 기준 13개
- import 오류 시 `sys.path`·`apps/` 패키지명 확인
- DB 마이그레이션: `main.py` lifespan `_migrate_tables` (로컬·Neon 연결 필요)

### 관련 문서·코드

| 문서/파일 | 내용 |
|----------|------|
| [`AGENTS.md`](./AGENTS.md) | DB 모듈 경로·Neon 테이블명 고정 |
| `backend/main.py` | 앱 등록, ORM F401, 마이그레이션 |
| `backend/alembic/env.py` | Alembic 메타데이터 import 목록 |

*마지막 정리: fridge → titanic 헥사고날 정렬, `domain/` 제거, `ingredient_manager` 제거, `__init__.py` 비움, DIP 팩토리·thin router 확립.*
