# The headset probe's "input" step: practice review

The first run with the owner was wasted: the headset showed only a colour while the task sat in the
chat. The `practice-reviewer` brief (`.claude/agents/practice-reviewer.md`), run on the step as it
stood, found that mistake on its own and five more. The rebuild follows this list.

## Findings, most serious first
1. **The task never reaches the headset**: a green field, then a blue one; the words are on the 2D
   page he never sees. Normal: a prompt in the headset that stays until the action is done (Meta,
   developers.meta.com/horizon/design/hands-onboarding-best-practices/); text plus tooltips on the
   virtual controllers helped learning (Kao, Magana and Mousas 2021, PACM HCI 5 CHI PLAY, art. 234,
   doi 10.1145/3474661).
2. **No feedback on a press, no sign of the end**. Controller testers light up the control pressed;
   the vendored A-Frame 1.7.1 `meta-touch-controls` recolours each button when touched and pressed;
   the webxr-input-profiles README: "Update the 3D model to reflect the button, thumbstick, and
   touchpad state."
3. **Fixed 15 s phases** start when the runner presses the button, not when he is ready. Meta:
   "Require players to successfully perform a critical gesture before they can advance."
4. **"Every button" includes the Meta button**, an "OS-level feature" that opens the universal menu
   (developers.meta.com/horizon/design/controllers/); visibility changes are not logged.
5. **The hands phase cannot tell its failures apart**: no hands are drawn; hands come only with the
   headset setting "Auto Enable Hands or Controllers" (developers.meta.com/horizon/resources/vrc-quest-input-7/);
   Meta advises "Explicitly instructing players to put their controllers away".
6. **The end says nothing**: the session drops to a page of JSON.

Minor: the thumbrest reports touch only and is not asked for; the start buzz reaches only controllers
connected at 0.5 s (the 9.10 run pulsed the left only, cause unverified).

## The simplest form
One line of words at a time on a panel about 1 m ahead (canvas text as in `src/engine/panel.js`,
sizes from `docs/research/vr/03c-viewing-text.md`); the real controller models with `meta-touch-controls`,
buttons lighting up as pressed; start on his trigger; one control at a time, the next once its press
is read, a control that never reports skippable (that is what is measured); "except the round Meta
button"; then "put the controllers down", wait for hands, draw them, "move your fingers"; end with
"done, you can take off the headset".
