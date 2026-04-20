# PRD: Portfolio CMS

## 1. Product overview

### 1.1 Document title and version

- PRD: Portfolio CMS
- Version: 1.0

### 1.2 Product summary

The Portfolio CMS is a lightweight, developer-focused content management system integrated directly into the existing Next.js portfolio website. It provides a password-protected admin panel at `/admin` where the site owner can create, edit, and delete all portfolio content without touching code or redeploying.

The CMS will manage professional information (bio, experience, skills, projects), personal sections (hobbies, interests, certifications), social proof (testimonials, recommendations), and media assets (images, GIFs, small videos). Data will be stored in a SQLite database using Drizzle ORM, replacing the current hardcoded TypeScript data file.

The system is designed with extensibility in mind—authentication can be upgraded to OAuth providers later, and multi-language support can be added in future iterations.

## 2. Goals

### 2.1 Business goals

- Enable real-time content updates without code changes or deployments
- Reduce time-to-publish for new projects, experiences, and blog posts
- Present a more complete professional profile with rich media and personal sections
- Maintain a single source of truth for all portfolio content

### 2.2 User goals

- Quickly update professional information when changing jobs or completing projects
- Showcase personality through hobbies, interests, and personal stories
- Manage testimonials and social proof from colleagues and clients
- Upload and organize media assets for projects and blog posts

### 2.3 Non-goals

- Complex role-based access control (single admin user for now)
- Real-time collaboration or draft sharing
- SEO optimization tools or analytics dashboards
- Email newsletter or subscriber management
- Multi-language content (planned for future)

## 3. User personas

### 3.1 Key user types

- Site owner (admin): The developer who owns and maintains the portfolio
- Site visitor: Recruiters, potential clients, and fellow developers viewing the portfolio

### 3.2 Basic persona details

- **Gagik (Admin)**: A senior frontend engineer who wants to keep his portfolio up-to-date without manual code edits. Values speed, simplicity, and a clean interface. Comfortable with developer tools but prefers not to deploy for content changes.

- **Hiring Manager (Visitor)**: Wants to quickly assess technical skills, experience, and cultural fit. Looks for recent projects, clear communication, and professional presentation.

### 3.3 Role-based access

- **Admin**: Full CRUD access to all content types, media uploads, and settings. Protected by password authentication.
- **Public**: Read-only access to published content on the portfolio website.

## 4. Functional requirements

### 4.1 Database schema and data layer (Priority: High)

- Define Drizzle ORM schema for all content types
- Create migration scripts from hardcoded data to database
- Implement type-safe data access functions
- Support for ordering/sorting of list items (experience, projects, skills)

### 4.2 Authentication system (Priority: High)

- Password-protected admin routes using environment variable
- Session management with HTTP-only cookies
- Login/logout functionality
- Middleware to protect `/admin/*` routes

### 4.3 Bio management (Priority: High)

- Edit name, title, tagline, short bio, long bio
- Update profile photo
- Toggle availability status ("Open to work", "Not available", "Freelance only")

### 4.4 Social links management (Priority: High)

- CRUD operations for social links
- Support for: GitHub, LinkedIn, Email, X/Twitter, and custom links
- Icon selection from predefined set
- Drag-and-drop reordering

### 4.5 Skills management (Priority: High)

- CRUD operations for skill categories
- CRUD operations for skills within categories
- Reorder categories and skills
- Skill proficiency level (optional: beginner, intermediate, expert)

### 4.6 Experience management (Priority: High)

- CRUD operations for work experience entries
- Fields: role, company, company URL, location, start date, end date, highlights
- Support for "present" as end date
- Reorder experiences
- Rich text editor for highlights

### 4.7 Projects management (Priority: High)

- CRUD operations for projects
- Fields: title, slug, description, tech stack, live URL, repo URL, featured flag
- Image/GIF upload for project thumbnails
- Reorder projects
- Filter by featured status

### 4.8 Education management (Priority: Medium)

- CRUD operations for education entries
- Fields: degree, institution, location, start year, end year, description
- Support for certifications and courses

### 4.9 Certifications management (Priority: Medium)

- CRUD operations for certifications
- Fields: name, issuer, issue date, expiry date, credential URL, credential ID
- Image upload for certification badges

### 4.10 Hobbies and interests (Priority: Medium)

- CRUD operations for hobbies/interests
- Fields: name, description, icon/emoji, related links
- Group by category (e.g., "Sports", "Creative", "Tech")
- Optional: photo gallery per hobby

### 4.11 Testimonials management (Priority: Medium)

- CRUD operations for testimonials
- Fields: author name, author title, company, quote, avatar, date, LinkedIn URL
- Featured flag for homepage display
- Approval workflow (draft/published)

### 4.12 Blog posts management (Priority: Low)

- CRUD operations for blog posts
- Fields: title, slug, excerpt, content (markdown), tags, published date, featured image
- Draft/published status
- Reading time calculation
- Code syntax highlighting support

### 4.13 Media library (Priority: Medium)

- Upload images, GIFs, and small videos (< 10MB)
- Browse and search uploaded media
- Delete unused media
- Generate optimized image variants
- Copy URL to clipboard for use in content

### 4.14 Settings and metadata (Priority: Low)

- Site title and description
- Default OG image
- Contact email
- Resume/CV PDF upload
- Theme preferences (if applicable)

## 5. User experience

### 5.1 Entry points and first-time user flow

- Admin accesses `/admin` and sees a login form
- After entering the correct password, a session cookie is set
- Admin is redirected to the dashboard showing content overview
- First-time setup wizard migrates existing hardcoded data (optional)

### 5.2 Core experience

- **Dashboard**: Overview cards showing counts for each content type with quick-edit links
- **Content lists**: Sortable tables with inline status indicators and action buttons
- **Edit forms**: Clean, single-column forms with auto-save indicators
- **Media picker**: Modal for selecting or uploading media when editing content

### 5.3 Advanced features and edge cases

- Unsaved changes warning when navigating away
- Optimistic UI updates with error rollback
- Empty state guidance for new content types
- Bulk delete with confirmation
- Search/filter within content lists

### 5.4 UI/UX highlights

- Minimal, monochrome design matching developer aesthetic
- Keyboard shortcuts for common actions (Cmd+S to save)
- Toast notifications for success/error states
- Responsive layout for tablet editing
- Form validation with inline error messages

## 6. Narrative

Gagik lands a new role at a prominent tech company and wants to update his portfolio immediately. He opens `/admin`, logs in with his password, and navigates to the Experience section. He adds his new position with a few highlights, uploads the company logo, and hits save. Within seconds, his public portfolio reflects the change—no git commits, no deployments, no waiting. Later, he adds a testimonial from his former manager and a new hobby section about his weekend hiking adventures. His portfolio now tells a complete story: professional expertise backed by real recommendations, and a glimpse into the person behind the code.

## 7. Success metrics

### 7.1 User-centric metrics

- Time to publish new content: < 2 minutes from login to live
- Admin session duration: Track engagement with the CMS
- Content freshness: Percentage of sections updated in last 90 days

### 7.2 Business metrics

- Portfolio engagement: Time on site, pages per session
- Contact form submissions: Conversion from visitors to leads
- Return visitor rate: People coming back to check updates

### 7.3 Technical metrics

- Admin page load time: < 1 second
- API response time: < 200ms for CRUD operations
- Media upload success rate: > 99%
- Zero downtime deployments

## 8. Technical considerations

### 8.1 Integration points

- **Drizzle ORM + LibSQL**: Already in package.json, use for database layer
- **Next.js App Router**: Server Actions for mutations, RSC for data fetching
- **Resend**: Available for password reset emails (future)
- **Zod v4**: Schema validation for all API inputs

### 8.2 Data storage and privacy

- SQLite database (LibSQL) for content storage
- Media files stored in `/public/uploads` or external service (Cloudflare R2/S3)
- Password hashed and stored in environment variable (simple auth)
- No PII collection from visitors
- Session tokens in HTTP-only cookies

### 8.3 Scalability and performance

- Static generation with on-demand revalidation for public pages
- Admin routes are fully dynamic (no caching)
- Image optimization via Next.js Image component
- Lazy loading for media library
- Database queries optimized with proper indexes

### 8.4 Potential challenges

- **Media storage**: Local `/public` folder works for dev but may need cloud storage for production
- **Rich text editing**: Choosing between markdown and WYSIWYG for blog posts
- **Data migration**: Safely transferring existing hardcoded data to database
- **Authentication upgrade path**: Designing session management to support OAuth later

## 9. Milestones and sequencing

### 9.1 Project estimate

- Medium-Large: 4-6 weeks for full implementation

### 9.2 Team size and composition

- Solo developer with AI assistance
- Skills needed: Next.js, React, Drizzle ORM, TypeScript, Tailwind CSS

### 9.3 Suggested phases

- **Phase 1: Foundation** (1 week)
  - Database schema design and Drizzle setup
  - Authentication system (password-based)
  - Admin layout and navigation
  - Data migration from hardcoded file

- **Phase 2: Core content management** (1.5 weeks)
  - Bio and social links management
  - Skills management with categories
  - Experience management with rich text
  - Projects management with media

- **Phase 3: Extended content** (1 week)
  - Education and certifications
  - Hobbies and interests
  - Testimonials management

- **Phase 4: Media and polish** (1 week)
  - Media library with upload/browse/delete
  - Blog posts with markdown support
  - Settings page
  - UX polish and keyboard shortcuts

- **Phase 5: Testing and launch** (0.5 weeks)
  - End-to-end testing of admin flows
  - Performance optimization
  - Documentation
  - Production deployment

## 10. User stories

### 10.1 Admin authentication

- **ID**: GH-001
- **Description**: As an admin, I want to log in with a password so that I can access the CMS securely.
- **Acceptance criteria**:
  - Visiting `/admin` without a session redirects to `/admin/login`
  - Login form accepts password input
  - Correct password sets HTTP-only session cookie and redirects to dashboard
  - Incorrect password shows error message without revealing password hints
  - Session expires after 7 days of inactivity

### 10.2 Admin logout

- **ID**: GH-002
- **Description**: As an admin, I want to log out so that my session is securely terminated.
- **Acceptance criteria**:
  - Logout button visible in admin header
  - Clicking logout clears session cookie
  - User is redirected to login page
  - Subsequent visits to `/admin/*` require re-authentication

### 10.3 View dashboard

- **ID**: GH-003
- **Description**: As an admin, I want to see a dashboard overview so that I can quickly assess my portfolio content.
- **Acceptance criteria**:
  - Dashboard shows count cards for each content type
  - Each card links to the respective management page
  - "Last updated" timestamp shown for recently edited content
  - Quick action buttons for "Add new" on each content type

### 10.4 Edit bio information

- **ID**: GH-004
- **Description**: As an admin, I want to edit my bio information so that visitors see accurate personal details.
- **Acceptance criteria**:
  - Form fields for: name, title, tagline, short bio, long bio
  - Profile photo upload with preview
  - Availability status dropdown (Open to work, Not available, Freelance only)
  - Save button persists changes to database
  - Success toast shown after save
  - Changes reflect on public site immediately

### 10.5 Manage social links

- **ID**: GH-005
- **Description**: As an admin, I want to manage my social links so that visitors can connect with me on various platforms.
- **Acceptance criteria**:
  - List view showing all social links with icon, label, and URL
  - Add new link with icon selection (GitHub, LinkedIn, Email, X, custom)
  - Edit existing link inline or via modal
  - Delete link with confirmation
  - Drag-and-drop reordering
  - Changes reflect on public site immediately

### 10.6 Manage skill categories

- **ID**: GH-006
- **Description**: As an admin, I want to manage skill categories so that my skills are organized logically.
- **Acceptance criteria**:
  - List view of skill categories with item count
  - Add new category with name
  - Edit category name
  - Delete category (with warning if skills exist)
  - Reorder categories via drag-and-drop

### 10.7 Manage skills within categories

- **ID**: GH-007
- **Description**: As an admin, I want to add and edit skills within categories so that I can showcase my technical abilities.
- **Acceptance criteria**:
  - View skills grouped by category
  - Add skill to category with name and optional proficiency level
  - Edit skill name and proficiency
  - Delete skill with confirmation
  - Reorder skills within category
  - Move skill between categories

### 10.8 Add work experience

- **ID**: GH-008
- **Description**: As an admin, I want to add work experience entries so that visitors see my professional history.
- **Acceptance criteria**:
  - Form with fields: role, company, company URL, location, start date, end date
  - Checkbox for "I currently work here" (sets end date to null)
  - Rich text editor for highlights (bullet points)
  - Company logo upload (optional)
  - Save creates new experience entry
  - New entry appears in list and on public site

### 10.9 Edit work experience

- **ID**: GH-009
- **Description**: As an admin, I want to edit existing work experience so that my history stays accurate.
- **Acceptance criteria**:
  - Click experience entry to open edit form
  - All fields are pre-populated with current values
  - Save updates the entry in database
  - Cancel discards changes
  - Unsaved changes warning if navigating away

### 10.10 Delete work experience

- **ID**: GH-010
- **Description**: As an admin, I want to delete work experience entries so that I can remove outdated positions.
- **Acceptance criteria**:
  - Delete button on each experience entry
  - Confirmation modal before deletion
  - Entry removed from database and public site
  - Success toast shown after deletion

### 10.11 Reorder work experience

- **ID**: GH-011
- **Description**: As an admin, I want to reorder my work experience so that I can control the display order.
- **Acceptance criteria**:
  - Drag-and-drop handles on experience list
  - Order persists to database on drop
  - Public site reflects new order immediately

### 10.12 Add project

- **ID**: GH-012
- **Description**: As an admin, I want to add new projects so that visitors see my latest work.
- **Acceptance criteria**:
  - Form with fields: title, slug (auto-generated from title), description, tech stack (tag input)
  - Optional fields: live URL, repo URL, featured checkbox
  - Image/GIF upload for project thumbnail
  - Save creates new project entry
  - Slug must be unique

### 10.13 Edit project

- **ID**: GH-013
- **Description**: As an admin, I want to edit existing projects so that I can update details and add media.
- **Acceptance criteria**:
  - All fields editable
  - Tech stack as removable tags
  - Replace or remove project thumbnail
  - Slug change updates URL (with redirect consideration)

### 10.14 Delete project

- **ID**: GH-014
- **Description**: As an admin, I want to delete projects so that I can remove deprecated work.
- **Acceptance criteria**:
  - Delete with confirmation
  - Associated media flagged for cleanup
  - Project removed from public site

### 10.15 Toggle project featured status

- **ID**: GH-015
- **Description**: As an admin, I want to toggle featured status on projects so that I can highlight my best work.
- **Acceptance criteria**:
  - Featured toggle visible in project list and edit form
  - Toggle updates immediately in database
  - Public site shows featured projects prominently

### 10.16 Add education entry

- **ID**: GH-016
- **Description**: As an admin, I want to add education entries so that visitors see my academic background.
- **Acceptance criteria**:
  - Form with fields: degree, institution, location, start year, end year, description
  - Support for "In progress" (no end year)
  - Save creates new education entry

### 10.17 Manage certifications

- **ID**: GH-017
- **Description**: As an admin, I want to manage certifications so that I can showcase my credentials.
- **Acceptance criteria**:
  - CRUD for certifications
  - Fields: name, issuer, issue date, expiry date (optional), credential URL, credential ID
  - Badge image upload
  - Expired certifications marked visually

### 10.18 Add hobby or interest

- **ID**: GH-018
- **Description**: As an admin, I want to add hobbies and interests so that visitors see my personality.
- **Acceptance criteria**:
  - Form with fields: name, description, category, icon/emoji
  - Optional: related links, photo gallery
  - Categories: Sports, Creative, Tech, Travel, Other
  - Save creates new hobby entry

### 10.19 Manage testimonials

- **ID**: GH-019
- **Description**: As an admin, I want to manage testimonials so that I can display social proof from colleagues.
- **Acceptance criteria**:
  - CRUD for testimonials
  - Fields: author name, author title, company, quote, avatar, date, LinkedIn URL
  - Featured flag for homepage display
  - Draft/published status
  - Only published testimonials show on public site

### 10.20 Create blog post

- **ID**: GH-020
- **Description**: As an admin, I want to create blog posts so that I can share my knowledge and thoughts.
- **Acceptance criteria**:
  - Form with fields: title, slug, excerpt, tags, featured image
  - Markdown editor for content with preview
  - Auto-calculated reading time
  - Draft/published status
  - Publish date (can be scheduled)

### 10.21 Edit blog post

- **ID**: GH-021
- **Description**: As an admin, I want to edit blog posts so that I can update and improve content.
- **Acceptance criteria**:
  - All fields editable
  - Version history (optional, future enhancement)
  - Preview mode before publishing changes

### 10.22 Upload media

- **ID**: GH-022
- **Description**: As an admin, I want to upload media files so that I can use them in my content.
- **Acceptance criteria**:
  - Drag-and-drop or file picker upload
  - Supported formats: JPEG, PNG, GIF, WebP, MP4 (< 10MB)
  - Progress indicator during upload
  - Automatic image optimization
  - Success shows thumbnail and copy URL button

### 10.23 Browse media library

- **ID**: GH-023
- **Description**: As an admin, I want to browse uploaded media so that I can find and reuse assets.
- **Acceptance criteria**:
  - Grid view of all uploaded media
  - Filter by type (image, video, GIF)
  - Search by filename
  - Click to view full size
  - Copy URL to clipboard

### 10.24 Delete media

- **ID**: GH-024
- **Description**: As an admin, I want to delete unused media so that I can keep storage clean.
- **Acceptance criteria**:
  - Delete button on each media item
  - Warning if media is used in content
  - Confirmation before deletion
  - File removed from storage

### 10.25 Update site settings

- **ID**: GH-025
- **Description**: As an admin, I want to update site settings so that I can customize metadata and behavior.
- **Acceptance criteria**:
  - Fields: site title, description, OG image, contact email
  - Resume/CV PDF upload
  - Save persists to database
  - Changes reflect on public site

### 10.26 View public portfolio with CMS data

- **ID**: GH-026
- **Description**: As a visitor, I want to see up-to-date portfolio content so that I can learn about the developer.
- **Acceptance criteria**:
  - Public pages fetch data from database instead of hardcoded file
  - All sections render: bio, skills, experience, projects, education, hobbies, testimonials
  - Page performance maintained (< 2s load time)
  - SEO metadata populated from CMS data

---

**PRD Complete.** This document outlines a comprehensive CMS for your portfolio website with all the features discussed.

Would you like me to create GitHub issues for these user stories?
