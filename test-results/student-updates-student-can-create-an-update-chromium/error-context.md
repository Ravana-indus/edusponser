# Page snapshot

```yaml
- dialog "Create New Update":
  - heading "Create New Update" [level=2]
  - paragraph: Share your progress and achievements with your sponsor
  - text: Title
  - textbox "Title": My Progress
  - text: Type
  - combobox "Type":
    - option "Academic" [selected]
    - option "Project"
    - option "Personal"
    - option "Milestone"
  - text: Content
  - textbox "Content": Made great progress this week.
  - button "Create Update"
  - button "Cancel"
  - button "Close"
```