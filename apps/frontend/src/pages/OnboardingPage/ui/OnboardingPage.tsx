/**
 * Приветственная (onboarding) страница — точка входа в приложение.
 *
 * Расположена на маршруте /. Содержит:
 *  - Hero-секцию с названием проекта и CTA-кнопками
 *  - Блок преимуществ (совместная оценка, реальное время, гибкие колоды, история)
 *  - Секцию «Как это работает» (3 шага)
 *
 * Кнопки ведут на /create-room (быстрый старт) и /login (авторизация).
 */
import { Link } from 'react-router-dom';

export function OnboardingPage() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-300 p-4 md:p-8">
      <section className="py-16 text-center">
        <h1 className="mb-4 text-[2rem] font-bold text-foreground md:text-[3rem]">
          Poker Planning
        </h1>
        <p className="mx-auto max-w-150 text-base text-muted-foreground md:text-xl">
          Инструмент для оценки задач в Agile-командах с помощью Planning Poker
        </p>
        <div>
          <Link
            to="/create-room"
            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-medium text-white transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            Быстрый старт
          </Link>
          <Link
            to="/about"
            className="mt-8 ml-4 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-secondary px-6 font-medium text-foreground transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            Узнать больше
          </Link>
        </div>
      </section>

      <section className="text-center">
        <h2 className="mb-8 text-[2rem] text-foreground">Почему Poker Planning?</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-8">
          <div className="rounded-xl border border-border bg-secondary p-6">
            <h3 className="mb-3 text-xl text-foreground">Совместная оценка</h3>
            <p className="leading-relaxed text-muted-foreground">
              Вся команда оценивает задачи одновременно, что устраняет предвзятость и даёт более
              точные оценки.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-secondary p-6">
            <h3 className="mb-3 text-xl text-foreground">В реальном времени</h3>
            <p className="leading-relaxed text-muted-foreground">
              WebSocket-соединение обеспечивает мгновенную синхронизацию голосов между всеми
              участниками.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-secondary p-6">
            <h3 className="mb-3 text-xl text-foreground">Гибкие колоды</h3>
            <p className="leading-relaxed text-muted-foreground">
              Поддержка классической последовательности Фибоначчи, T-shirt размеров и
              пользовательских колод.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-secondary p-6">
            <h3 className="mb-3 text-xl text-foreground">История сессий</h3>
            <p className="leading-relaxed text-muted-foreground">
              Все результаты сохраняются и доступны для анализа и экспорта в любое время.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 text-center">
        <h2 className="mb-8 text-[2rem] text-foreground">Как это работает</h2>
        <div className="flex flex-wrap justify-center gap-8 max-md:flex-col max-md:items-center">
          <div className="max-w-75 min-w-50 flex-1 text-center">
            <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
              1
            </span>
            <p className="leading-relaxed text-muted-foreground">
              Создайте комнату и поделитесь ссылкой с командой
            </p>
          </div>
          <div className="max-w-75 min-w-50 flex-1 text-center">
            <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
              2
            </span>
            <p className="leading-relaxed text-muted-foreground">
              Обсудите задачу и выберите карту с оценкой
            </p>
          </div>
          <div className="max-w-75 min-w-50 flex-1 text-center">
            <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
              3
            </span>
            <p className="leading-relaxed text-muted-foreground">
              Откройте результаты и обсудите расхождения
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
