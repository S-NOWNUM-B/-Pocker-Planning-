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
import styles from './OnboardingPage.module.css';

export function OnboardingPage() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Poker Planning</h1>
        <p className={styles.subtitle}>
          Инструмент для оценки задач в Agile-командах с помощью Planning Poker
        </p>
        <div className={styles.actions}>
          <Link to="/create-room" className={styles.buttonPrimary}>
            Начать бесплатно
          </Link>
          <Link to="/login" className={styles.buttonSecondary}>
            Войти
          </Link>
        </div>
      </section>

      <section className={styles.features}>
        <h2>Почему Poker Planning?</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.feature}>
            <h3>Совместная оценка</h3>
            <p>
              Вся команда оценивает задачи одновременно, что устраняет предвзятость
              и даёт более точные оценки.
            </p>
          </div>
          <div className={styles.feature}>
            <h3>В реальном времени</h3>
            <p>
              WebSocket-соединение обеспечивает мгновенную синхронизацию голосов
              между всеми участниками.
            </p>
          </div>
          <div className={styles.feature}>
            <h3>Гибкие колоды</h3>
            <p>
              Поддержка классической последовательности Фибоначчи, T-shirt размеров
              и пользовательских колод.
            </p>
          </div>
          <div className={styles.feature}>
            <h3>История сессий</h3>
            <p>
              Все результаты сохраняются и доступны для анализа и экспорта
              в любое время.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.howItWorks}>
        <h2>Как это работает</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <span className={styles.stepNumber}>1</span>
            <p>Создайте комнату и поделитесь ссылкой с командой</p>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNumber}>2</span>
            <p>Обсудите задачу и выберите карту с оценкой</p>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNumber}>3</span>
            <p>Откройте результаты и обсудите расхождения</p>
          </div>
        </div>
      </section>
    </div>
  );
}
