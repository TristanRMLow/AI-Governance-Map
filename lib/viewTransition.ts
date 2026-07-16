import type { useRouter } from "next/navigation";

type Router = ReturnType<typeof useRouter>;

/** Wraps a route push in the View Transition API when the browser supports it,
 * so navigating from the map into a country page cross-fades instead of hard-cutting. */
export function navigateWithTransition(router: Router, href: string) {
  if (typeof document.startViewTransition === "function") {
    document.startViewTransition(() => router.push(href));
  } else {
    router.push(href);
  }
}
