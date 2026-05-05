# Desk Objects Geometry Audit

## Desk Surface Reference
- **Tabletop**: center `[0, 0.75, 0]`, size `[3.2, 0.08, 1.5]`
- **Desk surface Y**: `0.75 + 0.08/2 = 0.79`
- **Desk bounds**: X `[-1.6, 1.6]`, Z `[-0.75, 0.75]`

---

## 1. InteractiveBooks — group at `[0.75, 0.79, -0.45]`

### Book positions (absolute Y):
| Book | Width | X center | Y center | Z       |
|------|-------|----------|----------|---------|
| 0    | 0.25  | 0.75     | 0.83     | -0.45   |
| 1    | 0.20  | 0.77     | 0.88     | -0.45   |
| 2    | 0.22  | 0.79     | 0.93     | -0.45   |
| 3    | 0.18  | 0.81     | 0.98     | -0.45   |

### Issues found:

**A) Cover opens too wide — clips through desk.**
- Open angle: `-Math.PI * 0.78` ≈ -140° (nearly fully open)
- Cover pivot at left spine edge `[-width/2, 0, 0]`, cover rotates clockwise (rotZ negative)
- At 140°, the right edge of the cover traces an arc that goes downward:
  - Book 0 (width=0.25): right edge at y ≈ `0.83 - 0.64*0.25 = 0.67` — **below desk surface (0.79)**
  - Book 1 (width=0.20): right edge at y ≈ `0.88 - 0.64*0.20 = 0.75` — **below desk surface**
  - Book 2 (width=0.22): right edge at y ≈ `0.93 - 0.64*0.22 = 0.79` — at desk surface exactly
  - Book 3 (width=0.18): right edge at y ≈ `0.98 - 0.64*0.18 = 0.86` — OK, just above

**B) Books are very small relative to the scene.**
- Book widths: 0.18–0.25 on a 3.2-wide desk (5-8% of desk width)
- A typical real book is ~15-20% of desk width → the books are rendered at ~1/3 real scale
- Difficult to see and click, especially from the camera's distance

**C) X-offset cascade is negligible.**
- `index * 0.02` produces only 0.06 total x-spread across 4 books
- With widths 0.18–0.25, the books align almost perfectly on top of each other
- The visual cascade is nearly invisible

**D) Books are at the far back of the desk (z = -0.45).**
- Desk extends from z=-0.75 to z=0.75, so they're in the back third
- Camera is at +Z side, so they're partially occluded by other desk objects

---

## 2. CoffeeMachine — `[1.4, 0.79, 0.05]`

- Body: `[0, 0.25, 0]` within group → absolute y center = 1.04
- Body size: `[0.35, 0.5, 0.3]`, bottom at y=0.79 ✓ (correctly offset by +0.25 = half height)
- Water tank at `[0.2, 0.25, 0]` relative → absolute x = 1.6
- Tank width: 0.12 → x-range `[1.54, 1.66]`

**Issue: Water tank clips 0.06 beyond desk right edge (desk edge at x=1.6).**

---

## 3. Headphones — `[0.4, 0.79, 0.15]`

- Stand: cylinder `[0.025, 0.04, 0.3, 8]` at local `[0,0,0]`
- Stand extends from y = 0.79-0.15 = **0.64** to 0.79+0.15 = 0.94

**Issue: Stand bottom at y=0.64 is 0.15 below desk surface (0.79). Clips through desk.**

---

## 4. Notepad — `[-0.3, 0.8, -0.2]`

- Notepad body: `[0.25, 0.015, 0.35]` at local origin
- Bottom at y = 0.8 - 0.0075 = 0.7925, just above desk (0.79) ✓
- Pen: cylinder `[0.008, 0.008, 0.2]` at `[0.18, 0.01, 0]`
- Pen bottom: 0.8 + 0.01 - 0.1 = **0.71** — below desk surface

**Minor issue: Pen clips through desk, but hidden from view (embedded in desk geometry).**

---

## 5. CoffeeMug — `[-0.7, 0.79, 0.15]`

- Mug cylinder: `[0.05, 0.045, 0.1, 16]` at local `[0,0,0]`
- Bottom: 0.79 - 0.05 = **0.74** 

**Issue: Mug bottom at y=0.74 is 0.05 below desk surface. Clips through desk.**

---

## 6. Plant — `[-1.4, 0.79, 0.35]`

- Pot cylinder: `[0.07, 0.055, 0.09, 12]` at local `[0,0,0]`
- Bottom: 0.79 - 0.045 = **0.745**

**Issue: Pot bottom at y=0.745 is 0.045 below desk surface. Clips through desk.**

---

## 7. DeskLamp — `[-1.65, 0.79, -0.55]`

- Base cylinder: `[0.12, 0.14, 0.03]` at local `[0,0,0]`
- Bottom: 0.79 - 0.015 = **0.775**

**Issue: Lamp base at y=0.775 is 0.015 below desk surface. Slight clip.**

---

## Summary of Clipping Issues

| Object       | Bottom Y | Desk Y | Clip Depth | Severity |
|-------------|----------|--------|------------|----------|
| Headphones  | 0.64     | 0.79   | **0.15**   | 🔴 HIGH  |
| CoffeeMug   | 0.74     | 0.79   | **0.05**   | 🟡 MED   |
| Plant pot   | 0.745    | 0.79   | **0.045**  | 🟡 MED   |
| DeskLamp    | 0.775    | 0.79   | **0.015**  | 🟢 LOW   |
| Notepad pen | 0.71     | 0.79   | **0.08**   | 🟢 LOW (hidden) |
| Book cover (book 0) | 0.67 | 0.79 | **0.12** | 🔴 HIGH (when open) |
| Book cover (book 1) | 0.75 | 0.79 | **0.04** | 🟡 MED (when open) |
| CoffeeMachine tank | x=1.66 | x=1.6 | **0.06** beyond edge | 🟡 MED |

## Visibility / Scale Issues

| Object | Issue |
|--------|-------|
| Books  | Too small (0.18-0.25 wide on 3.2 desk). Hard to see/click. Cascade x-offset (0.02) nearly invisible. At far back of desk (z=-0.45). |
| Books  | Open angle 140° is too wide — cover swings past flat and clips desk. Should be ~110-120° max. |
