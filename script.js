const fileSystem = {
  type: "dir",
  children: {
    "resume.txt": {
      type: "file",
      content: `
Macky Ruiz
IT Infrastructure & Security Leader

=====================================================================
  Summary
=====================================================================

15+ years building and scaling IT infrastructure, security programs,
and global IT organizations across startups, mid-sized companies,
and large enterprises.

Email: ruiz.mackyjo@gmail.com
LinkedIn: linkedin.com/in/mackyruiz

Specializing in:
- Infrastructure architecture
- Networking & data centers
- Security programs & compliance
- Enterprise SaaS ecosystems
- IT automation and DevOps

=====================================================================
  Professional Experience
=====================================================================
Manager, IT Operations & Cybersecurity (Head of IT)
Sonatus — Sunnyvale, CA
May 2022 - Present

- Founding IT hire responsible for building global IT infrastructure
  and security programs.
- Scaled IT operations as the company grew from 60 → 350 employees
  across multiple international offices.
- Built and led an 8-person global IT team across the US, South Korea,
  Philippines, and Ireland.
- Implemented ISO 27001 security framework and achieved certification
  within the first year.
- Designed enterprise security architecture including SSO, MFA, MDM,
  endpoint protection, DNS security, and backups.
- Re-architected corporate networking using Cisco Meraki and Cisco Nexus.
- Led vendor selection and deployment of colocation data center
  infrastructure and engineering labs.
- Managed enterprise SaaS lifecycle, security reviews, and ITSM processes.

Senior IT Engineer
Cisco Systems — San Jose, CA
Sep 2017 - May 2022

- Managed engineering lab infrastructure supporting the HyperFlex
  business unit across San Jose and Bangalore.
- Designed and maintained large-scale lab environments spanning
  178 racks and 3000+ servers.
- Automated infrastructure provisioning using NetBox DCIM and Ansible.
- Built proof-of-concept environments for next-gen infrastructure
  including Cisco HyperFlex and Cisco ACI.


IT Manager
Springpath — Sunnyvale, CA
Sep 2013 - Sep 2017

- Joined as founding IT engineer and later promoted to IT Manager.
- Built and managed a team of four IT professionals.
- Supported company growth from 20 → 150 employees.
- Designed corporate offices, engineering labs, and colocation
  data center infrastructure.
- Led IT integration after Springpath was acquired by Cisco.
- Architected AWS environments supporting secure ingestion
  and storage of customer data.

Early Career
Systems & Network Administrator — Cisco Systems
Lab Administrator — Harmonic
Engineering Lab Technician — Omneon

Supported large-scale engineering lab environments with
100+ racks and thousands of servers across networking,
compute, and storage systems.      

=====================================================================
  Skills & Technologies
=====================================================================
Infrastructure & Cloud
VMware, AWS, GCP, Cisco UCS, Dell PowerEdge, On-prem Data Centers

Networking
Cisco, Nexus, Meraki, HPE, Aruba

Storage
NetApp, Pure Storage, ZFS

Identity & Endpoint
JumpCloud, Cisco Duo

Security
Cisco Secure Endpoint
Cisco Umbrella
Cisco XDR
Secure Connect
Tenable Nessus

DevOps & Automation
Docker
Ansible
NetBox

Enterprise SaaS
Google Workspace
Slack
Jira
Confluence
GitHub Enterprise
HubSpot
Freshworks
Figma
BambooHR
Greenhouse
Expensify
Snipe-IT

=====================================================================
  Certifications 
=====================================================================
AWS Solutions Architect – Associate
AWS SysOps Administrator – Associate
Cisco CCNA Enterprise
VMware VCP-DCV
CompTIA Security+
CompTIA A+
ITIL v4 Foundation
LPI Linux Essentials

=====================================================================
  Education
=====================================================================
Western Governors University
B.S. Information Technology
Network Operations & Security


      
      `
    },
    projects: {
      type: "dir",
      children: {
        "opensuse-setup.txt": {
          type: "file",
          content: `openSUSE Tumbleweed bootstrap project

- Automated workstation and VM setup with Ansible
- Includes dev tooling, containers, virtualization, and CTF packages
- Designed for repeatable personal lab provisioning`
        },
        "security-lab.txt": {
          type: "file",
          content: `Security lab notes

- VM-based testing environment
- Packet capture and traffic inspection workflow
- Focus on safe experimentation, service analysis, and reproducible configs`
        }
      }
    },
    contact: {
      type: "dir",
      children: {
        "links.txt": {
          type: "file",
          content: `Contact

Email: ruiz.mackyjo@gmail.com
GitHub: github.com/mackyruiz
LinkedIn: linkedin.com/in/mackyruiz`
        }
      }
    }
  }
};

const output = document.getElementById("output");
const form = document.getElementById("terminal-form");
const input = document.getElementById("terminal-input");
const cwdLabel = document.getElementById("cwd");

let currentPath = [];
const commandHistory = [];
let historyIndex = -1;
let draftInput = "";
let pagerState = null;
let bootInProgress = true;

const commands = ["ls", "cd", "cat", "more", "less", "pwd", "whoami", "uname", "uptime", "resume", "help", "history","clear", "nano", "emacs", "vim"];
const resumeDownloadPath = "./Macky%20Ruiz%20Resume.pdf";

const bootBanner = [
  "                  _                   _                           ",
  "._ _ _  ___  ___ | |__ _ _  _ _  _ _ <_>.___    ___  ___ ._ _ _   ",
  "| ' ' |<_> |/ | '| / /| | || '_>| | || | / / _ / | '/ . \\| ' ' |  ",
  "|_|_|_|<___|\\_|_.|_\\_\\`_. ||_|  `___||_|/___<_>\\_|_.\\___/|_|_|_|  ",
  "                      <___'                                       "
].join("\n");

const bootMessages = [
  "Hey there! Welcome to my site! Type 'help' to see available commands.",
  "Try 'whoami', 'ls', or 'less resume.txt' or 'resume -d' to download my resume.",
];

const helpText = `Available commands:
ls [path]
 - this shows the contents of a directory. 
cd [path]
 - this changes the current directory. 
cat <file>
 - this shows the full contents of a file. 
more <file>
 - this also shows the contents of a file, but it uses a pager if the content is long.
less <file>
 - this is similar to 'more', but it has more advanced navigation features.
pwd
 - this shows the current directory you're in.
whoami
 - this shows a little bit about me and the purpose of this site.
uname
 - this shows the system information for this terminal environment.
uptime
 - how long I've been building things in IT
resume -d
 - downloads my PDF resume.
history
 - my career history
help
 - this shows the list of available commands and their descriptions.
clear`;

function getNode(pathParts) {
  let node = fileSystem;

  for (const part of pathParts) {
    if (!node.children || !node.children[part]) {
      return null;
    }
    node = node.children[part];
  }

  return node;
}

function normalizePath(rawPath) {
  if (!rawPath || rawPath === ".") {
    return [...currentPath];
  }

  const absolute = rawPath.startsWith("/");
  const base = absolute ? [] : [...currentPath];
  const parts = rawPath.split("/").filter(Boolean);

  for (const part of parts) {
    if (part === ".") {
      continue;
    }

    if (part === "..") {
      base.pop();
      continue;
    }

    base.push(part);
  }

  return base;
}

function currentDisplayPath() {
  return currentPath.length ? `~/${currentPath.join("/")}` : "~";
}

function scrollToBottom() {
  requestAnimationFrame(() => {
    form.scrollIntoView({ block: "end" });
    output.scrollTop = output.scrollHeight;
  });
}

function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function getDirectoryEntries(pathArg = "") {
  const trimmedPath = pathArg.trim();
  const endsWithSlash = trimmedPath.endsWith("/");
  const parts = trimmedPath.split("/");
  const partial = endsWithSlash ? "" : (parts.pop() || "");
  const basePathRaw = endsWithSlash ? trimmedPath : parts.join("/");
  const basePath = normalizePath(basePathRaw);
  const baseNode = getNode(basePath);

  if (!baseNode || baseNode.type !== "dir") {
    return [];
  }

  return Object.entries(baseNode.children)
    .filter(([name]) => name.startsWith(partial))
    .map(([name, child]) => {
      const prefix = basePathRaw ? `${basePathRaw.replace(/\/+$/, "")}/` : "";
      return `${prefix}${name}${child.type === "dir" ? "/" : ""}`;
    });
}

function getCompletionOptions(rawValue) {
  const trimmedStart = rawValue.trimStart();
  const hasTrailingSpace = /\s$/.test(rawValue);
  const tokens = trimmedStart.split(/\s+/).filter(Boolean);

  if (!tokens.length) {
    return commands;
  }

  if (tokens.length === 1 && !hasTrailingSpace) {
    return commands.filter((command) => command.startsWith(tokens[0]));
  }

  const [command, ...args] = tokens;
  if (!["ls", "cd", "cat", "more", "less"].includes(command)) {
    return [];
  }

  const pathFragment = hasTrailingSpace ? "" : args.join(" ");
  const matches = getDirectoryEntries(pathFragment);

  if (command === "cd") {
    return matches.filter((entry) => entry.endsWith("/"));
  }

  return matches;
}

function longestCommonPrefix(values) {
  if (!values.length) {
    return "";
  }

  let prefix = values[0];
  for (const value of values.slice(1)) {
    while (!value.startsWith(prefix) && prefix) {
      prefix = prefix.slice(0, -1);
    }
  }

  return prefix;
}

function applyTabCompletion() {
  const rawValue = input.value;
  const trimmedStart = rawValue.trimStart();
  const leadingWhitespace = rawValue.slice(0, rawValue.length - trimmedStart.length);
  const hasTrailingSpace = /\s$/.test(rawValue);
  const tokens = trimmedStart.split(/\s+/).filter(Boolean);
  const options = getCompletionOptions(rawValue);

  if (!options.length) {
    return;
  }

  if (!tokens.length) {
    input.value = `${leadingWhitespace}${options.length === 1 ? `${options[0]} ` : longestCommonPrefix(options)}`;
    return;
  }

  if (tokens.length === 1 && !hasTrailingSpace) {
    const prefix = options.length === 1 ? `${options[0]} ` : longestCommonPrefix(options);
    input.value = `${leadingWhitespace}${prefix}`;
    return;
  }

  const command = tokens[0];
  const args = hasTrailingSpace ? [] : tokens.slice(1, -1);
  const completedPath = options.length === 1 ? options[0] : longestCommonPrefix(options);
  const rebuilt = [command, ...args, completedPath].filter(Boolean).join(" ");
  input.value = `${leadingWhitespace}${rebuilt}${options.length === 1 ? " " : ""}`;
}

function navigateHistory(direction) {
  if (!commandHistory.length) {
    return;
  }

  if (direction === "up") {
    if (historyIndex === -1) {
      draftInput = input.value;
      historyIndex = commandHistory.length - 1;
    } else if (historyIndex > 0) {
      historyIndex -= 1;
    }
  }

  if (direction === "down") {
    if (historyIndex === -1) {
      return;
    }

    if (historyIndex < commandHistory.length - 1) {
      historyIndex += 1;
    } else {
      historyIndex = -1;
      input.value = draftInput;
      return;
    }
  }

  input.value = commandHistory[historyIndex];
}

function appendEntry(content, className = "entry--response", allowHtml = false) {
  const entry = document.createElement("div");
  entry.className = `entry ${className}`;
  if (allowHtml) {
    entry.innerHTML = content;
  } else {
    entry.textContent = content;
  }
  output.insertBefore(entry, form);
  scrollToBottom();
}

function appendPrompt(command) {
  appendEntry(
    `<div class="prompt-inline"><span class="prompt">guest@mackyruiz</span><span class="prompt-separator">:</span><span class="cwd">${currentDisplayPath()}</span><span class="prompt-symbol">$</span><span>${escapeHtml(command)}</span></div>`,
    "entry--command",
    true
  );
}

function appendBanner(content) {
  appendEntry(`<pre class="boot-banner">${escapeHtml(content)}</pre>`, "entry--response", true);
}

function createEntry(className = "entry--response", allowHtml = false) {
  const entry = document.createElement("div");
  entry.className = `entry ${className}`;
  entry.dataset.allowHtml = allowHtml ? "true" : "false";
  output.insertBefore(entry, form);
  scrollToBottom();
  return entry;
}

async function typeIntoEntry(entry, content, delay = 18) {
  for (let index = 0; index < content.length; index += 1) {
    const nextValue = content.slice(0, index + 1);
    if (entry.dataset.allowHtml === "true") {
      entry.innerHTML = nextValue;
    } else {
      entry.textContent = nextValue;
    }
    scrollToBottom();
    await sleep(delay);
  }
}

async function typeLine(content, className = "entry--response", delay = 18) {
  const entry = createEntry(className);
  await typeIntoEntry(entry, content, delay);
}

async function typeBanner(content, delay = 3) {
  const entry = createEntry("entry--response", true);
  entry.innerHTML = '<pre class="boot-banner"></pre>';
  const pre = entry.querySelector(".boot-banner");

  for (let index = 0; index < content.length; index += 1) {
    pre.textContent = content.slice(0, index + 1);
    scrollToBottom();
    await sleep(delay);
  }
}

function appendInterruptPrompt(command) {
  appendEntry(
    `<div class="prompt-inline"><span class="prompt">guest@mackyruiz</span><span class="prompt-separator">:</span><span class="cwd">${currentDisplayPath()}</span><span class="prompt-symbol">$</span><span>${escapeHtml(command)}</span><span class="error">^C</span></div>`,
    "entry--command",
    true
  );
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function formatLs(node) {
  return Object.entries(node.children)
    .map(([name, child]) => child.type === "dir" ? `<span class="dir">${name}/</span>` : `<span>${name}</span>`)
    .join("");
}

function printHelp() {
  appendEntry(helpText);
}

function downloadResume() {
  const link = document.createElement("a");
  link.href = resumeDownloadPath;
  link.download = "Macky-Ruiz-Resume.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function renderFile(content) {
  appendEntry(content);
}

function ensurePager() {
  let pager = document.getElementById("pager");
  if (pager) {
    return pager;
  }

  pager = document.createElement("section");
  pager.id = "pager";
  pager.className = "pager hidden";
  pager.innerHTML = `
    <div class="pager__content"></div>
    <div class="pager__status"></div>
  `;
  document.querySelector(".terminal").appendChild(pager);
  return pager;
}

function closePager() {
  pagerState = null;
  const pager = document.getElementById("pager");
  if (pager) {
    pager.classList.add("hidden");
  }
  form.classList.remove("prompt-row--disabled");
  input.disabled = false;
  input.focus();
  scrollToBottom();
}

function renderPager() {
  if (!pagerState) {
    return;
  }

  const pager = ensurePager();
  const content = pager.querySelector(".pager__content");
  const status = pager.querySelector(".pager__status");
  const end = Math.min(pagerState.offset + pagerState.pageSize, pagerState.lines.length);
  const visibleLines = pagerState.lines.slice(pagerState.offset, end).join("\n");

  content.textContent = visibleLines;
  status.textContent = `${pagerState.fileName}  ${end}/${pagerState.lines.length}  q quit, j/k scroll, space next page`;
  pager.classList.remove("hidden");
}

function openPager(fileName, content) {
  const lines = content.split("\n");
  pagerState = {
    fileName,
    lines,
    offset: 0,
    pageSize: 18
  };

  form.classList.add("prompt-row--disabled");
  input.disabled = true;
  renderPager();
}

function handlePagerKey(event) {
  if (!pagerState) {
    return false;
  }

  if (event.ctrlKey && event.key.toLowerCase() === "c") {
    event.preventDefault();
    closePager();
    return true;
  }

  switch (event.key) {
    case "q":
    case "Escape":
      event.preventDefault();
      closePager();
      return true;
    case "ArrowDown":
    case "j":
      event.preventDefault();
      pagerState.offset = Math.min(pagerState.offset + 1, Math.max(0, pagerState.lines.length - 1));
      renderPager();
      return true;
    case "ArrowUp":
    case "k":
      event.preventDefault();
      pagerState.offset = Math.max(pagerState.offset - 1, 0);
      renderPager();
      return true;
    case " ":
    case "PageDown":
      event.preventDefault();
      pagerState.offset = Math.min(
        pagerState.offset + pagerState.pageSize,
        Math.max(0, pagerState.lines.length - 1)
      );
      renderPager();
      return true;
    case "PageUp":
      event.preventDefault();
      pagerState.offset = Math.max(pagerState.offset - pagerState.pageSize, 0);
      renderPager();
      return true;
    case "Home":
      event.preventDefault();
      pagerState.offset = 0;
      renderPager();
      return true;
    case "End":
      event.preventDefault();
      pagerState.offset = Math.max(0, pagerState.lines.length - pagerState.pageSize);
      renderPager();
      return true;
    default:
      return false;
  }
}

function listDirectory(pathArg) {
  const node = getNode(normalizePath(pathArg));
  if (!node) {
    appendEntry(`ls: cannot access '${pathArg}': No such file or directory`, "entry--response error");
    return;
  }

  if (node.type !== "dir") {
    appendEntry(pathArg, "entry--response");
    return;
  }

  appendEntry(`<div class="file-list">${formatLs(node)}</div>`, "entry--response", true);
}

function changeDirectory(pathArg) {
  const targetPath = normalizePath(pathArg || "/");
  const node = getNode(targetPath);

  if (!node) {
    appendEntry(`cd: no such file or directory: ${pathArg}`, "entry--response error");
    return;
  }

  if (node.type !== "dir") {
    appendEntry(`cd: not a directory: ${pathArg}`, "entry--response error");
    return;
  }

  currentPath = targetPath;
  cwdLabel.textContent = currentDisplayPath();
}

function readFile(pathArg, pager = false) {
  if (!pathArg) {
    appendEntry("Missing file operand.", "entry--response error");
    return;
  }

  const node = getNode(normalizePath(pathArg));

  if (!node) {
    appendEntry(`cannot open '${pathArg}': No such file or directory`, "entry--response error");
    return;
  }

  if (node.type !== "file") {
    appendEntry(`'${pathArg}' is a directory`, "entry--response error");
    return;
  }

  if (pager) {
    openPager(pathArg, node.content);
    return;
  }

  renderFile(node.content);
}

function clearTerminal() {
  output.replaceChildren(form);
  resetPromptState();
  cwdLabel.textContent = currentDisplayPath();
  scrollToBottom();
  input.focus();
}

function resetPromptState() {
  input.value = "";
  historyIndex = -1;
  draftInput = "";
}

function interruptCommand() {
  if (pagerState) {
    closePager();
    return;
  }

  appendInterruptPrompt(input.value);
  resetPromptState();
}

function runCommand(rawCommand) {
  if (bootInProgress) {
    return;
  }

  const command = rawCommand.trim();
  if (!command) {
    appendPrompt("");
    return;
  }

  commandHistory.push(command);
  historyIndex = -1;
  draftInput = "";

  appendPrompt(command);

  const [cmd, ...args] = command.split(/\s+/);
  const target = args.join(" ");

  switch (cmd) {
    case "help":
      printHelp();
      break;
    case "ls":
      listDirectory(target);
      break;
    case "pwd":
      appendEntry(currentDisplayPath());
      break;
    case "whoami":
      appendEntry(`
Hey there! I'm Macky. I do IT infrastructure and security stuff for the past 15 years

Most of my career has been spent helping fast-growing companies figure out
how to turn scrappy startup infrastructure into something reliable, secure,
and scalable. I've been lucky enough to do that at places like Cisco and
Springpath, and today I lead IT Operations & Cybersecurity at Sonatus.

I enjoy the mix of engineering and leadership that comes with IT. One day
that might mean designing networks or automating infrastructure, and the
next it might mean building security programs, helping teams work better,
or supporting a company as it grows globally.

At heart I'm still a builder. I like understanding how systems work,
improving them, and creating environments where engineers can move fast
without breaking things.

This site is a small project where I experiment, share ideas, and document
things I learn along the way.

Type "help" to explore the rest of the terminal.`);

      break;
    case "uname":
      appendEntry("MackyRuiz human 15yoe Silicon-Valley infrastructure-engineer security-builder x86_64 coffee-powered");
      break;
    case "history":
      appendEntry(`
1  Omneon - Engineering Lab Technician
2  Harmonic - Lab Administrator
3  Cisco - Systems & Network Administrator
4  Springpath - IT Engineer → IT Manager
5  Cisco - Senior IT Engineer
6  Sonatus - Head of IT Operations & Cybersecurity`);
      break;
    case "uptime":
      appendEntry("up 15 years, 5 companies, 1000s of servers managed, load average: coffee, curiosity, automation");
      break;
    case "resume":
      if (target === "-d") {
        downloadResume();
        appendEntry("Downloading resume: 'Macky Ruiz Resume.pdf'");
      } else {
        appendEntry("Usage: resume -d");
      }
      break;
    case "nano":
      appendEntry("c'mon, just use vim already.");
      break;
    case "emacs":
      appendEntry("Really? emacs? Just use vim.");
      break;
    case "vim":
      appendEntry("Yes, vim is a great editor.");
      break;
    case "cd":
      changeDirectory(target);
      break;
    case "cat":
      readFile(target);
      break;
    case "more":
    case "less":
      readFile(target, true);
      break;
    case "clear":
      clearTerminal();
      break;
    case "sudo":
      appendEntry("Nice try, but you do not have root here.");
      break;
    case `:(){ :|:& };:`:
      appendEntry("Woah there, let's not do that.");
      break;
    case "rm":
      appendEntry("rm? On this terminal? Nope, not gonna do it.");
      break;
    default:
      appendEntry(`${cmd}: command not found. Type 'help' for supported commands.`, "entry--response error");
  }
}

async function playBootSequence() {
  input.disabled = true;
  form.classList.add("prompt-row--disabled");
  cwdLabel.textContent = currentDisplayPath();

  appendBanner(bootBanner);
  await sleep(120);

  for (const message of bootMessages) {
    await typeLine(message);
    await sleep(90);
  }

  form.classList.remove("prompt-row--disabled");
  input.disabled = false;
  bootInProgress = false;
  input.focus();
  scrollToBottom();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = input.value;
  runCommand(value);
  input.value = "";
});

input.addEventListener("keydown", (event) => {
  if (pagerState) {
    return;
  }

  if (event.ctrlKey && event.key.toLowerCase() === "c") {
    event.preventDefault();
    interruptCommand();
    return;
  }

  if (event.key === "Tab") {
    event.preventDefault();
    applyTabCompletion();
    return;
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();
    navigateHistory("up");
    return;
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    navigateHistory("down");
  }
});

document.addEventListener("keydown", (event) => {
  if (handlePagerKey(event)) {
    return;
  }
});

document.addEventListener("click", () => {
  if (!pagerState) {
    input.focus();
    scrollToBottom();
  }
});

playBootSequence();
