
# Contributing to Gadget Genie

Thank you for your interest in contributing to Gadget Genie! This document provides guidelines for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
- [Contact](#contact)

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold professional standards and treat all contributors with respect.

## Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/gadget-genie.git
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Start development server**
   ```bash
   npm run dev
   ```

## Development Process

### Branch Naming Convention
- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `hotfix/description` - Critical fixes
- `docs/description` - Documentation updates

### Commit Message Format
```
type(scope): brief description

Detailed description if needed

Closes #issue-number
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Pull Request Process

1. **Update your fork**
   ```bash
   git fetch origin
   git checkout main
   git merge origin/main
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write clean, documented code
   - Follow existing code style
   - Add tests if applicable

4. **Test your changes**
   ```bash
   npm run build
   npm run lint
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

6. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## Style Guidelines

### TypeScript/React
- Use TypeScript for all new files
- Follow React hooks patterns
- Use functional components
- Implement proper error boundaries

### CSS/Styling
- Use Tailwind CSS classes
- Follow mobile-first responsive design
- Maintain consistent spacing and colors
- Use CSS Grid/Flexbox appropriately

### File Organization
- Keep components small and focused
- Use proper imports/exports
- Follow established folder structure
- Create reusable hooks when appropriate

## Testing

- Write unit tests for utility functions
- Test React components with proper props
- Ensure responsive design works across devices
- Test authentication and authorization flows

## Documentation

- Update README.md for significant changes
- Document new API endpoints
- Add inline comments for complex logic
- Update type definitions

## Contact

For questions or discussions about contributing:
- Developer: Tyga Sparta
- Website: [tyga-sparta.com](https://tyga-sparta.com)
- Project Repository: This repository

## Recognition

Contributors will be recognized in the project documentation and release notes.

Thank you for contributing to Gadget Genie! 🚀
