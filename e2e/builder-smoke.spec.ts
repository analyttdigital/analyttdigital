import { expect, test } from "@playwright/test";

/**
 * Builder smoke tests (M9.3). Exercises the real publish path end to end:
 * API create → API publish → public render → API delete. Runs against a
 * throwaway dev instance (dev bypass auth); builder JSON is cleaned up, but
 * `public/uploads` is untouched (media tests never upload here).
 */

const slug = `e2e-${Date.now()}`;

const pageDoc = {
  schemaVersion: 1,
  meta: {
    title: "E2E smoke",
    description: "Playwright smoke test page",
    path: `/${slug}`,
    layout: "default",
    ogImage: "",
  },
  puck: {
    content: [
      {
        type: "Heading",
        props: {
          text: "Hello E2E",
          level: "h2",
          size: "3xl",
          align: "left",
          color: "text",
          font: "heading",
        },
      },
    ],
    root: { props: {} },
    zones: {},
  },
  draft: false,
};

test("admin dashboard loads", async ({ page }) => {
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Pages" })).toBeVisible();
});

test("publish flow renders at the public URL", async ({ request, page }) => {
  const create = await request.post("/api/builder/pages", { data: { slug } });
  expect(create.ok()).toBeTruthy();

  const put = await request.put("/api/builder/page", { data: { slug, data: pageDoc } });
  expect(put.ok()).toBeTruthy();

  await page.goto(`/p/${slug}`);
  await expect(page.getByRole("heading", { name: "Hello E2E" })).toBeVisible();

  const remove = await request.delete(`/api/builder/pages?slug=${slug}`);
  expect(remove.ok()).toBeTruthy();
});

test("sitemap serves XML", async ({ request }) => {
  const res = await request.get("/sitemap.xml");
  expect(res.ok()).toBeTruthy();
  expect(await res.headers()).toMatchObject({ "content-type": expect.stringContaining("xml") });
  expect(await res.text()).toContain("<urlset");
});
