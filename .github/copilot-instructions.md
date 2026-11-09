# Правила проекта «Сипсик Love»

Telegram Mini App. Эти правила **обязательны** для любого кода в репозитории. Если задача противоречит правилу — остановись
и спроси, а не нарушай его молча.

## Стек (не менять и не добавлять альтернативы)

- **UI:** Vue 3, только Composition API + TypeScript: `<script setup lang="ts">`. Options API, `defineComponent({...})`
  с объектом опций, JS-файлы — запрещены.
- **Состояние:** Pinia (setup-stores). **Роутинг:** vue-router (hash history, `src/app/router.ts`).
- **Компоненты:** shadcn-vue (reka-ui) из `src/shared/ui/*`, кастомизированные под бренд. Новые примитивы добавлять через
  shadcn-vue и сразу адаптировать к бренд-токенам.
- **Стили:** Tailwind v4 + бренд-токены из `src/assets/main.css`.
- **Персонаж и игровая графика:** Pixi.js v8 (WebGL) в `src/game/**`. **Никакого SVG/DOM/CSS-рисования персонажа.**
- **Тулчейн VoidZero:** Vite+ (`vp`), Rolldown (бандлер), Oxc (`vp lint` = oxlint, `vp fmt` = oxfmt). Не добавлять
  ESLint, Prettier, Webpack, Babel, Jest и т.п.
- **Пакетный менеджер:** pnpm (версия зафиксирована в `devEngines`).

## Стили — строго

- **Запрещены инлайн-стили** (`style="..."`, `:style`) и `<style>`-блоки в компонентах. Единственное исключение —
  динамический transform в shadcn `Progress.vue`.
- Цвета — **только через токены**, никаких хексов/`rgb()`/`[#...]` в классах:
  семантические `bg-primary` (navy), `text-primary-foreground`, `bg-secondary` (peach), `bg-accent` (peach-soft),
  `bg-muted` (mist), `text-muted-foreground`, `text-destructive`, `border-primary`, и брендовые `navy navy-2 paper
  mist grey peach peach-soft peach-ink sky butter butter-edge`. Новый цвет → сначала токен в `main.css`.
- **Без «каши» из классов.** Если длинный набор классов повторяется — вынеси в маленький компонент или в `cva`-вариант
  (как в `src/shared/ui/*/index.ts`). Сначала ищи готовый вариант (`Button`, `Card` tone, `Badge`, `Toggle`…).
- Сливать классы через `cn()` из `src/shared/lib/utils.ts`.
- Цвета для Pixi (WebGL) живут в `src/game/theme.ts` и `src/game/character/palettes.ts`, не в компонентах.

## Архитектура и слои

```
src/
  domain/    чистый TS: типы, правила, даты, каталоги. Без Vue, Pixi, DOM, сети.
  services/  границы с внешним миром: api (Supabase), telegram, storage, notify, photo.
  stores/    Pinia: session, taps, sheets — общее состояние и синхронизация.
  game/      Pixi.js: engine (GameStage, SceneManager, Scene, tweens), scenes, character, art, ui, thumbnails,
             vue/ (CatStage, CharacterThumb — единственный мост Vue ↔ Pixi).
  shared/    ui (shadcn), components (общие), composables, lib, config.
  features/  экраны по фичам (us, wishlist, home, calendar, places, care, notes, coats, settings, onboarding, status).
  app/       оболочка: App.vue, router, AppShell, BottomNav, SheetHost, useLiveSync.
```

- Направление зависимостей: `app → features → (shared, stores, game/vue) → services → domain`. `domain` ни от чего не
  зависит. Фича не импортирует внутренности другой фичи (общее — переносить в `shared`/`domain`/`stores`).
- Импорты через алиас `@/…`.
- **Маленькие компоненты с одной ответственностью.** Логика — в composables/stores/domain, не в шаблонах.
- Нижние шторки: открывать через `useSheetsStore().open(kind, props)`, рендерит `SheetHost`; компонент шторки содержит
  только контент и обязательно `SheetTitle`.
- Изменения состояния пары — через `session.act` / `session.mutate` (оптимистично), сеть — через типизированный
  `call()` из `src/services/api/client.ts`, контракт — `src/services/api/contract.ts`.
- Конфиг окружения — только в `src/shared/config.ts` (`VITE_API_URL`, `VITE_BOT_USERNAME` с боевыми дефолтами).
  Не хардкодить URL/имена в фичах. Секреты во фронтенд не класть.

## WebGL / игра

- Код пишется так, чтобы вырасти в игру: сцены (`Scene`) через `SceneManager`, персонаж — композиция частей
  (`character/*`), декларативный арт (`art/*`), анимации — через `engine/tweens`.
- **На экране максимум один `CatStage`** (один WebGL-контекст). Для маленьких статичных картинок (лица, предметы,
  облики) — `CharacterThumb` (рендер в `<img>` через общий `ThumbnailRenderer`).
- Корректно освобождать ресурсы Pixi (`destroy`) при размонтировании.
- Новые облики: id в `src/domain/coats.ts` + палитра в `src/game/character/palettes.ts` (+ паттерн при необходимости).

## TypeScript и стиль кода

- `strict`, `noUncheckedIndexedAccess`, `erasableSyntaxOnly`: **никаких `enum`** (используй `as const` + union),
  никаких parameter properties в конструкторах, **никаких `any`** и лишних `as`.
- Исчерпывающие `switch` по union-типам.
- Современные паттерны: composables (`useXxx`), `defineProps`/`defineEmits`/`defineModel` с типами, `computed`
  вместо дублирующего состояния, `@vueuse/core` вместо самописных утилит.
- Отправка по Enter — через `<form @submit.prevent>`, а не `keydown`-обработчики.
- Комментарии — только там, где код неочевиден.
- Тексты интерфейса — на русском, с типографикой (« », —, …) как в существующих экранах.

## Проверка перед завершением задачи

```
pnpm typecheck   # vue-tsc -b
pnpm lint        # vp lint (oxlint)
pnpm fmt         # vp fmt (oxfmt)
pnpm build       # vue-tsc -b && vp build → dist/
```

Всё должно проходить без ошибок и предупреждений.

## Деплой

- GitHub Pages через `.github/workflows/deploy.yml` (ручной запуск из `main`, вход `version`: `new` — сборка ветки
  `refactor` в `dist`, `legacy` — старая версия с `main`).
- `base: "./"` в `vite.config.ts` и hash-роутер обязательны — сайт живёт по подпути `/sipsik-love/`.
- Поддерживать `README.md` в актуальном состоянии при изменении стека, команд, архитектуры или деплоя.
