import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

function getApiResponse({ page, url }: { page: Page; url: string }): Promise<{ status: number; json: any }> {
  return page.evaluate(async (url) => {
    const response = await fetch(url);
    const json = await response.json();
    return { status: response.status, json };
  }, url);
}

test.describe("with-multiple", () => {
  const baseUrl = "http://localhost:3001";

  test("it can fetch a response from API one", async ({ page }) => {
    const url = `${baseUrl}/api-one/pets`;
    await page.goto(baseUrl);
    const { status, json } = await getApiResponse({ page, url });
    expect(status).toEqual(200);
    expect(Array.isArray(json)).toEqual(true);
    expect(Object.values(json[0]).length).toEqual(3);
  });

  test("it can fetch a response from API two", async ({ page }) => {
    const url = `${baseUrl}/api-two/pets/123`;
    await page.goto(baseUrl);
    const { status, json } = await getApiResponse({ page, url });
    expect(status).toEqual(200);
    expect(Object.values(json).length).toEqual(3);
  });
});

test.describe("with-nuxt", () => {
  const baseUrl = "http://localhost:3002";
  test("it can fetch a response from API one", async ({ page }) => {
    const url = `${baseUrl}/api/pets`;
    await page.goto(baseUrl);
    const { status, json } = await getApiResponse({ page, url });
    expect(status).toEqual(200);
    expect(Array.isArray(json)).toEqual(true);
    expect(Object.values(json[0]).length).toEqual(3);
  });
});

test.describe("with-vite", () => {
  const baseUrl = "http://localhost:3003";
  test("it can fetch a response from API one", async ({ page }) => {
    const url = `${baseUrl}/api/pets`;
    await page.goto(baseUrl);
    const { status, json } = await getApiResponse({ page, url });
    expect(status).toEqual(200);
    expect(Array.isArray(json)).toEqual(true);
    expect(Object.values(json[0]).length).toEqual(3);
  });
});

test.describe("with-interceptors-vite", () => {
  const baseUrl = "http://localhost:3004";

  test("it can fetch a response from API one", async ({ page }) => {
    const url = `${baseUrl}/api/pets`;
    await page.goto(baseUrl);
    const { status, json } = await getApiResponse({ page, url });
    expect(status).toEqual(200);
    expect(Array.isArray(json)).toEqual(true);
    expect(Object.values(json[0]).length).toEqual(4);
    expect(json[0].name).toEqual("Rambo");
    expect(json[0].goodBoy).toEqual(true);
  });

  test("it can fetch a response from findPets", async ({ page }) => {
    const url = `${baseUrl}/api/pets/123`;
    await page.goto(baseUrl);
    const { status, json } = await getApiResponse({ page, url });
    expect(status).toEqual(200);
    expect(json).toEqual("Hello world!");
  });

  test("it can fetch a response from operation with query string parameter", async ({ page }) => {
    const url = `${baseUrl}/api/pets?limit=1`;
    await page.goto(baseUrl);
    const { status, json } = await getApiResponse({ page, url });
    expect(status).toEqual(200);
    expect(Array.isArray(json)).toEqual(true);
    expect(Object.values(json[0]).length).toEqual(4);
    expect(json[0].name).toEqual("Rambo");
    expect(json[0].goodBoy).toEqual(true);
  });
});
