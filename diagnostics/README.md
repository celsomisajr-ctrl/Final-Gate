# iPhone audio diagnosis — behavior fix pending device trace

Target: https://celsomisajr-ctrl.github.io/Final-Gate/. Public HTML matched repository base 5e45936 byte-for-byte (SHA256 f6da5b3dd7465f5d9e9503e7c5d093576dbd8f51e04420e4aa9a0949fc794ae9). User reports iPhone 13 Pro, iOS 26.6.2, silent even with Silent Mode off. The OS version is user-reported.

## Instrumentation

Open the instrumented build with ?sfxdebug=1. Console entries use [Final Gate SFX]. window.__finalGateSFX exposes a bounded 250-entry events buffer and snapshot(). It records context creation/state changes/currentTime, resume requests/success/rejection, errors, app mute, user activation and trusted gesture events, play attempts, skipped reasons and successful scheduling. It reports hardware mute as unobservable; running/scheduled does not prove audible speaker output. Diagnostics are opt-in, memory-only and do not transmit data. No extra AudioContext or audible node is created by diagnostics. Gameplay and UI are untouched.

The diagnostics-only baseline browser traces are from desktop Chromium and desktop WebKit 26.0 with iPhone 13 Pro touch emulation. Both reach running and schedule sound after SOUND off/on. They do not reproduce physical-iPhone silence, and cannot certify audible iOS playback. Four deterministic module tests expose the existing first-created-suspended race, interrupted-state omission, logged resume rejection and retained desktop/mute behavior. Run node --test tests/sfx-diagnostics.cjs.

## Physical iPhone evidence still required

Diagnostics-only commit 5a79169 was published with PO approval on 4 November 2026. Open https://celsomisajr-ctrl.github.io/Final-Gate/?sfxdebug=1 in a fresh Safari tab. On a Mac connected to that iPhone, enable the iPhone Safari Web Inspector and use Safari Develop > iPhone > Final Gate. Inspect the console while selecting a hero, toggling SOUND off/on, entering a fight, and after background/foreground. Confirm audible or silent at each step and report the actual iOS version from Settings.

Export from the remote inspector:

```js
JSON.stringify({snapshot:window.__finalGateSFX.snapshot(),events:window.__finalGateSFX.events},null,2)
```

Interpretation: context-not-running plus suspended/interrupted and resume result isolates unlock/resume; muted isolates saved application state; create/play failure exposes its error. A running advancing audio clock plus play-scheduled with continued physical silence points beyond the simple state guard to the device/audio route; do not claim a gesture fix resolves it without the device result.

## Home Screen-specific follow-up

The user confirms Safari audio works but the installed Home Screen app is silent immediately. This supersedes the earlier assumption that all iPhone Safari execution is silent. The manifest start_url is ./, so an installed launch need not retain the diagnostic query from the Safari tab. There is no service worker in this repository to attribute this to a service-worker cache. Saved finalgate.v1 app mute state must be inspected in the installed context rather than inferred from the Safari tab.

Use the Home Screen app, not the Safari tab, as the Web Inspector target. In its console, enable the published diagnostics with a same-app navigation:

```js
location.search = '?sfxdebug=1&build=5a79169';
```

After it reloads, toggle SOUND off/on and enter a fight. Export from that same inspected app:

```js
JSON.stringify({
  standalone: navigator.standalone,
  displayMode: matchMedia('(display-mode: standalone)').matches ? 'standalone' : matchMedia('(display-mode: fullscreen)').matches ? 'fullscreen' : 'browser',
  url: location.href,
  snapshot: window.__finalGateSFX?.snapshot(),
  events: window.__finalGateSFX?.events
}, null, 2)
```

Expected: standalone true for the iOS Home Screen app, and a defined diagnostic snapshot/events. Do not delete/reinstall the app or clear storage before capturing this trace. The Home Screen silence is confirmed by the user's listening report; its context/mute/resume state is still unknown. WebKit bug 291892 reports superficially similar standalone silence, including iPhone 13 Pro, but commonly after reopening and cannot establish this immediately-silent launch's root cause: https://bugs.webkit.org/show_bug.cgi?id=291892.

## Proposed minimal fix after diagnosis

Keep one existing context and graph. Within trusted touchend/pointerup and existing click/keyboard handlers, explicitly resume new or suspended/interrupted contexts and start a one-frame silent buffer synchronously in the gesture if the trace confirms an unlock problem. Keep retries possible even if an earlier resume is pending. Wire SOUND unmute and the Fight/Start Game control directly; the full-screen handler needs an unlock before its awaits and 250ms timer. Play only those control confirmation cues after successful resume, preserving mute intent and avoiding delayed combat-sound queues. Preserve the existing voice/rate limits and synthesis. Do not introduce extra contexts, change gameplay timing, force audioSession policy, or mask resume failures. Verify real iPhone audibility and desktop regression afterward.

WebKit's user activation documentation distinguishes mouse pointerdown from touch pointerup/touchend: https://webkit.org/blog/13862/the-user-activation-api/. This supports a hypothesis, not a confirmed diagnosis of this phone. Behavior changes are intentionally pending physical-device evidence per the user's instruction to diagnose first.
