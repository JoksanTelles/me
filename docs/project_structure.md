# Project Structure Documentation

This document outlines the project's routing structure and component organization.

## Routing

The project uses Nuxt's file-based routing, where the structure of the `app/pages` directory defines the application's routes.

- **`/`**: `app/pages/index.vue`
- **`/archives`**: `app/pages/archives/index.vue`
- **`/archives/:slug`**: `app/pages/archives/[slug].vue`
- **`/archives/section/:tag`**: `app/pages/archives/section/[tag].vue`
- **`/devlog`**: `app/pages/devlog/index.vue`
- **`/devlog/:slug`**: `app/pages/devlog/[slug].vue`
- **`/p/:slug`**: `app/pages/p/[slug].vue` (Projects)
- **`/portfolio`**: `app/pages/portfolio/index.vue`
- **`/s/:slug`**: `app/pages/s/[slug]/index.vue` (Stories)
- **`/s/:slug/:chapter`**: `app/pages/s/[slug]/[chapter].vue` (Story Chapters)
- **`/stories`**: `app/pages/stories/index.vue`

## Components

Components are organized into three main categories within `app/components`: `app`, `storyblok`, and `ui`.

### App Components (`app/components/app`)

These are global application components used for layout and core functionalities.

- `colorModeToggle.vue`: A component to switch between light and dark mode.
- `Footer.vue`: The application's main footer.
- `Header.vue`: The application's main header.
- `mobileNav.vue`: The navigation component for mobile devices.
- `NewsletterForm.vue`: A form for newsletter subscriptions.

### Storyblok Components (`app/components/storyblok`)

These components are dynamically rendered by the Storyblok CMS based on the "blok" type. They are responsible for rendering specific content types.

- `Archive.vue`: Renders an archive list.
- `Chapter.vue`: Renders a story chapter.
- `Devlogs.vue`: Renders a list of developer logs.
- `Feature.vue`: Renders a specific feature section.
- `Grid.vue`: Renders a grid of content items.
- `Log.vue`: Renders a single log entry.
- `Page.vue`: Renders a generic content page.
- `Post.vue`: Renders a blog post.
- `Project.vue`: Renders a single project page.
- `Story.vue`: Renders a story.
- `Teaser.vue`: Renders a teaser or summary for a piece of content.

### UI Components (`app/components/ui`)

These are general-purpose UI elements, likely part of a component library like `shadcn-vue`. They are organized by component type.

- **`badge`**: `Badge.vue`
- **`button`**: `Button.vue`
- **`card`**: `Card.vue`, `CardContent.vue`, `CardDescription.vue`, `CardFooter.vue`, `CardHeader.vue`, `CardTitle.vue`
- **`dropdown-menu`**: A comprehensive set of components for dropdown menus.
- **`separator`**: `Separator.vue`
- **`sheet`**: Components for building overlay sheets (`Sheet.vue`, `SheetContent.vue`, etc.).
- **`sonner`**: A toast notification component.
