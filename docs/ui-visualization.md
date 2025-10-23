# UI Enhancements Spec — Floating Form, Sorting, Searching

This document outlines the UX and implementation plan to improve the Campaign Dashboard visualization while keeping the core architecture (App as container, presentational children) intact.

## Goals
- Make the Campaign form “floating” (doesn’t consume page layout space) and hidden by default.
- Add an obvious entry point to create campaigns (Add button or +) in the grid’s toolbar.
- Support sorting by column and searching campaigns.
- Maintain accessibility (keyboard, screen-readers) and responsiveness.

## User Experience

### 1) Floating Campaign Form
- Hidden by default; no vertical space taken in the layout.
- Triggered by a primary “Add Campaign” button with a + icon in the grid toolbar (top-right).
- Appears as a centered modal overlay (preferred), or optionally as a right-side drawer.
  - Use an overlay backdrop to focus attention and prevent background interaction.
  - Trap focus within the form while open; return focus to the Add button on close.
  - Dismiss via:
    - Cancel button
    - Pressing Escape
    - Clicking outside the modal (overlay)
- Responsive layout:
  - Max-width ~640–720px on desktop; full-width on small screens with comfortable padding.
  - Vertical scrolling within form if content exceeds viewport height.
- Accessibility:
  - role="dialog" aria-modal="true" with a labelled heading.
  - Keyboard focus management and Escape handling.
  - Buttons with clear text labels and aria-labels on icon-only buttons.

### 2) Grid Toolbar
- Left: Search input (placeholder: “Search campaigns…”) with clear (×) affordance.
- Right: Add button (label: “Add Campaign”, icon: +). Keyboard shortcut (optional): Alt+A.
- On small screens, the Add button stacks below or to the left of search to avoid overflow.

### 3) Sorting
- Clickable column headers toggle sort: None → Ascending → Descending.
- Visual indicators: ▲ for ascending, ▼ for descending; aria-sort reflects state.
- Sortable columns: Name (text), Start Date, End Date (date), Clicks (number), Cost (currency), Revenue (currency), Profit (derived).
- Non-sortable: Actions.
- Sorting behavior:
  - Stable sort; re-clicking the same header toggles direction.
  - Derived profit = revenue - cost computed on-the-fly for comparisons.
  - Numeric and currency columns compare numeric values (not formatted strings).
  - Dates sorted by actual date value (ISO strings are naturally sortable, but parsing is safer).

### 4) Searching
- Single search box filters rows in real-time (debounce ~200ms):
  - Matches against campaign name (case-insensitive).
  - Optionally extend to date range or numeric ranges in a later iteration.
- Clear (×) resets the search quickly.
- Search coexists with sorting: filter first, then sort the resulting set.

## Component Design

- App (container):
  - State: campaigns[], editingCampaign, ui state (isFormOpen, sortState, searchQuery).
  - Derived: filteredCampaigns = by search; sortedCampaigns = by sort over filtered.
  - Handlers: handleAdd, handleEdit, handleUpdate, handleDelete, toggleFormOpen, handleSort, handleSearch.
  - Persistence: localStorage for campaigns; optionally persist search/sort in localStorage for convenience.

- Toolbar (new presentational):
  - Props: { searchQuery, onSearchChange, onAddClick }
  - Renders search input and Add (+) button.

- FloatingForm (new presentational wrapper):
  - Props: { isOpen, title, onRequestClose, children }
  - Handles overlay, dialog semantics, escape and outside-click.
  - Contains existing CampaignForm as child; CampaignForm remains presentational.

- CampaignTable (presentational):
  - Props extended: { campaigns, onEdit, onDelete, sortState, onSort }
  - Renders sortable headers with indicators and aria-sort.

## State & Data Flow
- App owns all state and passes props down.
- Profit is derived, not stored.
- Filtering and sorting use useMemo to avoid recomputation on unrelated state changes.

## Styling (CSS Guidelines)
- New classes:
  - .toolbar, .toolbar-left, .toolbar-right
  - .search-input, .add-button
  - .floating-form, .floating-overlay, .floating-content, .floating-close
  - .sortable, .sort-asc, .sort-desc
- Modal overlay: fixed, full-screen, semi-transparent backdrop.
- Floating content: centered card (border radius, shadow, max-width), focus ring on open.
- Maintain existing color semantics for positive/negative profit.

## Accessibility Checklist
- Add button has descriptive text; icon has aria-hidden.
- Modal has role="dialog" + aria-modal="true" + aria-labelledby for title.
- Focus trap inside modal; return focus to trigger on close.
- Escape key closes modal.
- Column headers expose aria-sort with correct value: none | ascending | descending.

## Edge Cases
- Empty dataset: show empty state with an Add button.
- Large datasets: ensure sort/filter are memoized; avoid formatting costs in comparisons.
- Mixed data types: guard against undefined/null values in sort comparators.
- LocalStorage cleared: fall back to sample campaigns.

## Implementation Plan (Phased)
1) Toolbar + Floating shell
   - Create Toolbar and FloatingForm components; wire App state isFormOpen.
   - Move existing CampaignForm into FloatingForm; remove inline form space.
2) Add button behavior
   - Hook Add button to open FloatingForm; close on submit/cancel.
   - Preserve current create/edit logic; edit continues to reuse CampaignForm.
3) Sorting
   - Add sort state { column, direction } in App; implement comparators per type.
   - Add clickable headers and indicators in CampaignTable; aria-sort binding.
4) Search
   - Add searchQuery state; debounce updates; filter by name before sorting.
   - Add clear button.
5) Persistence (optional)
   - Save sort/search UI state to localStorage; restore on mount.
6) Tests
   - Toolbar: render + interactions (Add opens modal, search updates query).
   - Floating form: opens, closes (escape/outside), focus trap (basic assertions), returns focus to trigger.
   - Sorting: toggles asc/desc; numeric/date/derived columns; aria-sort values.
   - Search: filters rows; coexists with sort (order verified after filter).

## Acceptance Criteria
- The Campaign form does not take vertical space when closed.
- Clicking Add opens a floating modal with the CampaignForm; ESC/outside click/Cancel closes it.
- Sorting works on specified columns with visible indicators and correct aria-sort.
- Searching filters campaigns by name; clearing search restores full list.
- All existing CRUD flows continue to work; profit remains derived and correct.
- Automated tests cover the above behaviors.

## Non-Goals (for this iteration)
- Backend/API integration.
- Multi-column sort.
- Advanced filters (date range, numeric range) — candidates for future work.

---

## Wireframes (ASCII)

Toolbar (desktop)

  [ Search: (Search campaigns…) ][        ][ + Add Campaign ]

Mobile (stacked)

  [ Search: (Search campaigns…) ]
  [ + Add Campaign ]

Table with sortable headers

  +-------------------------------------------------------------------------------------+
  | Name ▲ | Start Date | End Date | Clicks ▼ | Cost | Revenue | Profit | Actions      |
  +-------------------------------------------------------------------------------------+
  | …                                                                                   |
  +-------------------------------------------------------------------------------------+

Floating form (modal)

  +--------------------------------------+
  | Add Campaign                  [×]    |  <- role="dialog" aria-modal="true"
  +--------------------------------------+
  |  Name: [_________________________]   |
  |  Start: [____]  End: [____]         |
  |  Clicks: [____]                      |
  |  Cost:   [____]  Revenue: [____]    |
  |                                      |
  |  [ Add ]   [ Cancel ]                |
  +--------------------------------------+

Notes
- Sorting indicators (▲/▼) appear on the active column.
- Profit column is derived and not editable.
- Modal is centered with backdrop; pressing ESC or clicking backdrop closes it.

---

## Testing Guidance — Queries and Selectors

Prefer Testing Library role/label-based queries over data-testid. Only use test IDs when no accessible handle is practical.

Recommended queries
- Toolbar search: getByRole('searchbox', { name: /search campaigns/i }) or getByPlaceholderText(/search campaigns/i)
- Add button: getByRole('button', { name: /add campaign/i })
- Table headers: getByRole('columnheader', { name: /name/i }) etc.; verify aria-sort
- Rows: getAllByRole('row'); within(row).getByText(name)
- Profit cell: within(row).getAllByRole('cell')[6]
- Modal: getByRole('dialog', { name: /add campaign|edit campaign/i })
- Cancel: getByRole('button', { name: /cancel/i })

Optional data-testid map (only if needed)
- toolbar: data-testid="toolbar"
- search: data-testid="toolbar-search"
- add: data-testid="toolbar-add"
- modal container: data-testid="floating-form"
- backdrop: data-testid="floating-overlay"
- table: data-testid="campaign-table"
- rows: data-testid={`row-${id}`}

---

## Keyboard & Focus Behavior (Detailed)

- Add button
  - Enter/Space opens modal
  - Focus moves to the first field in the form

- Floating form (modal)
  - Trap focus within the dialog while open (Tab/Shift+Tab cycle inside)
  - ESC closes and returns focus to Add button
  - Clicking backdrop closes and returns focus to Add button

- Sorting
  - Column headers are buttons or button-like (role="columnheader" plus an interactive control)
  - Enter/Space toggles sort order
  - aria-sort reflects: none | ascending | descending

---

## CSS Class Reference (Proposed)

- Toolbar: .toolbar, .toolbar-left, .toolbar-right, .search-input, .add-button
- Floating: .floating-form, .floating-overlay, .floating-content, .floating-close
- Table: .sortable, .sort-asc, .sort-desc

---

## Open Questions

- Should the Add button be sticky on scroll for large datasets?
- Do we prefer a right-side drawer instead of a centered modal for wide screens?
- Should search include other fields (e.g., dates) in a future iteration?
