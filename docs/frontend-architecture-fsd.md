# Frontend Architecture — Feature-Sliced Design (FSD)

## 📁 Project Structure Overview

```
frontend/src/
│
├── app/                      # APP LAYER: Application initialization
│   ├── providers/            #   - React context providers
│   │   ├── QueryProvider.tsx
│   │   ├── RouterProvider.tsx
│   │   ├── StoreProvider.tsx
│   │   └── index.tsx
│   ├── router/               #   - Routing configuration
│   │   ├── routes.tsx
│   │   ├── RouteGuard.tsx
│   │   └── index.ts
│   ├── styles/               #   - Global styles
│   │   ├── global.css
│   │   ├── tokens.css        # CSS variables (design tokens)
│   │   └── index.css
│   └── App.tsx               # Root component
│
├── pages/                    # PAGES LAYER: Route components
│   ├── RoomPage/             #   - Room page (main gameplay)
│   │   ├── ui/
│   │   │   └── RoomPage.tsx
│   │   ├── lib/
│   │   │   └── useRoomParams.ts
│   │   └── index.ts
│   ├── HomePage/             #   - Home/lobby page
│   │   ├── ui/
│   │   │   └── HomePage.tsx
│   │   └── index.ts
│   ├── NotFoundPage/         #   - 404 page
│   │   ├── ui/
│   │   │   └── NotFoundPage.tsx
│   │   └── index.ts
│   └── index.ts              # Pages barrel export
│
├── widgets/                  # WIDGETS LAYER: Composite blocks
│   ├── RoomHeader/           #   - Room header with controls
│   │   ├── ui/
│   │   │   ├── RoomHeader.tsx
│   │   │   └── RoomHeader.module.css
│   │   └── index.ts
│   ├── ParticipantsList/     #   - Participants list widget
│   │   ├── ui/
│   │   │   ├── ParticipantsList.tsx
│   │   │   └── ParticipantsList.module.css
│   │   └── index.ts
│   ├── VotingCards/          #   - Voting cards widget
│   │   ├── ui/
│   │   │   ├── VotingCards.tsx
│   │   │   └── VotingCards.module.css
│   │   └── index.ts
│   ├── RoomResults/          #   - Results display widget
│   │   ├── ui/
│   │   │   ├── RoomResults.tsx
│   │   │   └── RoomResults.module.css
│   │   └── index.ts
│   └── index.ts              # Widgets barrel export
│
├── features/                 # FEATURES LAYER: User actions & behaviors
│   ├── create-room/          #   - Create new room
│   │   ├── ui/
│   │   │   ├── CreateRoomForm.tsx
│   │   │   └── CreateRoomForm.module.css
│   │   ├── lib/
│   │   │   └── useCreateRoom.ts
│   │   └── index.ts
│   ├── join-room/            #   - Join room
│   │   ├── ui/
│   │   │   ├── JoinRoomForm.tsx
│   │   │   └── JoinRoomForm.module.css
│   │   ├── lib/
│   │   │   └── useJoinRoom.ts
│   │   └── index.ts
│   ├── vote/                 #   - Make a vote
│   │   ├── ui/
│   │   │   ├── VoteButton.tsx
│   │   │   └── VoteButton.module.css
│   │   ├── lib/
│   │   │   └── useVote.ts
│   │   └── index.ts
│   ├── reveal-votes/         #   - Reveal votes (moderator)
│   │   ├── ui/
│   │   │   └── RevealButton.tsx
│   │   ├── lib/
│   │   │   └── useRevealVotes.ts
│   │   └── index.ts
│   ├── manage-room/          #   - Room management
│   │   ├── ui/
│   │   │   ├── RoomControls.tsx
│   │   │   └── RoomControls.module.css
│   │   └── index.ts
│   └── index.ts              # Features barrel export
│
├── entities/                 # ENTITIES LAYER: Business entities
│   ├── room/                 #   - Room entity
│   │   ├── ui/
│   │   │   ├── RoomCard.tsx
│   │   │   ├── RoomStatusBadge.tsx
│   │   │   └── RoomCard.module.css
│   │   ├── model/
│   │   │   ├── types.ts
│   │   │   ├── selectors.ts
│   │   │   └── context.tsx
│   │   ├── api/
│   │   │   └── roomApi.ts
│   │   └── index.ts
│   ├── participant/          #   - Participant entity
│   │   ├── ui/
│   │   │   ├── ParticipantCard.tsx
│   │   │   ├── ParticipantAvatar.tsx
│   │   │   └── ParticipantCard.module.css
│   │   ├── model/
│   │   │   ├── types.ts
│   │   │   └── selectors.ts
│   │   └── index.ts
│   ├── vote/                 #   - Vote entity
│   │   ├── ui/
│   │   │   └── VoteDisplay.tsx
│   │   ├── model/
│   │   │   └── types.ts
│   │   └── index.ts
│   └── index.ts              # Entities barrel export
│
├── shared/                   # SHARED LAYER: Reusable primitives
│   ├── ui/                   #   - UI components (atoms)
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.module.css
│   │   │   └── index.ts
│   │   ├── Input/
│   │   │   ├── Input.tsx
│   │   │   ├── Input.module.css
│   │   │   └── index.ts
│   │   ├── Card/
│   │   │   ├── Card.tsx
│   │   │   ├── Card.module.css
│   │   │   └── index.ts
│   │   ├── Badge/
│   │   │   ├── Badge.tsx
│   │   │   ├── Badge.module.css
│   │   │   └── index.ts
│   │   ├── Modal/
│   │   │   ├── Modal.tsx
│   │   │   ├── Modal.module.css
│   │   │   └── index.ts
│   │   ├── Spinner/
│   │   │   ├── Spinner.tsx
│   │   │   ├── Spinner.module.css
│   │   │   └── index.ts
│   │   ├── EmptyState/
│   │   │   ├── EmptyState.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── api/                  #   - API layer
│   │   ├── client.ts         # Axios instance
│   │   ├── types.ts          # API types
│   │   └── index.ts
│   ├── lib/                  #   - Utilities & helpers
│   │   ├── hooks/
│   │   │   ├── useLocalStorage.ts
│   │   │   ├── useWebSocket.ts
│   │   │   └── index.ts
│   │   ├── cn.ts             # Classname utility
│   │   ├── constants.ts      # Shared constants
│   │   └── index.ts
│   └── config/               #   - Configuration
│       ├── query.ts          # React Query config
│       └── index.ts
│
└── main.tsx                  # Entry point
```

## 📐 Layer Dependencies

```
app → pages → widgets → features → entities → shared
  ↓       ↓        ↓         ↓          ↓         ↓
  └───────┴────────┴─────────┴──────────┴─────────┘
          Each layer can ONLY depend on layers below it
```

### Dependency Rules:
- **app** can import: pages, widgets, features, entities, shared
- **pages** can import: widgets, features, entities, shared
- **widgets** can import: features, entities, shared
- **features** can import: entities, shared
- **entities** can import: shared, @poker/shared
- **shared** can import: @poker/shared (ONLY)

## 🔧 Layer Descriptions

### 1. `app/` — Application Initialization
**Purpose:** Application bootstrapping, global providers, routing setup.

```
app/
├── providers/
│   ├── QueryProvider.tsx     # React Query setup
│   ├── RouterProvider.tsx    # BrowserRouter setup
│   ├── ThemeProvider.tsx     # Theme context (optional)
│   └── index.tsx             # Compose all providers
├── router/
│   ├── routes.tsx            # Route definitions
│   ├── RouteGuard.tsx        # Protected routes (if needed)
│   └── index.ts
└── styles/
    ├── global.css            # Global resets, base styles
    ├── tokens.css            # CSS variables (colors, spacing, fonts)
    └── index.css
```

**Example `app/providers/index.tsx`:**
```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
}
```

**Example `app/router/routes.tsx`:**
```tsx
import { Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { RoomPage } from '@/pages/RoomPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/room/:roomId" element={<RoomPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
```

---

### 2. `pages/` — Route Components
**Purpose:** Page-level components assembled from widgets/features. Handle routing params, page-level data fetching.

```
pages/RoomPage/
├── ui/
│   └── RoomPage.tsx          # Main page component
├── lib/
│   └── useRoomParams.ts      # Extract/validate route params
└── index.ts
```

**Example `pages/RoomPage/ui/RoomPage.tsx`:**
```tsx
import { RoomHeader } from '@/widgets/RoomHeader';
import { ParticipantsList } from '@/widgets/ParticipantsList';
import { VotingCards } from '@/widgets/VotingCards';
import { RoomResults } from '@/widgets/RoomResults';
import { useRoomParams } from '../lib/useRoomParams';

export function RoomPage() {
  const { roomId } = useRoomParams();

  return (
    <div className="room-page">
      <RoomHeader roomId={roomId} />
      <main>
        <ParticipantsList roomId={roomId} />
        <VotingCards roomId={roomId} />
        <RoomResults roomId={roomId} />
      </main>
    </div>
  );
}
```

---

### 3. `widgets/` — Composite Widgets
**Purpose:** Large composite blocks combining features + entities. Represent self-contained UI sections.

```
widgets/ParticipantsList/
├── ui/
│   ├── ParticipantsList.tsx
│   └── ParticipantsList.module.css
└── index.ts
```

**Example `widgets/ParticipantsList/ui/ParticipantsList.tsx`:**
```tsx
import { ParticipantCard } from '@/entities/participant';
import { EmptyState } from '@/shared/ui';
import type { Participant } from '@poker/shared';

interface Props {
  participants: Participant[];
  roomId: string;
}

export function ParticipantsList({ participants, roomId }: Props) {
  if (participants.length === 0) {
    return <EmptyState message="No participants yet" />;
  }

  return (
    <section className="participants-list">
      <h2>Participants ({participants.length})</h2>
      <ul>
        {participants.map((p) => (
          <ParticipantCard key={p.id} participant={p} roomId={roomId} />
        ))}
      </ul>
    </section>
  );
}
```

---

### 4. `features/` — User Actions & Behaviors
**Purpose:** Interactive elements representing user actions. Each feature is a complete slice (UI + logic).

```
features/vote/
├── ui/
│   ├── VoteButton.tsx
│   └── VoteButton.module.css
├── lib/
│   └── useVote.ts            # Vote mutation logic
└── index.ts
```

**Example `features/vote/lib/useVote.ts`:**
```tsx
import { useMutation } from '@tanstack/react-query';
import { api } from '@/shared/api';
import type { VoteValue } from '@poker/shared';

export function useVote(roomId: string) {
  return useMutation({
    mutationFn: async (vote: VoteValue) => {
      return api.post(`/rooms/${roomId}/vote`, { vote });
    },
  });
}
```

**Example `features/vote/ui/VoteButton.tsx`:**
```tsx
import { Button } from '@/shared/ui';
import { useVote } from '../lib/useVote';
import type { VoteValue } from '@poker/shared';

interface Props {
  roomId: string;
  vote: VoteValue;
  disabled?: boolean;
}

export function VoteButton({ roomId, vote, disabled }: Props) {
  const { mutate, isPending } = useVote(roomId);

  return (
    <Button
      onClick={() => mutate(vote)}
      disabled={disabled || isPending}
      variant="card"
    >
      {vote}
    </Button>
  );
}
```

---

### 5. `entities/` — Business Entities
**Purpose:** Domain models with their UI, state, and API. Represent core business concepts.

```
entities/room/
├── ui/
│   ├── RoomCard.tsx
│   ├── RoomStatusBadge.tsx
│   └── RoomCard.module.css
├── model/
│   ├── types.ts              # Entity-specific types
│   ├── selectors.ts          # Data selectors
│   └── context.tsx           # Entity context (if needed)
├── api/
│   └── roomApi.ts            # Entity-specific API calls
└── index.ts
```

**Example `entities/room/model/types.ts`:**
```ts
import type { RoomState, RoomStatus } from '@poker/shared';

export type { RoomState, RoomStatus };

export interface RoomDetails extends RoomState {
  createdAt: string;
  moderatorId: string;
}
```

**Example `entities/room/ui/RoomStatusBadge.tsx`:**
```tsx
import { Badge } from '@/shared/ui';
import type { RoomStatus } from '@poker/shared';

const statusConfig: Record<RoomStatus, { label: string; color: string }> = {
  waiting: { label: 'Waiting', color: 'blue' },
  voting: { label: 'Voting', color: 'yellow' },
  revealed: { label: 'Revealed', color: 'green' },
};

export function RoomStatusBadge({ status }: { status: RoomStatus }) {
  const config = statusConfig[status];
  return <Badge label={config.label} color={config.color} />;
}
```

---

### 6. `shared/` — Reusable Primitives
**Purpose:** Lowest-level building blocks. No business logic, only technical implementations.

```
shared/
├── ui/                       # Atomic UI components
│   ├── Button/
│   ├── Input/
│   ├── Card/
│   ├── Badge/
│   ├── Modal/
│   ├── Spinner/
│   └── EmptyState/
├── api/                      # API infrastructure
│   ├── client.ts             # Axios instance with interceptors
│   └── types.ts
├── lib/                      # Utilities
│   ├── hooks/
│   │   ├── useLocalStorage.ts
│   │   └── useWebSocket.ts
│   └── cn.ts                 # Classname utility
└── config/                   # Configuration
    └── query.ts
```

**Example `shared/api/client.ts`:**
```ts
import axios from 'axios';
import type { ApiError } from '@poker/shared';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.response.interceptors.use(
  (response) => response,
  (error) => {
    const apiError: ApiError = {
      statusCode: error.response?.status || 500,
      error: error.response?.data?.error || 'Unknown error',
      message: error.response?.data?.message || error.message,
    };
    return Promise.reject(apiError);
  }
);
```

**Example `shared/lib/hooks/useWebSocket.ts`:**
```ts
import { useEffect, useRef, useCallback } from 'react';

interface UseWebSocketOptions<T> {
  url: string;
  onMessage: (data: T) => void;
  reconnectInterval?: number;
}

export function useWebSocket<T>({
  url,
  onMessage,
  reconnectInterval = 3000,
}: UseWebSocketOptions<T>) {
  const wsRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    ws.onclose = () => {
      setTimeout(connect, reconnectInterval);
    };
  }, [url, onMessage, reconnectInterval]);

  useEffect(() => {
    connect();
    return () => {
      wsRef.current?.close();
    };
  }, [connect]);

  return wsRef.current;
}
```

**Example `shared/lib/cn.ts`:**
```ts
// Simple classname utility (like clsx/cx)
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
```

---

## 🎨 Import Path Aliases

Configure in `tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/app/*": ["./src/app/*"],
      "@/pages/*": ["./src/pages/*"],
      "@/widgets/*": ["./src/widgets/*"],
      "@/features/*": ["./src/features/*"],
      "@/entities/*": ["./src/entities/*"],
      "@/shared/*": ["./src/shared/*"]
    }
  }
}
```

Configure in `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/app': path.resolve(__dirname, './src/app'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/widgets': path.resolve(__dirname, './src/widgets'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/entities': path.resolve(__dirname, './src/entities'),
      '@/shared': path.resolve(__dirname, './src/shared'),
    },
  },
});
```

---

## 🚀 Migration Plan

### Phase 1: Fix Structure & Setup
1. **Rename directories** (fix typos):
   - `entitiess/` → `entities/`
   - `feauters/` → `features/`
   - `app/touter/` → `app/router/`
   - `app/styles/tockens.css` → `app/styles/tokens.css`

2. **Setup infrastructure**:
   - Configure path aliases in `tsconfig` & `vite.config.ts`
   - Setup `shared/api/client.ts` with axios
   - Setup `app/providers/` with QueryClient & Router
   - Add global styles to `app/styles/`

### Phase 2: Shared Layer
1. Create atomic UI components in `shared/ui/`:
   - Button, Input, Card, Badge, Modal, Spinner, EmptyState
2. Create utility hooks in `shared/lib/hooks/`:
   - useLocalStorage, useWebSocket
3. Create `shared/lib/cn.ts` utility

### Phase 3: Entities Layer
1. Create `entities/room/` with:
   - UI components (RoomCard, RoomStatusBadge)
   - Model types & selectors
   - API functions
2. Create `entities/participant/` with:
   - UI components (ParticipantCard, ParticipantAvatar)
   - Model types & selectors
3. Create `entities/vote/` with:
   - UI components (VoteDisplay)
   - Model types

### Phase 4: Features Layer
1. Create `features/create-room/`:
   - Form UI + mutation hook
2. Create `features/join-room/`:
   - Form UI + mutation hook
3. Create `features/vote/`:
   - VoteButton UI + mutation hook
4. Create `features/reveal-votes/`:
   - RevealButton UI + mutation hook
5. Create `features/manage-room/`:
   - RoomControls UI

### Phase 5: Widgets Layer
1. Create `widgets/RoomHeader/`:
   - Combines entities + features
2. Create `widgets/ParticipantsList/`:
   - Uses ParticipantCard entity
3. Create `widgets/VotingCards/`:
   - Uses VoteButton feature
4. Create `widgets/RoomResults/`:
   - Shows revealed votes

### Phase 6: Pages Layer
1. Create `pages/HomePage/`:
   - Lobby with create/join room forms
2. Create `pages/RoomPage/`:
   - Main gameplay page with all widgets
3. Create `pages/NotFoundPage/`:
   - 404 fallback

### Phase 7: App Layer
1. Wire up `app/router/routes.tsx`
2. Compose `app/providers/index.tsx`
3. Update `App.tsx` to use providers + routes
4. Add global styles & tokens

---

## 📋 Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Directories | kebab-case | `create-room/`, `ParticipantsList/` |
| Components | PascalCase | `VoteButton.tsx`, `RoomPage.tsx` |
| Hooks | camelCase, prefixed | `useVote.ts`, `useRoomParams.ts` |
| Types | PascalCase | `RoomState`, `VoteValue` |
| Constants | UPPER_SNAKE_CASE | `VOTE_VALUES`, `ROOM_STATUS` |
| CSS Modules | `[name].module.css` | `Button.module.css` |
| Barrel exports | `index.ts` | Every segment exports from index.ts |

---

## 🔒 Import Rules Enforcement

### ✅ Allowed:
```ts
// pages can import widgets, features, entities, shared
import { RoomHeader } from '@/widgets/RoomHeader';
import { useVote } from '@/features/vote';
import { RoomStatusBadge } from '@/entities/room';
import { Button } from '@/shared/ui';

// features can import entities, shared
import { RoomStatusBadge } from '@/entities/room';
import { api } from '@/shared/api';

// entities can import shared, @poker/shared
import { Badge } from '@/shared/ui';
import type { RoomState } from '@poker/shared';
```

### ❌ Forbidden:
```ts
// entities CANNOT import features, widgets, pages
import { VoteButton } from '@/features/vote'; // ❌

// features CANNOT import widgets, pages
import { RoomHeader } from '@/widgets/RoomHeader'; // ❌

// shared CANNOT import any upper layer
import { RoomCard } from '@/entities/room'; // ❌
```

---

## 📦 Segment Structure Pattern

Every segment (slice) follows this pattern:

```
segment-name/
├── ui/              # Components (visual layer)
│   ├── Component.tsx
│   ├── Component.module.css
│   └── index.ts
├── model/           # State, types, logic (optional)
│   ├── types.ts
│   ├── selectors.ts
│   └── context.tsx
├── lib/             # Hooks, helpers (optional)
│   └── useSomething.ts
├── api/             # API functions (optional)
│   └── segmentApi.ts
└── index.ts         # Public API (barrel export)
```

**`index.ts` example:**
```ts
// Re-export only what should be public
export { SegmentComponent } from './ui/SegmentComponent';
export type { SegmentType } from './model/types';
export { useSegmentHook } from './lib/useSegmentHook';
```

---

## 🎯 Domain Slices

Based on Planning Poker domain:

| Layer | Slice | Responsibility |
|-------|-------|---------------|
| entities | room | Room CRUD, status, metadata |
| entities | participant | Participant info, presence |
| entities | vote | Vote data, reveal logic |
| features | create-room | Create room form |
| features | join-room | Join room form |
| features | vote | Submit vote action |
| features | reveal-votes | Moderator reveal action |
| features | manage-room | Reset, close, settings |
| widgets | RoomHeader | Title, status, controls |
| widgets | ParticipantsList | List of participants |
| widgets | VotingCards | Voting interface |
| widgets | RoomResults | Revealed results view |
| pages | HomePage | Lobby/landing |
| pages | RoomPage | Main gameplay |
| pages | NotFoundPage | 404 fallback |

---

## 🛠 Tech Stack Integration

| Technology | Usage in FSD |
|------------|--------------|
| React 19 | All UI components |
| TypeScript | Full type safety across layers |
| React Router | `app/router/`, page navigation |
| TanStack Query | `shared/config/query.ts`, data fetching |
| Axios | `shared/api/client.ts` |
| WebSocket | `shared/lib/hooks/useWebSocket.ts` |
| Tailwind CSS | `shared/ui/` component styling |
| CSS Modules | Widget & feature scoped styles |
| @poker/shared | Domain types used by entities layer |

---

## 📊 Complexity Scaling

### Current State (Simple):
- Local state with React Context
- Direct API calls with axios
- Basic routing

### Future Enhancements:
- Add Zustand/Redux for complex state → `entities/*/model/store.ts`
- Add WebSocket real-time → `shared/lib/hooks/useWebSocket.ts`
- Add i18n → `shared/i18n/` segment
- Add theme system → `shared/theme/` segment
- Add error boundaries → `app/providers/ErrorBoundary.tsx`
- Add analytics → `shared/analytics/` segment

---

## ✅ Checklist

### Structure Setup
- [ ] Rename directories (fix typos)
- [ ] Configure path aliases (tsconfig + vite)
- [ ] Create barrel exports (index.ts) for all segments
- [ ] Setup `shared/api/client.ts`
- [ ] Setup `app/providers/`
- [ ] Setup `app/router/`

### Implementation
- [ ] Build `shared/ui/` atomic components
- [ ] Build `entities/` with UI + model + API
- [ ] Build `features/` with UI + hooks
- [ ] Build `widgets/` composing entities + features
- [ ] Build `pages/` composing widgets
- [ ] Wire up routing in `app/`
- [ ] Connect providers in `App.tsx`

### Quality
- [ ] Add ESLint import rules (enforce layer boundaries)
- [ ] Add TypeScript strict mode
- [ ] Add component tests (shared/ui/)
- [ ] Add integration tests (features/, widgets/)
- [ ] Add e2e tests (pages/)

---

## 📚 Resources

- [Feature-Sliced Design Official Docs](https://feature-sliced.design/)
- [FSD React Tutorial](https://feature-sliced.design/docs/get-started/tutorial)
- [FSD React Query Integration](https://feature-sliced.design/docs/guides/examples/api-clients)

---

**Last Updated:** 2026-04-08
**Version:** 1.0.0
**Architecture:** Feature-Sliced Design (FSD) 2.0
