# Deploy to GitHub Pages

Deploy the project to GitHub Pages with build optimization.

## Usage

```
/deploy_to_github_page [branch]
```

## Arguments

- `branch` (optional): The branch to use for GitHub Pages deployment. Defaults to `gh-pages`.

## Description

This command will:
1. Build the project for production using `npm run build`
2. Create/switch to the specified deployment branch (default: gh-pages)
3. Copy build artifacts to the deployment branch
4. Push the deployment branch to GitHub
5. Configure GitHub Pages to serve from the specified branch

The command handles the entire deployment process including:
- Production build generation
- Branch management for GitHub Pages
- Asset copying and optimization
- Remote repository push
- GitHub Pages configuration

## Examples

Deploy to default gh-pages branch:
```
/deploy_to_github_page
```

Deploy to a custom branch:
```
/deploy_to_github_page main
```

Deploy to production branch:
```
/deploy_to_github_page production
```

## Prerequisites

- Project must be initialized as a git repository
- Remote origin must be configured
- npm build script must be available
- User must have push access to the repository

## Implementation

When executed, Claude will:

1. **Build Project**: Run `npm run build` to generate production assets
2. **Branch Management**: Create or switch to the deployment branch
3. **Content Preparation**: Copy build directory contents to deployment branch root
4. **Git Operations**: Add, commit, and push changes to the deployment branch
5. **GitHub Pages Setup**: Provide instructions for enabling GitHub Pages from the branch

The deployment process ensures the built application is properly configured for GitHub Pages hosting with correct asset paths and routing.