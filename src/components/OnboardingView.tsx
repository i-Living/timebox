/**
 * @fileoverview Onboarding screen that introduces the TimeBox app workflow to new users.
 * Displays step-by-step instructions and a "Start" button to proceed.
 */

import { Clock, Calendar, ClipboardList, Pen } from 'lucide-react';
import { Button } from './Button';

interface Props {
  onDone: () => void;
}

/**
 * OnboardingView component - renders the welcome screen with app instructions.
 * @param {Props} props - Component props
 * @param {() => void} props.onDone - Callback when user clicks "Start" button
 */
export function OnboardingView({ onDone }: Props) {
  return (
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 24px;text-align:center;">
      <div style="margin-bottom:16px;color:var(--primary);"><Clock size={56} /></div>
      <h1 style="font-size:24px;font-weight:700;margin-bottom:8px;">Добро пожаловать в TimeBox</h1>
      <p style="font-size:15px;color:var(--text-secondary);line-height:1.6;max-width:320px;margin-bottom:32px;">
        Приложение для записи клиентов на свободные временные слоты. Всё хранится в вашем браузере — сервер не нужен.
      </p>

      <div style="display:flex;flex-direction:column;gap:16px;width:100%;max-width:320px;">
        <div style="display:flex;align-items:flex-start;gap:12px;text-align:left;">
          <span style="flex-shrink:0;color:var(--primary);"><Calendar size={24} /></span>
          <div>
            <strong>Создайте окно</strong>
            <div style="font-size:13px;color:var(--text-secondary);">Нажмите «＋ Окно», задайте дату, время и вместимость</div>
          </div>
        </div>
        <div style="display:flex;align-items:flex-start;gap:12px;text-align:left;">
          <span style="flex-shrink:0;color:var(--primary);"><ClipboardList size={24} /></span>
          <div>
            <strong>Поделитесь</strong>
            <div style="font-size:13px;color:var(--text-secondary);">Скопируйте текст со свободными окнами и отправьте клиенту</div>
          </div>
        </div>
        <div style="display:flex;align-items:flex-start;gap:12px;text-align:left;">
          <span style="flex-shrink:0;color:var(--primary);"><Pen size={24} /></span>
          <div>
            <strong>Запишите клиента</strong>
            <div style="font-size:13px;color:var(--text-secondary);">По его ответу добавьте его в слот вручную</div>
          </div>
        </div>
      </div>

      <Button style="margin-top:32px;padding:14px 48px;font-size:17px;" onClick={onDone}>
        Начать
      </Button>

      <div style="margin-top:24px;font-size:12px;color:var(--text-secondary);">
        Данные хранятся только в этом браузере
      </div>
    </div>
  );
}