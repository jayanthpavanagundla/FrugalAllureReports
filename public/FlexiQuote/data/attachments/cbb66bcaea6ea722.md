# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\regression\orm.csr.spec.ts >> ORM Integration >> Submit Quote to ORM
- Location: tests\regression\orm.csr.spec.ts:91:7

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: locator.click: Test timeout of 60000ms exceeded.
Call log:
  - waiting for locator('//a[normalize-space()=\'Quote\']')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e5]:
    - img [ref=e6]
    - generic [ref=e8]: We are aware there was an issue impacting FlexiQuote performance earlier today. The team have deployed a fix and are continuing to monitor performance.
    - button "×" [ref=e9] [cursor=pointer]
  - article [ref=e12]:
    - generic [ref=e13]:
      - generic [ref=e14]:
        - generic [ref=e15]: error
        - generic [ref=e16]: Unable to Complete Request (1 of 2)
      - generic [ref=e18] [cursor=pointer]: close
    - generic [ref=e19]:
      - paragraph
      - generic [ref=e21] [cursor=pointer]:
        - generic [ref=e22]: Technical Details
        - generic [ref=e23]: keyboard_arrow_down
      - generic [ref=e25]:
        - generic [ref=e27]: 1 / 2
        - button "Next" [ref=e29] [cursor=pointer]
  - generic [ref=e30]:
    - banner [ref=e31]:
      - navigation [ref=e32]:
        - generic [ref=e33]:
          - link "Home" [ref=e34] [cursor=pointer]:
            - /url: /v2/
            - img "Home" [ref=e35]
          - text: 󰈙 󰀦 󰍃
        - generic [ref=e36]:
          - generic [ref=e39]:
            - generic: search
            - textbox "Search the system..." [ref=e41]
          - generic [ref=e42]:
            - button "routine" [ref=e46] [cursor=pointer]:
              - generic [ref=e47]: routine
            - generic [ref=e49]:
              - generic [ref=e50]: 9:58
              - generic [ref=e51]: AM
            - button "notifications" [ref=e54] [cursor=pointer]:
              - generic [ref=e55]: notifications
            - generic [ref=e58]:
              - generic [ref=e60] [cursor=pointer]:
                - generic [ref=e61]: SKY Smash & Repair
                - generic [ref=e63]: 󰅀
              - text: 󰀄 󰈙 󱥉 󰀦 󰍃 󰙎
    - generic [ref=e64]:
      - generic [ref=e66]:
        - generic [ref=e68]:
          - navigation [ref=e70]:
            - generic [ref=e71]:
              - paragraph [ref=e72]: QUOTE STATUS
              - button "󰐕 New" [ref=e73] [cursor=pointer]:
                - generic [ref=e74]: 󰐕
                - text: New
            - generic [ref=e76]:
              - generic [ref=e77] [cursor=pointer]:
                - paragraph [ref=e78]: To Be Written
                - generic [ref=e79]: "578"
              - generic [ref=e80] [cursor=pointer]:
                - paragraph [ref=e81]: Pending Authority
                - generic [ref=e82]: "3"
              - generic [ref=e83] [cursor=pointer]:
                - paragraph [ref=e84]: Follow Up Required
                - generic [ref=e85]: "5"
              - generic [ref=e86] [cursor=pointer]:
                - paragraph [ref=e87]: Authorised
                - generic [ref=e88]: "0"
          - navigation [ref=e90]:
            - generic [ref=e91]: JOB STATUS
            - generic [ref=e93]:
              - generic [ref=e94] [cursor=pointer]:
                - paragraph [ref=e95]: Booked In
                - generic [ref=e96]: "233"
              - generic [ref=e97] [cursor=pointer]:
                - paragraph [ref=e98]: Waiting On Parts
                - generic [ref=e99]: "0"
              - generic [ref=e100] [cursor=pointer]:
                - paragraph [ref=e101]: Vehicle Arrived
                - generic [ref=e102]: "0"
              - generic [ref=e103] [cursor=pointer]:
                - paragraph [ref=e104]: Work In Progress
                - generic [ref=e105]: "0"
              - generic [ref=e106] [cursor=pointer]:
                - paragraph [ref=e107]: Vehicle Ready
                - generic [ref=e108]: "1"
              - generic [ref=e109] [cursor=pointer]:
                - paragraph [ref=e110]: Invoice Pending
                - generic [ref=e111]: "0"
        - navigation [ref=e114]:
          - generic [ref=e115]: MESSAGE INBOX
          - list [ref=e118]:
            - listitem [ref=e119]:
              - generic [ref=e120] [cursor=pointer]: Today
            - listitem [ref=e121]:
              - generic [ref=e122] [cursor=pointer]: Yesterday
            - listitem [ref=e123]:
              - generic [ref=e124] [cursor=pointer]: This Week
          - generic [ref=e126]: No Messages
      - generic [ref=e130]:
        - paragraph [ref=e131]: LATEST RELEASES
        - generic [ref=e133]:
          - generic [ref=e134]:
            - generic [ref=e135]: 02/09/2026
            - generic [ref=e137]:
              - text: Hotfix 1.60.00.01
              - generic [ref=e138]: New
            - list [ref=e139]:
              - listitem [ref=e140]:
                - generic [ref=e141]: "Repairer Quote: Fix issue with loading spinner getting stuck"
          - generic [ref=e142]:
            - generic [ref=e143]: 01/09/2026
            - generic [ref=e145]: Release 1.60.00.00
            - list [ref=e146]:
              - listitem [ref=e147]:
                - generic [ref=e148]: "Repairer Quote: Added real-time presence; the header shows who else is viewing or editing a quote, and your view reloads when they save"
              - listitem [ref=e149]:
                - generic [ref=e150]: "Repairer Quote: You are now alerted when a quote is updated in the background by an integration such as PartsCheck"
              - listitem [ref=e151]:
                - generic [ref=e152]: "Quote Invoice: The save button is now labelled Raise Invoice when assessment history is off, matching the label used when it is on"
              - listitem [ref=e153]:
                - generic [ref=e154]: "Quote Invoice: Added an Invoiced status pill, plus Void Invoice and Print Invoice options once a job has been invoiced"
              - listitem [ref=e155]:
                - generic [ref=e156]: "Quote Invoice: The Excess Invoice now shows the customer's phone and email, falling back to the Customer or Insurer name in Attn when no contact is set"
              - listitem [ref=e157]:
                - generic [ref=e158]: "Reports & Invoices: The Estimate and Job Card now show Part Type and Part No. as separate columns, with quantity and price for every part"
              - listitem [ref=e159]:
                - generic [ref=e160]: "Reports & Invoices: Fixed the Paint Code and Paint Group missing from the Job Card and Estimate when a supplementary quote is included"
              - listitem [ref=e161]:
                - generic [ref=e162]: "Reports & Invoices: The Reference now prints on the Quotation and Job Card for Misc quotes before invoicing, not just after"
              - listitem [ref=e163]:
                - generic [ref=e164]: "Comms: Insurer and assessor contacts now appear in the SMS and Email To pickers alongside customer contacts"
              - listitem [ref=e165]:
                - generic [ref=e166]: "Images: Improved image quality across FlexiQuote, the mobile app and the Image Uploader"
              - listitem [ref=e167]:
                - generic [ref=e168]: "EstImage Integration: Documents can now be sent to EstImage in one click, with anything already submitted shown as sent so nothing is uploaded twice"
              - listitem [ref=e169]:
                - generic [ref=e170]: "AudaNet Integration: Added one-click document upload to AudaNet and AudaBridge quotes, using the same experience as Submit Images"
              - listitem [ref=e171]:
                - generic [ref=e172]: "ORM Integration: ORM quotes now only accept the Hours quoting method; dollar-based quotes are stopped on submit with the Quoting Method highlighted, preventing inflated labour amounts and totals"
          - generic [ref=e173]:
            - generic [ref=e174]: 17/08/2026
            - generic [ref=e176]: Hotfix 1.59.00.02
            - list [ref=e177]:
              - listitem [ref=e178]:
                - generic [ref=e179]: "Repairer Quote: Fixed an issue where items were not being marked as report-only after authority is loaded"
          - generic [ref=e180]:
            - generic [ref=e181]: 10/08/2026
            - generic [ref=e183]: Hotfix 1.59.00.01
            - list [ref=e184]:
              - listitem [ref=e185]:
                - generic [ref=e186]: "Email: The recipient list now suggests addresses you have previously emailed, so repeat recipients no longer have to be typed out in full"
              - listitem [ref=e187]:
                - generic [ref=e188]: "Email: The recipient dropdown is now grouped into Quote Contacts, Recent and All Contacts, with Recent entries highlighted, making the right person quicker to pick"
              - listitem [ref=e189]:
                - generic [ref=e190]: "Navigation: Fixed middle-click and Ctrl+click on menu links opening a 404 page, so menu items now open correctly in a new tab"
          - generic [ref=e191]:
            - generic [ref=e192]: 04/08/2026
            - generic [ref=e194]: Release 1.59.00.00
            - list [ref=e195]:
              - listitem [ref=e196]:
                - generic [ref=e197]: "Repairer Quote: New supplementaries now inherit the full Key Dates panel from the Main quote and stay in sync as it changes; dates you set on the supp itself are kept, so rework dates hold"
              - listitem [ref=e198]:
                - generic [ref=e199]: "Repairer Quote: New Additional Quote, Copy Quote and Export Quote are now available while a quote is locked, so supps and resends are no longer blocked after loading an authority"
              - listitem [ref=e200]:
                - generic [ref=e201]: "Repairer Quote: Fixed Paint Match 2 incorrectly appearing on NTAR quotes where all paint items match the vehicle colour"
              - listitem [ref=e202]:
                - generic [ref=e203]: "Quote Header: The Assessor and phone number fields now also search and select from insurer and customer contacts, carrying the full contact details through to the quote"
              - listitem [ref=e204]:
                - generic [ref=e205]: "Quote Items: Fixed drag and drop for linked items such as paint loading"
              - listitem [ref=e206]:
                - generic [ref=e207]: "Quote Invoice: Invoices now use your actual Job Started and Job Completed dates instead of the estimated start and end dates, and update automatically as soon as a job is finished"
              - listitem [ref=e208]:
                - generic [ref=e209]: "Quote Invoice: Renamed the tax invoice header labels from Date In and Date Out to Job Start Date and Job Completed Date"
              - listitem [ref=e210]:
                - generic [ref=e211]: "Reports & Invoices: Report On lines are now clearly marked and aligned to the end of the line on the Job Card, Estimate, Detailed Invoice and Category & Lump Sum Invoice."
              - listitem [ref=e212]:
                - generic [ref=e213]: "Debtor List: Removed the All debtors option from the Debtors Statement report to avoid opening dozens of tabs"
              - listitem [ref=e214]:
                - generic [ref=e215]: "Insurer: Added a Parallel Parts markup for new and existing insurers, which flows into the quote at 0% by default"
              - listitem [ref=e216]:
                - generic [ref=e217]: "AudaBridge Integration: Added an Open in AudaBridge button on the AudaBridge tab that opens the matching quote in a new tab, leaving your FlexiQuote screen exactly where you left it"
              - listitem [ref=e218]:
                - generic [ref=e219]: "PartsCheck Integration: Part price status now holds at Priced after every sync, instead of resetting to Not Requested"
              - listitem [ref=e220]:
                - generic [ref=e221]: "PartsCheck Integration: Parts with a very short description now sync cleanly instead of failing with an error"
              - listitem [ref=e222]:
                - generic [ref=e223]: "PartsCheck Integration: On invoiced AudaNet quotes, price variances now arrive as a Report Only line so your invoiced figures stay untouched"
              - listitem [ref=e224]:
                - generic [ref=e225]: "PartsCheck Integration: Credit requests that cannot be synced for known reasons now close themselves off as Synced to PC and no longer fill up the Remarks on every retry"
              - listitem [ref=e226]:
                - generic [ref=e227]: "Performance: Improved the Assessment data lookup so it no longer reads the full table on every request"
          - link "View All" [ref=e229] [cursor=pointer]:
            - /url: "#"
```

# Test source

```ts
  149 |     });
  150 |     this.outStandingParts = this.dropdownContainer.getByText(
  151 |       "Outstanding Parts",
  152 |       { exact: true },
  153 |     );
  154 |     this.outstandingCredits = this.dropdownContainer.getByText(
  155 |       "Outstanding Credits",
  156 |       { exact: true },
  157 |     );
  158 |     this.salesAnalysis = this.dropdownContainer.getByText("Sales Analysis", {
  159 |       exact: true,
  160 |     });
  161 |     this.debtorList = this.dropdownContainer.getByText("Debtor List", {
  162 |       exact: true,
  163 |     });
  164 |     this.receipts = this.dropdownContainer.getByText("Receipts", {
  165 |       exact: true,
  166 |     });
  167 |     this.creditorList = this.dropdownContainer.getByText("Creditor List", {
  168 |       exact: true,
  169 |     });
  170 |     this.paymentList = this.dropdownContainer.getByText("Payment List", {
  171 |       exact: true,
  172 |     });
  173 | 
  174 |     // TABLES DROPDOWN
  175 |     this.tablesMenu = page.locator("//a[normalize-space()='Tables']");
  176 | 
  177 |     this.insurer = this.dropdownContainer.getByText("Insurer", { exact: true });
  178 |     this.customer = this.dropdownContainer.getByText("Customer", {
  179 |       exact: true,
  180 |     });
  181 |     this.vendor = this.dropdownContainer.getByText("Vendor", { exact: true });
  182 |     this.contactProfile = this.dropdownContainer.getByText("Contact Profile", {
  183 |       exact: true,
  184 |     });
  185 |     this.recurringRemarks = this.dropdownContainer.getByText(
  186 |       "Recurring Remarks",
  187 |       { exact: true },
  188 |     );
  189 |     this.quickItem = this.dropdownContainer.getByText("Quick Item", {
  190 |       exact: true,
  191 |     });
  192 |     this.item = this.dropdownContainer.getByText("Item", { exact: true });
  193 |     this.otherLabour = this.dropdownContainer.getByText("Other labour", {
  194 |       exact: true,
  195 |     });
  196 |     this.vehicle = this.dropdownContainer.getByText("Vehicle", { exact: true });
  197 |     this.unscheduledModel = this.dropdownContainer.getByText(
  198 |       "Unscheduled Model",
  199 |       { exact: true },
  200 |     );
  201 | 
  202 |     // ADMIN DROPDOWN
  203 |     this.adminMenu = page.locator("a.navbar-link", { hasText: "Admin" });
  204 |     this.glMapping = this.dropdownContainer.getByText("G/L Mapping", {
  205 |       exact: true,
  206 |     });
  207 |     this.emailSMS = this.dropdownContainer.getByText("Email/SMS Log", {
  208 |       exact: true,
  209 |     });
  210 | 
  211 |     // DASHBOARD VALIDATION
  212 |     // this.jobStatusHeader = page.locator('text=JOB STATUS');
  213 | 
  214 |     // JOB STATUS COUNTS (example - can refine later)
  215 |     this.bookedIn = page.locator("text=Booked In");
  216 |     this.waitingOnParts = page.locator("text=Waiting On Parts");
  217 |     this.vehicleArrived = page.locator("text=Vehicle Arrived");
  218 | 
  219 |     this.quoteNumberText = page.locator(
  220 |       "div.quote-info span.is-size-4.has-text-weight-bold",
  221 |     );
  222 | 
  223 |     this.companyOnboarding = page
  224 |       .locator("a")
  225 |       .filter({ hasText: "Company Onboarding" });
  226 |     this.companySetting = page.getByRole("link", { name: "Company Setting" });
  227 |     this.autoSaveCheckbox = page.getByRole("checkbox").nth(2);
  228 |   }
  229 | 
  230 |   async expectDashboardVisible() {
  231 |     await this.expectTitle("FlexiQuote Dashboard");
  232 |   }
  233 | 
  234 |   async openCompanyMenu() {
  235 |     await this.companyMenuLink.click();
  236 |   }
  237 | 
  238 |   async expectCompanyName(name: string = "PartsCheck") {
  239 |     await expect(this.companyMenuLink).toContainText(name);
  240 |   }
  241 | 
  242 |   async signOut() {
  243 |     await this.signOutLink.click();
  244 |     await this.page.waitForURL(/SignInCSR\.aspx/i, { timeout: 15000 });
  245 |   }
  246 | 
  247 |   async openQuoteDropdown() {
  248 |     await step("Open Quote Menu", async () => {
> 249 |       await this.quoteMenu.click();
      |                            ^ Error: locator.click: Test timeout of 60000ms exceeded.
  250 |     });
  251 |   }
  252 | 
  253 |   async selectRepairerQuote() {
  254 |     await step("Navigate to Repairer Quotes", async () => {
  255 |       await this.repairerQuote.click();
  256 |     });
  257 |   }
  258 | 
  259 |   async selectMiscQuote() {
  260 |     await step("Navigate to Misc Quotes", async () => {
  261 |       await this.miscQuote.click();
  262 |     });
  263 |   }
  264 | 
  265 |   async selectQuoteTemplate() {
  266 |     await step("Navigate to Quote Templates", async () => {
  267 |       await this.quoteTemplate.click();
  268 |     });
  269 |   }
  270 | 
  271 |   async selectBookings() {
  272 |     await step("Navigate to Bookings", async () => {
  273 |       await this.bookings.click();
  274 |     });
  275 |   }
  276 | 
  277 |   async selectORMMessages() {
  278 |     await step("Navigate to ORM Messages", async () => {
  279 |       await this.ormMessages.click();
  280 |     });
  281 |   }
  282 | 
  283 |   async openDebtorDropdown() {
  284 |     await step("Open Debtor Menu", async () => {
  285 |       await this.debtorMenu.click();
  286 |     });
  287 |   }
  288 | 
  289 |   async selectQuickInvoice() {
  290 |     await step("Navigate to Quick Invoice", async () => {
  291 |       await this.quickInvoice.click();
  292 |     });
  293 |   }
  294 | 
  295 |   async selectDebtorAdjustment() {
  296 |     await step("Navigate to Debtor Adjustment", async () => {
  297 |       await this.debtorAdjustment.click();
  298 |     });
  299 |   }
  300 | 
  301 |   async selectReceiptEntry() {
  302 |     await step("Navigate to Receipt Entry", async () => {
  303 |       await this.receiptEntry.click();
  304 |     });
  305 |   }
  306 | 
  307 |   async openCreditorDropdown() {
  308 |     await step("Open Creditor Menu", async () => {
  309 |       await this.creditorMenu.click();
  310 |     });
  311 |   }
  312 | 
  313 |   async selectSundryCreditor() {
  314 |     await step("Navigate to Sundry Creditor", async () => {
  315 |       await this.sundryCreditor.click();
  316 |     });
  317 |   }
  318 | 
  319 |   async selectPaymentEntry() {
  320 |     await step("Navigate to Payment Entry", async () => {
  321 |       await this.paymentEntry.click();
  322 |       await this.paymentEntryTitle.click();
  323 |     });
  324 |   }
  325 | 
  326 |   async selectPurchaseOrder() {
  327 |     await step("Navigate to Purchase Order", async () => {
  328 |       await this.purchaseOrder.click();
  329 |     });
  330 |   }
  331 | 
  332 |   async selectReturnParts() {
  333 |     await step("Navigate to Return Parts", async () => {
  334 |       await this.returnParts.click();
  335 |     });
  336 |   }
  337 | 
  338 |   async openReportDropdown() {
  339 |     await step("Open Reports Menu", async () => {
  340 |       await this.reportMenu.click();
  341 |     });
  342 |   }
  343 | 
  344 |   async selectJCNI() {
  345 |     await step("Navigate to JCNI Report", async () => {
  346 |       await this.jcni.click();
  347 |     });
  348 |   }
  349 | 
```