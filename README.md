# Portfolio

Interactive terminal-style portfolio site built as a static GitHub Pages project.

The site presents portfolio content through a browser-based terminal interface with a fake filesystem, command history, tab completion, a typed boot sequence, and pager-style file viewing.

## Features

- Full-screen terminal UI with Dracula-inspired styling
- Typed boot intro on first load
- Terminal-style navigation with `ls`, `cd`, `cat`, `more`, and `less`
- Command history with arrow keys
- Tab completion for commands and paths
- Easter eggs like `nano`, `vim`, and `emacs`
- Portfolio-specific commands such as `whoami`, `uname`, `uptime`, and `history`

## Project Structure

- `index.html` - page structure
- `style.css` - terminal styling and pager overlay
- `script.js` - command parser, fake filesystem, boot sequence, and interactions

## Local Preview

Run a simple static server from this directory:

```bash
python3 -m http.server
```

Then open `http://localhost:8000`.

## Deploying To GitHub Pages

1. Create a GitHub repository named `portfolio`.
2. Push the contents of this directory to that repository.
3. In GitHub, open `Settings` > `Pages`.
4. Under `Build and deployment`, choose `Deploy from a branch`.
5. Select your default branch and `/ (root)` as the folder.
6. Save, then wait for Pages to publish the site.

If you want the site at `https://mackyruiz.com`, point your custom domain at the GitHub Pages site and add a `CNAME` file later.

## Supported Commands

- `ls`
- `cd`
- `cat`
- `more`
- `less`
- `pwd`
- `whoami`
- `uname`
- `uptime`
- `history`
- `help`
- `clear`

## Notes

- This is a static frontend project with no backend.
- Portfolio content currently lives inside `script.js` as in-browser data.
- Contact links and some sample content should be updated before publishing.
