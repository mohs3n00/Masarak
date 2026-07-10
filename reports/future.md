# Complete Exam Builder Redesign

Review the current exam creation system.

Transform the existing implementation into a modern, professional, flexible assessment builder designed specifically for an educational platform.

Do NOT copy Google Forms.

Instead, create a clean, intuitive, and education-focused experience while preserving existing functionality whenever possible.

---

# General Objective

Redesign the entire exam creation experience.

The builder should be:

- Clean
- Fast
- Professional
- Easy to use
- Modern
- Responsive
- RTL Friendly
- LTR Friendly

Arabic and English must work perfectly.

Mixed Arabic + English text should render correctly without layout issues.

---

# Supported Question Types

Support at minimum:

- Multiple Choice (Single Answer)
- Multiple Choice (Multiple Answers)
- True / False
- Short Text Answer

Design the architecture so additional question types can be added later without major refactoring.

---

# Rich Question Content

Each question should support:

- Plain text
- Rich formatted text
- Images
- Mixed Arabic and English text
- Future-ready mathematical expressions

Teachers should be able to upload images directly inside the question.

Images should resize automatically while maintaining aspect ratio.

---

# Rich Answer Options

Each answer option should support:

- Text only
- Image only
- Text + Image

Teachers should easily upload or replace answer images.

---

# Question Points

Each question should have its own score.

Teachers should be able to assign custom points to every question independently.

Examples:

Question 1 → 1 point

Question 2 → 2 points

Question 3 → 5 points

Automatically calculate:

- Total exam score
- Passing score validation
- Student final score

Changing question points should immediately update the exam total.

---

# Question Management

Teachers should be able to:

- Add Question
- Duplicate Question
- Delete Question
- Reorder Questions (Drag & Drop if possible)
- Move Up / Down
- Collapse Question
- Expand Question
- Preview Question

Changes should be smooth without losing entered data.

---

# Answer Management

Teachers should be able to:

- Add Answers
- Remove Answers
- Reorder Answers
- Upload Images
- Mark Correct Answers
- Prevent Invalid Configurations

Prevent saving questions without a valid correct answer.

---

# Media Handling

Support uploading images for:

- Questions
- Answers
- Future explanations

Optimize uploaded images.

Generate previews before saving.

Maintain aspect ratio.

---

# Bulk Import (Future Ready)

Prepare the architecture for bulk importing questions.

The UI should include an Import option, even if advanced parsing is implemented later.

Future supported formats should include:

- Excel (.xlsx)
- CSV
- Word (.docx)

The architecture should make future import implementation simple without redesigning the builder.

---

# Exam Settings

Support configurable settings including:

- Exam Title
- Description
- Instructions
- Passing Score
- Duration
- Attempt Limit
- Availability Date
- Availability Time
- Randomize Questions
- Randomize Answers
- Allow Review
- Show Correct Answers
- Visibility Settings

All settings should be clearly organized.

---

# Validation

Prevent common mistakes.

Examples:

- Empty Question
- Empty Answer
- Missing Correct Answer
- Duplicate Answers
- Invalid Passing Score
- Invalid Duration
- Missing Required Fields

Provide clear validation messages.

---

# User Experience

Improve:

- Layout
- Typography
- Alignment
- Button hierarchy
- Hover states
- Focus states
- Loading states
- Empty states
- Animations

The builder should feel polished and commercial.

---

# Mobile Responsiveness

Ensure full functionality on:

- Desktop
- Tablet
- Mobile

No important controls should become inaccessible.

---

# Performance

Optimize rendering.

Avoid unnecessary re-renders.

Support exams containing many questions efficiently.

Lazy load heavy components where appropriate.

---

# Accessibility

Review:

- Keyboard Navigation
- Focus Order
- Labels
- Readability
- RTL/LTR Compatibility

---

# Data Integrity

Ensure:

Questions save correctly.

Images save correctly.

Question order is preserved.

Answer order is preserved.

Question points are saved correctly.

Editing existing exams remains stable.

No data should be lost while editing.

---

# Architecture

Reuse existing project architecture.

Avoid duplicated code.

Keep components modular.

Future question types should be easy to implement.

Future import formats should plug into the existing architecture.

---

# Future Ready

Design the builder so future features can be added easily, including:

- Mathematical Equation Editor
- Audio Questions
- Video Questions
- Question Bank
- AI Question Generation
- AI Question Improvement
- Question Categories
- Difficulty Levels

Do not implement these features now.

Only prepare the architecture for future expansion.

---

# Final Verification

Before considering the task complete verify:

✓ Teachers can create exams easily.

✓ Questions support images.

✓ Answers support images.

✓ Arabic layout is correct.

✓ English layout is correct.

✓ Mixed Arabic/English text renders correctly.

✓ Question ordering works.

✓ Answer ordering works.

✓ Question points work correctly.

✓ Total score calculation works.

✓ Validation works.

✓ Editing existing exams works.

✓ Bulk Import architecture is prepared.

✓ Performance remains smooth.

✓ Responsive layout works.

✓ No regressions introduced.

The final result should feel like a professional educational assessment builder designed for large-scale educational platforms rather than a generic online form.
---

# Subject Compatibility

The exam builder must support all educational subjects without requiring future redesign.

The system should work correctly for:

- Mathematics
- Physics
- Chemistry
- Biology
- Geology
- Computer Science
- Arabic
- English
- French
- German
- History
- Geography
- Philosophy
- Any future subject

---

# Scientific Content Support

Ensure questions can correctly display:

- Mathematical equations
- Chemical formulas
- Physical symbols
- Scientific notation
- Superscript
- Subscript
- Greek letters
- Special symbols
- Unicode characters
- Mixed RTL/LTR content

Examples include:

H₂O

CO₂

NaCl

Ca(OH)₂

SO₄²⁻

x²

√x

π

Δ

μ

≤

≥

∞

α β γ

The layout must preserve formatting correctly.

Do not break symbols during rendering, editing, saving, or displaying.

---

# Text Formatting

Teachers should be able to write content naturally.

Preserve:

- Paragraphs
- Line breaks
- Lists
- Numbering
- Indentation
- Bold
- Italic
- Underline
- Highlighting

The displayed question should match what the teacher created.

---

# Mixed Language Support

Support questions that mix multiple languages.

Examples:

Arabic + English

Arabic + Scientific Symbols

English + Mathematical Equations

Arabic + Chemical Formulas

RTL and LTR text should render naturally without layout corruption.

Cursor movement, text selection, editing, and copy/paste should behave correctly.

---

# Image Placement

Teachers should be able to place images naturally inside questions.

Support:

Image above text

Image below text

Image between paragraphs

Image beside answers (if layout allows)

Maintain responsive behavior.

---

# Copy & Paste Compatibility

Teachers frequently copy questions from:

Microsoft Word

Google Docs

PDFs

Educational websites

School documents

The editor should preserve formatting whenever possible.

Avoid introducing broken HTML or malformed formatting.

---

# Input Validation

Prevent common mistakes such as:

Saving an empty exam.

Saving a question without answers.

Saving multiple-choice questions without a correct answer.

Assigning negative question points.

Assigning zero points to required questions.

Invalid exam duration.

Duplicate answer options.

Broken image references.

Missing uploaded images.

Corrupted imported questions.

Invalid imported files.

Unsupported file formats.

Excessively large uploads.

---

# Data Safety

Prevent accidental data loss.

Warn teachers before:

Leaving the page.

Refreshing the browser.

Closing the tab.

Deleting questions.

Deleting exams.

Automatically save drafts whenever practical.

Recover unsaved work whenever possible.

---

# Future Compatibility

The architecture should allow future support for:

LaTeX

Math Editor

Equation Builder

Chemical Structure Editor

Drawing Canvas

Handwritten Answers

Audio Questions

Video Questions

Interactive Questions

Question Bank

AI Question Generation

AI Question Review

Do not implement these now.

Only ensure the architecture will support them later without major redesign.
# Large Exam Support

The builder must remain fast and stable even for large exams.

Examples:

100 Questions

200 Questions

300+ Answer Options

Many Images

Large Rich Text Content

No noticeable lag should occur while editing.

Optimize rendering to keep the editing experience smooth.