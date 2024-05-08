import { Browser, Page } from "puppeteer";

export function isBlank(v: string | undefined | null): boolean {
  if (v === undefined) {
    return true;
  }

  if (v === null) {
    return true;
  }

  if (v === "") {
    return true;
  }

  return false;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function handleMultiplePages<T>(
  browser: Browser,
  iterate: number,
  func: (page: Page, pageNumber: number) => Promise<T>
) {
  const promiseResults = await Promise.allSettled(
    [...Array(iterate)].map(async (_, index) => {
      let newPage;
      const pageNumber = index + 1;
      try {
        newPage = await browser.newPage();
        const data = await func(newPage, pageNumber);
        return { ok: true, data };
      } catch (e) {
        console.error("Error Occurred", e);
        console.error("page number ===> ", pageNumber);
        throw e;
      } finally {
        newPage?.close();
      }
    })
  );

  const result = promiseResults.map((r) => {
    if (r.status === "fulfilled") {
      return r.value.data;
    } else {
      return [];
    }
  });

  return result.flat();
}
