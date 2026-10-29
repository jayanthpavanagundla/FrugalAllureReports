# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: Build\apitools.spec.ts >> Agent - Tools >> Test 3 - Create API Tool, add it to Instructions and verify through Test Agent
- Location: tests\Build\apitools.spec.ts:236:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('listbox')
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for getByRole('listbox')

```

```yaml
- region "Notifications alt+T"
- main:
  - button
  - heading "Automation Agent 1791438685885" [level=4]
  - text: /
  - button "v1 · Draft":
    - heading "v1 · Draft" [level=4]
  - button "Test agent":
    - paragraph: Test agent
  - button
  - navigation "Editor views":
    - button "Instructions":
      - paragraph: Instructions
    - button "Variables":
      - paragraph: Variables
    - button "Tools":
      - paragraph: Tools
    - button "Settings":
      - paragraph: Settings
    - button "Automated tests":
      - paragraph: Automated tests
  - heading "Greeting" [level=2]
  - paragraph: Hi, I am Shubh calling from Sarvam, how can I help you today?
  - button "Translations":
    - paragraph: Translations
  - heading "Instructions" [level=2]
  - paragraph: Write the agent prompt. Type / for commands, @ to mention variables or tools.
  - toolbar "Canvas actions":
    - button "Review agent":
      - paragraph: Review agent
  - separator "Resize side panel"
  - heading "Genie" [level=1]
  - button "Chat history"
  - button "Close panel"
  - heading "What's on your mind?" [level=2]
  - button "Rename this agent and tighten the greeting"
  - separator
  - button "Switch the voice to Hindi and slow the pace"
  - separator
  - button "Add a knowledge base for product FAQs"
  - textbox "Message":
    - /placeholder: What's on your mind?
  - button "Send" [disabled]
- alert: Indus by Sarvam
```

# Test source

```ts
  594 |   ).toBeVisible();
  595 | 
  596 |   console.log(
  597 |     `SUCCESS: ${variableName} found in Variables page`,
  598 |   );
  599 | }
  600 | 
  601 | 
  602 | // =========================================================
  603 | // COMPLETE CREATE VARIABLE FROM INSTRUCTIONS FLOW
  604 | // =========================================================
  605 | 
  606 | async createAndVerifyVariableFromInstructions() {
  607 |   // -------------------------------------------------------
  608 |   // STEP 1
  609 |   // Type @ → Create Variable
  610 |   // -------------------------------------------------------
  611 | 
  612 |   const {
  613 |     variableName,
  614 |     defaultValue,
  615 |   } =
  616 |     await this.createVariableFromInstructions();
  617 | 
  618 |   // -------------------------------------------------------
  619 |   // STEP 2
  620 |   // Refresh → type @ → verify variable in dropdown
  621 |   // -------------------------------------------------------
  622 | 
  623 |   await this
  624 |     .refreshAndVerifyCreatedVariableInDropdown(
  625 |       variableName,
  626 |       defaultValue,
  627 |     );
  628 | 
  629 |   // -------------------------------------------------------
  630 |   // STEP 3
  631 |   // Variables → verify same variable exists
  632 |   // -------------------------------------------------------
  633 | 
  634 |   await this
  635 |     .verifyCreatedInstructionVariableInVariablesPage(
  636 |       variableName,
  637 |       defaultValue,
  638 |     );
  639 | 
  640 |   return {
  641 |     variableName,
  642 |     defaultValue,
  643 |   };
  644 | }
  645 | // =========================================================
  646 | // ADD TOOL TO INSTRUCTIONS
  647 | // =========================================================
  648 | 
  649 | async addToolToInstructions(
  650 |   toolName: string,
  651 | ) {
  652 |   await this.openInstructions();
  653 | 
  654 |   // -------------------------------------------------------
  655 |   // Go to the end of Instructions
  656 |   // -------------------------------------------------------
  657 | 
  658 |   await this.editorCanvas.click();
  659 | 
  660 |   await this.page.keyboard.press(
  661 |     'Control+End',
  662 |   );
  663 | 
  664 |   await this.page.keyboard.press(
  665 |     'Enter',
  666 |   );
  667 | 
  668 |   // -------------------------------------------------------
  669 |   // Add instruction text
  670 |   // -------------------------------------------------------
  671 | 
  672 |   const instructionText =
  673 |     'If the user asks for what jersey is available ';
  674 | 
  675 |   await this.page.keyboard.type(
  676 |     instructionText,
  677 |   );
  678 | 
  679 |   // -------------------------------------------------------
  680 |   // Type @ to open tool / variable dropdown
  681 |   // -------------------------------------------------------
  682 | 
  683 |   await this.page.keyboard.type('@');
  684 | 
  685 |   // -------------------------------------------------------
  686 |   // Wait for dropdown
  687 |   // -------------------------------------------------------
  688 | 
  689 |   const listbox =
  690 |     this.page.getByRole('listbox');
  691 | 
  692 |   await expect(
  693 |     listbox,
> 694 |   ).toBeVisible({
      |     ^ Error: expect(locator).toBeVisible() failed
  695 |     timeout: 15_000,
  696 |   });
  697 | 
  698 |   // -------------------------------------------------------
  699 |   // Find dynamically created tool
  700 |   //
  701 |   // Example:
  702 |   //
  703 |   // toolName = jerseydatabase5637
  704 |   // UI may show = Jerseydatabase5637
  705 |   //
  706 |   // Use case-insensitive regex.
  707 |   // -------------------------------------------------------
  708 | 
  709 |   const escapedToolName =
  710 |     toolName.replace(
  711 |       /[.*+?^${}()|[\]\\]/g,
  712 |       '\\$&',
  713 |     );
  714 | 
  715 |   const toolOption =
  716 |     listbox
  717 |       .getByRole('option')
  718 |       .filter({
  719 |         hasText: new RegExp(
  720 |           escapedToolName,
  721 |           'i',
  722 |         ),
  723 |       })
  724 |       .first();
  725 | 
  726 |   await expect(
  727 |     toolOption,
  728 |     `Tool ${toolName} not found in @ dropdown`,
  729 |   ).toBeVisible({
  730 |     timeout: 15_000,
  731 |   });
  732 | 
  733 |   console.log(
  734 |     `Tool found in @ dropdown: ${toolName}`,
  735 |   );
  736 | // -------------------------------------------------------
  737 | // Select Tool
  738 | // -------------------------------------------------------
  739 | 
  740 | await toolOption.click();
  741 | 
  742 | console.log(
  743 |   `Tool selected: ${toolName}`,
  744 | );
  745 | 
  746 | // -------------------------------------------------------
  747 | // Tool selection automatically adds:
  748 | //
  749 | // with <parameters>
  750 | //
  751 | // Caret is already at the end, so remove it.
  752 | // -------------------------------------------------------
  753 | 
  754 | const autoAddedText =
  755 |   ' with <parameters>';
  756 | 
  757 | for (
  758 |   let i = 0;
  759 |   i < autoAddedText.length;
  760 |   i++
  761 | ) {
  762 |   await this.page.keyboard.press(
  763 |     'Backspace',
  764 |   );
  765 | }
  766 | 
  767 | console.log(
  768 |   'Removed auto-added "with <parameters>" text',
  769 | );
  770 | 
  771 | // -------------------------------------------------------
  772 | // Verify it is gone
  773 | // -------------------------------------------------------
  774 | 
  775 | await expect(
  776 |   this.editorCanvas,
  777 | ).not.toContainText(
  778 |   'with <parameters>',
  779 | );
  780 | 
  781 | console.log(
  782 |   'SUCCESS: Tool added without parameters placeholder',
  783 | );
  784 | 
  785 |   // -------------------------------------------------------
  786 |   // Verify tool was inserted into Instructions
  787 |   // -------------------------------------------------------
  788 | 
  789 |   await expect(
  790 |     this.editorCanvas,
  791 |   ).toContainText(
  792 |     'If the user asks for what jersey is available',
  793 |     {
  794 |       timeout: 30_000,
```