import { expect, test } from "@playwright/test";

test.describe("with-multiple", () => {
  test("it can fetch a response from API one", async ({ page }) => {
    await page.goto("http://localhost:3001/api-one/pets");
    const responseOne = await page.textContent("body");

    if (responseOne) {
      const jsonOne = JSON.parse(responseOne);
      expect(Array.isArray(jsonOne)).toEqual(true);
    } else {
      expect(responseOne).not.toEqual(null);
    }
  });

  test("it can fetch a response from API two", async ({ page }) => {
    await page.goto("http://localhost:3001/api-two/pets/123");
    const responseTwo = await page.textContent("body");

    if (responseTwo) {
      const jsonTwo = JSON.parse(responseTwo);
      expect(Object.values(jsonTwo).length).toEqual(3);
    } else {
      expect(responseTwo).not.toEqual(null);
    }
  });
});

test.describe("with-nuxt", () => {
  test("it can fetch a response from api", async ({ page }) => {
    await page.goto("http://localhost:3002/api/pets");
    const responseOne = await page.textContent("body");
    if (responseOne) {
      const jsonOne = JSON.parse(responseOne);
      expect(Array.isArray(jsonOne)).toEqual(true);
    } else {
      expect(responseOne).not.toEqual(null);
    }
  });
});

test.describe("with-vite", () => {
  test("it can fetch a response from api", async ({ page }) => {
    await page.goto("http://localhost:3003/api/pets");
    const responseOne = await page.textContent("body");
    if (responseOne) {
      const jsonOne = JSON.parse(responseOne);
      expect(Array.isArray(jsonOne)).toEqual(true);
    } else {
      expect(responseOne).not.toEqual(null);
    }
  });
});
