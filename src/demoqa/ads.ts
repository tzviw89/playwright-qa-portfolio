import type { BrowserContext } from '@playwright/test';

/**
 * DemoQA serves third-party ads that often sit over form controls.
 * Abort those requests so overlays never mount, instead of sleeping
 * or force-clicking through them.
 */
const AD_URL =
  /googlesyndication\.com|doubleclick\.net|googletagservices\.com|googletagmanager\.com|googleadservices\.com|securepubads\.|pagead2\.|adsrvr\.org|amazon-adsystem\.com|adnxs\.com|criteo\.com|openx\.net|pubmatic\.com|ad\.plus/i;

export async function blockDemoQaAds(context: BrowserContext): Promise<void> {
  await context.route(AD_URL, (route) => route.abort());
}
