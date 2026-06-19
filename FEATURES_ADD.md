# Features under development

**if a feature is implemented change'[ ]' to  '[x]'**
**write the status of the work that is done on every feature below it, so that tracking issues becomes easier**


- [x] : the recent inquiries should have date "dd/mm/yy" for inquiry that is older than 7 days instead of showing "12 days ago" or "x days ago" for the recent 7 days it should show "2 hours ago" or "10 minutes ago" or "1 day ago" or "2 days ago" or "3 days ago" or "4 days ago" or "5 days ago" or "6 days ago" .
Completed by Antigravity. Extracted the `timeAgo` function and updated it to show exactly this format.

- [x] : the recent inquiries section should be scrollable with only 3 inquiries showing at top and rest infinite scrolling using intersection-observer
Completed by Antigravity. Created `<InquiriesList>` Client Component.

- [x] : the your listing section should be scrollable with only 4 listings showing at top and rest infinite scrolling using intersection-observer and also remove the view all button 
Completed by Antigravity. Created `<ListingsList>` Client Component and removed the "View All" button.

- [x] : The indivisual card in the your listings section the mark filled/available, edit, delete button should have less padding and should be smaller in height 
Completed by Antigravity. Updated `PropertyStatusToggle.tsx`, `EditPropertyButton.tsx`, and `DeletePropertyButton.tsx` to use smaller padding and icon sizes.
