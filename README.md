# Сипсик Love

Telegram Mini App для пары: общий котик, вишлист, дом, календарь и места.

📖 **Полная и подробная спецификация** — что и как работает, структура папок, подходы и куда что добавлять:
[Description.md](Description.md).

## Стек

- **Vue 3** (Composition API, `<script setup lang="ts">`), **Pinia**, **vue-router** (hash history)
- **shadcn-vue** (reka-ui) + **Tailwind v4**; брендовые токены в `src/assets/main.css`
- **Pixi.js v8** (WebGL): котик и сцены
- **vue-i18n** (Composition API) + `Intl` для дат и чисел; словари в `src/__localization__/`
- Тулчейн VoidZero: **Vite+** (`vp`), **Rolldown** (сборка), **Oxlint** / **Oxfmt** (`vp lint` / `vp fmt`)

## Команды

```sh
pnpm install
pnpm dev          # vp dev
pnpm playground   # приложение в рамке iPhone 13 Pro Max на моках Telegram и API
pnpm build        # vue-tsc -b && vp build
pnpm typecheck
pnpm lint         # oxlint
pnpm fmt          # oxfmt
```

Без Telegram приложение показывает экран «Открой меня в Telegram». Адрес API и имя бота можно переопределить
через `VITE_API_URL` и `VITE_BOT_USERNAME` в `.env.local`.

## Локализация

- `src/__localization__/source_lang.json` — исходные русские тексты; по нему проверяются типы ключей `t()`.
- Переводы — файлы `src/__localization__/<язык>_<РЕГИОН>.json` (`en_US.json`, `ru_RU.json`, `en_GB.json`…) с теми
  же ключами. Новый файл подхватывается автоматически (`import.meta.glob`) и появляется в выборе языка.
- Язык берётся из Telegram (`language_code`), его можно сменить в настройках; выбор хранится в `localStorage` и
  Telegram CloudStorage. Нет файла для языка — английский (`en_*`), нет и его — исходный русский.
- В коде: `t("ключ", { param })`, `tn("ключ", n)` (множественное: формы через `|` в порядке CLDR),
  `session.gendered("ключ")` (варианты `m`/`f`/`n`); даты и время — только через `src/domain/dates.ts`.

## Деплой (GitHub Pages)

Workflow `.github/workflows/deploy.yml` запускается вручную: **Actions → Deploy to GitHub Pages → Run workflow**
(из ветки `main`). Сайт на Pages один, выбери, какая версия будет на нём:

- `new` — собирает это приложение из ветки `refactor` (`pnpm build` → `dist/`);
- `legacy` — публикует старую однофайловую версию из `main` как есть (откат).

В поле `ref` можно указать другую ветку, тег или коммит. CLI: `gh workflow run deploy.yml -f version=legacy`.

## Архитектура

```
src/
  __localization__/  словари: source_lang.json (исходный русский) + <язык>_<РЕГИОН>.json
  domain/      чистый TS: типы, даты, настроение, вещи, шубки, каталоги, i18n-порт `t`/`tn` (без Vue)
  services/    платформа: api (типизированный контракт + клиент), telegram, storage, photo, notify
  stores/      Pinia: session (act / mutate / refresh / ping / boot), taps (батчинг), sheets (реестр шторок),
               locale (выбранный язык)
  game/        WebGL-слой
    art/         декларативный DSL фигур → Pixi Graphics
    character/   котик: палитры, лицо, тело, вещи, композиция
    engine/      GameStage, SceneManager, Scene, твины, easing
    scenes/      HomeScene (котик + реплики); новые сцены добавлять сюда
    thumbnails/  рендер статичных миниатюр в data URL (один общий renderer)
    vue/         CatStage.vue (живая сцена), CharacterThumb.vue (картинка)
  shared/
    ui/          компоненты shadcn, настроенные под бренд (варианты через cva)
    components/  общие компоненты приложения (SegmentedPills, Field, DateField, ListRow…)
    lib/         утилиты (cn, motion)
    locale/      vue-i18n: реестр файлов локалей, запасные языки, правила множественного числа
  features/    экраны и шторки по фичам: us, wishlist, home, calendar, places, care, notes, coats, settings,
               onboarding, status
  app/         App.vue, AppShell, BottomNav, SheetHost, router, live sync
```

### Принципы

- **Поток данных:** экран вызывает `session.mutate(action, payload, apply, okMsg)` для оптимистичных правок или
  `session.act(...)` для блокирующих; ответ сервера заменяет состояние.
- **Вкладка** = роут с двумя именованными view: `band` (тёмная шапка) и `default` (тело страницы). В меню 5 пунктов;
  «Планы» = родительский роут с дочерними разделами Календарь / Места / Желания.
- **Шторки** открываются через `useSheetsStore().open(kind, props)`; новая шторка = компонент + строка в
  `SheetHost.vue` + тип в `stores/sheets.ts`.
- **Новая игровая сцена:** наследник `Scene` (`game/engine/Scene.ts`), показывается через
  `stage.scenes.show(scene)`. На экране одновременно только один `CatStage` (каждый держит свой WebGL-контекст).
- **Стили** только через токены Tailwind и варианты компонентов; без инлайн-стилей.
