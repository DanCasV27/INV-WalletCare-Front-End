import { Page } from '@playwright/test';

export async function waitForNotification(page: Page, text?: string) {
  const notification = page.locator('.ant-notification-notice');
  await notification.waitFor({ state: 'visible' });
  if (text) {
    await notification.filter({ hasText: text }).waitFor({ state: 'visible' });
  }
  return notification;
}
