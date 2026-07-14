import { BuilderProvider } from './state/BuilderContext';
import { Builder } from './components/Builder';
import { ReviewPanel } from './components/ReviewPanel';
import s from './App.module.css';

export default function App() {
  return (
    <BuilderProvider>
      <main className={s.page}>
        <h1 className={s.pageTitle}>Let&rsquo;s get started!</h1>
        <div className={s.layout}>
          <div className={s.builderCol}>
            <Builder />
          </div>
          <div className={s.panelCol}>
            <ReviewPanel />
          </div>
        </div>
      </main>
    </BuilderProvider>
  );
}
