# The AI-Native Frontend Developer — Complete Zero-to-Advanced Syllabus

> A full, sequenced curriculum for becoming an exceptional frontend engineer who builds *with* AI and builds products *powered by* AI.
> Snapshot of the industry: **November 2026**. Timeless foundations are separated from current tools throughout, so the syllabus stays useful as tools change.

---

## Table of Contents

- [Part I — Introduction to the Profession](#part-i--introduction-to-the-profession)
- [Part II — How to Read This Syllabus](#part-ii--how-to-read-this-syllabus)
- [Part III — The Complete Learning Sequence](#part-iii--the-complete-learning-sequence)
- [Part IV — The Syllabus](#part-iv--the-syllabus)
  - Stage 1 — Foundations
    - [Domain 1: Computer, Operating System and Command-Line Foundations](#domain-1-computer-operating-system-and-command-line-foundations)
    - [Domain 2: Internet and Web Fundamentals](#domain-2-internet-and-web-fundamentals)
  - Stage 2 — The Core Web Platform
    - [Domain 3: HTML](#domain-3-html)
    - [Domain 4: CSS](#domain-4-css)
    - [Domain 5: JavaScript](#domain-5-javascript)
    - [Domain 6: Programming, Problem-Solving and Computer Science Fundamentals](#domain-6-programming-problem-solving-and-computer-science-fundamentals)
  - Stage 3 — Professional Tooling and Typed JavaScript
    - [Domain 7: Version Control with Git and GitHub](#domain-7-version-control-with-git-and-github)
    - [Domain 8: Frontend Tooling and Build Systems](#domain-8-frontend-tooling-and-build-systems)
    - [Domain 9: TypeScript](#domain-9-typescript)
  - Stage 4 — Deep Platform Knowledge
    - [Domain 10: Browser Engineering](#domain-10-browser-engineering)
    - [Domain 11: Web Accessibility (Deep)](#domain-11-web-accessibility-deep)
  - Stage 5 — Frontend Engineering
    - [Domain 12: React — Fundamentals to Internals](#domain-12-react--fundamentals-to-internals)
    - [Domain 13: Styling Systems and UI Engineering](#domain-13-styling-systems-and-ui-engineering)
    - [Domain 14: Next.js and Meta-Frameworks](#domain-14-nextjs-and-meta-frameworks)
    - [Domain 15: The Wider Framework Landscape](#domain-15-the-wider-framework-landscape)
  - Stage 6 — Professional Engineering
    - [Domain 16: Testing and Quality](#domain-16-testing-and-quality)
    - [Domain 17: Debugging](#domain-17-debugging)
    - [Domain 18: Web Performance and Core Web Vitals](#domain-18-web-performance-and-core-web-vitals)
    - [Domain 19: Web Security](#domain-19-web-security)
    - [Domain 20: SEO, Discoverability and Internationalization](#domain-20-seo-discoverability-and-internationalization)
    - [Domain 21: Backend and Full-Stack Fundamentals](#domain-21-backend-and-full-stack-fundamentals)
    - [Domain 22: Deployment, CI/CD and Production Engineering](#domain-22-deployment-cicd-and-production-engineering)
    - [Domain 23: Design Systems and Design Engineering](#domain-23-design-systems-and-design-engineering)
    - [Domain 24: Frontend Architecture and Frontend System Design](#domain-24-frontend-architecture-and-frontend-system-design)
  - Stage 7 — AI Foundations and AI Engineering
    - [Domain 25: AI and Machine Learning Foundations](#domain-25-ai-and-machine-learning-foundations)
    - [Domain 26: LLM Application Engineering](#domain-26-llm-application-engineering)
    - [Domain 27: AI-Native Application Engineering](#domain-27-ai-native-application-engineering)
    - [Domain 28: AI-Assisted Software Development](#domain-28-ai-assisted-software-development)
  - Stage 8 — Senior, Staff and Principal Capabilities
    - [Domain 29: Engineering Judgment, Product Sense and Leadership](#domain-29-engineering-judgment-product-sense-and-leadership)
  - [Optional Specializations](#optional-specializations)
- [Part V — Cross-Cutting Resource Directory](#part-v--cross-cutting-resource-directory)
- [Part VI — Timeless Knowledge vs. Current Tools](#part-vi--timeless-knowledge-vs-current-tools)

---

# Part I — Introduction to the Profession

## What a frontend developer does

A frontend developer builds the part of software that people see, touch and interact with: the interface running in the browser (and increasingly in desktop, mobile and embedded web views). The job sits at the intersection of three disciplines:

1. **Software engineering** — writing correct, maintainable, testable, secure code.
2. **The web platform** — HTML, CSS, JavaScript, browser APIs, networking and rendering.
3. **Human experience** — usability, accessibility, performance as perceived by people, visual and interaction quality.

Frontend is not "the easy part." Modern frontends handle complex state, real-time data, offline behaviour, accessibility law, internationalization, security boundaries, performance budgets on low-end phones, and — now — streaming, non-deterministic AI output.

## What "AI-native" adds

"AI-native" describes two shifts that happened between 2023 and 2026:

1. **AI as the medium (what you build).** Products now contain language models, agents and retrieval systems as core features: chat and copilot interfaces, generative UI, agents that act on the user's behalf, semantic search, summarization, multimodal input. The frontend is where this non-deterministic behaviour meets humans — streaming tokens, partial structured objects, tool-call approvals, citations, undo, failure and uncertainty states, cost and latency budgets. Frameworks such as the Vercel AI SDK (v7, June 2026), protocols such as the Model Context Protocol (MCP, spec revision 2026-07-28), and model provider APIs from Anthropic, OpenAI and Google are now part of the frontend toolbox.
2. **AI as the collaborator (how you build).** Agentic coding tools (Claude Code, Cursor, GitHub Copilot agent mode, OpenAI Codex, and others) now explore codebases, write features, run tests and open pull requests. The developer's job moves up a level: specifying intent, decomposing work, providing context, reviewing and verifying output, owning architecture and quality. Teams such as Anthropic, Vercel, Linear and Stripe publicly describe engineers operating several agents in parallel while remaining accountable for every line that ships.

**What does not change:** fundamentals become *more* valuable, not less. You cannot review AI-generated code you do not understand, debug a rendering problem you cannot reason about, or catch an accessibility or security defect you have never learned to see. The AI-native developer is a strong engineer first.

## What distinguishes exceptional frontend engineers

Patterns that recur across engineering ladders and the writing of senior practitioners at Google, Vercel, Stripe, Airbnb, Meta and others:

| Average | Exceptional |
|---|---|
| Knows a framework's API | Understands the platform the framework abstracts (DOM, event loop, rendering, HTTP, caching) |
| Makes it work on their laptop | Makes it work on a slow phone, with a screen reader, in another language, on a flaky network |
| Copies patterns | Can explain *why* a pattern exists and when it is wrong |
| Treats accessibility/performance/security as afterthoughts | Treats them as design constraints from the first line |
| Accepts AI output that "looks right" | Specifies precisely, verifies rigorously, and knows where models fail |
| Writes code | Shapes product decisions, writes design docs, raises the team's quality bar |
| Uses design specs | Has design taste; collaborates with designers fluently; sweats interaction details |

## Career levels and what each expects

- **Junior / Entry:** Implements well-scoped features with guidance; solid HTML/CSS/JS/TypeScript; one framework; uses Git; writes basic tests; uses AI assistants safely and verifies their output.
- **Mid-level:** Owns features end to end; understands data fetching, state, routing, testing, accessibility, performance basics; debugs independently; reviews peers' code.
- **Senior:** Owns systems; designs component and application architecture; sets performance, accessibility and security standards; mentors; translates product goals into technical plans; designs AI features with evaluation and failure handling.
- **Staff:** Sets technical direction across teams; frontend platform, design-system and build-infrastructure decisions; writes RFCs; resolves cross-team ambiguity; defines how the organization uses AI agents in development safely.
- **Principal:** Organization- or industry-level technical strategy; long-horizon bets (framework migrations, AI platform architecture); multiplies many teams; external influence (standards, open source, talks).

The syllabus below covers everything up to staff level in depth and introduces principal-level concerns in Domain 29.

---

# Part II — How to Read This Syllabus

## Hierarchy

Every domain uses the same five-level hierarchy:

```
## Domain N: Main Domain
### N.1 Parent Topic
#### N.1.1 Topic
- **Subtopic**
  - Individual concept
```

## Labels

| Label | Meaning |
|---|---|
| **[Essential]** | Required for every professional frontend developer |
| **[Core-Senior]** | Expected at senior level and above; learn after the essentials |
| **[Optional]** | Valuable specialization; learn when your work requires it |

## Depth targets

Each domain states how deeply it must be understood:

| Depth | What it means |
|---|---|
| **D1 — Aware** | You know it exists, what problem it solves, and where to look it up |
| **D2 — Working** | You can use it correctly in everyday work with occasional reference |
| **D3 — Fluent** | You can use it without reference, explain it to others, and debug it |
| **D4 — Expert** | You understand internals, trade-offs and edge cases; you can design systems around it and teach it |

## Timeless vs. tooling

Each domain separates:
- **Timeless core** — concepts that have been stable for 10+ years or are grounded in standards (HTTP, DOM, accessibility, algorithms, rendering, closures, caching).
- **Current tools (2026 snapshot)** — today's best-in-class libraries and products. Learn them, but expect them to change.

## A rule for using AI while learning

Use AI assistants from day one, but as a **tutor, not a substitute**:
- Ask it to *explain*, *quiz you*, *critique your code*, and *give hints* — not to write your exercises.
- Type the code yourself during foundational stages (Domains 1–9). Muscle memory and error-reading skills are built here.
- Verify every factual claim against official documentation; models hallucinate APIs, especially newer ones.
- From Domain 28 onward you deliberately learn to delegate implementation to agents — after you can judge the output.

---

# Part III — The Complete Learning Sequence

## The dependency chain

```
STAGE 1  FOUNDATIONS
  Computer & OS & Command Line ──► Internet & Web Fundamentals
                                           │
STAGE 2  CORE WEB PLATFORM                 ▼
  HTML ──► CSS ──► JavaScript (core) ──► Programming & CS Fundamentals (DSA in JS)
                          │
STAGE 3  PROFESSIONAL TOOLING              ▼
  Git & GitHub ──► Tooling & Build Systems (npm, Vite, lint) ──► TypeScript
                          │
STAGE 4  DEEP PLATFORM KNOWLEDGE           ▼
  Browser Engineering ──► Accessibility (deep)
                          │
STAGE 5  FRONTEND ENGINEERING              ▼
  React fundamentals ──► React advanced ──► React internals
        │                     │
        ▼                     ▼
  Styling systems        Next.js & meta-frameworks ──► Wider framework landscape
                          │
STAGE 6  PROFESSIONAL ENGINEERING          ▼
  Testing ─ Debugging ─ Performance ─ Security ─ SEO/i18n
        ──► Backend & Full-Stack ──► Deployment/CI/CD/Production
        ──► Design Systems & Design Engineering ──► Frontend Architecture & System Design
                          │
STAGE 7  AI                                ▼
  AI/ML Foundations ──► LLM Application Engineering ──► AI-Native Application Engineering
                                                              │
                         AI-Assisted Development ◄────────────┘ (practised lightly throughout,
                                                                 mastered here)
                          │
STAGE 8  SENIOR+                           ▼
  Engineering judgment, product sense, technical leadership
```

## Why this order

1. **Computers and the internet first**, because every later concept (files, processes, requests, servers) assumes them.
2. **HTML before CSS before JavaScript**, because CSS styles a document that HTML defines, and JavaScript manipulates both.
3. **Core JavaScript before computer science**, because you need a language to practise algorithms in; but DSA comes before frameworks, because frameworks hide complexity you must later reason about.
4. **Git and tooling before TypeScript and React**, because every real project uses them and TypeScript requires a build setup.
5. **Browser engineering before React**, because React's performance model, effects and rendering only make sense once you understand the browser's event loop and rendering pipeline.
6. **React before Next.js**, because Next.js is React plus routing, server rendering, caching and deployment conventions.
7. **Professional engineering after a framework**, because testing, performance and security are learned best on real applications.
8. **Backend before AI engineering**, because LLM features are server-side integrations involving APIs, secrets, streaming, databases and authentication.
9. **AI foundations before AI engineering before AI-native architecture**, because you cannot design reliable agentic systems without understanding tokens, context windows, embeddings and failure modes.
10. **AI-assisted development is used lightly from the start but mastered last**, because delegation is only safe when you can verify.

## Building while learning

Every stage should end with something built and deployed. Suggested capstones (not a schedule):
- Stage 2: a multi-page accessible, responsive site in plain HTML/CSS/JS.
- Stage 3: the same site rebuilt with TypeScript and Vite, in Git, with linting.
- Stage 5: a React/Next.js application with routing, forms, data fetching and authentication.
- Stage 6: production-grade: tests, CI, performance budget, accessibility audit, error monitoring.
- Stage 7: an AI-native application: streaming chat with tool calling, RAG over your own documents, generative UI, an agent with human approval, evals and tracing.

---

# Part IV — The Syllabus

---

# STAGE 1 — FOUNDATIONS

---

## Domain 1: Computer, Operating System and Command-Line Foundations

**Label:** [Essential] · **Depth target:** D2 (D3 for the command line) · **Prerequisites:** None. Basic literacy and the ability to install software.

**Why it matters:** Every development tool — editors, terminals, package managers, compilers, servers, AI coding agents — assumes you understand files, processes, paths, permissions and the shell. Agentic coding tools run in the terminal; you must be able to read what they do.

### 1.1 How Computers Work

#### 1.1.1 Hardware fundamentals
- **The core components**
  - CPU: instructions, cores, clock speed, threads
  - Memory (RAM): volatile, fast, addressed storage
  - Storage (SSD/HDD): persistent storage; why disk is slower than RAM
  - GPU: parallel processors; why they matter for graphics and AI
  - Input/output devices; network interface
- **The memory hierarchy**
  - Registers → CPU caches (L1/L2/L3) → RAM → disk → network
  - Latency orders of magnitude ("latency numbers every programmer should know")
  - Why locality and caching matter at every level of software

#### 1.1.2 Data representation
- **Binary and number systems**
  - Bits, bytes, kilobytes → gigabytes
  - Binary, decimal, hexadecimal; converting between them
  - Signed integers, two's complement (conceptual)
  - Floating-point numbers and precision (why `0.1 + 0.2 !== 0.3`)
- **Text encoding**
  - ASCII, Unicode, code points
  - UTF-8 and why it dominates the web
  - Graphemes vs. code points vs. bytes (emoji, combining characters)
- **Media representation**
  - Pixels, color channels (RGB, alpha)
  - Raster vs. vector images
  - Compression: lossless vs. lossy

#### 1.1.3 How programs run
- **From source code to execution**
  - Source code, compilers, interpreters, just-in-time compilation
  - Machine code and bytecode (conceptual)
- **Processes and threads**
  - A process: running program with its own memory
  - Threads: concurrent paths of execution sharing memory
  - Concurrency vs. parallelism
- **Memory in programs**
  - Stack vs. heap
  - Allocation and garbage collection (conceptual)

### 1.2 Operating Systems

#### 1.2.1 Operating system fundamentals
- **What an OS does**
  - Kernel vs. user space
  - Process scheduling, memory management, device drivers
  - System calls (conceptual)
- **The major operating systems**
  - Windows, macOS, Linux; Unix heritage of macOS and Linux
  - Why most servers run Linux
  - WSL (Windows Subsystem for Linux) for Windows developers

#### 1.2.2 Files and directories
- **The file system**
  - Files, directories (folders), the tree structure
  - Root directory, home directory
  - Absolute vs. relative paths; `.` and `..`
  - Path separators (`/` vs `\`) and cross-platform consequences
- **File properties**
  - File extensions and MIME types
  - Hidden files and dotfiles (`.gitignore`, `.env`)
  - Text files vs. binary files
  - Line endings (LF vs. CRLF)
- **Permissions and ownership**
  - Users, groups, read/write/execute
  - `chmod` and executable scripts
  - Administrator / root / `sudo` and why to use it sparingly

#### 1.2.3 Processes, environment and configuration
- **Environment variables**
  - `PATH` and how the shell finds programs
  - Setting variables per session and per project
  - Secrets in environment variables; never committing them
- **Process management**
  - Foreground and background processes
  - Ports and which process is listening
  - Killing hung processes; signals (`SIGINT`, `SIGTERM`)
- **Package managers for the OS**
  - Homebrew (macOS), winget/Chocolatey (Windows), apt (Debian/Ubuntu)

### 1.3 The Command Line

#### 1.3.1 Shell basics
- **What a shell is**
  - Terminal emulator vs. shell (bash, zsh, fish, PowerShell)
  - Prompt, command, arguments, flags/options
- **Navigation**
  - `pwd`, `ls`, `cd`, tab completion, history
- **File operations**
  - `mkdir`, `touch`, `cp`, `mv`, `rm` (and why `rm -rf` is dangerous)
  - `cat`, `less`, `head`, `tail`
- **Getting help**
  - `man`, `--help`, `tldr`

#### 1.3.2 Composition and text processing
- **Streams and redirection**
  - stdin, stdout, stderr
  - `>`, `>>`, `<`, `2>&1`
- **Pipes**
  - Composing small tools: `|`
  - `grep`/`ripgrep`, `sort`, `uniq`, `wc`, `find`, `xargs`
  - `sed` and `awk` (read-level familiarity)
  - `jq` for JSON
- **Exit codes**
  - Success (0) vs. failure; `&&` and `||`

#### 1.3.3 Scripting and automation
- **Shell scripts**
  - Shebang lines, variables, conditionals, loops
  - Making scripts executable
- **Remote and network tools**
  - `curl` for HTTP requests
  - `ssh` and key pairs
- **Developer workflow in the terminal**
  - Multiple panes/tabs; terminal multiplexers (tmux) — optional
  - Why AI coding agents (Claude Code, Codex CLI, Gemini CLI) live in the terminal

### 1.4 The Developer Environment

#### 1.4.1 Code editors
- **Editor fundamentals**
  - VS Code (and VS Code-based AI editors such as Cursor)
  - Command palette, multi-cursor, search across files, go-to-definition
  - Extensions: linters, formatters, language servers
- **Language Server Protocol (conceptual)**
  - Why editors understand code: diagnostics, completions, refactors

#### 1.4.2 Typing, reading and navigating code
- Touch typing and keyboard-driven editing
- Reading error messages and stack traces carefully
- Searching documentation effectively

### Resources — Domain 1

| Resource | Type | Creator / Org | URL | What to learn |
|---|---|---|---|---|
| CS50x: Introduction to Computer Science | Course (free) | Harvard University (David Malan) | https://cs50.harvard.edu/x/ | Computing fundamentals, C, memory, algorithms, web basics — the best single starting point |
| The Missing Semester of Your CS Education | Course (free) | MIT CSAIL | https://missing.csail.mit.edu/ | Shell, scripting, editors, data wrangling, Git, debugging — exactly the tooling gap most courses skip |
| Crash Course Computer Science | YouTube series | PBS / Carrie Anne Philbin | https://www.youtube.com/playlist?list=PL8dPuuaLjXtNlUrzyH5r6jN9ulIgZBpdo | Visual explanation of hardware, binary, OS, networking |
| Code: The Hidden Language of Computer Hardware and Software (2nd ed.) | Book | Charles Petzold | https://www.charlespetzold.com/code/ | How computers work from switches up to software |
| The Linux Command Line | Book (free online) | William Shotts | https://linuxcommand.org/tlcl.php | Comprehensive shell and command-line reference |
| Julia Evans' zines | Zines / blog | Julia Evans | https://wizardzines.com/ | Friendly, precise explanations of bash, terminals, DNS, HTTP, Git |
| VS Code documentation | Official docs | Microsoft | https://code.visualstudio.com/docs | Editor fundamentals, debugging, extensions |
| Latency Numbers Every Programmer Should Know | Interactive page | Colin Scott (after Jeff Dean) | https://colin-scott.github.io/personal_website/research/interactive_latency.html | Order-of-magnitude intuition for hardware and network latency |

---

## Domain 2: Internet and Web Fundamentals

**Label:** [Essential] · **Depth target:** D3 · **Prerequisites:** Domain 1.

**Why it matters:** Frontend performance, security, caching, API design, streaming AI responses and deployment are all networking problems in disguise.

### 2.1 Networking Fundamentals

#### 2.1.1 How the internet is built
- **Networks and the internet**
  - LAN, WAN, ISPs, backbone networks, undersea cables
  - Packets and packet switching
  - Routers, switches, modems
- **Network models**
  - The TCP/IP model: link, internet, transport, application layers
  - The OSI model as a reference vocabulary
- **Addressing**
  - IP addresses (IPv4, IPv6), public vs. private addresses
  - Ports and sockets
  - NAT (conceptual)

#### 2.1.2 Transport protocols
- **TCP**
  - Connection setup (three-way handshake)
  - Reliability, ordering, retransmission
  - Congestion control and slow start (why first loads are slow)
  - Head-of-line blocking
- **UDP**
  - Connectionless, unordered; when it is useful (real-time media, QUIC)
- **QUIC**
  - UDP-based transport for HTTP/3; reduced handshake latency; per-stream loss recovery

#### 2.1.3 Latency and bandwidth
- Latency vs. bandwidth vs. throughput
- Round-trip time (RTT) and why the number of round trips dominates web performance
- Mobile networks: variability, radio wake-up cost
- Edge locations and CDNs as latency reducers

### 2.2 DNS

#### 2.2.1 Domain Name System
- **Names to addresses**
  - Domain hierarchy: root, TLD, second-level domains, subdomains
  - Recursive resolvers, authoritative name servers
  - The resolution process step by step
- **Record types**
  - A, AAAA, CNAME, MX, TXT, NS, CAA
  - Apex domains and ALIAS/flattening
- **Caching and TTL**
  - Why DNS changes "take time to propagate"
- **Practical DNS**
  - Registrars, configuring a custom domain for a deployed site
  - `dig` / `nslookup`

### 2.3 HTTP and HTTPS

#### 2.3.1 HTTP fundamentals
- **The request/response model**
  - Clients and servers; stateless protocol
  - URLs: scheme, host, port, path, query, fragment
  - URL encoding
- **Requests**
  - Methods: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS
  - Safe and idempotent methods
  - Headers, body, content types (`application/json`, `multipart/form-data`, `text/event-stream`)
- **Responses**
  - Status code classes: 1xx, 2xx, 3xx, 4xx, 5xx
  - Key codes: 200, 201, 204, 301, 302, 304, 307, 308, 400, 401, 403, 404, 409, 422, 429, 500, 502, 503, 504
- **Headers you must know**
  - `Content-Type`, `Content-Length`, `Accept`, `Authorization`
  - `Cache-Control`, `ETag`, `Last-Modified`, `Vary`
  - `Set-Cookie`, `Cookie`
  - `Location`, `Retry-After`

#### 2.3.2 HTTP versions
- HTTP/1.1: persistent connections, pipelining limits
- HTTP/2: multiplexing, header compression, single connection
- HTTP/3: over QUIC
- What each change means for bundling and asset strategy

#### 2.3.3 HTTPS and TLS
- **Why encryption**
  - Confidentiality, integrity, authentication
- **TLS concepts**
  - Symmetric vs. asymmetric encryption (conceptual)
  - Certificates, certificate authorities, chain of trust
  - TLS handshake (conceptual); TLS 1.3
  - HSTS
- **Practical HTTPS**
  - Let's Encrypt and automatic certificates on modern hosts
  - Mixed content

#### 2.3.4 Cookies and state
- Cookies: attributes `Secure`, `HttpOnly`, `SameSite`, `Domain`, `Path`, `Max-Age`
- Sessions vs. tokens (introduced here, deepened in Domain 21)
- First-party vs. third-party cookies; the privacy-driven decline of third-party cookies

#### 2.3.5 HTTP caching
- Browser cache, proxy/CDN caches
- `Cache-Control` directives: `max-age`, `s-maxage`, `no-cache`, `no-store`, `private`, `public`, `immutable`, `stale-while-revalidate`
- Conditional requests and validation (`ETag`, `304 Not Modified`)
- Cache-busting with content hashes

#### 2.3.6 Cross-origin rules
- The same-origin policy
- CORS: simple vs. preflighted requests, `Access-Control-Allow-*` headers
- Why CORS errors are a server configuration issue

### 2.4 Clients, Servers and the Web

#### 2.4.1 Client-server architecture
- Clients (browsers, apps, scripts) vs. servers (programs listening on ports)
- Static vs. dynamic content
- Web servers, application servers, reverse proxies, load balancers
- Origin servers and CDNs; edge computing

#### 2.4.2 What happens when you type a URL
- URL parsing → DNS → TCP/QUIC → TLS → HTTP request → server processing → response → parsing → rendering
- Where each stage can be slow, and which tools reveal it (DevTools Network panel, waterfall)

#### 2.4.3 APIs
- **What an API is**
  - Interface contracts between programs
- **Web API styles**
  - REST: resources, verbs, representations
  - RPC-style APIs (JSON-RPC, tRPC)
  - GraphQL: schema, queries, mutations
  - Webhooks
- **Data formats**
  - JSON (structure, limitations), XML (recognition), form data, binary
- **Real-time transports (introduction)**
  - Polling, long-polling, Server-Sent Events, WebSockets, WebRTC — (deepened in Domain 21; SSE is central to AI streaming in Domain 27)

#### 2.4.4 The web's institutions
- W3C, WHATWG, TC39, IETF — who defines HTML, DOM, JavaScript and HTTP
- Living standards vs. versioned specifications
- How to read a specification (and why MDN is usually the better starting point)
- Browser compatibility data: Baseline, caniuse

### Resources — Domain 2

| Resource | Type | Creator / Org | URL | What to learn |
|---|---|---|---|---|
| MDN: How the web works / Web mechanics | Official docs | Mozilla | https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards | Internet, servers, DNS, packets at beginner level |
| MDN: HTTP | Official docs | Mozilla | https://developer.mozilla.org/en-US/docs/Web/HTTP | Complete HTTP reference: methods, headers, caching, CORS, cookies |
| Cloudflare Learning Center | Articles | Cloudflare | https://www.cloudflare.com/learning/ | DNS, CDN, TLS, DDoS, edge computing — clear diagrams |
| High Performance Browser Networking | Book (free online) | Ilya Grigorik (O'Reilly) | https://hpbn.co/ | TCP, TLS, HTTP/2, mobile networks, WebSocket, WebRTC — the networking book for web developers |
| How DNS Works | Comic | DNSimple | https://howdns.works/ | Visual introduction to DNS resolution |
| Computer Networking: A Top-Down Approach | Book + free lectures | Jim Kurose & Keith Ross | https://gaia.cs.umass.edu/kurose_ross/index.php | University-level networking, starting from the application layer |
| What happens when… | GitHub repository | Alex Gaynor and contributors | https://github.com/alex/what-happens-when | Extremely detailed walk-through of typing a URL and pressing Enter |
| Hussein Nasser (YouTube) | YouTube channel | Hussein Nasser | https://www.youtube.com/@hnasr | Deep dives on networking, HTTP, proxies, databases, backend engineering |
| web.dev: HTTP caching | Article | Google Chrome team | https://web.dev/articles/http-cache | Practical caching headers strategy |
| Baseline | Official initiative | WebDX Community Group / web.dev | https://web.dev/baseline | Which web features are safe to use across browsers |

---

# STAGE 2 — THE CORE WEB PLATFORM

---

## Domain 3: HTML

**Label:** [Essential] · **Depth target:** D3 (D4 for semantics, forms and accessibility) · **Prerequisites:** Domains 1–2.

**Why it matters:** HTML is the structure and meaning of every interface. Semantic HTML is the cheapest source of accessibility, SEO, and robustness — and the most frequently neglected by developers and by AI-generated code.

### 3.1 HTML Fundamentals

#### 3.1.1 Document structure
- **Anatomy of an HTML document**
  - `<!doctype html>`, `<html lang>`, `<head>`, `<body>`
  - Elements, tags, attributes, nesting, void elements
  - Character encoding (`<meta charset="utf-8">`)
  - Comments and whitespace handling
- **How browsers parse HTML**
  - Error tolerance; the parsing algorithm repairs invalid markup
  - Why valid markup still matters (predictability, accessibility)
  - Validation with the W3C validator

#### 3.1.2 Text content
- Headings `h1`–`h6` and document outline
- Paragraphs, line breaks, thematic breaks
- Inline semantics: `strong`, `em`, `mark`, `small`, `code`, `kbd`, `abbr`, `time`, `q`, `cite`, `sub`, `sup`
- Block quotations, preformatted text
- Lists: ordered, unordered, description lists
- Character references and entities

#### 3.1.3 Links and navigation
- Anchors: `href`, absolute vs. relative URLs, fragments
- `target`, `rel` (`noopener`, `noreferrer`, `nofollow`)
- Links vs. buttons: navigation vs. action — a foundational distinction
- `download`, `mailto:`, `tel:`

#### 3.1.4 Media and embedded content
- **Images**
  - `img`: `src`, `alt` (writing good alternative text), `width`/`height` (preventing layout shift)
  - `loading="lazy"`, `decoding`, `fetchpriority`
  - Responsive images: `srcset`, `sizes`, `<picture>`, art direction
  - Formats: JPEG, PNG, WebP, AVIF, SVG, GIF
- **SVG in HTML**
  - Inline SVG vs. `<img>`; `viewBox`; accessible SVGs
- **Audio and video**
  - `video`, `audio`, `source`, `track` (captions/subtitles)
- **Embedded content**
  - `iframe` and its security attributes (`sandbox`, `allow`)
  - `canvas` (introduction)

#### 3.1.5 Tables
- `table`, `caption`, `thead`, `tbody`, `tfoot`, `tr`, `th`, `td`
- `scope`, `headers`, `colspan`, `rowspan`
- Tables for data only, never for layout

### 3.2 Semantic HTML

#### 3.2.1 Sectioning and landmarks
- `header`, `nav`, `main`, `aside`, `footer`, `section`, `article`, `search`
- Landmarks and how screen-reader users navigate by them
- One `main` per page; heading hierarchy

#### 3.2.2 Choosing the right element
- `div`/`span` as last resort
- `button` vs. `a` vs. clickable `div` (and why the last is broken)
- `figure`/`figcaption`, `address`, `details`/`summary`, `dialog`
- Native interactive elements bring keyboard support, focus and accessibility for free

### 3.3 Forms

#### 3.3.1 Form structure
- `form`: `action`, `method`, submission, `enctype`
- `label` (explicit `for` and implicit wrapping) — every input needs a label
- `fieldset` and `legend` for groups
- `input` types: text, email, password, number, tel, url, search, date, time, checkbox, radio, file, range, color, hidden
- `select`, `option`, `optgroup`, `datalist`, `textarea`, `output`, `progress`, `meter`
- Buttons: `type="submit"`, `"button"`, `"reset"`

#### 3.3.2 Form behaviour and validation
- Built-in constraint validation: `required`, `min`, `max`, `minlength`, `maxlength`, `pattern`, `step`
- `autocomplete` tokens (critical for usability and password managers)
- `inputmode` and `enterkeyhint` for mobile keyboards
- The Constraint Validation API (preview of Domain 5)
- Accessible error messages: association, timing, focus management
- Progressive enhancement: forms that work before JavaScript loads

### 3.4 Metadata and the Document Head

#### 3.4.1 Head elements
- `title`, `meta name="description"`, `meta name="viewport"`
- `link rel`: stylesheet, icon, manifest, canonical, alternate (hreflang), preload, preconnect, modulepreload
- `script`: `defer`, `async`, `type="module"`
- `base` (and its pitfalls)

#### 3.4.2 Social and structured metadata
- Open Graph and Twitter/X card metadata
- Structured data: JSON-LD and schema.org (deepened in Domain 20)
- Favicons and web app manifest

### 3.5 Accessibility in HTML (First Pass)

#### 3.5.1 Accessible foundations
- Why accessibility: people with disabilities, situational limitations, legal requirements
- The accessibility tree: how HTML becomes roles, names, states
- Accessible names: label, `alt`, text content, `aria-label`
- Keyboard access: tab order, focusable elements, never removing focus outlines without replacement
- First rule of ARIA: use native HTML first
- (Full treatment in Domain 11)

### 3.6 Advanced HTML

#### 3.6.1 Modern interactive elements
- `dialog` and modal behaviour (`showModal`, `::backdrop`, focus trapping)
- The Popover API (`popover` attribute, `popovertarget`)
- `details`/`summary` with `name` for exclusive accordions
- The `inert` attribute
- Customizable `select` (`appearance: base-select`) — emerging

#### 3.6.2 Templates and components
- `template` and `slot`
- Custom elements and Shadow DOM (preview; covered in Domain 15)
- Declarative Shadow DOM

#### 3.6.3 Global attributes
- `id`, `class`, `data-*`, `hidden`, `tabindex`, `contenteditable`, `draggable`, `lang`, `dir`, `translate`, `spellcheck`, `title`

#### 3.6.4 Resource hints and loading behaviour
- `preload`, `prefetch`, `preconnect`, `dns-prefetch`, `modulepreload`
- Speculation Rules API for prerendering
- `fetchpriority` and the browser's resource prioritization

### Resources — Domain 3

| Resource | Type | Creator / Org | URL | What to learn |
|---|---|---|---|---|
| MDN: Structuring content with HTML | Official course | Mozilla | https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content | Beginner-to-intermediate HTML in the correct order |
| MDN HTML reference | Official docs | Mozilla | https://developer.mozilla.org/en-US/docs/Web/HTML | Every element and attribute |
| Learn HTML | Course (free) | web.dev / Google Chrome team | https://web.dev/learn/html | Modern semantic HTML, forms, metadata, focus |
| Learn Forms | Course (free) | web.dev | https://web.dev/learn/forms | Form design, validation, autocomplete, accessibility |
| Learn Images | Course (free) | web.dev | https://web.dev/learn/images | Responsive images, formats, performance |
| HTML Living Standard | Specification | WHATWG | https://html.spec.whatwg.org/multipage/ | The authoritative definition of HTML |
| The Odin Project — Foundations | Course (free) | The Odin Project community | https://www.theodinproject.com/paths/foundations/courses/foundations | Project-based HTML/CSS/JS path |
| freeCodeCamp Responsive Web Design | Course (free) | freeCodeCamp | https://www.freecodecamp.org/learn | Interactive beginner HTML and CSS |
| W3C Markup Validation Service | Tool | W3C | https://validator.w3.org/ | Checking markup validity |
| Manuel Matuzović's blog | Blog | Manuel Matuzović | https://www.matuzo.at/blog/ | Deep, accessibility-first HTML writing |


---

## Domain 4: CSS

**Label:** [Essential] · **Depth target:** D3 for fundamentals and layout; D4 for the cascade, box model and layout algorithms (senior) · **Prerequisites:** Domain 3.

**Why it matters:** CSS is a declarative language with its own algorithms (cascade, layout, stacking). Most "CSS is broken" frustration comes from not knowing those algorithms. Strong CSS is a distinguishing skill — and AI tools frequently produce bloated, fragile CSS that only a knowledgeable reviewer catches.

### 4.1 CSS Fundamentals

#### 4.1.1 How CSS works
- **Applying CSS**
  - External stylesheets, `<style>`, inline styles
  - Rules, selectors, declarations, properties, values
  - Comments, shorthand vs. longhand properties
- **The cascade**
  - Origins: user-agent, user, author
  - Importance (`!important`) and why to avoid it
  - Cascade layers (`@layer`)
  - Specificity calculation (IDs, classes/attributes/pseudo-classes, elements)
  - Source order
- **Inheritance**
  - Inherited vs. non-inherited properties
  - `inherit`, `initial`, `unset`, `revert`, `revert-layer`
- **Values and units**
  - Absolute units (`px`), relative units (`em`, `rem`, `%`, `ch`, `ex`, `lh`)
  - Viewport units (`vw`, `vh`, `svh`, `lvh`, `dvh`)
  - Container query units (`cqi`, `cqb`)
  - Computed, used and resolved values
  - Functions: `calc()`, `min()`, `max()`, `clamp()`, `var()`

#### 4.1.2 Selectors
- **Basic selectors**
  - Type, class, ID, universal, attribute selectors
- **Combinators**
  - Descendant, child (`>`), adjacent sibling (`+`), general sibling (`~`)
- **Pseudo-classes**
  - User action: `:hover`, `:focus`, `:focus-visible`, `:focus-within`, `:active`
  - Structural: `:first-child`, `:nth-child()`, `:nth-of-type()`, `:only-child`, `:empty`
  - Form state: `:checked`, `:disabled`, `:invalid`, `:user-invalid`, `:placeholder-shown`
  - Logical: `:is()`, `:where()` (zero specificity), `:not()`, `:has()` (the "parent selector")
- **Pseudo-elements**
  - `::before`, `::after`, `::first-line`, `::marker`, `::placeholder`, `::selection`, `::backdrop`
- **Nesting**
  - Native CSS nesting and the `&` selector

#### 4.1.3 The box model
- Content, padding, border, margin
- `box-sizing: content-box` vs. `border-box`
- Margin collapsing (and when it does not happen)
- Block vs. inline vs. inline-block formatting
- `display` values and the inner/outer display model
- Overflow: `visible`, `hidden`, `clip`, `scroll`, `auto`; scroll containers
- Logical properties: `margin-inline`, `padding-block`, `inset-inline-start` — direction-agnostic layout

#### 4.1.4 Typography and text
- `font-family`, font stacks, generic families, system font stack
- `font-size`, `font-weight`, `font-style`, `line-height`, `letter-spacing`
- Web fonts: `@font-face`, `font-display`, variable fonts, subsetting
- Text layout: `text-align`, `text-wrap: balance | pretty`, `white-space`, `word-break`, `overflow-wrap`, `hyphens`
- Text overflow and line clamping
- Vertical rhythm and readable line length (45–75 characters)

#### 4.1.5 Color and backgrounds
- Color formats: named, hex, `rgb()`, `hsl()`, `hwb()`
- Modern color: `oklch()`, `oklab()`, `color-mix()`, relative color syntax, wide-gamut (`display-p3`)
- Opacity and alpha
- Backgrounds: color, images, gradients (linear, radial, conic), `background-size`, `background-clip`
- Borders, `border-radius`, outlines, `box-shadow`, `filter`, `backdrop-filter`
- Contrast requirements (WCAG) — tie-in to Domain 11

### 4.2 Layout

#### 4.2.1 Normal flow and positioning
- Normal flow: block and inline formatting contexts
- Block formatting context (BFC) and what creates one (`display: flow-root`)
- `position`: static, relative, absolute, fixed, sticky
- Containing blocks
- Floats (legacy understanding; text wrapping around images)

#### 4.2.2 Stacking and layering
- `z-index` and stacking contexts — what creates a new stacking context
- Why `z-index: 9999` does not work
- The top layer (dialogs, popovers)

#### 4.2.3 Flexbox
- Flex container and flex items; main and cross axes
- `flex-direction`, `flex-wrap`, `justify-content`, `align-items`, `align-content`, `align-self`
- `gap`
- `flex-grow`, `flex-shrink`, `flex-basis`, the `flex` shorthand
- Minimum content size and the `min-width: 0` problem
- Ordering and its accessibility implications
- One-dimensional layout use cases

#### 4.2.4 CSS Grid
- Grid container, tracks, lines, cells, areas
- `grid-template-columns`/`rows`, `fr` unit, `repeat()`, `minmax()`
- `auto-fill` vs. `auto-fit` for responsive grids without media queries
- Named lines and `grid-template-areas`
- Explicit vs. implicit grid; `grid-auto-flow`, `dense`
- Alignment in grid
- Subgrid
- Two-dimensional layout use cases

#### 4.2.5 Intrinsic and algorithmic layout
- Intrinsic sizing: `min-content`, `max-content`, `fit-content`
- Aspect ratio
- Layout primitives (stack, cluster, sidebar, switcher, cover, center) — the "Every Layout" approach
- Designing layouts that adapt without breakpoints

### 4.3 Responsive Design

#### 4.3.1 Responsive foundations
- Mobile-first approach
- The viewport meta tag
- Media queries: width, range syntax, orientation
- Fluid typography and spacing with `clamp()`
- Responsive images (from Domain 3) and CSS

#### 4.3.2 Modern responsive techniques
- Container queries (`@container`, `container-type`) — component-level responsiveness
- Style queries (emerging)
- User preference media queries: `prefers-color-scheme`, `prefers-reduced-motion`, `prefers-contrast`, `forced-colors`
- Pointer and hover media features (`pointer: coarse`, `hover: none`)
- Touch target sizing

#### 4.3.3 Theming
- CSS custom properties as design tokens
- Light/dark themes; `color-scheme`; `light-dark()`
- Respecting system preferences and user overrides

### 4.4 Transitions and Animations

#### 4.4.1 Transitions
- `transition-property`, duration, timing functions, delay
- Easing: `ease`, `cubic-bezier()`, `linear()` for spring-like curves
- Transitioning to and from `display: none` (`transition-behavior: allow-discrete`, `@starting-style`)

#### 4.4.2 Keyframe animations
- `@keyframes`, `animation-*` properties, fill modes, iteration
- Animating cheaply: `transform` and `opacity` (compositor-only properties)
- `will-change` and its costs

#### 4.4.3 Modern motion
- View Transitions API (same-document and cross-document)
- Scroll-driven animations (`animation-timeline: scroll() | view()`)
- Anchor positioning for tooltips and popovers
- Respecting `prefers-reduced-motion`
- Motion design principles: purpose, duration, easing, choreography (tie-in to Domain 23)

### 4.5 Advanced CSS

#### 4.5.1 Advanced features
- Custom properties in depth: scoping, fallback, `@property` (typed, animatable custom properties)
- Cascade layers for architecture
- `@scope` for scoped styles
- `@supports` feature queries
- Math functions: trigonometric functions, `round()`, `mod()`
- Masks, clip paths, blend modes
- Transforms in 3D

#### 4.5.2 CSS and performance
- Selector matching cost (rarely the bottleneck) vs. layout and paint cost (often the bottleneck)
- `content-visibility` and `contain`
- Avoiding layout thrashing (Domain 10)
- Critical CSS and render-blocking

### 4.6 CSS Architecture

#### 4.6.1 Organizing CSS at scale
- **The problems**
  - Global namespace, specificity wars, dead code, unpredictability
- **Methodologies (historical and current)**
  - BEM naming
  - OOCSS, SMACSS, ITCSS (recognition level)
  - CUBE CSS (Composition, Utility, Block, Exception)
  - Utility-first CSS (Tailwind)
- **Scoping strategies**
  - CSS Modules
  - CSS-in-JS (runtime vs. zero-runtime/compile-time) and why runtime CSS-in-JS declined with React Server Components
  - Native `@scope` and cascade layers
- **Resets and base styles**
  - Modern CSS resets; normalize vs. reset

#### 4.6.2 Preprocessors and postprocessors
- Sass (recognition; many codebases still use it)
- PostCSS, Lightning CSS, autoprefixing, browser targets

### Timeless core vs. current tools — Domain 4

- **Timeless:** cascade, specificity, inheritance, box model, formatting contexts, stacking contexts, flexbox, grid, responsive principles, accessible contrast and motion.
- **Current tools (2026):** Tailwind CSS v4, CSS Modules, Lightning CSS, PostCSS, vanilla-extract, Panda CSS. Native CSS has absorbed many former preprocessor features (nesting, variables, color functions, scoping).

### Resources — Domain 4

| Resource | Type | Creator / Org | URL | What to learn |
|---|---|---|---|---|
| MDN: CSS styling basics & CSS layout | Official course | Mozilla | https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics | Correctly sequenced CSS fundamentals |
| Learn CSS | Course (free) | web.dev (Una Kravets, Andy Bell, et al.) | https://web.dev/learn/css | Box model, cascade, specificity, layout, modern features |
| CSS for JavaScript Developers | Course (paid) | Josh W. Comeau | https://css-for-js.dev/ | Mental models of CSS layout algorithms; highly regarded |
| Josh W. Comeau's blog | Blog | Josh W. Comeau | https://www.joshwcomeau.com/ | Interactive explanations of flexbox, grid, stacking contexts, animation |
| Every Layout | Book/site | Heydon Pickering & Andy Bell | https://every-layout.dev/ | Algorithmic, intrinsic layout primitives |
| A Complete Guide to Flexbox | Article | CSS-Tricks | https://css-tricks.com/snippets/css/a-guide-to-flexbox/ | Flexbox reference |
| A Complete Guide to CSS Grid | Article | CSS-Tricks | https://css-tricks.com/snippets/css/complete-guide-grid/ | Grid reference |
| Flexbox Froggy / Grid Garden | Games | Thomas Park / Codepip | https://flexboxfroggy.com/ · https://cssgridgarden.com/ | Playful practice for layout |
| Kevin Powell | YouTube channel | Kevin Powell | https://www.youtube.com/@KevinPowell | The most comprehensive CSS teacher on YouTube |
| Ahmad Shadeed's blog | Blog | Ahmad Shadeed | https://ishadeed.com/ | Interactive deep dives on layout, container queries, `:has()` |
| Modern CSS Solutions | Blog | Stephanie Eckles | https://moderncss.dev/ | Modern replacements for old CSS hacks |
| Utopia | Tool/method | Clearleft (James Gilyead, Trys Mudford) | https://utopia.fyi/ | Fluid type and space scales |
| CSS Working Group drafts | Specifications | W3C CSSWG | https://drafts.csswg.org/ | Authoritative and upcoming CSS specs |
| State of CSS survey | Survey | Devographics | https://stateofcss.com/ | Which CSS features and tools developers actually use |
| Chrome for Developers — CSS & UI | Articles | Google | https://developer.chrome.com/docs/css-ui | Anchor positioning, view transitions, scroll-driven animations |

---

## Domain 5: JavaScript

**Label:** [Essential] · **Depth target:** D4 (JavaScript is the core language of the profession) · **Prerequisites:** Domains 1–4. No prior programming assumed; this domain teaches programming fundamentals through JavaScript.

**Why it matters:** Everything else in frontend — TypeScript, React, Node.js, the AI SDKs — is JavaScript underneath. Deep JavaScript knowledge is the single most reliable predictor of frontend debugging ability.

### 5.1 Programming Fundamentals (in JavaScript)

#### 5.1.1 First programs
- **Running JavaScript**
  - The browser console; `<script>` tags; Node.js REPL
  - `console.log` and reading output
  - Statements, expressions, semicolons and automatic semicolon insertion
  - Comments
- **Thinking like a programmer**
  - Algorithms as step-by-step instructions
  - Decomposition: breaking problems into smaller problems
  - Reading code before writing it

#### 5.1.2 Variables and data types
- **Variables**
  - `let`, `const`, (`var` and why it is avoided)
  - Naming conventions; meaningful names
  - Declaration, assignment, reassignment vs. mutation
- **Primitive types**
  - `number` (IEEE 754 doubles, `NaN`, `Infinity`, safe integers), `bigint`
  - `string` (immutability, template literals, escape sequences, common methods)
  - `boolean`, `undefined`, `null`, `symbol`
- **Type checks and conversion**
  - `typeof` and its quirks (`typeof null`)
  - Explicit conversion: `Number()`, `String()`, `Boolean()`, `parseInt`, `parseFloat`
  - Implicit coercion; truthy and falsy values
  - `==` vs. `===`; `Object.is`

#### 5.1.3 Operators and expressions
- Arithmetic, assignment, comparison, logical operators
- Short-circuit evaluation; `??` nullish coalescing; `?.` optional chaining
- Logical assignment (`||=`, `&&=`, `??=`)
- Operator precedence
- Ternary operator

#### 5.1.4 Control flow
- `if`/`else`, `switch`
- Loops: `for`, `while`, `do...while`, `for...of`, `for...in` (and its pitfalls)
- `break`, `continue`, labels (recognition)
- Guard clauses and early returns

### 5.2 Functions

#### 5.2.1 Function fundamentals
- Function declarations, function expressions, arrow functions
- Parameters vs. arguments; default parameters; rest parameters
- Return values; implicit `undefined`
- Pure functions and side effects
- Hoisting of functions vs. variables

#### 5.2.2 Functions as values
- First-class functions
- Higher-order functions
- Callbacks
- Function composition
- Currying and partial application (conceptual)
- Recursion and the call stack

### 5.3 Scope and Closures

#### 5.3.1 Scope
- Global, function, block and module scope
- Lexical scoping
- The scope chain
- Temporal dead zone
- Shadowing

#### 5.3.2 Closures
- What a closure is: a function plus its lexical environment
- Practical uses: data privacy, factories, memoization, event handlers
- Stale closures (critical later for React hooks)
- Closures in loops (`let` vs. `var`)
- Closures and memory retention

### 5.4 Objects and Arrays

#### 5.4.1 Objects
- Object literals, properties, methods
- Dot vs. bracket notation; computed property names
- Shorthand properties and methods
- Property existence: `in`, `Object.hasOwn`
- Iteration: `Object.keys`, `values`, `entries`, `fromEntries`
- Property descriptors, getters and setters
- `Object.freeze`, `Object.seal`
- References vs. values; shallow vs. deep copy; `structuredClone`
- Equality by reference

#### 5.4.2 Arrays
- Creating, accessing, length
- Mutating methods: `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`
- Non-mutating methods: `map`, `filter`, `reduce`, `find`, `findIndex`, `findLast`, `some`, `every`, `includes`, `slice`, `concat`, `flat`, `flatMap`
- Change-by-copy methods: `toSorted`, `toReversed`, `toSpliced`, `with`
- `Array.from`, `Array.of`, `Object.groupBy`
- Sorting comparators and stability

#### 5.4.3 Destructuring and spread
- Array and object destructuring; defaults; renaming; nested destructuring
- Spread and rest in arrays, objects and function calls
- Immutable update patterns (vital for React)

#### 5.4.4 Other built-in collections
- `Map` and `Set` (and when to prefer them over objects/arrays)
- `WeakMap`, `WeakSet`, `WeakRef` (memory-aware references)
- Typed arrays and `ArrayBuffer` (for binary data, media, AI tensors)

#### 5.4.5 Strings, numbers and dates in depth
- String methods, Unicode-aware iteration, `Intl.Segmenter`
- Regular expressions: syntax, flags, groups, lookarounds, `matchAll`, `replaceAll`
- Number formatting and precision
- `Date` and its problems; the Temporal API (now shipping across browsers) as the modern replacement
- `Intl` APIs: `NumberFormat`, `DateTimeFormat`, `RelativeTimeFormat`, `PluralRules`, `Collator`

#### 5.4.6 JSON
- `JSON.stringify` and `JSON.parse`; replacers and revivers
- What cannot be serialized (functions, `undefined`, `BigInt`, cycles, `Date` fidelity)

### 5.5 `this`, Prototypes and Classes

#### 5.5.1 `this`
- Binding rules: default, implicit, explicit (`call`, `apply`, `bind`), `new`
- Arrow functions and lexical `this`
- Common `this` bugs in callbacks

#### 5.5.2 Prototypes
- The prototype chain
- `Object.create`, `Object.getPrototypeOf`
- Constructor functions and `new`
- Property lookup and shadowing
- How built-ins use prototypes

#### 5.5.3 Classes
- Class syntax as sugar over prototypes
- Constructors, methods, static members
- Public and private fields (`#private`)
- Inheritance with `extends` and `super`
- Composition over inheritance

### 5.6 The DOM

#### 5.6.1 DOM fundamentals
- The DOM as a tree of nodes; `document`, `window`
- Node types: element, text, comment, document fragment
- Selecting: `querySelector`, `querySelectorAll`, `getElementById`, `closest`, `matches`
- Traversal: parent, children, siblings
- Live vs. static collections

#### 5.6.2 Manipulating the DOM
- Creating and inserting: `createElement`, `append`, `prepend`, `before`, `after`, `replaceWith`, `remove`
- `textContent` vs. `innerHTML` (and the XSS risk of `innerHTML`)
- Attributes vs. properties; `dataset`
- `classList`, inline styles, `getComputedStyle`
- Measuring: `getBoundingClientRect`, `offset*`, `scroll*`
- Templates and document fragments for efficient insertion

#### 5.6.3 Events
- `addEventListener`, `removeEventListener`, options (`once`, `passive`, `capture`, `signal`)
- The event object; `target` vs. `currentTarget`
- Event propagation: capture, target, bubble
- `preventDefault` and `stopPropagation`
- Event delegation
- Common events: mouse, pointer, keyboard, focus, input/change, submit, scroll, resize
- Pointer events vs. mouse/touch events
- Custom events and `dispatchEvent`
- Keyboard handling and accessibility (key vs. code, focus management)

#### 5.6.4 Forms in JavaScript
- Reading form values; `FormData`
- Constraint Validation API
- Controlled submission with `fetch`

### 5.7 Asynchronous JavaScript

#### 5.7.1 Foundations of asynchrony
- Synchronous vs. asynchronous execution
- Single-threaded JavaScript and why blocking is harmful
- Callbacks and "callback hell"
- Timers: `setTimeout`, `setInterval`, `queueMicrotask`, `requestAnimationFrame`

#### 5.7.2 Promises
- Promise states: pending, fulfilled, rejected
- `then`, `catch`, `finally`, chaining
- `Promise.all`, `allSettled`, `race`, `any`, `Promise.withResolvers`
- Error propagation in chains
- Unhandled rejections

#### 5.7.3 async/await
- `async` functions return promises
- `await` and sequential vs. parallel awaiting
- `try`/`catch` with `await`
- Top-level `await` in modules
- Async iteration: `for await...of`, async generators — essential for streaming AI responses

#### 5.7.4 The event loop
- Call stack, task (macrotask) queue, microtask queue
- Rendering opportunities in the loop
- Ordering puzzles: `setTimeout` vs. promise vs. `queueMicrotask`
- Starvation: infinite microtasks blocking rendering
- (Browser-level detail in Domain 10)

#### 5.7.5 Network requests
- `fetch`: requests, responses, headers, status checking (fetch does not reject on 404)
- Request bodies: JSON, `FormData`, `Blob`
- Cancellation with `AbortController` and `AbortSignal.timeout`
- Reading streams: `response.body`, `ReadableStream`, `TextDecoderStream`
- Retries, exponential backoff, timeouts

### 5.8 Modules

#### 5.8.1 Module systems
- ES modules: `import`, `export`, default vs. named exports
- Module scope, strict mode by default
- Static vs. dynamic `import()`; code splitting
- CommonJS (`require`, `module.exports`) and interop with ESM
- Import maps (recognition)
- Module resolution and package entry points (`exports` field) — preview of Domain 8

### 5.9 Error Handling

#### 5.9.1 Errors
- `Error` and built-in subtypes; `throw`
- `try`/`catch`/`finally`
- Custom error classes; `cause`
- Errors in async code
- Global handlers: `window.onerror`, `unhandledrejection`
- Designing error messages and recovery
- Result-type patterns (returning errors as values) — optional

### 5.10 Iterators, Generators and Advanced Language Features

#### 5.10.1 Iteration protocols
- Iterables and iterators; `Symbol.iterator`
- Generators (`function*`, `yield`)
- Async generators and async iterables (streams of tokens)
- Iterator helpers (`map`, `filter`, `take` on iterators)

#### 5.10.2 Metaprogramming
- `Symbol` and well-known symbols
- `Proxy` and `Reflect` (how reactive frameworks such as Vue and MobX work)
- Tagged template literals

#### 5.10.3 Functional programming concepts
- Immutability, pure functions, referential transparency
- Map/filter/reduce thinking
- Composition and pipelines

### 5.11 Memory Management

#### 5.11.1 Memory in JavaScript
- Garbage collection: reachability, mark-and-sweep, generational GC (conceptual)
- Common leaks: forgotten timers, detached DOM nodes, closures holding large objects, unremoved listeners, growing caches
- `WeakMap`/`WeakRef`/`FinalizationRegistry`
- Profiling memory with DevTools heap snapshots (Domain 17)

### 5.12 Browser APIs Beyond the DOM (Survey)

#### 5.12.1 Commonly used Web APIs
- Storage: `localStorage`, `sessionStorage`, IndexedDB (deepened in Domain 10)
- URL and `URLSearchParams`; History API; Navigation API
- `IntersectionObserver`, `ResizeObserver`, `MutationObserver`
- Clipboard, File and Blob, drag and drop
- Web Workers and `postMessage`
- `BroadcastChannel`
- Geolocation, Notifications, Permissions (recognition)
- Media: `getUserMedia`, `MediaRecorder` (voice input for AI apps)
- Web Speech API (recognition)
- Canvas 2D (introduction)

### 5.13 The Language's Evolution

#### 5.13.1 How JavaScript evolves
- ECMAScript and TC39; the stage process (0–4)
- Annual releases; reading proposals
- Transpilation and polyfills

### Timeless core vs. current tools — Domain 5

- **Timeless:** types, scope, closures, prototypes, the event loop, async patterns, DOM events, immutability, memory and GC.
- **Current (2026):** Temporal API, iterator helpers, `Promise.withResolvers`, `Object.groupBy`, explicit resource management (`using`) — check Baseline status before relying on any new feature.

### Resources — Domain 5

| Resource | Type | Creator / Org | URL | What to learn |
|---|---|---|---|---|
| The Modern JavaScript Tutorial | Online book (free) | Ilya Kantor | https://javascript.info/ | The most complete, well-sequenced JavaScript tutorial, from basics to advanced |
| MDN JavaScript Guide | Official docs | Mozilla | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide | Language guide and reference |
| MDN: Dynamic scripting with JavaScript | Official course | Mozilla | https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting | Beginner JavaScript, DOM, events, async |
| Eloquent JavaScript (4th ed.) | Book (free online) | Marijn Haverbeke | https://eloquentjavascript.net/ | Programming fundamentals through JavaScript, with exercises |
| You Don't Know JS Yet | Book series (free on GitHub) | Kyle Simpson | https://github.com/getify/You-Dont-Know-JS | Scope, closures, objects, types — deep language understanding |
| Learn JavaScript | Course (free) | web.dev | https://web.dev/learn/javascript | Modern JavaScript fundamentals |
| What the heck is the event loop anyway? | Conference talk (JSConf EU 2014) | Philip Roberts | https://www.youtube.com/watch?v=8aGhZQkoFbQ | The classic visual explanation of the event loop |
| In The Loop | Conference talk (JSConf Asia 2018) | Jake Archibald | https://www.youtube.com/watch?v=cCOL7MC4Pl0 | Tasks, microtasks, animation frames and rendering |
| Tasks, microtasks, queues and schedules | Article | Jake Archibald | https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/ | Precise event loop ordering |
| JavaScript: The Hard Parts / Deep JavaScript Foundations | Courses (paid) | Will Sentance / Kyle Simpson (Frontend Masters) | https://frontendmasters.com/courses/ | Under-the-hood JavaScript: execution context, closures, async |
| ECMAScript specification | Specification | Ecma TC39 | https://tc39.es/ecma262/ | Authoritative language definition (advanced reference) |
| TC39 proposals | GitHub repository | TC39 | https://github.com/tc39/proposals | Tracking upcoming language features |
| Exploring JS books | Books (free online) | Axel Rauschmayer | https://exploringjs.com/ | Thorough, current coverage of each ECMAScript version |
| JavaScript Weekly | Newsletter | Cooperpress | https://javascriptweekly.com/ | Staying current with the ecosystem |

---

## Domain 6: Programming, Problem-Solving and Computer Science Fundamentals

**Label:** [Essential] for 6.1–6.4; [Core-Senior] for 6.5–6.6 · **Depth target:** D3 · **Prerequisites:** Domain 5 (sections 5.1–5.5 at minimum).

**Why it matters:** Frontend work constantly uses trees (DOM, component trees, ASTs), graphs (dependencies, routing), queues (event loop, task scheduling), caching, diffing and search. Interviews at leading companies still test this. And when AI writes the code, *you* must spot the O(n²) loop inside a render path.

### 6.1 Logic and Problem-Solving

#### 6.1.1 Computational thinking
- Decomposition, pattern recognition, abstraction, algorithm design
- Understanding the problem: inputs, outputs, constraints, edge cases
- Working examples by hand before coding
- Pseudocode
- Polya's problem-solving method (understand → plan → execute → review)

#### 6.1.2 Logic
- Boolean logic: AND, OR, NOT, XOR; truth tables
- De Morgan's laws (simplifying conditions)
- Predicates and invariants
- Basic proof thinking: why does this loop terminate? why is this correct?

#### 6.1.3 Debugging mindset (introduction)
- The scientific method applied to bugs: observe, hypothesize, test
- Reading error messages and stack traces
- Rubber-duck debugging
- (Full treatment in Domain 17)

### 6.2 Complexity Analysis

#### 6.2.1 Big-O notation
- Time and space complexity
- Common classes: O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ)
- Best, average, worst case; amortized analysis
- Practical intuition: when n is 10 vs. 10,000 vs. 10 million
- Complexity of JavaScript built-ins (`Array.includes` vs. `Set.has`, `shift` vs. `pop`)

### 6.3 Data Structures

#### 6.3.1 Linear structures
- Arrays and dynamic arrays
- Linked lists (singly, doubly)
- Stacks (undo/redo, call stack, parsing)
- Queues and deques (task scheduling, BFS)
- Ring buffers (log buffers, streaming windows)

#### 6.3.2 Hash-based structures
- Hash tables / maps and sets
- Hashing, collisions (conceptual)
- Use cases: lookups, deduplication, caching, indexing

#### 6.3.3 Trees
- Tree terminology: root, node, leaf, depth, height
- Binary trees, binary search trees
- Tree traversal: pre-order, in-order, post-order, level-order
- Heaps and priority queues (schedulers, top-k)
- Tries (autocomplete, prefix search)
- Real-world trees: DOM, component trees, abstract syntax trees, file systems, JSON

#### 6.3.4 Graphs
- Vertices, edges, directed/undirected, weighted
- Representations: adjacency list, adjacency matrix
- Use cases: dependency graphs (bundlers, package managers), navigation flows, social graphs, agent workflow graphs

#### 6.3.5 Caches
- LRU cache design (Map-based)
- Cache invalidation and eviction policies
- Memoization

### 6.4 Algorithms

#### 6.4.1 Fundamental techniques
- Iteration and recursion; converting between them
- Two pointers, sliding window
- Divide and conquer
- Searching: linear search, binary search
- Sorting: bubble/insertion (conceptual), merge sort, quicksort; stability
- Graph traversal: BFS, DFS; topological sort (dependency ordering)
- Backtracking (conceptual)
- Dynamic programming basics (memoized recursion, tabulation)
- Greedy algorithms (conceptual)

#### 6.4.2 Frontend-relevant algorithms
- Tree diffing and reconciliation (how virtual DOM diffing works — previewing Domain 12)
- Debounce and throttle (implement from scratch)
- Virtualized list windowing math
- Fuzzy search and string distance (Levenshtein)
- Text diffing (Myers' algorithm, conceptual) — relevant to AI code/edit review UIs
- Deep equality and deep clone
- Event emitter / pub-sub implementation
- Promise pool / concurrency limiter
- Cosine similarity (preview of embeddings, Domain 25)

### 6.5 Basic Computer Science

#### 6.5.1 How languages work
- Lexing, parsing, ASTs (how Babel, TypeScript, ESLint and Prettier work)
- Compilation vs. interpretation vs. JIT
- Type systems: static vs. dynamic, strong vs. weak, structural vs. nominal

#### 6.5.2 Concurrency concepts
- Concurrency vs. parallelism
- Race conditions, atomicity, locks (conceptual)
- Event-driven concurrency (JavaScript's model) vs. threads
- Idempotency and retries

#### 6.5.3 Programming paradigms
- Imperative, declarative, functional, object-oriented, reactive
- State machines and statecharts (UI flows, agent states)

#### 6.5.4 Discrete math and probability (light)
- Sets, functions, relations
- Basic combinatorics
- Probability and statistics basics (needed for A/B tests, evaluations and understanding LLM sampling)
- Vectors and dot products (needed for embeddings)

### 6.6 Software Design Fundamentals

#### 6.6.1 Writing good code
- Naming, functions that do one thing, avoiding deep nesting
- DRY vs. WET vs. AHA (avoid hasty abstractions)
- Coupling and cohesion
- SOLID principles (adapted for frontend)
- Separation of concerns
- Code smells and refactoring
- Comments that explain *why*

#### 6.6.2 Design patterns (frontend-relevant)
- Observer / pub-sub, strategy, factory, adapter, facade, decorator, command (undo/redo), mediator
- Module pattern, dependency injection
- When patterns help and when they add needless complexity

### Resources — Domain 6

| Resource | Type | Creator / Org | URL | What to learn |
|---|---|---|---|---|
| CS50x | Course (free) | Harvard | https://cs50.harvard.edu/x/ | Algorithms, data structures, memory — foundational CS |
| Grokking Algorithms (2nd ed.) | Book | Aditya Bhargava (Manning) | https://www.manning.com/books/grokking-algorithms-second-edition | Illustrated, beginner-friendly algorithms |
| Structure and Interpretation of Computer Programs (JS edition) | Book (free online) | Abelson, Sussman; JS adaptation by Henz & Wrigstad (MIT Press) | https://sourceacademy.org/sicpjs/index | Deep programming fundamentals in JavaScript |
| NeetCode | Site + YouTube | Navdeep Singh | https://neetcode.io/ | Structured algorithm practice by pattern |
| LeetCode | Practice platform | LeetCode | https://leetcode.com/ | Algorithm practice (use sparingly; focus on patterns) |
| GreatFrontEnd | Practice platform | GreatFrontEnd (ex-Meta engineers) | https://www.greatfrontend.com/ | Frontend-specific coding questions: debounce, promise utilities, DOM APIs |
| Visualgo | Interactive tool | National University of Singapore | https://visualgo.net/en | Visualizations of data structures and algorithms |
| Refactoring (2nd ed.) | Book | Martin Fowler | https://martinfowler.com/books/refactoring.html | Code smells and refactorings with JavaScript examples |
| A Philosophy of Software Design (2nd ed.) | Book | John Ousterhout | https://web.stanford.edu/~ouster/cgi-bin/book.php | Complexity, deep modules, interface design |
| Patterns.dev | Free book/site | Lydia Hallie & Addy Osmani | https://www.patterns.dev/ | Design, rendering and performance patterns for modern web apps |
| Crafting Interpreters | Book (free online) | Robert Nystrom | https://craftinginterpreters.com/ | How languages are parsed and executed (advanced/optional) |


---

# STAGE 3 — PROFESSIONAL TOOLING AND TYPED JAVASCRIPT

---

## Domain 7: Version Control with Git and GitHub

**Label:** [Essential] · **Depth target:** D3 (D4 for senior: history surgery, recovery, branching strategy) · **Prerequisites:** Domain 1. Start basic Git as early as Domain 3; complete this domain before team projects.

**Why it matters:** Git is how all professional software — and all AI agent output — is tracked, reviewed and reverted. Agentic tools create branches, commits, worktrees and pull requests; you must understand exactly what they did.

### 7.1 Git Fundamentals

#### 7.1.1 Core model
- **What version control solves**
  - History, collaboration, safe experimentation, rollback
- **Git's data model**
  - Repository, working tree, staging area (index), commits
  - Commits as snapshots, not diffs; commit hashes
  - The commit graph (a directed acyclic graph)
  - Blobs, trees, commits, tags (conceptual object model)
  - `HEAD`, branches as movable pointers, detached HEAD

#### 7.1.2 Everyday commands
- `init`, `clone`, `status`, `add`, `commit`, `log`, `diff`, `show`
- `.gitignore` (and never committing `.env`, `node_modules`, build output)
- Writing good commit messages; Conventional Commits
- `restore`, `reset` (soft/mixed/hard), `revert` — and which ones rewrite history

#### 7.1.3 Branching and merging
- `branch`, `switch`, `checkout`
- Merging: fast-forward vs. three-way merge
- Resolving merge conflicts
- Rebasing: linear history, interactive rebase (squash, reword, fixup)
- The golden rule: do not rewrite shared history

#### 7.1.4 Remote collaboration
- Remotes, `fetch`, `pull`, `push`, upstream tracking
- Forks and upstream syncing
- Force-push safety (`--force-with-lease`)

### 7.2 Advanced Git

#### 7.2.1 History and recovery
- `reflog` — recovering "lost" commits
- `cherry-pick`, `stash`
- `bisect` — binary search for the commit that introduced a bug
- `blame` and `log -S` / `log -G` for archaeology
- Tags and releases; semantic versioning

#### 7.2.2 Scaling Git
- `worktree` — multiple working directories (used heavily to run parallel AI agents on separate branches)
- Sparse checkout and partial clone for monorepos
- Git hooks (pre-commit, commit-msg) and tools like Husky / lint-staged
- Large files and Git LFS
- Signing commits

### 7.3 GitHub and Collaborative Workflows

#### 7.3.1 Pull requests and code review
- Pull requests: description, linking issues, draft PRs
- Writing reviewable PRs: small, focused, explained
- Reviewing code: correctness, readability, tests, security, accessibility, performance
- Review etiquette and constructive feedback
- Reviewing AI-generated PRs: higher scrutiny for plausible-but-wrong code

#### 7.3.2 Workflows
- Trunk-based development vs. GitFlow vs. GitHub Flow
- Feature flags as an alternative to long-lived branches
- Branch protection, required checks, CODEOWNERS
- Issues, project boards, discussions
- GitHub CLI (`gh`)

### Resources — Domain 7

| Resource | Type | Creator / Org | URL | What to learn |
|---|---|---|---|---|
| Pro Git (2nd ed.) | Book (free online) | Scott Chacon & Ben Straub | https://git-scm.com/book/en/v2 | The complete Git reference, including internals |
| Learn Git Branching | Interactive tutorial | Peter Cottle | https://learngitbranching.js.org/ | Visual practice of branching, rebasing, remotes |
| Oh Shit, Git!?! | Guide | Katie Sylor-Miller | https://ohshitgit.com/ | Recovering from common mistakes |
| GitHub Docs | Official docs | GitHub | https://docs.github.com/en | Pull requests, Actions, CLI, collaboration |
| Conventional Commits | Specification | Community | https://www.conventionalcommits.org/en/v1.0.0/ | Structured commit messages |
| Semantic Versioning | Specification | Tom Preston-Werner | https://semver.org/ | Version numbering rules |
| Trunk Based Development | Site | Paul Hammant | https://trunkbaseddevelopment.com/ | Branching strategy used by high-performing teams |
| Google Engineering Practices: Code Review | Guide | Google | https://google.github.io/eng-practices/review/ | How Google reviews code and writes reviewable changes |

---

## Domain 8: Frontend Tooling and Build Systems

**Label:** [Essential] (8.1–8.4), [Core-Senior] (8.5–8.6) · **Depth target:** D2 → D3 at senior level · **Prerequisites:** Domains 5, 7.

**Why it matters:** Every modern frontend is compiled, bundled, linted and formatted. Understanding the toolchain turns mysterious build failures into routine fixes, and is required before TypeScript and React.

### 8.1 Node.js as a Development Runtime

#### 8.1.1 Node.js basics for tooling
- What Node.js is: JavaScript outside the browser (V8 + libuv)
- Installing Node; version managers (nvm, fnm, Volta); LTS releases
- Running scripts; `process.argv`, `process.env`
- Alternative runtimes: Bun, Deno (awareness)

### 8.2 Package Management

#### 8.2.1 npm and the package ecosystem
- `package.json`: name, version, scripts, dependencies, devDependencies, peerDependencies, `type`, `exports`, `engines`
- Semantic version ranges (`^`, `~`), lockfiles and reproducible installs
- `npm install`, `npm ci`, `npx`
- Package managers: npm, pnpm (content-addressed store), Yarn, Bun
- `node_modules` resolution, hoisting, phantom dependencies
- Workspaces and monorepos (preview of 8.6)

#### 8.2.2 Dependency hygiene and supply chain
- Evaluating packages: maintenance, size, licence, downloads, security history
- `npm audit`, Dependabot, Renovate
- Supply-chain attacks (typosquatting, compromised maintainers, malicious post-install scripts)
- Slopsquatting: AI assistants hallucinating package names that attackers then register — always verify packages exist and are legitimate
- Bundle-size awareness (bundlephobia, pkg-size)

### 8.3 Code Quality Tooling

#### 8.3.1 Linting and formatting
- Linters: ESLint (flat config), typescript-eslint, eslint-plugin-jsx-a11y, React hooks rules
- Fast alternatives: Biome, Oxlint
- Formatting: Prettier (or Biome); why formatting should never be debated by humans
- Editor integration; format on save
- Pre-commit enforcement

#### 8.3.2 Editor configuration
- `.editorconfig`
- Workspace settings, recommended extensions

### 8.4 Compilation and Bundling

#### 8.4.1 Why build steps exist
- Modules, browser compatibility, performance, JSX/TypeScript transformation
- Development server vs. production build

#### 8.4.2 Transpilers and compilers
- Babel (plugins, presets; historical importance)
- SWC, esbuild, Oxc — Rust/Go-based fast compilers
- Targets and browserslist
- Polyfills vs. transpilation

#### 8.4.3 Bundlers
- What bundlers do: dependency graph, tree shaking, code splitting, minification, asset handling, hashing
- Vite (dev server on native ESM + Rollup/Rolldown production builds) — the default for most non-Next.js projects
- webpack (legacy and enterprise codebases)
- Turbopack (Next.js), Rspack, Parcel (awareness)
- Source maps
- Hot module replacement (HMR)
- Environment variables at build time and the risk of leaking secrets into client bundles

#### 8.4.4 Asset pipelines
- Image optimization, font handling, CSS processing
- Static asset hashing and long-term caching

### 8.5 Library Authoring (Core-Senior)

#### 8.5.1 Publishing packages
- ESM/CJS dual packages, the `exports` map, type declarations
- Tree-shakeable library design; `sideEffects`
- Bundling libraries (tsup, tsdown, Vite library mode, unbuild)
- Versioning and changelogs (Changesets)

### 8.6 Monorepos (Core-Senior)

#### 8.6.1 Monorepo tooling
- Why monorepos: shared code, atomic changes, design systems
- Workspaces (pnpm/npm/Yarn)
- Task runners and caching: Turborepo, Nx
- Remote caching, affected-only builds
- Internal packages and boundaries

### Resources — Domain 8

| Resource | Type | Creator / Org | URL | What to learn |
|---|---|---|---|---|
| Node.js Learn | Official docs | OpenJS Foundation | https://nodejs.org/en/learn | Node fundamentals, npm, modules |
| npm Docs | Official docs | GitHub/npm | https://docs.npmjs.com/ | package.json, scripts, publishing |
| Vite Guide | Official docs | Vite team (Evan You et al.) | https://vite.dev/guide/ | Modern dev server and bundling |
| ESLint docs | Official docs | OpenJS / ESLint | https://eslint.org/docs/latest/ | Linting configuration and rules |
| Prettier docs | Official docs | Prettier | https://prettier.io/docs/ | Code formatting and rationale |
| Biome | Official docs | Biome project | https://biomejs.dev/ | All-in-one fast linter/formatter |
| pnpm docs | Official docs | pnpm | https://pnpm.io/motivation | Efficient package management and workspaces |
| Turborepo docs | Official docs | Vercel | https://turborepo.com/docs | Monorepo task orchestration and caching |
| Socket.dev blog | Blog | Socket | https://socket.dev/blog | npm supply-chain security incidents and defences |

---

## Domain 9: TypeScript

**Label:** [Essential] · **Depth target:** D3 (D4 for library/design-system authors and senior engineers) · **Prerequisites:** Domains 5, 8.

**Why it matters:** TypeScript is the default language of professional frontend in 2026. Types are also the most effective guardrail for AI-generated code: they turn many hallucinations into compile errors, and give agents a precise description of the codebase.

### 9.1 TypeScript Fundamentals

#### 9.1.1 Getting started
- What TypeScript is: a typed superset of JavaScript; types are erased at runtime
- The compiler (`tsc`), `tsconfig.json`, `strict` mode
- Type checking vs. transpiling (why esbuild/SWC strip types without checking)
- Node's native type stripping (awareness)
- The TypeScript compiler's native (Go) port — "TypeScript 7" / `tsgo` — for much faster type checking (awareness)

#### 9.1.2 Basic types
- Primitive types: `string`, `number`, `boolean`, `bigint`, `symbol`, `null`, `undefined`
- Arrays, tuples (including named and optional elements)
- `any` (avoid), `unknown` (prefer), `never`, `void`
- Type inference and when to annotate
- Literal types; `as const`
- Union types and intersection types
- Type aliases vs. interfaces

#### 9.1.3 Functions
- Parameter and return types; optional and default parameters
- Function type expressions; call signatures
- Overloads
- `this` typing
- Typing callbacks and higher-order functions

#### 9.1.4 Objects and interfaces
- Object types; optional and readonly properties
- Index signatures; `Record`
- Interfaces: extending, declaration merging
- Excess property checks
- Structural typing ("duck typing") vs. nominal typing

### 9.2 Narrowing and Control Flow

#### 9.2.1 Narrowing techniques
- `typeof`, `instanceof`, `in`, equality narrowing
- Truthiness narrowing and its pitfalls
- Discriminated (tagged) unions — the most important modelling pattern in TS
- Exhaustiveness checking with `never`
- User-defined type guards (`x is T`) and assertion functions (`asserts x is T`)
- Control-flow analysis

### 9.3 Generics

#### 9.3.1 Generic fundamentals
- Generic functions, interfaces, classes, type aliases
- Constraints (`extends`)
- Default type parameters
- Inference from arguments
- `const` type parameters
- Generic components in React (Domain 12)

### 9.4 Type Operators and Utility Types

#### 9.4.1 Type operators
- `keyof`, `typeof` (type position), indexed access types (`T[K]`)
- Mapped types; key remapping with `as`
- Conditional types; `infer`
- Distributive conditional types
- Template literal types
- `satisfies` operator

#### 9.4.2 Built-in utility types
- `Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `Record`
- `Exclude`, `Extract`, `NonNullable`
- `ReturnType`, `Parameters`, `Awaited`, `InstanceType`
- `NoInfer`

### 9.5 Advanced Type System (Core-Senior)

#### 9.5.1 Type-level programming
- Recursive types (JSON types, deep partial)
- Variance (covariance, contravariance) and `in`/`out` annotations
- Branded/opaque types for IDs and validated values
- Function overloads vs. generics vs. conditional types
- Type performance: avoiding slow, deeply-instantiated types
- When type cleverness hurts readability

#### 9.5.2 Declaration files and modules
- `.d.ts` files, `declare`, ambient modules
- `@types` packages (DefinitelyTyped)
- Module resolution settings (`moduleResolution: bundler`, `NodeNext`)
- Project references for large codebases

### 9.6 TypeScript in Real-World Architecture

#### 9.6.1 Runtime validation at boundaries
- Why compile-time types do not validate runtime data (API responses, forms, LLM output)
- Schema libraries: Zod, Valibot, ArkType; Standard Schema interface
- Inferring types from schemas (single source of truth)
- Validating environment variables, API payloads, URL params — and model structured outputs (Domain 26)

#### 9.6.2 Typing applications
- Typing API layers end to end (OpenAPI codegen, tRPC, GraphQL codegen)
- Typing React props, events, refs, context, reducers
- Modelling state with discriminated unions (`idle | loading | success | error`)
- Making impossible states impossible
- Error types and result types
- Strictness options beyond `strict` (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`)

### Resources — Domain 9

| Resource | Type | Creator / Org | URL | What to learn |
|---|---|---|---|---|
| The TypeScript Handbook | Official docs | Microsoft | https://www.typescriptlang.org/docs/handbook/intro.html | The complete language guide |
| TypeScript Playground | Tool | Microsoft | https://www.typescriptlang.org/play | Experimenting with types and compiler output |
| Total TypeScript (incl. free tutorials and book) | Course/book | Matt Pocock | https://www.totaltypescript.com/ | Practical to advanced TypeScript, generics, type-level programming |
| Effective TypeScript (2nd ed.) | Book | Dan Vanderkam (O'Reilly) | https://effectivetypescript.com/ | 83 specific ways to improve your TypeScript |
| Type Challenges | Exercises | Anthony Fu & community | https://github.com/type-challenges/type-challenges | Type-system practice from easy to extreme |
| React TypeScript Cheatsheets | Community docs | typescript-cheatsheets | https://react-typescript-cheatsheet.netlify.app/ | Typing React components and hooks |
| Zod docs | Official docs | Colin McDonnell | https://zod.dev/ | Runtime validation and type inference |
| TypeScript blog | Official blog | Microsoft | https://devblogs.microsoft.com/typescript/ | Release notes, native compiler port |
| Matt Pocock (YouTube) | YouTube channel | Matt Pocock | https://www.youtube.com/@mattpocockuk | TypeScript tips, AI engineering with TypeScript |

---

# STAGE 4 — DEEP PLATFORM KNOWLEDGE

---

## Domain 10: Browser Engineering

**Label:** [Essential] for 10.1–10.5; [Core-Senior] for depth · **Depth target:** D3 (D4 for senior/staff — this is what separates senior frontend engineers) · **Prerequisites:** Domains 2–5.

**Why it matters:** Performance, jank, layout shift, memory leaks, event timing bugs and "it works but feels slow" all live here. React's scheduling, Server Components and streaming only make sense with this model.

### 10.1 Browser Architecture

#### 10.1.1 Multi-process architecture
- Browser process, renderer processes, GPU process, network service, utility processes
- Site isolation and its security purpose
- Tabs, frames and process allocation
- Main thread, compositor thread, raster threads, worker threads

#### 10.1.2 Browser engines
- Rendering engines: Blink (Chrome, Edge, Opera), WebKit (Safari), Gecko (Firefox)
- JavaScript engines: V8, JavaScriptCore, SpiderMonkey
- Why cross-browser testing still matters (especially Safari/iOS, where all browsers use WebKit)

### 10.2 The Rendering Pipeline

#### 10.2.1 From bytes to pixels
- **Parsing**
  - Bytes → characters → tokens → nodes → DOM
  - The preload scanner
  - Parser-blocking scripts; `defer`/`async`/modules
  - CSSOM construction; render-blocking CSS
- **Style**
  - Style recalculation; matching selectors to elements
- **Layout (reflow)**
  - Computing geometry; the layout tree
  - What triggers layout; layout scope
- **Paint**
  - Paint records; paint invalidation
- **Compositing**
  - Layers, layer promotion, compositor-only animations (`transform`, `opacity`)
  - Raster and GPU
- **The frame**
  - 60/120 Hz frame budgets (~16.7ms/~8.3ms)
  - `requestAnimationFrame` timing
  - Frame lifecycle: input → JS → style → layout → paint → composite

#### 10.2.2 Performance hazards in rendering
- Forced synchronous layout and layout thrashing (read/write interleaving)
- Long tasks (>50ms) and blocked input
- Large DOM size
- Expensive paints (large shadows, filters)
- Layout shifts and their causes

### 10.3 The JavaScript Engine

#### 10.3.1 How engines execute JavaScript
- Parsing, bytecode, interpreter (Ignition), optimizing compilers (TurboFan, Maglev in V8)
- Hidden classes / shapes and inline caches (why consistent object shapes are faster)
- Deoptimization
- Garbage collection: young/old generations, incremental and concurrent GC
- Parse and compile cost of large bundles (why JavaScript is the most expensive asset per byte)

### 10.4 The Event Loop in the Browser

#### 10.4.1 Scheduling
- Event loop processing model per the HTML spec
- Tasks vs. microtasks vs. rendering steps
- `requestAnimationFrame`, `requestIdleCallback`
- `scheduler.postTask` and `scheduler.yield` for yielding to the main thread
- Input event handling and coalescing
- How frameworks schedule work (React's scheduler, time slicing)

### 10.5 Web APIs, Storage and Caching

#### 10.5.1 Client-side storage
- Cookies (size, sent with every request)
- `localStorage`/`sessionStorage`: synchronous, string-only, origin-scoped
- IndexedDB: asynchronous, structured, large; wrapper libraries (idb, Dexie)
- Cache Storage API
- Origin Private File System (OPFS)
- Storage quotas, eviction, persistence
- Partitioned storage and privacy changes
- Choosing storage for offline AI chat history, drafts, embeddings

#### 10.5.2 Caching layers
- Memory cache, HTTP disk cache, service worker cache, back/forward cache (bfcache)
- CDN cache
- Making pages bfcache-eligible

#### 10.5.3 Service workers and offline
- Service worker lifecycle: register, install, activate, fetch
- Caching strategies: cache-first, network-first, stale-while-revalidate
- Progressive Web Apps: manifest, installability, offline
- Workbox (tooling)
- Background sync, push notifications (awareness)

#### 10.5.4 Workers and off-main-thread work
- Dedicated workers, shared workers
- Transferable objects and `SharedArrayBuffer` (cross-origin isolation requirements)
- Comlink-style RPC
- Running AI models in workers (Transformers.js, WebLLM) to keep UI responsive

#### 10.5.5 Graphics and compute APIs (awareness)
- Canvas 2D, WebGL, WebGPU
- WebAssembly
- OffscreenCanvas

### 10.6 Browser Security Model (Introduction)

#### 10.6.1 Security boundaries
- Same-origin policy; origins vs. sites
- Sandboxing, site isolation, Spectre mitigations
- Cross-origin isolation (COOP/COEP)
- Permissions model
- (Full treatment in Domain 19)

### 10.7 Browser DevTools Mastery

#### 10.7.1 DevTools panels
- Elements: DOM, styles, computed, layout overlays (flex/grid), accessibility tree
- Console: logging levels, live expressions, `$0`, `copy()`
- Sources: breakpoints, conditional/logpoints, step-through, local overrides
- Network: waterfall, throttling, request blocking, HAR files
- Performance: recording, flame charts, long tasks, layout shifts, interactions, Performance Insights
- Memory: heap snapshots, allocation timelines
- Application: storage, service workers, manifest, bfcache testing
- Lighthouse
- Rendering: paint flashing, layout shift regions, emulate media features
- DevTools MCP / AI assistance in DevTools (letting agents inspect live pages) — awareness

### Resources — Domain 10

| Resource | Type | Creator / Org | URL | What to learn |
|---|---|---|---|---|
| Inside look at modern web browser (4 parts) | Article series | Mariko Kosaka (Google) | https://developer.chrome.com/blog/inside-browser-part1 | Browser processes, navigation, rendering, input |
| How browsers work | Article | Tali Garsiel & Paul Irish | https://web.dev/articles/howbrowserswork | Parsing, rendering, layout, painting in depth |
| Rendering performance | Article | web.dev | https://web.dev/articles/rendering-performance | Pixel pipeline and frame budget |
| RenderingNG architecture | Article series | Chrome team | https://developer.chrome.com/docs/chromium/renderingng | How Chromium's modern rendering engine works |
| V8 blog | Engineering blog | V8 team (Google) | https://v8.dev/blog | JS engine internals, GC, compilers |
| Chrome DevTools docs | Official docs | Google | https://developer.chrome.com/docs/devtools | Every DevTools panel |
| web.dev: Storage for the web | Article | web.dev | https://web.dev/articles/storage-for-the-web | Storage options and quotas |
| Learn PWA | Course (free) | web.dev | https://web.dev/learn/pwa | Service workers, manifests, offline |
| Web Browser Engineering | Book (free online) | Pavel Panchekha & Chris Harrelson | https://browser.engineering/ | Build a browser in Python — the deepest way to understand browsers |
| MDN Web APIs | Official docs | Mozilla | https://developer.mozilla.org/en-US/docs/Web/API | Every browser API |
| HTML spec: event loops | Specification | WHATWG | https://html.spec.whatwg.org/multipage/webappapis.html#event-loops | Authoritative event loop processing model |

---

## Domain 11: Web Accessibility (Deep)

**Label:** [Essential] · **Depth target:** D3 for all; D4 for senior and design-system engineers · **Prerequisites:** Domains 3–5 (first-pass accessibility in Domain 3).

**Why it matters:** Accessibility is a legal requirement in many markets (the European Accessibility Act has applied since June 2025; ADA in the US; EN 301 549; national laws elsewhere), a quality signal, and a direct indicator of engineering skill. Accessible markup also makes interfaces legible to AI agents that operate browsers through the accessibility tree.

### 11.1 Accessibility Foundations

#### 11.1.1 Who accessibility serves
- Visual (blindness, low vision, color blindness), auditory, motor, cognitive, speech, vestibular disabilities
- Permanent, temporary and situational disabilities
- Ageing populations
- Assistive technologies: screen readers (NVDA, JAWS, VoiceOver, TalkBack, Narrator), screen magnifiers, switch devices, voice control, braille displays, alternative keyboards

#### 11.1.2 Standards and law
- WCAG 2.2: principles (Perceivable, Operable, Understandable, Robust), guidelines, success criteria, levels A/AA/AAA
- WCAG 3 (in development; awareness)
- WAI-ARIA 1.2 specification
- Legal landscape: ADA, Section 508, European Accessibility Act, EN 301 549, AODA, and others
- Accessibility statements and conformance (VPAT/ACR)

### 11.2 Accessible Semantics

#### 11.2.1 The accessibility tree
- Roles, names, descriptions, states, properties
- Accessible name computation (labels, content, `aria-labelledby`, `aria-label`, `title`)
- Inspecting the accessibility tree in DevTools

#### 11.2.2 ARIA
- The five rules of ARIA use
- Roles: landmark, widget, document structure, live region roles
- States and properties: `aria-expanded`, `aria-selected`, `aria-checked`, `aria-pressed`, `aria-current`, `aria-controls`, `aria-describedby`, `aria-invalid`, `aria-hidden`, `aria-busy`
- Live regions: `aria-live` politeness, `role="status"`, `role="alert"` — essential for streaming AI output and async updates
- "No ARIA is better than bad ARIA"

### 11.3 Keyboard and Focus

#### 11.3.1 Keyboard accessibility
- Tab order and DOM order
- `tabindex` values (0, -1; never positive)
- Visible focus indicators; `:focus-visible`; WCAG 2.2 focus appearance and not-obscured criteria
- Skip links
- Keyboard traps and how to avoid them

#### 11.3.2 Focus management
- Moving focus on route change in single-page apps
- Focus in dialogs: initial focus, trapping, restoring
- Roving tabindex and `aria-activedescendant` for composite widgets
- Focus after deletion, after async loading, after AI responses complete

### 11.4 Accessible Components and Patterns

#### 11.4.1 ARIA Authoring Practices patterns
- Buttons, links, toggle buttons
- Disclosure, accordion
- Dialog (modal), alert dialog
- Menu and menu button (and why most "menus" should be navigation lists)
- Tabs
- Combobox / autocomplete
- Listbox, tree view, grid
- Tooltip
- Carousel
- Toast/notifications

#### 11.4.2 Content accessibility
- Alternative text strategy (informative, decorative, functional, complex images)
- Captions, transcripts, audio description
- Color contrast (4.5:1 text, 3:1 large text and UI components); not relying on color alone
- Readable text, resizing to 200%, reflow at 320px width
- Motion and animation safety; vestibular disorders
- Cognitive accessibility: plain language, consistent navigation, error prevention, timeouts
- Accessible forms: labels, instructions, error identification and suggestions
- Accessible data tables and charts
- Accessible authentication (WCAG 2.2) — no cognitive function tests

#### 11.4.3 Accessibility of AI interfaces
- Announcing streamed content without overwhelming screen readers (batching, `aria-busy`, completion announcements)
- Keyboard access to chat inputs, message actions, citations, tool approvals
- Accessible voice and multimodal input
- Clear language in AI output; AI-assisted alt text with human review

### 11.5 Testing Accessibility

#### 11.5.1 Automated testing
- axe-core and its integrations (browser extension, Playwright, Storybook, jest-axe)
- Lighthouse accessibility audits
- What automation cannot catch (most issues require human judgment)

#### 11.5.2 Manual testing
- Keyboard-only testing
- Screen reader testing basics: VoiceOver (macOS/iOS), NVDA (Windows), TalkBack (Android)
- Zoom and reflow testing
- Forced colors / high contrast mode
- Testing with disabled users — the gold standard

### Resources — Domain 11

| Resource | Type | Creator / Org | URL | What to learn |
|---|---|---|---|---|
| WCAG 2.2 | Standard | W3C WAI | https://www.w3.org/TR/WCAG22/ | The success criteria |
| How to Meet WCAG (Quick Reference) | Official guide | W3C WAI | https://www.w3.org/WAI/WCAG22/quickref/ | Filterable, practical WCAG reference with techniques |
| ARIA Authoring Practices Guide (APG) | Official guide | W3C WAI | https://www.w3.org/WAI/ARIA/apg/ | Accessible widget patterns with examples |
| Learn Accessibility | Course (free) | web.dev | https://web.dev/learn/accessibility | Practical accessibility for developers |
| WebAIM | Articles & tools | Utah State University | https://webaim.org/ | Screen reader testing, contrast checker, WebAIM Million report |
| Inclusive Components | Book/blog | Heydon Pickering | https://inclusive-components.design/ | Building accessible components from first principles |
| The A11Y Project | Community site | The A11Y Project | https://www.a11yproject.com/ | Checklist, patterns, resources |
| Sara Soueidan's blog & Practical Accessibility course | Blog/course | Sara Soueidan | https://www.sarasoueidan.com/blog/ · https://practical-accessibility.today/ | Deep accessibility engineering |
| Deque / axe-core | Training & tools | Deque Systems | https://www.deque.com/ · https://github.com/dequelabs/axe-core | Accessibility rules, automated testing |
| Adrian Roselli's blog | Blog | Adrian Roselli | https://adrianroselli.com/ | Expert analysis of accessible patterns and common mistakes |
| Accessibility for Everyone | Book | Laura Kalbag (A Book Apart) | https://abookapart.com/products/accessibility-for-everyone | Accessible design and development introduction |


---

# STAGE 5 — FRONTEND ENGINEERING

---

## Domain 12: React — Fundamentals to Internals

**Label:** [Essential] (12.1–12.8), [Core-Senior] (12.9–12.11) · **Depth target:** D4 · **Prerequisites:** Domains 5, 8, 9, 10 (rendering and event loop).

**Why it matters:** React remains the dominant UI library globally, the default target of AI code generators and most AI UI kits (AI SDK UI, AI Elements, assistant-ui, CopilotKit), and the foundation of Next.js. Senior engineers are expected to understand not just its API but its rendering model.

**Current version context (Nov 2026):** React 19.x (19.2 added `<Activity>`, `useEffectEvent`, Performance Tracks); React Compiler 1.0 is stable and opt-in in major frameworks; Server Components are production-standard in Next.js.

### 12.1 Thinking in React

#### 12.1.1 Declarative UI
- Imperative DOM manipulation vs. declarative description of UI as a function of state
- `UI = f(state)`
- One-way data flow
- Thinking in React: break UI into a component hierarchy, find minimal state, decide where state lives

#### 12.1.2 Setting up React
- Starting with a framework (Next.js, React Router framework mode) or Vite
- Project structure basics
- React DevTools

### 12.2 Components and JSX

#### 12.2.1 JSX
- JSX as syntax for `createElement`/`jsx()` calls
- Expressions in JSX; conditional rendering patterns (`&&`, ternary, early return)
- Rendering lists; keys and why they matter (identity, not index)
- Fragments
- JSX differences from HTML: `className`, `htmlFor`, camelCase attributes, `style` objects
- Escaping and XSS safety; `dangerouslySetInnerHTML` and when it is (rarely) acceptable

#### 12.2.2 Components
- Function components; components as pure functions of props
- Props: passing data, `children`, default values, spreading props
- Component composition over configuration
- Typing props with TypeScript
- Purity rules: no side effects during render; Strict Mode double rendering

### 12.3 State and Events

#### 12.3.1 State
- `useState`; state as a snapshot
- Batching and the render cycle (trigger → render → commit)
- Updater functions
- Immutable updates of objects and arrays
- `useReducer` for complex state transitions
- Choosing state structure: avoid redundant and duplicated state; derive instead of sync
- Lifting state up; controlled vs. uncontrolled components
- Preserving and resetting state (component position in tree; `key` to reset)

#### 12.3.2 Events
- Synthetic events and event handler props
- Event propagation in React
- Passing handlers down

### 12.4 Hooks

#### 12.4.1 Built-in hooks
- State: `useState`, `useReducer`
- Context: `useContext`
- Refs: `useRef`; refs as escape hatches; DOM refs; `ref` as a prop (React 19)
- Effects: `useEffect`, `useLayoutEffect`, `useInsertionEffect`
- Performance: `useMemo`, `useCallback` (less necessary with React Compiler)
- `useId` for accessible IDs
- `useSyncExternalStore` for external stores
- `useTransition`, `useDeferredValue` (concurrent features)
- React 19: `use`, `useActionState`, `useFormStatus`, `useOptimistic`
- React 19.2: `useEffectEvent`, `<Activity>`

#### 12.4.2 Effects in depth
- Effects synchronize with external systems — they are not lifecycle methods
- Dependency arrays and the exhaustive-deps rule
- Cleanup functions; race conditions in data fetching effects
- "You Might Not Need an Effect": deriving data, event-driven logic, resetting state
- Stale closures in effects and handlers
- Effect events for non-reactive logic

#### 12.4.3 Custom hooks
- Extracting reusable stateful logic
- Rules of Hooks and why they exist (call order)
- Designing hook APIs
- Testing custom hooks

### 12.5 Context and Composition Patterns

#### 12.5.1 Context
- Avoiding prop drilling; provider/consumer
- Context performance pitfalls (re-render all consumers); splitting contexts
- Context for dependency injection, theming, auth, feature flags

#### 12.5.2 Composition patterns
- Children and slots
- Compound components (e.g., `<Tabs><Tabs.List>…`)
- Render props and higher-order components (legacy recognition)
- Headless components and hooks
- Polymorphic components (`as`/`asChild` patterns)
- Controlled/uncontrolled hybrid components ("state reducer" and "control props" patterns)

### 12.6 Forms in React

#### 12.6.1 Form handling
- Controlled inputs vs. uncontrolled inputs with `FormData`
- React 19 form Actions: `<form action={fn}>`, `useActionState`, `useFormStatus`
- Optimistic UI with `useOptimistic`
- Form libraries: React Hook Form, TanStack Form, Conform
- Schema validation with Zod/Valibot shared between client and server
- Accessible error handling and focus management
- Multi-step forms and form state machines

### 12.7 Routing

#### 12.7.1 Client-side routing concepts
- URLs as state; History API
- Nested routes and layouts
- Dynamic segments, search params as state
- Data loading tied to routes (loaders), mutations (actions)
- Code splitting per route
- Pending UI, navigation transitions, scroll restoration, focus management
- Routers: React Router (v7, framework and library modes), TanStack Router (type-safe), Next.js App Router (Domain 14)

### 12.8 Data Fetching, Server State and Caching

#### 12.8.1 Server state vs. client state
- Server state: remote, shared, asynchronous, can go stale
- Client/UI state: local, synchronous, owned by the UI
- Why mixing them in one global store causes bugs

#### 12.8.2 Data fetching patterns
- Fetch-on-render, fetch-then-render, render-as-you-fetch
- Waterfalls and how to avoid them (parallel fetching, route loaders, preloading)
- Suspense for data
- Loading, error, empty and success states (make all four explicit)

#### 12.8.3 Server-state libraries
- TanStack Query: queries, query keys, caching, staleTime vs. gcTime, invalidation, mutations, optimistic updates, infinite queries, prefetching
- SWR (awareness)
- RTK Query, Apollo Client / urql / Relay for GraphQL (awareness)
- Real-time sync and local-first approaches (awareness: Zero, Electric, Convex, Liveblocks)

#### 12.8.4 Error boundaries
- Error boundaries (class components or `react-error-boundary`)
- Granularity: route-level vs. widget-level
- Recovery and retry UI
- Reporting to monitoring tools

### 12.9 State Management at Scale (Core-Senior)

#### 12.9.1 Choosing state tools
- Decision framework: local state → lifted state → context → URL state → server-state cache → external store
- External stores: Zustand, Redux Toolkit, Jotai (atoms), MobX/Valtio (proxy-based), XState (state machines/statecharts)
- Signals as a cross-framework concept (Preact, Solid, Angular, Vue; TC39 signals proposal)
- Selectors and subscription granularity
- Persisting state; syncing across tabs
- State for AI chat: message lists, streaming parts, tool-call states, branching conversations

### 12.10 Performance Optimization in React (Core-Senior)

#### 12.10.1 Rendering performance
- What triggers re-renders (state, parent render, context) — and that props changing alone do not
- Measuring before optimizing: React DevTools Profiler, Performance Tracks in Chrome DevTools
- React Compiler: automatic memoization; how it works; its rules; adopting it incrementally
- Manual memoization: `memo`, `useMemo`, `useCallback` — when still useful
- Moving state down; lifting content up (children as props)
- Concurrent rendering: transitions, deferred values for responsive input
- List virtualization (TanStack Virtual, react-window) for long lists and long AI conversations
- Avoiding expensive work in render
- Bundle size: lazy loading with `lazy` and `Suspense`, dynamic imports

### 12.11 React Internals (Core-Senior)

#### 12.11.1 How React works
- Elements, components, instances
- Fiber architecture: fiber nodes, work loop, double buffering (current and work-in-progress trees)
- Reconciliation: the diffing heuristics (type changes, keys)
- Render phase vs. commit phase
- Lanes and priorities; time slicing and interruptible rendering
- The scheduler and yielding to the browser
- Hooks implementation: linked list of hooks per fiber (why order matters)
- Suspense internals: thrown promises, fallbacks, retry
- Hydration: matching server HTML; hydration mismatches; selective hydration

#### 12.11.2 React Server Components (RSC)
- The RSC model: server components, client components, the `'use client'` boundary
- Serialization of props across the boundary; the RSC payload (Flight protocol)
- Server Functions (`'use server'`) and their security implications (they are public endpoints)
- Streaming SSR and progressive hydration
- When to use server vs. client components
- RSC and AI: streaming UI generated on the server (Domain 27)

### Timeless core vs. current tools — Domain 12

- **Timeless (across frameworks):** declarative UI, component composition, unidirectional data flow, derived state, server vs. client state, effects as synchronization, reconciliation, immutability.
- **Current (2026):** React 19.2, React Compiler 1.0, RSC, React Router v7, TanStack Query v5/TanStack Router, Zustand, React Hook Form, Zod 4.

### Resources — Domain 12

| Resource | Type | Creator / Org | URL | What to learn |
|---|---|---|---|---|
| react.dev — Learn | Official docs | Meta / React team | https://react.dev/learn | The canonical, interactive React curriculum (read every page) |
| react.dev — Reference | Official docs | React team | https://react.dev/reference/react | Every hook, component and API |
| You Might Not Need an Effect | Official article | React team | https://react.dev/learn/you-might-not-need-an-effect | The most important article on effects |
| React blog | Official blog | React team | https://react.dev/blog | React 19, 19.2, Compiler releases |
| React Compiler docs | Official docs | React team | https://react.dev/learn/react-compiler | Automatic memoization and adoption |
| The Joy of React | Course (paid) | Josh W. Comeau | https://www.joyofreact.com/ | Deep, mental-model-first React |
| Epic React | Course (paid) | Kent C. Dodds | https://www.epicreact.dev/ | Hooks, patterns, performance, testing, RSC |
| Overreacted | Blog | Dan Abramov | https://overreacted.io/ | Deep essays on React's design, RSC and mental models |
| Build your own React | Article | Rodrigo Pombo | https://pomb.us/build-your-own-react/ | Implement a mini-React with fiber and hooks |
| React Fiber Architecture | Document | Andrew Clark | https://github.com/acdlite/react-fiber-architecture | Original explanation of Fiber |
| TkDodo's blog | Blog | Dominik Dorfmeister (TanStack Query maintainer) | https://tkdodo.eu/blog/ | Server state, React Query patterns, effects |
| TanStack Query docs | Official docs | TanStack (Tanner Linsley) | https://tanstack.com/query/latest | Server-state caching |
| React Router docs | Official docs | Remix/Shopify team | https://reactrouter.com/ | Routing, loaders, actions |
| Zustand docs | Official docs | Poimandres | https://zustand.docs.pmnd.rs/ | Minimal external state |
| Redux Toolkit docs | Official docs | Redux team (Mark Erikson) | https://redux-toolkit.js.org/ | Scalable global state |
| XState / Stately docs | Official docs | Stately (David Khourshid) | https://stately.ai/docs | State machines and statecharts |
| React Conf talks | YouTube | React team | https://www.youtube.com/@ReactConfOfficial | Official talks on Compiler, RSC, future direction |
| This Week In React | Newsletter | Sébastien Lorber | https://thisweekinreact.com/ | Weekly React and React Native news |

---

## Domain 13: Styling Systems and UI Engineering

**Label:** [Essential] · **Depth target:** D3 · **Prerequisites:** Domains 4, 12.

**Why it matters:** Production UI requires consistent, themeable, accessible styling across hundreds of components. Interface polish — motion, micro-interactions, responsiveness — is now a primary differentiator for products like Linear, Vercel, Stripe and Raycast.

### 13.1 Styling Approaches in Component Frameworks

#### 13.1.1 Approaches compared
- Global CSS + methodologies (BEM)
- CSS Modules (scoped class names)
- Utility-first: Tailwind CSS v4 (CSS-first config, `@theme`, design tokens as CSS variables)
- Zero-runtime CSS-in-JS: vanilla-extract, Panda CSS, StyleX
- Runtime CSS-in-JS (styled-components, Emotion) — legacy awareness and RSC incompatibility
- Trade-offs: colocation, performance, theming, refactorability, AI-generation friendliness (Tailwind is the de facto output format of most AI UI generators)

#### 13.1.2 Class composition
- Conditional classes (`clsx`)
- Variant APIs (`cva`, `tailwind-variants`)
- Merging conflicting utilities (`tailwind-merge`)

### 13.2 Component Libraries and Headless Primitives

#### 13.2.1 Library strategies
- Full component libraries (MUI, Mantine, Chakra, Ant Design) — speed vs. customization
- Headless/unstyled primitives: Radix UI, React Aria (Adobe), Base UI, Ark UI, Headless UI
- "Copy-in" component collections: shadcn/ui (you own the code; distributed via a registry that AI tools can also install from)
- Why accessible primitives matter (focus management, keyboard, ARIA handled correctly)

### 13.3 Icons, Images and Media in Components

#### 13.3.1 Assets
- SVG icon systems (inline components, sprites), icon libraries (Lucide, Heroicons, Phosphor)
- Optimized images (framework image components, responsive sizes, placeholders)
- Video and animated media; respecting data saver and reduced motion

### 13.4 Motion and Interaction Engineering

#### 13.4.1 Animation in UI
- Purposeful motion: feedback, orientation, continuity, delight
- Durations, easing, springs (physics-based animation)
- Enter/exit animations; layout animations; shared-element transitions
- Gesture-driven interfaces (drag, swipe) with velocity and interruption
- Libraries: Motion (formerly Framer Motion), React Spring, GSAP; CSS-first where possible
- View Transitions API with routers
- Performance: compositor-friendly properties
- Reduced-motion alternatives

#### 13.4.2 Interface details ("craft")
- Hover, active and focus states for every interactive element
- Loading states: skeletons vs. spinners vs. optimistic UI
- Empty and error states
- Toasts and inline feedback
- Command palettes (`cmdk`), keyboard shortcuts
- Scroll behaviour, overscroll, sticky elements
- Text selection, copy affordances (critical in AI output: copy code, copy message)
- Perceived performance techniques

### 13.5 Theming and Visual Consistency

#### 13.5.1 Theming systems
- Design tokens in CSS variables (primitive → semantic → component tokens)
- Dark mode without flash (server-known preference, `color-scheme`)
- Multi-brand theming
- Density and scaling

### Resources — Domain 13

| Resource | Type | Creator / Org | URL | What to learn |
|---|---|---|---|---|
| Tailwind CSS docs | Official docs | Tailwind Labs | https://tailwindcss.com/docs | Utility-first styling, v4 theming |
| shadcn/ui | Docs + registry | shadcn (Vercel) | https://ui.shadcn.com/ | Ownable, accessible component patterns |
| Radix Primitives | Official docs | WorkOS | https://www.radix-ui.com/primitives | Headless accessible primitives |
| React Aria | Official docs | Adobe | https://react-spectrum.adobe.com/react-aria/ | The most rigorous accessible hooks/components; excellent internationalization |
| Base UI | Official docs | Base UI team (MUI) | https://base-ui.com/ | Unstyled accessible components |
| Motion docs | Official docs | Matt Perry | https://motion.dev/docs | Production animation in React and JS |
| animations.dev | Course (paid) | Emil Kowalski | https://animations.dev/ | Web animation craft from a design-engineering perspective |
| Emil Kowalski's blog | Blog | Emil Kowalski | https://emilkowal.ski/ | Interface craft, building Sonner and Vaul |
| Rauno Freiberg — Invisible Details of Interaction Design | Article | Rauno Freiberg | https://rauno.me/craft/interaction-design | Why great interactions feel right |
| Refactoring UI | Book | Adam Wathan & Steve Schoger | https://www.refactoringui.com/ | Visual design tactics for developers |

---

## Domain 14: Next.js and Meta-Frameworks

**Label:** [Essential] (Next.js), [Optional] (alternatives) · **Depth target:** D3 (D4 for caching and rendering strategies at senior level) · **Prerequisites:** Domains 2 (HTTP caching), 10, 12.

**Why it matters:** Meta-frameworks combine routing, server rendering, data fetching, caching and deployment. Next.js is the most widely used React framework and the reference platform for many AI application templates.

**Current version context:** Next.js 16 (Oct 2025) made Turbopack the default bundler, made React Compiler support stable (opt-in), introduced Cache Components (`'use cache'`), and renamed middleware to `proxy`. 16.x releases continue in 2026 — always check the official blog.

### 14.1 Rendering Strategies (Framework-Agnostic Concepts)

#### 14.1.1 Rendering models
- Client-side rendering (CSR) / SPA
- Server-side rendering (SSR) per request
- Static site generation (SSG) at build time
- Incremental static regeneration (ISR) / revalidation
- Streaming SSR
- Partial prerendering (static shell + dynamic holes)
- Islands architecture (Astro)
- Resumability (Qwik) — awareness
- Choosing a strategy per page: freshness, personalization, SEO, cost, TTFB

#### 14.1.2 Hydration
- What hydration costs; hydration mismatches and their causes (dates, randomness, browser-only APIs)
- Progressive and selective hydration
- Reducing client JavaScript with server components

### 14.2 Next.js App Router

#### 14.2.1 Routing
- File-system routing: `app/` directory, `page`, `layout`, `template`, `loading`, `error`, `not-found`, `default`
- Dynamic routes, catch-all segments, route groups
- Parallel routes and intercepting routes (modals)
- Linking and navigation; prefetching
- Route handlers (`route.ts`) for APIs — including streaming AI endpoints

#### 14.2.2 Server and client components in Next.js
- Default server components; placing `'use client'` boundaries low in the tree
- Passing server data to client components
- Server-only and client-only modules
- Environment variables: server vs. `NEXT_PUBLIC_` (never expose API keys)

#### 14.2.3 Data fetching and mutations
- Fetching in server components
- Server Actions/Functions for mutations; validation and authorization inside every action
- Revalidation: `revalidatePath`, `revalidateTag`, `updateTag`, `refresh`
- Streaming with `Suspense` and `loading.tsx`
- Avoiding request waterfalls on the server

#### 14.2.4 Caching
- Cache Components and the `'use cache'` directive; `cacheLife`, `cacheTag`
- Request memoization, data cache, full route cache, client router cache (and how they changed across versions)
- Dynamic vs. static rendering signals (`cookies()`, `headers()`, `searchParams`)
- Debugging stale data

#### 14.2.5 Platform features
- `next/image`, `next/font`, `next/script`
- Metadata API, sitemaps, robots, Open Graph image generation
- `proxy.ts` (formerly middleware) for redirects, rewrites, auth gating at the edge
- Internationalized routing
- Runtime choices: Node.js vs. edge
- Instrumentation and OpenTelemetry
- Next.js DevTools MCP and AI-agent-friendly tooling (awareness)

#### 14.2.6 Pages Router (legacy recognition)
- `getServerSideProps`, `getStaticProps` — for maintaining older codebases

### 14.3 Other Meta-Frameworks (Awareness → Working, by need)

#### 14.3.1 Alternatives
- React Router v7 framework mode (the evolution of Remix): loaders/actions, web-standards focus
- TanStack Start: type-safe, full-stack React built on TanStack Router
- Astro: content-focused, islands, multi-framework
- Nuxt (Vue), SvelteKit (Svelte), SolidStart (Solid), Analog (Angular), Qwik City
- Choosing a framework: team skills, rendering needs, hosting, ecosystem, AI tooling support

### Resources — Domain 14

| Resource | Type | Creator / Org | URL | What to learn |
|---|---|---|---|---|
| Next.js Docs | Official docs | Vercel | https://nextjs.org/docs | App Router, caching, rendering, deployment |
| Next.js Learn | Official course (free) | Vercel | https://nextjs.org/learn | Build a full dashboard app step by step |
| Next.js 16 release post | Official blog | Vercel | https://nextjs.org/blog/next-16 | Cache Components, Turbopack default, proxy |
| Next.js blog | Official blog | Vercel | https://nextjs.org/blog | Ongoing release notes |
| Patterns.dev — Rendering patterns | Free book | Lydia Hallie & Addy Osmani | https://www.patterns.dev/ | CSR, SSR, SSG, ISR, streaming, islands explained |
| Rendering on the Web | Article | Jason Miller & Addy Osmani (web.dev) | https://web.dev/articles/rendering-on-the-web | Trade-offs of rendering strategies |
| Vercel blog | Engineering blog | Vercel | https://vercel.com/blog | Framework, performance and AI engineering posts |
| Lee Robinson's site | Blog/videos | Lee Robinson | https://leerob.com/ | Next.js, React and AI-era development practice |
| Astro docs | Official docs | Astro | https://docs.astro.build/ | Islands and content sites |
| TanStack Start docs | Official docs | TanStack | https://tanstack.com/start/latest | Type-safe full-stack React |

---

## Domain 15: The Wider Framework Landscape

**Label:** [Optional] for depth; [Essential] at D1 for awareness · **Depth target:** D1 overall; D2 in one non-React framework recommended for senior engineers · **Prerequisites:** Domain 12.

**Why it matters:** Ideas move between frameworks (signals, fine-grained reactivity, compilers, resumability). Knowing several makes you a better React engineer and prepares you for framework migrations and staff-level technology choices.

### 15.1 Reactivity Models

#### 15.1.1 Approaches to reactivity
- Virtual DOM diffing (React, Preact)
- Fine-grained reactivity with signals (Solid, Preact Signals, Angular signals, Vue refs, Svelte 5 runes)
- Compiler-driven frameworks (Svelte, React Compiler, Vue Vapor mode)
- Proxies vs. explicit signals
- Push vs. pull vs. push-pull reactivity

### 15.2 Major Frameworks

#### 15.2.1 Vue
- Single-file components, Composition API, reactivity with `ref`/`reactive`, Nuxt
#### 15.2.2 Svelte
- Compiler approach, runes (`$state`, `$derived`, `$effect`), SvelteKit
#### 15.2.3 Angular
- Enterprise usage, dependency injection, signals, standalone components, zoneless change detection
#### 15.2.4 Solid
- Fine-grained reactivity, no virtual DOM, JSX without re-rendering components
#### 15.2.5 Web Components
- Custom elements, Shadow DOM, slots, form-associated custom elements
- Lit
- Use cases: framework-agnostic design systems, micro-frontends, embeddable widgets (including embeddable AI chat widgets)
- Limitations: SSR, accessibility across shadow boundaries, styling

### 15.3 Mobile and Cross-Platform (Awareness)

#### 15.3.1 Beyond the browser
- React Native and Expo (React for native apps; shared logic with web)
- Capacitor, Tauri, Electron
- PWAs vs. native apps

### Resources — Domain 15

| Resource | Type | Creator / Org | URL | What to learn |
|---|---|---|---|---|
| Vue docs | Official docs | Vue team (Evan You) | https://vuejs.org/guide/introduction.html | Vue fundamentals and reactivity |
| Svelte tutorial | Official interactive tutorial | Svelte team (Rich Harris) | https://svelte.dev/tutorial | Compiler-based UI and runes |
| Angular docs | Official docs | Google | https://angular.dev/ | Signals, components, DI |
| SolidJS docs | Official docs | Solid team (Ryan Carniato) | https://docs.solidjs.com/ | Fine-grained reactivity |
| Lit docs | Official docs | Google | https://lit.dev/docs/ | Web components |
| Ryan Carniato's writing & streams | Blog/YouTube | Ryan Carniato | https://dev.to/ryansolid | Deepest public thinking on reactivity and framework design |
| State of JavaScript survey | Survey | Devographics | https://stateofjs.com/ | Framework usage and satisfaction trends |


---

# STAGE 6 — PROFESSIONAL ENGINEERING

---

## Domain 16: Testing and Quality

**Label:** [Essential] · **Depth target:** D3 · **Prerequisites:** Domains 9, 12.

**Why it matters:** Tests are the contract that lets humans and AI agents change code safely. In AI-assisted development, a strong test suite is the primary verification mechanism: agents iterate against tests, and reviewers trust changes because tests pin behaviour.

### 16.1 Testing Fundamentals

#### 16.1.1 Why and what to test
- Confidence vs. cost; testing behaviour, not implementation
- The testing pyramid vs. the testing trophy (static → unit → integration → end-to-end)
- Test anatomy: arrange, act, assert
- Determinism and flakiness
- Test doubles: mocks, stubs, spies, fakes — and over-mocking
- Code coverage: useful signal, poor goal

#### 16.1.2 Test-driven and test-first practices
- Red → green → refactor
- Writing tests from requirements and bug reports
- Tests as specifications for AI agents ("make these tests pass")

### 16.2 Unit and Integration Testing

#### 16.2.1 Tools and techniques
- Test runners: Vitest (default for Vite projects), Jest (legacy and React Native), Node's built-in test runner
- Assertions and matchers; async tests; fake timers
- Testing Library philosophy: query by role/label/text like a user would
- `user-event` for realistic interactions
- Testing hooks, context, forms, routing
- Network mocking with Mock Service Worker (MSW)
- Snapshot testing (sparingly)
- Component testing in a real browser (Vitest Browser Mode, Playwright component tests)

### 16.3 End-to-End Testing

#### 16.3.1 E2E with Playwright
- Browser automation; locators; auto-waiting; web-first assertions
- Fixtures, authentication state, test isolation
- Cross-browser testing (Chromium, Firefox, WebKit)
- Trace viewer and debugging failures
- Visual comparisons
- Running in CI; sharding and parallelism
- Playwright MCP / agent-driven browser testing (awareness → Domain 28)
- Cypress (awareness)

### 16.4 Specialized Testing

#### 16.4.1 Other test types
- Accessibility testing (axe integration — Domain 11)
- Visual regression testing (Chromatic, Playwright screenshots)
- Performance testing and budgets (Lighthouse CI)
- Contract testing for APIs
- Property-based testing (fast-check) — optional
- Mutation testing (Stryker) — optional
- Load testing awareness (k6)
- Testing non-deterministic AI features (evals — Domain 27)

### 16.5 Component Development Environments

#### 16.5.1 Storybook
- Stories as component states catalogue
- Interaction tests, accessibility addon, visual tests
- Documentation and design review
- Stories as context for AI agents generating UI

### Resources — Domain 16

| Resource | Type | Creator / Org | URL | What to learn |
|---|---|---|---|---|
| Testing Library docs | Official docs | Kent C. Dodds & community | https://testing-library.com/docs/ | User-centric component testing |
| The Testing Trophy and Testing Classifications | Article | Kent C. Dodds | https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications | Test strategy |
| Vitest docs | Official docs | Vitest team | https://vitest.dev/guide/ | Unit/integration testing, browser mode |
| Playwright docs | Official docs | Microsoft | https://playwright.dev/docs/intro | End-to-end testing |
| Mock Service Worker | Official docs | Artem Zakharchenko | https://mswjs.io/docs/ | API mocking at the network level |
| Storybook docs | Official docs | Chromatic / Storybook | https://storybook.js.org/docs | Component workshop and testing |
| Learn Testing | Course (free) | web.dev | https://web.dev/learn/testing | Testing concepts for the web |
| Test-Driven Development: By Example | Book | Kent Beck | https://www.oreilly.com/library/view/test-driven-development/0321146530/ | The original TDD book |

---

## Domain 17: Debugging

**Label:** [Essential] · **Depth target:** D4 (debugging is the core skill AI cannot remove; when agents fail, you finish the job) · **Prerequisites:** Domains 5, 10, 12.

### 17.1 Debugging Method

#### 17.1.1 Systematic debugging
- Reproduce reliably; minimal reproductions
- Observe → hypothesize → experiment → conclude
- Bisecting: code (comment out halves), history (`git bisect`), dependencies
- Reading stack traces; source maps
- Distinguishing symptoms from root causes
- Fixing the class of bug, not just the instance; adding a regression test
- Writing post-mortems

### 17.2 Tools and Techniques

#### 17.2.1 Browser debugging
- Breakpoints: line, conditional, DOM mutation, XHR/fetch, event listener, exception
- Logpoints; `debugger` statement
- Call stack and scope inspection
- Network debugging: request/response inspection, replay, throttling, offline
- Performance debugging: flame charts, long tasks, interaction traces
- Memory debugging: heap snapshots, comparison, detached nodes, allocation sampling
- Rendering debugging: paint flashing, layout shift regions, layers panel

#### 17.2.2 Framework and runtime debugging
- React DevTools: component tree, props/state/hooks, profiler, "why did this render"
- Hydration error debugging
- Node.js debugging: `--inspect`, VS Code debugger
- Debugging server components and server actions (server logs vs. client logs)
- Debugging streaming responses (SSE inspection in Network panel)

#### 17.2.3 Production debugging
- Error monitoring: Sentry and similar; grouping, breadcrumbs, release tracking
- Session replay (privacy considerations)
- Logs, metrics, traces correlation
- Feature flags to isolate issues
- Debugging only-in-production issues: minified code, source map upload, environment differences

### 17.3 AI-Assisted Debugging (bridge to Domain 28)

#### 17.3.1 Using AI to debug well
- Providing the model with the error, stack trace, reproduction, relevant code and what you already tried
- Asking for hypotheses ranked by likelihood, then verifying each yourself
- Agents that run code, add logging, and iterate — with you reviewing the diagnosis
- Recognizing when the model is guessing (confident fixes that do not address the root cause)

### Resources — Domain 17

| Resource | Type | Creator / Org | URL | What to learn |
|---|---|---|---|---|
| Chrome DevTools: Debug JavaScript | Official docs | Google | https://developer.chrome.com/docs/devtools/javascript | Breakpoint debugging |
| Chrome DevTools: Memory problems | Official docs | Google | https://developer.chrome.com/docs/devtools/memory-problems | Finding memory leaks |
| React Developer Tools | Official docs | React team | https://react.dev/learn/react-developer-tools | Inspecting and profiling React |
| Debugging: The 9 Indispensable Rules | Book | David J. Agans | https://debuggingrules.com/ | Timeless debugging method |
| Sentry docs | Official docs | Sentry | https://docs.sentry.io/ | Error monitoring and tracing |
| Julia Evans — debugging zines/blog | Blog | Julia Evans | https://jvns.ca/ | Debugging mindset and tools |

---

## Domain 18: Web Performance and Core Web Vitals

**Label:** [Essential] (18.1–18.4), [Core-Senior] (18.5) · **Depth target:** D3 (D4 senior) · **Prerequisites:** Domains 2, 10, 12, 14.

**Why it matters:** Performance affects conversion, retention, SEO ranking and accessibility for users on low-end devices and slow networks. AI features add new performance dimensions: time-to-first-token, streaming smoothness and long-conversation rendering.

### 18.1 Performance Fundamentals

#### 18.1.1 What to measure
- User-centric metrics vs. technical metrics
- Core Web Vitals:
  - **LCP** (Largest Contentful Paint) — loading; good ≤ 2.5s
  - **INP** (Interaction to Next Paint) — responsiveness; good ≤ 200ms (replaced FID in 2024)
  - **CLS** (Cumulative Layout Shift) — visual stability; good ≤ 0.1
- Supporting metrics: TTFB, FCP, TBT, Speed Index, long animation frames (LoAF)
- Percentiles (p75) and distributions, not averages
- Lab data vs. field data (RUM); Chrome UX Report (CrUX)

#### 18.1.2 Measurement tools
- Lighthouse and PageSpeed Insights
- Chrome DevTools Performance panel with live metrics
- WebPageTest
- `web-vitals` library for RUM
- Performance APIs: `PerformanceObserver`, User Timing (`performance.mark/measure`), Resource Timing, Long Animation Frames API

### 18.2 Loading Performance

#### 18.2.1 Network and resources
- Critical rendering path; render-blocking resources
- Reducing bytes: compression (Brotli, gzip, Zstandard), minification, tree shaking
- Reducing requests and round trips; HTTP/2 and HTTP/3
- Resource hints: `preconnect`, `preload`, `fetchpriority`, `modulepreload`, Speculation Rules
- CDNs and edge caching; cache headers (Domain 2)
- Image optimization: formats (AVIF/WebP), dimensions, responsive sizes, lazy loading, LCP image prioritization
- Font optimization: subsetting, `font-display`, preloading, size-adjust fallbacks to prevent CLS
- Third-party script control (tag managers, analytics, chat widgets): facades, `async`/`defer`, Partytown-style off-main-thread loading

#### 18.2.2 JavaScript cost
- Parse/compile/execute cost
- Code splitting by route and interaction
- Bundle analysis (bundle visualizers); dependency weight
- Shipping less JavaScript: server components, islands, progressive enhancement
- Differential/modern-only builds

### 18.3 Runtime Performance

#### 18.3.1 Responsiveness (INP)
- Breaking up long tasks; yielding (`scheduler.yield`)
- Debouncing and throttling input
- Moving work to web workers
- Avoiding layout thrashing; batching DOM reads/writes
- React-specific: transitions, deferred values, avoiding unnecessary renders, virtualization

#### 18.3.2 Visual stability (CLS)
- Reserving space for images, embeds and ads
- Avoiding late-injected content above existing content
- Font-swap layout shift
- Streaming content shifts (AI responses pushing content) — anchored scrolling, stick-to-bottom behaviour that respects user scroll

#### 18.3.3 Animation and scrolling performance
- Compositor-only animations
- Scroll performance; passive listeners
- `content-visibility` for long pages

### 18.4 Performance Culture and Budgets

#### 18.4.1 Sustaining performance
- Performance budgets (bytes, metrics) enforced in CI
- Regression detection and alerting from RUM
- Performance as product requirement; communicating business impact

### 18.5 Advanced Performance (Core-Senior)

#### 18.5.1 Advanced topics
- Back/forward cache optimization
- Prerendering and instant navigations
- Edge rendering trade-offs
- Memory performance on low-end Android devices
- Performance of AI features: time-to-first-token, streaming render cost (markdown parsing incrementally, syntax highlighting off main thread), long conversation virtualization, client-side model loading cost

### Resources — Domain 18

| Resource | Type | Creator / Org | URL | What to learn |
|---|---|---|---|---|
| Web Vitals | Official docs | Google (web.dev) | https://web.dev/articles/vitals | Core Web Vitals definitions and thresholds |
| Learn Performance | Course (free) | web.dev | https://web.dev/learn/performance | Comprehensive loading and runtime performance |
| Optimize INP | Article | web.dev | https://web.dev/articles/optimize-inp | Responsiveness optimization |
| Optimize LCP | Article | web.dev | https://web.dev/articles/optimize-lcp | Loading optimization |
| Optimize CLS | Article | web.dev | https://web.dev/articles/optimize-cls | Layout stability |
| WebPageTest | Tool | Catchpoint | https://www.webpagetest.org/ | Deep lab performance testing |
| PageSpeed Insights | Tool | Google | https://pagespeed.web.dev/ | Lab + field data |
| Addy Osmani's writing | Blog/books | Addy Osmani | https://addyosmani.com/ | Performance, JavaScript cost, image optimization, AI-assisted engineering |
| Harry Roberts (CSS Wizardry) | Blog | Harry Roberts | https://csswizardry.com/ | Expert web performance consulting insights |
| Smashing Magazine — performance | Articles | Smashing Magazine | https://www.smashingmagazine.com/category/performance/ | Practical performance articles, annual checklist |

---

## Domain 19: Web Security

**Label:** [Essential] · **Depth target:** D3 · **Prerequisites:** Domains 2, 5, 10, 14.

**Why it matters:** Frontend code handles untrusted input, tokens, and personal data. AI introduces new attack surfaces (prompt injection, insecure output handling, excessive agency), and AI-generated code repeats common security mistakes unless reviewed.

### 19.1 Security Foundations

#### 19.1.1 Security mindset
- Threat modelling: assets, attackers, trust boundaries, attack surface
- The client is untrusted: every security check must happen on the server
- Defence in depth; least privilege; secure defaults
- OWASP Top 10 (web) — current edition

### 19.2 Common Web Vulnerabilities

#### 19.2.1 Injection and XSS
- Cross-site scripting: stored, reflected, DOM-based
- Output encoding; framework auto-escaping and its escape hatches (`dangerouslySetInnerHTML`, `innerHTML`, `href="javascript:"`, `eval`)
- Sanitization (DOMPurify) — critical when rendering LLM-generated HTML/markdown
- Trusted Types
- SQL/NoSQL injection (server side)

#### 19.2.2 Request forgery and clickjacking
- CSRF: how it works; SameSite cookies; CSRF tokens; Origin checks (Server Actions have built-in origin checks — understand them)
- Clickjacking: `frame-ancestors`, `X-Frame-Options`
- Open redirects
- SSRF (server-side request forgery) — relevant to URL-fetching AI tools

#### 19.2.3 Authentication and session security
- Password storage (hashing; never in frontend)
- Session cookies vs. tokens in `localStorage` (XSS exposure)
- Token handling: short-lived access tokens, refresh token rotation
- OAuth/OIDC flows for SPAs (Authorization Code + PKCE)
- Passkeys/WebAuthn
- Multi-factor authentication
- Broken access control and IDOR — the most common real-world vulnerability

### 19.3 Browser Security Mechanisms

#### 19.3.1 Security headers
- Content Security Policy (CSP): directives, nonces/hashes, `strict-dynamic`, report-only mode
- HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`
- COOP/COEP/CORP
- Subresource Integrity (SRI)
- Iframe sandboxing — essential for rendering AI-generated apps/artifacts safely

### 19.4 Secrets, Dependencies and Supply Chain

#### 19.4.1 Protecting secrets
- Never ship API keys (including LLM provider keys) to the browser
- Proxying model calls through your server with authentication, rate limiting and quotas
- Secret managers and environment variable hygiene; rotating leaked keys
- Secret scanning in repositories

#### 19.4.2 Supply chain
- Dependency risks, lockfiles, audits, provenance (npm provenance, Sigstore)
- Third-party scripts as a security risk
- Verifying AI-suggested dependencies exist and are reputable

### 19.5 Privacy and Compliance

#### 19.5.1 Privacy engineering
- Data minimization; PII handling in logs, analytics and LLM prompts
- Consent management; GDPR, CCPA/CPRA, and similar laws (awareness)
- Data residency and model provider data policies (zero data retention options)
- The EU AI Act transparency obligations for AI-generated content and chatbots (awareness)

### 19.6 AI-Specific Security (bridge to Domain 27)

#### 19.6.1 LLM attack surface (introduction)
- Prompt injection (direct and indirect via retrieved content, web pages, emails, tool results)
- Insecure output handling (rendering model output as HTML, executing model-generated code)
- Excessive agency (agents with too many permissions)
- Data exfiltration through rendered links/images in model output
- The "lethal trifecta": private data + untrusted content + external communication
- OWASP Top 10 for LLM Applications and OWASP Top 10 for Agentic Applications

### Resources — Domain 19

| Resource | Type | Creator / Org | URL | What to learn |
|---|---|---|---|---|
| OWASP Top 10 | Standard | OWASP | https://owasp.org/www-project-top-ten/ | Most critical web security risks |
| OWASP Cheat Sheet Series | Guides | OWASP | https://cheatsheetseries.owasp.org/ | XSS prevention, CSRF, authentication, session management |
| MDN Web Security | Official docs | Mozilla | https://developer.mozilla.org/en-US/docs/Web/Security | CSP, HTTPS, same-origin, headers |
| web.dev: Security headers quick reference | Article | web.dev | https://web.dev/articles/security-headers | Headers and how to deploy them |
| PortSwigger Web Security Academy | Course (free) | PortSwigger | https://portswigger.net/web-security | Hands-on labs for every web vulnerability |
| OWASP Top 10 for LLM Applications | Standard | OWASP GenAI Security Project | https://genai.owasp.org/llm-top-10/ | LLM-specific risks (2025 edition) |
| OWASP Top 10 for Agentic Applications | Standard | OWASP GenAI Security Project | https://genai.owasp.org/2025/12/09/owasp-top-10-for-agentic-applications-the-benchmark-for-agentic-security-in-the-age-of-autonomous-ai/ | Agent-specific risks: goal hijack, tool misuse, privilege abuse |
| Simon Willison — prompt injection series | Blog series | Simon Willison | https://simonwillison.net/series/prompt-injection/ | The most thorough public writing on prompt injection |
| The lethal trifecta for AI agents | Article | Simon Willison | https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/ | Mental model for agent data-exfiltration risk |
| The Copenhagen Book | Free guide | Pilcrow | https://thecopenhagenbook.com/ | Implementing authentication securely |

---

## Domain 20: SEO, Discoverability and Internationalization

**Label:** [Essential] (20.1–20.2), [Core-Senior] (20.3–20.4) · **Depth target:** D2 (D3 for content/e-commerce products) · **Prerequisites:** Domains 3, 14.

### 20.1 Technical SEO

#### 20.1.1 How search engines work
- Crawling, rendering (JavaScript rendering by Googlebot), indexing, ranking
- Crawl budget; `robots.txt`; XML sitemaps
- Canonical URLs, duplicate content, pagination
- Status codes and redirects for SEO
- Rendering strategy impact on SEO (SSR/SSG vs. CSR)

#### 20.1.2 On-page signals
- Titles, meta descriptions, headings, semantic HTML
- Structured data (JSON-LD, schema.org) and rich results
- Internal linking; descriptive link text
- Page experience: Core Web Vitals, mobile-friendliness, HTTPS
- Social previews (Open Graph images)

### 20.2 Discoverability in the AI Era

#### 20.2.1 Generative engine optimization (emerging)
- How AI search and assistants (Google AI Overviews/AI Mode, ChatGPT search, Perplexity, Claude) retrieve and cite pages
- Clean semantic HTML, server-rendered content and structured data as machine-readability foundations
- `llms.txt` proposal (emerging, unstandardized — awareness)
- AI crawler user agents and `robots.txt` controls
- Making web apps operable by browser agents: accessible names, stable semantics, predictable forms; WebMCP proposal (emerging — awareness)

### 20.3 Internationalization (i18n) and Localization (l10n)

#### 20.3.1 i18n engineering
- Separating strings from code; message formats (ICU MessageFormat), plurals, gender, interpolation
- Locale negotiation and routing
- `Intl` APIs for dates, numbers, currencies, lists, relative time
- Right-to-left (RTL) layouts with logical CSS properties; `dir`
- Text expansion and layout flexibility
- Fonts and scripts (CJK, Arabic, Indic scripts)
- Libraries: FormatJS/react-intl, i18next, next-intl, Lingui, Paraglide
- Translation workflows; machine translation with LLMs plus human review
- Time zones and calendars (Temporal)

### 20.4 Analytics and Experimentation (Engineering Side)

#### 20.4.1 Instrumentation
- Event tracking design (naming, properties, schemas)
- Product analytics tools (PostHog, Amplitude, Mixpanel — awareness)
- Feature flags and A/B testing implementation
- Privacy-respecting analytics

### Resources — Domain 20

| Resource | Type | Creator / Org | URL | What to learn |
|---|---|---|---|---|
| Google Search Central documentation | Official docs | Google | https://developers.google.com/search/docs | SEO fundamentals and JavaScript SEO |
| JavaScript SEO basics | Official docs | Google | https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics | How Google renders JS |
| Schema.org | Vocabulary | Schema.org community | https://schema.org/ | Structured data types |
| MDN Intl | Official docs | Mozilla | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl | Internationalization APIs |
| W3C Internationalization | Articles | W3C | https://www.w3.org/International/ | i18n best practices |
| llms.txt proposal | Proposal | Jeremy Howard (Answer.AI) | https://llmstxt.org/ | Emerging convention for LLM-readable site summaries |

---

## Domain 21: Backend and Full-Stack Fundamentals

**Label:** [Essential] (21.1–21.6), [Core-Senior] (21.7–21.8) · **Depth target:** D2 → D3 · **Prerequisites:** Domains 2, 5, 8, 9.

**Why it matters:** Modern frontend engineers routinely own the server layer of their application (route handlers, server actions, BFFs) — and every AI feature requires server code to call models securely, store conversations, retrieve documents and run tools.

### 21.1 Backend Concepts

#### 21.1.1 What servers do
- Request handling, business logic, persistence, integrations, background work
- Stateless servers and horizontal scaling
- Backend for Frontend (BFF) pattern
- Serverless functions, edge functions, long-running servers, containers
- Cold starts, timeouts and execution limits (critical for long AI agent runs)

### 21.2 Node.js for Servers

#### 21.2.1 Node.js runtime
- Event-driven, non-blocking I/O; libuv thread pool
- Core modules: `fs`, `path`, `http`, `crypto`, `stream`, `events`, `worker_threads`
- Streams and backpressure (piping model output to clients)
- Web-standard APIs in Node (`fetch`, `Request`, `Response`, Web Streams)
- Error handling and process crashes; graceful shutdown
- Bun and Deno (awareness)

#### 21.2.2 Server frameworks
- Express (legacy ubiquity), Fastify, Hono (web-standard, runs everywhere), NestJS (enterprise awareness)
- Middleware, routing, validation, error handling

### 21.3 APIs

#### 21.3.1 API design
- REST resource design, status codes, pagination (offset vs. cursor), filtering, versioning
- Idempotency keys
- Error formats (RFC 9457 Problem Details)
- OpenAPI specifications and code generation
- GraphQL: schemas, resolvers, N+1 problem, DataLoader
- tRPC and end-to-end type safety
- Rate limiting and quotas
- API design for agents: clear names, descriptions and errors (bridge to tool design in Domain 26)

### 21.4 Authentication and Authorization

#### 21.4.1 Authentication
- Sessions with cookies vs. JWTs: trade-offs
- OAuth 2.0 and OpenID Connect: roles, flows, scopes, PKCE
- Social login, passkeys, magic links
- Auth libraries/services: Better Auth, Auth.js, Clerk, WorkOS, Auth0, Supabase Auth (awareness)

#### 21.4.2 Authorization
- RBAC, ABAC, ReBAC (relationship-based, e.g., Google Zanzibar model)
- Enforcing authorization in every server action and API route
- Multi-tenancy
- Delegated authorization for agents acting on behalf of users (OAuth for MCP servers)

### 21.5 Databases

#### 21.5.1 Relational databases and SQL
- Tables, rows, columns, primary and foreign keys
- SQL: `SELECT`, `WHERE`, `JOIN`s, `GROUP BY`, aggregates, subqueries, CTEs
- Indexes and query plans (`EXPLAIN`)
- Transactions and ACID; isolation levels (conceptual)
- Normalization vs. denormalization
- PostgreSQL as the default choice; JSONB; full-text search
- SQLite (local-first, edge)

#### 21.5.2 NoSQL
- Document stores (MongoDB), key-value (Redis), wide-column, graph databases
- When NoSQL fits; trade-offs (consistency, querying, schema flexibility)
- Redis for caching, rate limiting, sessions, queues

#### 21.5.3 Data access
- ORMs and query builders: Prisma, Drizzle, Kysely
- Migrations and schema evolution
- Connection pooling (serverless considerations)
- Managed databases: Neon, Supabase, PlanetScale, Turso (awareness)

#### 21.5.4 Data modelling
- Entities and relationships; one-to-many, many-to-many
- Modelling for queries
- Soft deletes, audit trails, timestamps
- Modelling AI data: conversations, messages, message parts, tool calls, attachments, feedback, embeddings

#### 21.5.5 Vector storage (bridge to Domain 26)
- pgvector, dedicated vector databases (awareness)

### 21.6 Real-Time Communication

#### 21.6.1 Transports
- Polling and long polling
- Server-Sent Events: one-way streaming over HTTP; reconnection; event IDs — the default transport for LLM streaming
- WebSockets: bidirectional; scaling with pub/sub
- WebRTC: peer-to-peer media and data; real-time voice AI
- Managed real-time services (Pusher, Ably, Liveblocks, PartyKit/Cloudflare Durable Objects — awareness)

#### 21.6.2 Collaboration
- Presence, cursors, optimistic updates
- Conflict resolution: last-write-wins, operational transformation, CRDTs (Yjs, Automerge)
- Local-first software principles

### 21.7 Backend Architecture (Core-Senior)

#### 21.7.1 Architecture concepts
- Monoliths, modular monoliths, microservices — trade-offs
- Background jobs and queues (BullMQ, Inngest, Trigger.dev, cloud queues)
- Durable execution / workflows (Temporal, Vercel Workflow, Inngest) — essential for long-running AI agents
- Caching layers; cache invalidation
- Event-driven architecture; webhooks
- File storage (object storage: S3, R2, Vercel Blob); signed URLs; uploads
- Email, payments (Stripe) and other third-party integrations

### 21.8 Distributed Systems Basics (Core-Senior)

#### 21.8.1 Concepts
- CAP theorem and consistency models (conceptual)
- Replication, partitioning
- Retries, timeouts, circuit breakers
- Idempotency and exactly-once illusions

### Resources — Domain 21

| Resource | Type | Creator / Org | URL | What to learn |
|---|---|---|---|---|
| Node.js Learn | Official docs | OpenJS Foundation | https://nodejs.org/en/learn | Node fundamentals |
| Hono docs | Official docs | Yusuke Wada & community | https://hono.dev/docs/ | Web-standard server framework |
| SQLBolt | Interactive course | Community | https://sqlbolt.com/ | SQL fundamentals |
| PostgreSQL Tutorial (official docs) | Official docs | PostgreSQL Global Development Group | https://www.postgresql.org/docs/current/tutorial.html | Postgres fundamentals |
| Use The Index, Luke | Online book | Markus Winand | https://use-the-index-luke.com/ | SQL indexing and performance |
| Designing Data-Intensive Applications (2nd ed.) | Book | Martin Kleppmann & Chris Riccomini (O'Reilly) | https://dataintensive.net/ | Databases, replication, consistency, streams |
| Prisma docs | Official docs | Prisma | https://www.prisma.io/docs | ORM and data modelling |
| Drizzle ORM docs | Official docs | Drizzle Team | https://orm.drizzle.team/docs/overview | Type-safe SQL ORM |
| OAuth 2.0 | Reference site | Aaron Parecki | https://oauth.net/2/ | OAuth flows and specs |
| GraphQL Learn | Official docs | GraphQL Foundation | https://graphql.org/learn/ | GraphQL fundamentals |
| MDN: Server-sent events | Official docs | Mozilla | https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events | SSE for streaming |
| MDN: WebSockets API | Official docs | Mozilla | https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API | Bidirectional real-time |
| Local-first software | Essay | Ink & Switch (Kleppmann et al.) | https://www.inkandswitch.com/essay/local-first/ | Local-first principles and CRDTs |
| ByteByteGo | YouTube/newsletter | Alex Xu | https://www.youtube.com/@ByteByteGo | System design concepts visually explained |

---

## Domain 22: Deployment, CI/CD and Production Engineering

**Label:** [Essential] (22.1–22.4), [Core-Senior] (22.5) · **Depth target:** D2 → D3 · **Prerequisites:** Domains 7, 8, 14, 21.

### 22.1 Deployment Fundamentals

#### 22.1.1 Hosting models
- Static hosting + CDN
- Platform-as-a-service for frontend: Vercel, Netlify, Cloudflare (Workers/Pages), AWS Amplify
- Containers (Docker basics: images, containers, Dockerfile, multi-stage builds)
- Cloud providers: AWS, Google Cloud, Azure — core services (compute, storage, CDN, DNS)
- Preview deployments per pull request
- Environments: development, preview/staging, production
- Custom domains, DNS, TLS

### 22.2 CI/CD

#### 22.2.1 Continuous integration
- Pipelines: install → lint → type-check → test → build
- GitHub Actions: workflows, jobs, steps, matrices, caching, secrets
- Required status checks; merge queues
- AI code review bots in CI (awareness; human approval still required)

#### 22.2.2 Continuous delivery and deployment
- Automated deployments from main
- Rollbacks and instant rollback strategies
- Database migrations in deployment pipelines
- Feature flags for decoupling deploy from release
- Progressive delivery: canary releases, percentage rollouts, blue/green

### 22.3 Observability

#### 22.3.1 Three pillars and beyond
- Logs (structured logging), metrics, traces (distributed tracing)
- OpenTelemetry as the standard
- Frontend observability: RUM, error tracking, session replay
- Alerting, dashboards, SLIs/SLOs/error budgets
- LLM observability (Domain 27)

### 22.4 Reliability

#### 22.4.1 Running production
- Incident response; on-call basics; blameless post-mortems
- Graceful degradation: when the API, the CDN or the model provider is down
- Rate limiting and abuse prevention (bots, scraping, prompt abuse)
- Cost monitoring (bandwidth, functions, model tokens)

### 22.5 Infrastructure as Code and Platform Engineering (Core-Senior)

#### 22.5.1 Platform concepts
- Infrastructure as code (Terraform, Pulumi, SST — awareness)
- Developer platforms and golden paths
- Build performance at scale
- Frontend platform teams' responsibilities

### Resources — Domain 22

| Resource | Type | Creator / Org | URL | What to learn |
|---|---|---|---|---|
| GitHub Actions docs | Official docs | GitHub | https://docs.github.com/en/actions | CI/CD workflows |
| Vercel docs | Official docs | Vercel | https://vercel.com/docs | Deployments, previews, functions, observability |
| Cloudflare Workers docs | Official docs | Cloudflare | https://developers.cloudflare.com/workers/ | Edge compute, storage, AI on the edge |
| Docker docs — Get started | Official docs | Docker | https://docs.docker.com/get-started/ | Containers |
| OpenTelemetry docs | Official docs | CNCF | https://opentelemetry.io/docs/ | Traces, metrics, logs standards |
| Google SRE Books | Books (free online) | Google | https://sre.google/books/ | SLOs, incident response, reliability culture |
| Accelerate | Book | Forsgren, Humble, Kim | https://itrevolution.com/product/accelerate/ | DORA metrics and high-performing delivery |
| DORA research | Research program | Google Cloud / DORA | https://dora.dev/ | Software delivery performance research, including AI-assisted development reports |

---

## Domain 23: Design Systems and Design Engineering

**Label:** [Essential] (23.1–23.3), [Core-Senior] (23.4–23.5) · **Depth target:** D3 · **Prerequisites:** Domains 4, 11, 12, 13.

**Why it matters:** Design systems are how organizations scale UI quality — and in 2026 they are also the primary *context* that makes AI-generated UI on-brand and correct. Design engineering (the hybrid of designer and engineer) is one of the fastest-growing frontend specializations.

### 23.1 Design Literacy for Engineers

#### 23.1.1 Visual design fundamentals
- Hierarchy, contrast, alignment, proximity, repetition
- Typography: scale, line height, measure, weight
- Spacing systems (4/8-point grids)
- Color: palettes, semantic color, contrast
- Layout grids
- Iconography and imagery consistency

#### 23.1.2 Working with designers
- Reading Figma files: frames, Auto Layout (≈ flexbox), components, variants, variables
- Dev Mode, inspecting specs, design tokens export
- Figma MCP server / design-to-code with AI (Domain 28)
- Communicating feasibility and trade-offs; proposing alternatives
- Design QA: comparing implementation to design; when to push back

### 23.2 Design System Architecture

#### 23.2.1 Foundations
- Design tokens: primitive, semantic, component tiers
- Token formats: W3C Design Tokens Community Group format; Style Dictionary transforms
- Theming and modes (light/dark, brands, density)
- Typography, spacing, elevation, radius, motion tokens

#### 23.2.2 Component architecture
- Atomic design vocabulary (atoms, molecules, organisms) and its limits
- Primitive vs. composite components
- Component API design: props naming, variants, sizes, composition vs. configuration, `asChild`, controlled/uncontrolled
- Accessibility baked into components
- States: default, hover, focus, active, disabled, loading, error, selected, read-only
- Layout components (Stack, Grid, Box)
- Escape hatches and extension points

#### 23.2.3 Documentation and tooling
- Storybook as living documentation
- Usage guidelines, do/don't examples
- Code examples and playgrounds
- Machine-readable documentation for AI agents (component manifests, MCP servers exposing the design system, registries)

### 23.3 Delivery and Maintenance

#### 23.3.1 Shipping a design system
- Packaging and versioning (semver, changesets)
- Breaking changes, deprecations, codemods
- Visual regression testing
- Adoption metrics

### 23.4 Governance and Scale (Core-Senior)

#### 23.4.1 Operating a design system
- Centralized vs. federated models
- Contribution processes
- Design–code parity
- Multi-platform systems (web, iOS, Android) via tokens
- Measuring impact

### 23.5 Design Engineering as a Discipline (Core-Senior)

#### 23.5.1 The design engineer role
- Prototyping in code to explore interactions
- Owning the "last mile" of polish
- Building interaction-heavy features (editors, canvases, command menus, AI chat surfaces)
- Taste development: studying great products, recreating interactions, critique

### Resources — Domain 23

| Resource | Type | Creator / Org | URL | What to learn |
|---|---|---|---|---|
| Atomic Design | Book (free online) | Brad Frost | https://atomicdesign.bradfrost.com/ | Design system methodology |
| Design Tokens Community Group | Specification | W3C Community Group | https://www.designtokens.org/ | Standard token format |
| Style Dictionary | Official docs | Amazon / community | https://styledictionary.com/ | Token transformation pipelines |
| Storybook | Official docs | Chromatic | https://storybook.js.org/docs | Component documentation |
| Component Gallery | Reference | Iain Bean | https://component.gallery/ | How major design systems implement each component |
| Primer (GitHub) | Design system | GitHub | https://primer.style/ | Example of a mature, open design system |
| Carbon Design System | Design system | IBM | https://carbondesignsystem.com/ | Enterprise design system reference |
| GOV.UK Design System | Design system | UK Government Digital Service | https://design-system.service.gov.uk/ | Research-backed, accessible patterns |
| Design Engineering at Vercel | Article | Vercel | https://vercel.com/blog/design-engineering-at-vercel | What design engineers do |
| Figma for developers — Dev Mode | Official docs | Figma | https://www.figma.com/dev-mode/ | Inspecting designs, code connect |

---

## Domain 24: Frontend Architecture and Frontend System Design

**Label:** [Core-Senior] · **Depth target:** D3 (D4 staff) · **Prerequisites:** Domains 12, 14, 16, 18, 21, 23.

**Why it matters:** Senior and staff interviews at leading companies include frontend system design. Day-to-day, architecture determines whether a codebase stays changeable — by humans and agents — as it grows.

### 24.1 Application Architecture

#### 24.1.1 Structuring codebases
- Feature-based (vertical slice) vs. layer-based folder structures
- Module boundaries and public APIs; enforcing boundaries (lint rules, package boundaries)
- Dependency direction; avoiding circular dependencies
- Separation of UI, state, domain logic and data access
- Shared vs. feature-owned code
- Architectures: Feature-Sliced Design, hexagonal/clean architecture adapted to frontend (awareness)
- Codebases legible to AI agents: consistent conventions, colocated docs, `AGENTS.md`/`CLAUDE.md`, types as documentation

#### 24.1.2 Data architecture
- Client data layer design: normalized vs. denormalized caches
- API layer abstraction
- Optimistic updates and reconciliation
- Offline-first and sync engines
- Real-time data integration

#### 24.1.3 Scaling teams and apps
- Monorepos vs. polyrepos
- Micro-frontends (module federation, runtime composition) — when they are worth the cost
- Shared design system and platform packages
- Migration strategies: strangler fig, incremental adoption, codemods (increasingly AI-driven)

### 24.2 Frontend System Design

#### 24.2.1 Framework for system design interviews and real design docs
- Requirements: functional and non-functional (performance, accessibility, i18n, offline, security)
- High-level architecture: components, data flow, rendering strategy
- Data model and API design (client–server contract)
- State management and caching
- Performance strategy
- Accessibility and i18n strategy
- Error handling, observability, rollout

#### 24.2.2 Classic design problems
- News feed with infinite scroll
- Autocomplete/typeahead
- Image carousel and photo gallery
- Chat application (real-time messaging)
- Collaborative document editor
- E-commerce product page and checkout
- Video streaming UI
- Dashboard with real-time charts
- **AI-era problems:** ChatGPT/Claude-style chat app with streaming, branching and attachments; AI-powered search with citations; agent task dashboard with approvals; generative UI canvas; AI code editor panel

### 24.3 Technical Decision-Making

#### 24.3.1 Writing and deciding
- Design documents and RFCs
- Architecture Decision Records (ADRs)
- Evaluating technologies: maturity, ecosystem, team fit, lock-in, exit cost
- Build vs. buy
- Technical debt management and communicating it

### Resources — Domain 24

| Resource | Type | Creator / Org | URL | What to learn |
|---|---|---|---|---|
| GreatFrontEnd — Front End System Design | Guide/course | GreatFrontEnd | https://www.greatfrontend.com/front-end-system-design-playbook | Frontend system design framework and case studies |
| Patterns.dev | Free book | Lydia Hallie & Addy Osmani | https://www.patterns.dev/ | Architecture, rendering and performance patterns |
| Martin Fowler's site | Articles | Martin Fowler / Thoughtworks | https://martinfowler.com/ | Micro-frontends, refactoring, architecture patterns |
| Software Engineering at Google | Book (free online) | Winters, Manshreck, Wright | https://abseil.io/resources/swe-book | Engineering practices at scale |
| Staff Engineer | Book/site | Will Larson | https://staffeng.com/ | Staff-level archetypes and technical leadership |
| Feature-Sliced Design | Methodology docs | FSD community | https://feature-sliced.design/ | Frontend architecture methodology |
| The Pragmatic Engineer | Newsletter | Gergely Orosz | https://newsletter.pragmaticengineer.com/ | How top tech companies build software, including with AI |


---

# STAGE 7 — AI FOUNDATIONS AND AI ENGINEERING

---

## Domain 25: AI and Machine Learning Foundations

**Label:** [Essential] (25.1–25.4), [Optional] (25.5 deep ML) · **Depth target:** D2 (conceptual fluency; you are not training frontier models, but you must reason about how they behave) · **Prerequisites:** Domains 5, 6 (including vectors, probability basics). Domain 21 recommended.

**Why it matters:** Every design decision in an AI product — context size, retrieval strategy, temperature, streaming, failure handling, cost — follows from how models actually work. Engineers who understand tokens, attention and sampling write better prompts, choose better architectures and catch impossible requirements early.

### 25.1 AI Fundamentals

#### 25.1.1 The landscape
- **Definitions**
  - Artificial intelligence, machine learning, deep learning, generative AI
  - Narrow vs. general capabilities; "AGI" as a contested term
- **A short history**
  - Symbolic AI and expert systems
  - Statistical machine learning
  - Deep learning revolution (ImageNet, 2012)
  - Transformers (2017) and the scaling era
  - Instruction tuning, RLHF and chat assistants (2022–)
  - Reasoning models, agents and tool use (2024–2026)
- **The 2026 model landscape**
  - Frontier labs and model families: Anthropic (Claude), OpenAI (GPT and o-series reasoning models), Google (Gemini), Meta (Llama), Mistral, DeepSeek, Qwen, and others
  - Closed vs. open-weight models
  - Model sizes and tiers (fast/cheap vs. frontier); routing between them
  - Multimodal models: text, image, audio, video input and output
  - Benchmarks and their limitations (contamination, saturation, poor proxy for your task)

### 25.2 Machine Learning Basics

#### 25.2.1 Core concepts
- Learning from data: features, labels, models, parameters
- Supervised, unsupervised, self-supervised and reinforcement learning
- Training, validation and test sets; overfitting and generalization
- Loss functions and optimization (gradient descent, intuitively)
- Classification vs. regression vs. generation
- Evaluation metrics: accuracy, precision, recall, F1 — and why they matter for AI features (e.g., a classifier routing support tickets)
- Bias in data and models; fairness

### 25.3 Neural Networks and Deep Learning

#### 25.3.1 Neural network intuition
- Neurons, weights, biases, activation functions
- Layers and depth; forward pass
- Backpropagation (intuition)
- Representations: what hidden layers learn
- Vectors, matrices and tensors (the shapes data takes)
- GPUs and why matrix multiplication at scale enabled modern AI

### 25.4 Large Language Models

#### 25.4.1 How LLMs work
- **Tokens and tokenization**
  - Subword tokenization (BPE); tokens ≠ words ≠ characters
  - Why models struggle with character-level tasks, arithmetic and some languages
  - Token counting and cost estimation; tokenizer differences between providers
- **Next-token prediction**
  - Autoregressive generation
  - Logits, probabilities, softmax
- **The transformer architecture (conceptual)**
  - Embeddings and positional information
  - Self-attention: queries, keys, values (intuition)
  - Multi-head attention, feed-forward layers, residual connections
  - Decoder-only models
  - Mixture-of-experts (awareness)
- **Training pipeline**
  - Pretraining on large corpora
  - Supervised fine-tuning / instruction tuning
  - Preference optimization: RLHF, RLAIF, Constitutional AI, DPO (awareness)
  - Reinforcement learning for reasoning and agentic tasks
  - Knowledge cutoff and why models do not know recent events
- **Inference**
  - Prefill vs. decode; time-to-first-token vs. tokens-per-second
  - KV cache; prompt caching and its pricing implications
  - Sampling: temperature, top-p, top-k; determinism and its limits
  - Stop sequences, max tokens
  - Reasoning/"thinking" tokens and extended thinking budgets
- **Context windows**
  - Context length limits (hundreds of thousands to millions of tokens in 2026)
  - "Lost in the middle" and context degradation ("context rot") as context grows
  - Input vs. output token limits and pricing
- **Capabilities and limitations**
  - Strengths: language, code, summarization, transformation, classification, extraction, reasoning with tools
  - Weaknesses: hallucination/confabulation, sycophancy, brittle arithmetic, calibration, prompt sensitivity, non-determinism
  - Why "it worked once" proves nothing — the case for evaluation

#### 25.4.2 Embeddings and semantic representations
- What embeddings are: vectors capturing meaning
- Embedding models vs. generative models
- Similarity metrics: cosine similarity, dot product, Euclidean distance
- Dimensionality; normalization
- Uses: semantic search, clustering, classification, deduplication, recommendations
- Multimodal embeddings (text + image)

#### 25.4.3 Vector databases (concepts)
- Approximate nearest neighbour (ANN) search
- Index types: HNSW, IVF (conceptual)
- Metadata filtering; hybrid search (vector + keyword/BM25)
- Options: pgvector (Postgres), Pinecone, Weaviate, Qdrant, Chroma, Turbopuffer, LanceDB (awareness)

#### 25.4.4 Other generative modalities (awareness)
- Image generation (diffusion models)
- Speech-to-text, text-to-speech, real-time voice models
- Video generation
- Vision-language models (screenshots, documents, UI understanding)

### 25.5 Deeper ML (Optional Specialization)

#### 25.5.1 For those going further
- Building a GPT from scratch (Karpathy's course)
- Fine-tuning (LoRA/QLoRA) and when it beats prompting
- Distillation, quantization
- Running open-weight models locally (Ollama, LM Studio, llama.cpp)
- Mechanistic interpretability (awareness)

### Resources — Domain 25

| Resource | Type | Creator / Org | URL | What to learn |
|---|---|---|---|---|
| Neural Networks (series) | YouTube playlist | 3Blue1Brown (Grant Sanderson) | https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi | Visual intuition for neural nets, backprop, transformers, attention |
| Intro to Large Language Models | Talk | Andrej Karpathy | https://www.youtube.com/watch?v=zjkBMFhNj_g | One-hour overview of LLMs for a general technical audience |
| Deep Dive into LLMs like ChatGPT | Talk (3.5h) | Andrej Karpathy | https://www.youtube.com/watch?v=7xTGNNLPyMI | Full pipeline: pretraining, tokenization, post-training, RL, limitations |
| Neural Networks: Zero to Hero | Course (free) | Andrej Karpathy | https://karpathy.ai/zero-to-hero.html | Build neural nets and GPT from scratch (optional depth) |
| Machine Learning Crash Course | Course (free) | Google | https://developers.google.com/machine-learning/crash-course | ML fundamentals with interactive exercises |
| Machine Learning Specialization | Course | Andrew Ng (DeepLearning.AI / Stanford, Coursera) | https://www.coursera.org/specializations/machine-learning-introduction | Classic ML foundations |
| Practical Deep Learning for Coders | Course (free) | fast.ai (Jeremy Howard) | https://course.fast.ai/ | Top-down, practical deep learning |
| Hugging Face LLM Course | Course (free) | Hugging Face | https://huggingface.co/learn/llm-course | Transformers, tokenizers, fine-tuning |
| The Illustrated Transformer | Article | Jay Alammar | https://jalammar.github.io/illustrated-transformer/ | Visual explanation of transformer architecture |
| Transformer Explainer | Interactive tool | Georgia Tech Polo Club | https://poloclub.github.io/transformer-explainer/ | Interactive visualization of GPT-2 inference |
| LLM Visualization | Interactive 3D | Brendan Bycroft | https://bbycroft.net/llm | Step-through 3D visualization of an LLM |
| Tiktokenizer | Tool | David Duong | https://tiktokenizer.vercel.app/ | See how text becomes tokens |
| Attention Is All You Need | Research paper | Vaswani et al. (Google, 2017) | https://arxiv.org/abs/1706.03762 | The transformer paper |
| Hands-On Large Language Models | Book | Jay Alammar & Maarten Grootendorst (O'Reilly) | https://www.llm-book.com/ | Visual, practical LLM understanding: tokens, embeddings, RAG |
| Build a Large Language Model (From Scratch) | Book | Sebastian Raschka (Manning) | https://www.manning.com/books/build-a-large-language-model-from-scratch | Implementing an LLM step by step (optional) |
| Understanding Deep Learning | Book (free PDF) | Simon J.D. Prince (MIT Press) | https://udlbook.github.io/udlbook/ | Rigorous, well-illustrated deep learning text |
| Stanford CS224N: NLP with Deep Learning | University course | Stanford (Christopher Manning) | https://web.stanford.edu/class/cs224n/ | University-level NLP and transformers |

---

## Domain 26: LLM Application Engineering

**Label:** [Essential] · **Depth target:** D3 (D4 senior AI-product engineers) · **Prerequisites:** Domains 9, 12, 14, 21, 25.

**Why it matters:** This is the practical craft of building reliable features on top of model APIs: prompts, context, structured data, tools, retrieval and SDKs. It is now a core expectation for frontend and full-stack engineers at AI-forward companies.

### 26.1 Working with Model APIs

#### 26.1.1 API fundamentals
- Provider APIs: Anthropic Messages API, OpenAI Responses API, Google Gemini API; OpenAI-compatible endpoints
- Message roles: system, user, assistant; multi-turn conversations as arrays
- Content blocks: text, images, documents/PDFs, audio; tool use/result blocks
- Parameters: model, max tokens, temperature, stop sequences, reasoning effort/thinking budgets
- Streaming responses (SSE) vs. non-streaming
- Usage reporting: input/output/cached tokens
- Errors: rate limits (429), overloaded (529/503), context-length errors, content refusals; retries with backoff
- Batch APIs for offline workloads
- Prompt caching: structuring prompts so stable prefixes are cached
- Files APIs and citations features
- Model selection: capability vs. latency vs. cost; model routing and fallbacks
- Gateways: Vercel AI Gateway, OpenRouter, Cloudflare AI Gateway, LiteLLM (awareness)

#### 26.1.2 Security and architecture of model calls
- Server-side calls only; never expose keys
- Authentication, per-user rate limiting and spending caps
- Logging with PII redaction
- Data retention policies of providers

### 26.2 Prompt Engineering

#### 26.2.1 Core techniques
- Clear, direct, specific instructions; explaining *why*
- Role/system prompts
- Providing examples (few-shot / multishot prompting) and their biasing effects
- Structuring prompts with sections and XML-style tags
- Letting the model think: chain-of-thought, extended thinking/reasoning modes
- Prefilling and output formatting
- Prompt chaining: splitting complex tasks into steps
- Long-context prompting: placing documents first, quoting relevant passages before answering
- Reducing hallucination: allowing "I don't know", grounding in provided sources, requiring citations
- Prompt templates and variables; versioning prompts as code

#### 26.2.2 Prompt engineering as engineering
- Prompts are code: version control, review, testing
- Iterating against evaluation sets, not anecdotes
- Model-specific prompting differences and migration between model versions
- Using models to improve prompts (meta-prompting) with evaluation as the judge

### 26.3 Context Engineering

#### 26.3.1 Context as a finite resource
- Context engineering: curating the smallest set of high-signal tokens that achieves the outcome
- Components of context: system prompt, tool definitions, retrieved documents, conversation history, memory, examples, current state
- Context degradation with length; attention budget
- Just-in-time retrieval vs. pre-loading
- Compaction/summarization of long histories
- Structured note-taking and external memory
- Sub-agents with clean contexts for focused tasks
- Context for UI generation: design system docs, component APIs, tokens, screenshots

### 26.4 Structured Outputs

#### 26.4.1 Getting reliable data from models
- JSON mode vs. schema-constrained structured outputs
- Defining schemas with Zod/JSON Schema; schema design for models (descriptions, enums, optional fields)
- Validating and repairing outputs; retry strategies
- Streaming partial objects (progressive UI from incomplete JSON)
- Extraction, classification and transformation tasks
- When to use structured output vs. free text vs. tool calls

### 26.5 Tool Calling (Function Calling)

#### 26.5.1 Tools fundamentals
- How tool calling works: model emits a tool call → your code executes → result returned → model continues
- Tool definitions: name, description, input schema
- Tool choice: auto, required, specific tool, none
- Parallel tool calls
- Server-side vs. client-side tools (tools that run in the browser: UI actions, geolocation, confirmations)
- Provider-hosted tools: web search, code execution, computer use, file search (awareness)

#### 26.5.2 Designing good tools
- Tools as an API designed for a non-deterministic user (the model)
- Clear names and descriptions; unambiguous parameters; helpful error messages that guide recovery
- Returning concise, high-signal results (token efficiency); pagination and truncation
- Consolidating workflows into fewer, higher-level tools
- Tool permissions and side effects (read vs. write vs. irreversible)
- Evaluating tool use

### 26.6 Retrieval-Augmented Generation (RAG)

#### 26.6.1 RAG pipeline
- Why RAG: grounding answers in your data, freshness, citations, access control
- Ingestion: loading documents (PDF, HTML, Markdown), cleaning, chunking strategies (fixed, recursive, semantic, structure-aware)
- Embedding chunks; storing vectors with metadata
- Retrieval: vector search, keyword search (BM25), hybrid search
- Contextual retrieval (adding document context to chunks)
- Reranking
- Query transformation (rewriting, decomposition, HyDE — awareness)
- Generation with citations; displaying sources in UI
- Permissions-aware retrieval (users only see what they may see)
- Evaluating RAG: retrieval metrics (recall@k, MRR) and answer metrics (faithfulness, relevance)
- Agentic retrieval: letting agents search iteratively with tools vs. single-shot RAG
- When long context makes RAG unnecessary — and when it does not

### 26.7 AI SDKs and Frameworks

#### 26.7.1 TypeScript AI SDKs
- **Vercel AI SDK (v7 as of 2026)**
  - AI SDK Core: `generateText`, `streamText`, `generateObject`/structured output, tool calling, multi-step loops, embeddings, provider abstraction
  - AI SDK UI: `useChat`, `useCompletion`, `useObject`; UI message streams; message parts (text, reasoning, tool calls, sources, files, custom data)
  - Agents abstraction; tool approvals; durable/workflow agents; MCP client support; telemetry
  - AI Elements: prebuilt chat UI components
- **Provider SDKs**
  - Anthropic TypeScript SDK; Claude Agent SDK
  - OpenAI TypeScript SDK; OpenAI Agents SDK (JS)
  - Google Gen AI SDK
- **Agent frameworks (awareness → working, by need)**
  - Mastra (TypeScript agent framework), LangChain.js / LangGraph.js, LlamaIndex.TS
  - Choosing raw SDKs vs. frameworks: control and transparency vs. speed

#### 26.7.2 AI UI component kits (awareness)
- AI Elements, assistant-ui, CopilotKit, Chat SDK patterns
- Protocols for agent ↔ UI communication: AG-UI (awareness)

### Resources — Domain 26

| Resource | Type | Creator / Org | URL | What to learn |
|---|---|---|---|---|
| Claude Developer Platform docs | Official docs | Anthropic | https://docs.claude.com/en/docs/intro | Messages API, tool use, streaming, prompt caching, structured outputs |
| Prompt engineering overview (Claude) | Official docs | Anthropic | https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview | Prompting techniques from the model developer |
| Anthropic Courses (GitHub) | Free courses | Anthropic | https://github.com/anthropics/courses | API fundamentals, prompt engineering tutorial, real-world prompting, tool use |
| Anthropic Academy | Free courses | Anthropic | https://anthropic.skilljar.com/ | Building with the Claude API, MCP, Claude Code |
| Effective context engineering for AI agents | Engineering article | Anthropic | https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents | Context as a finite resource; compaction, notes, sub-agents |
| Writing effective tools for agents | Engineering article | Anthropic | https://www.anthropic.com/engineering/writing-tools-for-agents | Tool design and evaluation |
| Introducing Contextual Retrieval | Engineering article | Anthropic | https://www.anthropic.com/news/contextual-retrieval | Improving RAG retrieval accuracy |
| OpenAI Platform docs | Official docs | OpenAI | https://platform.openai.com/docs | Responses API, structured outputs, function calling, embeddings |
| OpenAI Cookbook | Examples | OpenAI | https://cookbook.openai.com/ | Practical recipes for RAG, evals, tools |
| Gemini API docs | Official docs | Google | https://ai.google.dev/gemini-api/docs | Gemini models, multimodal input, function calling |
| AI SDK docs | Official docs | Vercel | https://ai-sdk.dev/docs/introduction | TypeScript AI toolkit: Core, UI, agents |
| AI SDK 7 announcement | Changelog | Vercel | https://vercel.com/changelog/ai-sdk-7 | What changed in the current major version |
| Mastra docs | Official docs | Mastra | https://mastra.ai/docs | TypeScript agents, workflows, RAG, evals |
| AI Engineering | Book | Chip Huyen (O'Reilly, 2025) | https://www.oreilly.com/library/view/ai-engineering/9781098166298/ | The most complete book on building applications with foundation models |
| Prompt Engineering Guide | Guide | DAIR.AI | https://www.promptingguide.ai/ | Catalogue of prompting techniques and papers |
| DeepLearning.AI short courses | Courses (free) | DeepLearning.AI (Andrew Ng & partners) | https://www.deeplearning.ai/short-courses/ | Focused courses on RAG, agents, MCP, evals with industry partners |
| pgvector | GitHub repository | Andrew Kane | https://github.com/pgvector/pgvector | Vector search in Postgres |

---

## Domain 27: AI-Native Application Engineering

**Label:** [Essential] (27.1–27.6), [Core-Senior] (27.7–27.11) · **Depth target:** D3 → D4 · **Prerequisites:** Domains 11, 18, 19, 21, 26.

**Why it matters:** This is the defining capability of the AI-native frontend engineer: designing and building applications where models and agents are first-class components — reliable, observable, secure, evaluated, and pleasant for humans to use.

### 27.1 AI-Native Application Architecture

#### 27.1.1 Architectural building blocks
- Client UI ↔ server route/action ↔ model provider(s) ↔ tools/data
- Where state lives: conversation storage, message persistence, resumable streams
- Synchronous request/response vs. background agent runs with progress updates
- Durable execution for long-running agents (workflows that survive timeouts, deploys and crashes)
- Model gateways, routing and fallbacks
- Caching (prompt caching, semantic caching — with care)
- Cost architecture: per-request budgets, model tiering, token accounting per user/tenant
- Latency architecture: streaming, speculative UI, parallel tool calls, smaller models for fast steps
- AI features within conventional apps vs. AI-first apps

#### 27.1.2 Workflows vs. agents
- Workflows: predefined code paths orchestrating LLM calls (prompt chaining, routing, parallelization, orchestrator-workers, evaluator-optimizer)
- Agents: LLMs dynamically directing their own process and tool use in a loop
- Start with the simplest thing that works; add autonomy only where it pays off

### 27.2 AI-Powered Interfaces

#### 27.2.1 Interface paradigms
- Chat interfaces: when chat is right and when it is lazy design
- Copilots and inline assistance (in-editor suggestions, ghost text, inline edit)
- Command bars and natural-language actions
- AI in forms: autofill, extraction from documents, smart defaults
- Search with AI answers and citations
- Canvas/document co-editing with AI (artifacts, side-by-side panes)
- Background agents and task inboxes
- Voice and real-time multimodal interfaces
- Ambient/proactive AI (suggestions without prompts) and its interruption costs

#### 27.2.2 Interaction details for AI UIs
- Input: prompt boxes, attachments, drag-and-drop, slash commands, mentions/context pickers, model selectors
- Output rendering: incremental markdown, code blocks with copy, math, tables, images
- Message actions: copy, regenerate, edit-and-resend, branch, feedback (thumbs), share
- Stop/cancel generation; resume interrupted streams
- Auto-scroll that respects the user's scroll position
- Showing reasoning and progress (collapsible thinking, step lists, tool-call indicators)
- Citations and source previews
- Undo and version history for AI edits; diff views for proposed changes
- Empty states, suggested prompts, onboarding to capabilities
- Accessibility of all of the above (Domain 11.4.3)

### 27.3 Streaming

#### 27.3.1 Streaming end to end
- Why streaming: perceived latency (time-to-first-token)
- Transport: SSE, chunked HTTP, Web Streams; `ReadableStream` on server and client
- Stream protocols: text deltas, typed parts (text, reasoning, tool-call, tool-result, source, data), UI message streams
- Rendering streams in React: incremental updates without re-rendering everything; batching; memoizing completed blocks
- Streaming markdown parsing and unterminated syntax (half-written code fences, links)
- Streaming structured objects into progressive UI
- Backpressure, cancellation (`AbortController` from UI to provider), timeouts
- Resumable streams after network drops or page reloads
- Error mid-stream: partial results, retry from checkpoint

### 27.4 Generative UI

#### 27.4.1 Models that drive interfaces
- Tool calls mapped to React components (the model chooses *which* UI to show; your components render it safely)
- Streaming UI from server components (RSC-based generative UI — awareness of trade-offs)
- Structured outputs rendered into layouts
- UI from MCP servers: MCP Apps extension and OpenAI Apps SDK — interactive components served by tools, rendered in sandboxed iframes inside hosts like ChatGPT and Claude (awareness → working)
- Fully generated UI/code artifacts rendered in sandboxes (iframes, sandboxed runtimes); security boundaries
- Design-system-constrained generation: limiting models to known components and tokens

### 27.5 Tool Calling in Applications

#### 27.5.1 Tools in production
- Client-side tools: actions the model can request in the browser (navigate, fill form, open modal) with user confirmation
- Server-side tools: database queries, APIs, search
- Tool-call UI states: input-streaming, input-available, awaiting-approval, executing, output-available, error
- Rendering tool progress and results
- Idempotency and side-effect control; dry runs and previews

### 27.6 Human-in-the-Loop Systems

#### 27.6.1 Keeping humans in control
- Approval gates for consequential actions (send, buy, delete, deploy)
- Graduated autonomy: suggest → confirm → act with undo → act autonomously
- Interrupt, pause, edit and resume agent runs
- Presenting plans before execution; editable plans
- Escalation to humans; handoff patterns
- Feedback capture as training/evaluation signal
- Designing for trust calibration: showing confidence, sources and limitations without overwhelming

### 27.7 AI Agents (Core-Senior)

#### 27.7.1 Agent fundamentals
- The agent loop: observe → think → act (tool call) → observe result → repeat until done
- Stopping conditions, step limits, budgets
- Planning and re-planning; task decomposition
- Reflection and self-correction (evaluator-optimizer)
- Computer use and browser agents (awareness): operating UIs through screenshots or accessibility trees
- Coding agents as a reference architecture (Domain 28)
- Agent harnesses and SDKs (Claude Agent SDK, OpenAI Agents SDK, AI SDK agents, Mastra, LangGraph)
- Agent Skills: packaging instructions, scripts and resources that agents load on demand (awareness)

#### 27.7.2 Agentic workflows
- Long-running tasks: progress reporting, notifications, checkpoints
- Background agents and asynchronous UX
- Scheduling and triggers (cron, events, webhooks)
- Durable state and recovery

### 27.8 Model Context Protocol and Interoperability (Core-Senior)

#### 27.8.1 MCP
- What MCP is: an open protocol (now governed under the Linux Foundation's Agentic AI Foundation) connecting AI applications to tools, data and prompts
- Architecture: hosts, clients, servers
- Primitives: tools, resources, prompts; client features (sampling, elicitation, roots)
- Transports: stdio and Streamable HTTP
- The 2026-07-28 specification revision: a stateless core (no initialize handshake or session IDs), extensions (including UI via MCP Apps), tasks for long-running operations, hardened authorization — check the official changelog for exact details
- Authorization: OAuth 2.1-based flows for remote servers
- Building an MCP server in TypeScript (official SDK); testing with MCP Inspector
- Consuming MCP servers from your app (AI SDK MCP client)
- Security: tool poisoning, over-broad permissions, confused-deputy problems, untrusted servers

#### 27.8.2 Other protocols (awareness)
- Agent2Agent (A2A) protocol for agent-to-agent communication
- AG-UI for agent ↔ frontend event streams
- `AGENTS.md` for agent instructions in repositories

### 27.9 Multi-Agent Systems and Memory (Core-Senior)

#### 27.9.1 Multi-agent patterns
- Orchestrator–worker (lead agent delegating to sub-agents)
- Parallel sub-agents with isolated contexts
- Handoffs between specialist agents
- Debate/critique patterns (awareness)
- Costs: token multiplication, coordination failures, harder debugging — use only when the task is parallelizable and valuable

#### 27.9.2 Memory systems
- Short-term memory: conversation context, compaction
- Long-term memory: user preferences, facts, episodic memory stored externally and retrieved
- Memory as files/notes vs. vector stores vs. structured profiles
- Memory UX: showing, editing and deleting what the system remembers; privacy controls

### 27.10 Evaluation, Observability and Reliability (Core-Senior)

#### 27.10.1 AI evaluation
- Why evals: non-determinism, regression on prompt/model changes
- Error analysis first: read real traces, categorize failures
- Eval types: code-based assertions, reference-based, LLM-as-judge (with validated judges), human evaluation
- Building datasets: real logs, synthetic cases, edge cases, adversarial cases
- Offline evals in CI; online evals and monitoring in production
- Agent evals: task success, trajectory/tool-use correctness, cost and step counts
- A/B testing AI features; product metrics vs. model metrics
- Tools: Evalite, Promptfoo, Braintrust, Langfuse, LangSmith, OpenAI Evals (awareness)

#### 27.10.2 Observability
- Tracing every LLM call: prompt, response, tokens, latency, cost, tool calls
- OpenTelemetry GenAI semantic conventions
- Session/conversation-level views
- User feedback linked to traces
- Dashboards: latency (TTFT, total), error rates, refusal rates, cost per user/feature

#### 27.10.3 Reliability and guardrails
- Input guardrails: validation, moderation, injection heuristics, scope limits
- Output guardrails: schema validation, content filters, PII redaction, groundedness checks
- Fallbacks: alternative models, cached answers, graceful "I can't help with that"
- Timeouts, retries, circuit breakers for providers
- Deterministic code around the model wherever possible

### 27.11 AI Security (Core-Senior)

#### 27.11.1 Securing AI applications
- Prompt injection defences: privilege separation, treating all model output as untrusted, limiting tool access, human approval, isolating untrusted content, the "rule of two"/lethal-trifecta analysis
- Insecure output handling: sanitizing rendered markdown/HTML; blocking automatic image/link loads that exfiltrate data; sandboxing generated code
- Excessive agency: least-privilege tools, scoped credentials, per-action authorization
- Data leakage: system prompt leakage, cross-tenant retrieval leaks, PII in logs
- Denial of wallet: unbounded consumption, abuse, rate limits, quotas
- Supply chain: untrusted MCP servers, model and package provenance
- Red-teaming AI features
- Compliance: EU AI Act transparency duties, disclosure of AI-generated content, provider usage policies

### Resources — Domain 27

| Resource | Type | Creator / Org | URL | What to learn |
|---|---|---|---|---|
| Building effective agents | Engineering article | Anthropic (Erik Schluntz & Barry Zhang) | https://www.anthropic.com/engineering/building-effective-agents | Workflows vs. agents; the canonical patterns |
| How we built our multi-agent research system | Engineering article | Anthropic | https://www.anthropic.com/engineering/multi-agent-research-system | Real-world multi-agent architecture, evaluation and trade-offs |
| Equipping agents for the real world with Agent Skills | Engineering article | Anthropic | https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills | Progressive disclosure of instructions and tools to agents |
| A practical guide to building agents | Guide (PDF) | OpenAI | https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf | Agent design, orchestration, guardrails |
| 12-Factor Agents | GitHub repository | Dex Horthy (HumanLayer) | https://github.com/humanlayer/12-factor-agents | Principles for production-grade LLM software |
| Model Context Protocol | Official docs & spec | MCP project (Agentic AI Foundation) | https://modelcontextprotocol.io/ | MCP concepts, spec, SDKs, Inspector |
| MCP blog | Official blog | MCP project | https://blog.modelcontextprotocol.io/ | 2026-07-28 spec release notes and roadmap |
| OpenAI Apps SDK | Official docs | OpenAI | https://developers.openai.com/apps-sdk | Building UI-bearing apps on MCP inside ChatGPT |
| AG-UI Protocol | Official docs | CopilotKit & community | https://docs.ag-ui.com/ | Agent ↔ UI event protocol |
| A2A Protocol | Official docs | Linux Foundation (originated at Google) | https://a2a-protocol.org/ | Agent-to-agent interoperability |
| AI SDK — Generative UI & chatbot docs | Official docs | Vercel | https://ai-sdk.dev/docs/ai-sdk-ui/overview | Streaming chat, tool UIs, message parts |
| AI Elements | Component library | Vercel | https://ai-sdk.dev/elements | Prebuilt AI UI components |
| assistant-ui | Component library | assistant-ui | https://www.assistant-ui.com/ | React primitives for AI chat interfaces |
| Your AI Product Needs Evals | Article | Hamel Husain | https://hamel.dev/blog/posts/evals/ | Error analysis and evaluation-driven development |
| LLM Evals FAQ | Article | Hamel Husain & Shreya Shankar | https://hamel.dev/blog/posts/evals-faq/ | Practical answers to common eval questions |
| What We've Learned From A Year of Building with LLMs | Article | Yan, Bischof, Frye, Husain, Liu, Shankar | https://applied-llms.org/ | Tactical, operational, strategic lessons |
| Patterns for Building LLM-based Systems & Products | Article | Eugene Yan | https://eugeneyan.com/writing/llm-patterns/ | Evals, RAG, guardrails, caching, feedback patterns |
| Langfuse docs | Official docs | Langfuse | https://langfuse.com/docs | Open-source LLM tracing, prompt management, evals |
| Promptfoo docs | Official docs | Promptfoo | https://www.promptfoo.dev/docs/intro/ | Eval and red-teaming CLI |
| Evalite | Official docs | Matt Pocock | https://www.evalite.dev/ | TypeScript-native evals |
| OpenTelemetry GenAI semantic conventions | Specification | OpenTelemetry | https://opentelemetry.io/docs/specs/semconv/gen-ai/ | Standard telemetry for LLM calls |
| Chip Huyen's blog | Blog | Chip Huyen | https://huyenchip.com/blog/ | Agents, evaluation, AI system design |
| AI Engineer (conference talks) | YouTube channel | AI Engineer (swyx & Ben Dunphy) | https://www.youtube.com/@aiDotEngineer | Talks from practitioners building AI products |
| Simon Willison's Weblog | Blog | Simon Willison | https://simonwillison.net/ | Daily, rigorous notes on LLMs, tools, security |

---

## Domain 28: AI-Assisted Software Development

**Label:** [Essential] · **Depth target:** D3 (D4 for staff engineers who define team practice) · **Prerequisites:** Practised lightly from Stage 1 (as a tutor). Full mastery requires Domains 7, 9, 12, 16, 17, 26 — you must be able to verify what agents produce.

**Why it matters:** By 2026, agentic coding is standard practice at leading companies. Teams at Anthropic, Vercel, Stripe and many others describe engineers delegating large shares of implementation to agents while focusing on specification, architecture and review. The skill is not "using a tool" — it is a new engineering discipline of specifying, delegating and verifying. Evidence is mixed on productivity: a 2025 METR randomized study found experienced developers were slower with AI tools on familiar codebases despite feeling faster — a reminder that measurement and judgment matter.

### 28.1 The Tool Landscape

#### 28.1.1 Categories of AI development tools
- Chat assistants (Claude, ChatGPT, Gemini) for explanation, design discussion, learning
- In-editor assistants: completions, inline edits, chat (GitHub Copilot, Cursor, Windsurf, Zed, JetBrains AI)
- Agentic coding tools in the terminal/IDE: Claude Code, OpenAI Codex, Gemini CLI, Cursor Agent, Copilot agent mode, OpenCode, Aider
- Cloud/background agents that work asynchronously and open pull requests (Claude Code on the web, Codex cloud, Copilot coding agent, Cursor background agents, Devin, Jules)
- App/UI generators: v0, Lovable, Bolt, Replit Agent, Figma Make — for prototypes and scaffolds
- AI code review bots (CodeRabbit, Graphite, Copilot review, Claude Code review actions)
- Browser/DevTools agents via MCP (Playwright MCP, Chrome DevTools MCP)

#### 28.1.2 How coding agents work
- Agent loop with tools: read files, search (grep/glob), edit, run shell commands, run tests, browse
- Context windows and compaction; why long sessions degrade
- Permission modes and sandboxing
- Sub-agents, parallel agents and git worktrees
- Hooks, slash commands, skills, plugins and MCP integrations for customization
- Memory/instruction files: `CLAUDE.md`, `AGENTS.md`, `.cursor/rules`, Copilot instructions

### 28.2 Codebase Exploration and Understanding

#### 28.2.1 Using agents to learn codebases
- Asking architectural questions; tracing data flow; locating where a behaviour lives
- Generating onboarding docs and diagrams — then verifying them
- Understanding unfamiliar languages and libraries quickly
- Explaining legacy code and its history (with git log/blame)

### 28.3 Specification and Context

#### 28.3.1 Writing for agents
- Clear task specifications: goal, constraints, acceptance criteria, files involved, non-goals
- Spec-driven development: requirements → design → tasks → implementation (e.g., GitHub Spec Kit style workflows)
- Plan-first workflows: have the agent propose a plan; review and edit it before implementation
- Providing context: relevant files, docs, screenshots, design specs, error logs
- Project instruction files: conventions, commands, architecture notes, "gotchas"
- Context hygiene: fresh sessions per task, compaction, scoping

### 28.4 Autonomous Implementation

#### 28.4.1 Delegating implementation
- Task sizing: what to delegate (well-specified, verifiable) vs. keep (ambiguous, high-risk, novel architecture)
- Test-driven delegation: write or approve tests first, then let agents implement until green
- Iterating with visual feedback: screenshots, browser automation, design comparison
- Parallel agents on independent tasks (worktrees, background agents)
- Large-scale changes: migrations, codemods, dependency upgrades with agent assistance
- Prototyping speed vs. production rigor ("vibe coding" for throwaway exploration only)

### 28.5 AI-Assisted Debugging, Testing and Architecture

#### 28.5.1 Debugging
- Agents reproducing bugs, adding instrumentation, bisecting
- Feeding runtime evidence (logs, traces, DevTools output via MCP)
#### 28.5.2 Testing
- Generating test cases from specs; property-based ideas; edge-case brainstorming
- Watch for tests that assert current (buggy) behaviour or mock away the thing being tested
- E2E test generation with Playwright and browser agents
#### 28.5.3 Architecture
- Using models as a sounding board: trade-off analysis, alternative designs, risk lists
- Generating ADR/RFC drafts — the decision remains yours
- Consistency enforcement through lint rules and types that agents must satisfy

### 28.6 Human Verification and Accountability

#### 28.6.1 Reviewing AI-generated code
- You own every line you merge
- Review checklist: correctness, edge cases, security (injection, auth checks, secrets), accessibility, performance, error handling, consistency with conventions, unnecessary complexity, hallucinated APIs or packages
- Read diffs fully; run the code; test unhappy paths
- Detecting plausible-but-wrong patterns: silent catch blocks, fake implementations, disabled tests, over-broad types (`any`), duplicated logic
- Guardrails: CI, type checks, linters, tests, required human review, branch protection
- Security of agents themselves: permission scoping, secrets exposure, prompt injection via repository content or web pages, reviewing commands before execution

#### 28.6.2 Skill preservation
- Deliberate practice without AI to keep fundamentals sharp
- Using AI to learn deeper (asking why) rather than to avoid understanding
- Measuring actual productivity and quality, not perceived speed

### 28.7 Team and Organizational Practice (Core-Senior)

#### 28.7.1 Scaling AI-assisted development
- Shared instruction files, skills and MCP configurations
- Codebases designed for agent legibility (consistent patterns, good types, fast tests, clear docs)
- Review capacity as the new bottleneck; PR size discipline
- Policies: what data can be sent to which tools; licence and IP considerations
- Measuring impact (DORA metrics, cycle time, defect rates)

### Resources — Domain 28

| Resource | Type | Creator / Org | URL | What to learn |
|---|---|---|---|---|
| Claude Code docs | Official docs | Anthropic | https://code.claude.com/docs/en/overview | Agentic coding: memory, sub-agents, hooks, skills, MCP |
| Claude Code: Best practices for agentic coding | Engineering article | Anthropic | https://www.anthropic.com/engineering/claude-code-best-practices | Explore → plan → code → commit; TDD with agents; parallel agents |
| Cursor docs | Official docs | Anysphere | https://cursor.com/docs | AI editor, agents, rules |
| GitHub Copilot docs | Official docs | GitHub | https://docs.github.com/en/copilot | Copilot, agent mode, coding agent |
| OpenAI Codex docs | Official docs | OpenAI | https://developers.openai.com/codex | Codex CLI and cloud agent |
| Gemini CLI | GitHub repository | Google | https://github.com/google-gemini/gemini-cli | Open-source terminal agent |
| AGENTS.md | Open format | Community (OpenAI, Google, Cursor, others) | https://agents.md/ | Instruction files for coding agents |
| Spec Kit | GitHub repository | GitHub | https://github.com/github/spec-kit | Spec-driven development toolkit |
| Playwright MCP | GitHub repository | Microsoft | https://github.com/microsoft/playwright-mcp | Letting agents drive a browser |
| Chrome DevTools MCP | GitHub repository | Google Chrome DevTools team | https://github.com/ChromeDevTools/chrome-devtools-mcp | Letting agents inspect performance, network, console |
| Software Is Changing (Again) | Talk (YC AI Startup School, 2025) | Andrej Karpathy | https://www.youtube.com/watch?v=LCEmiRjPEtQ | "Software 3.0", partial autonomy, human verification loops |
| Here's how I use LLMs to help me write code | Article | Simon Willison | https://simonwillison.net/2025/Mar/11/using-llms-for-code/ | Practical, sceptical workflow advice |
| My LLM codegen workflow atm | Article | Harper Reed | https://harper.blog/2025/02/16/my-llm-codegen-workflow-atm/ | Spec → plan → execute workflow |
| Beyond Vibe Coding | Book | Addy Osmani (O'Reilly) | https://beyond.addy.ie/ | Professional AI-assisted engineering practices |
| Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity | Research study | METR | https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/ | Evidence on real productivity vs. perception |
| DORA research on AI-assisted development | Research program | Google Cloud / DORA | https://dora.dev/research/ | How AI adoption affects delivery performance |

---

# STAGE 8 — SENIOR, STAFF AND PRINCIPAL CAPABILITIES

---

## Domain 29: Engineering Judgment, Product Sense and Leadership

**Label:** [Core-Senior] · **Depth target:** D3 at senior; D4 at staff/principal · **Prerequisites:** Substantial professional experience across Stages 5–7.

**Why it matters:** At senior levels, technical knowledge is necessary but not sufficient. As AI handles more implementation, the distinguishing human contributions are judgment, taste, communication and ownership of outcomes.

### 29.1 Product Sense for Engineers

#### 29.1.1 Understanding the product
- Users, problems, jobs to be done
- Business models and metrics (activation, retention, conversion, revenue)
- Reading analytics; forming hypotheses; experimentation basics
- Scoping: MVPs, cutting scope without cutting quality
- Saying no; prioritization frameworks (impact vs. effort)
- AI product judgment: when AI improves the experience, when it adds latency/cost/uncertainty for little benefit

### 29.2 Engineering Judgment

#### 29.2.1 Making good decisions
- Reversible vs. irreversible decisions
- Simplicity as a feature; avoiding premature abstraction
- Estimating and managing risk; spikes and prototypes
- Balancing speed and quality; managing technical debt deliberately
- Taste: recognizing quality in code, interfaces and systems

### 29.3 Communication

#### 29.3.1 Written and verbal communication
- Writing design docs, RFCs, ADRs, post-mortems, PR descriptions
- Explaining technical trade-offs to non-engineers
- Giving and receiving feedback; code review culture
- Presenting and demoing
- Documentation as leverage (for humans and agents)

### 29.4 Collaboration and Leadership

#### 29.4.1 Working across disciplines
- Partnering with design (design engineering mindset), product, data, security, legal
- Running cross-team projects; driving alignment
#### 29.4.2 Technical leadership
- Mentoring and raising team capability
- Setting standards (accessibility, performance, security, AI usage)
- Staff archetypes: tech lead, architect, solver, right hand
- Building platforms and paved roads
- Influence without authority
- Hiring and interviewing (including evaluating candidates in an AI-assisted world)

### 29.5 Career and Continuous Learning

#### 29.5.1 Staying current without chasing hype
- Separating durable concepts from churn
- Reading primary sources: specs, release notes, papers
- Building in public; writing; open source contribution
- Ethics and responsibility: accessibility, privacy, dark patterns, AI harms

### Resources — Domain 29

| Resource | Type | Creator / Org | URL | What to learn |
|---|---|---|---|---|
| The Staff Engineer's Path | Book | Tanya Reilly (O'Reilly) | https://www.oreilly.com/library/view/the-staff-engineers/9781098118723/ | Staff-level technical leadership |
| Staff Engineer: Leadership Beyond the Management Track | Book/site | Will Larson | https://staffeng.com/ | Archetypes, stories from staff engineers |
| The Manager's Path | Book | Camille Fournier (O'Reilly) | https://www.oreilly.com/library/view/the-managers-path/9781491973882/ | Engineering leadership ladder |
| Lenny's Newsletter & Podcast | Newsletter/podcast | Lenny Rachitsky | https://www.lennysnewsletter.com/ | Product sense, growth, AI product building |
| The Pragmatic Engineer | Newsletter/podcast | Gergely Orosz | https://newsletter.pragmaticengineer.com/ | Engineering culture and AI's impact on the industry |
| An Elegant Puzzle | Book | Will Larson (Stripe Press) | https://press.stripe.com/an-elegant-puzzle | Systems of engineering management |
| Shape Up | Book (free online) | Ryan Singer (Basecamp) | https://basecamp.com/shapeup | Shaping and scoping product work |

---

## Optional Specializations

Learn these after the core syllabus, when your work or interests require them. Each lists prerequisites and the key concepts.

### S1. Graphics, Creative Coding and 3D
- **Prerequisites:** Domains 5, 10, 12; linear algebra basics
- **Concepts:** Canvas 2D; SVG animation; WebGL fundamentals; shaders (GLSL); three.js scene graph, cameras, lights, materials; React Three Fiber; WebGPU and WGSL; performance of GPU workloads
- **Resources:** three.js docs — https://threejs.org/docs/ · Three.js Journey (Bruno Simon) — https://threejs-journey.com/ · The Book of Shaders (Patricio Gonzalez Vivo & Jen Lowe) — https://thebookofshaders.com/ · WebGPU Fundamentals — https://webgpufundamentals.org/

### S2. Data Visualization
- **Prerequisites:** Domains 5, 11, 12
- **Concepts:** Visual encoding; chart selection; scales and axes; D3 (selections, scales, shapes, layouts); declarative charting (Observable Plot, Recharts, Visx, ECharts); accessible charts; real-time charts; dashboards for AI metrics
- **Resources:** D3 docs — https://d3js.org/ · Observable Plot — https://observablehq.com/plot/ · Fundamentals of Data Visualization (Claus Wilke, free) — https://clauswilke.com/dataviz/

### S3. On-Device and In-Browser AI
- **Prerequisites:** Domains 10, 25, 26
- **Concepts:** Running models in the browser (WebGPU, WASM); model size, quantization and download cost; Transformers.js; WebLLM; Chrome built-in AI APIs (Prompt, Summarizer, Translator, Writer APIs) and their availability; privacy and offline benefits; hybrid on-device/cloud routing
- **Resources:** Transformers.js — https://huggingface.co/docs/transformers.js/index · WebLLM — https://webllm.mlc.ai/ · Chrome built-in AI — https://developer.chrome.com/docs/ai/built-in

### S4. Real-Time Voice and Multimodal Interfaces
- **Prerequisites:** Domains 21.6, 26, 27
- **Concepts:** Audio capture and playback; WebRTC; speech-to-text/text-to-speech; real-time speech-to-speech models; turn detection, interruption (barge-in), latency budgets; voice UX
- **Resources:** OpenAI Realtime API docs — https://platform.openai.com/docs/guides/realtime · MDN WebRTC API — https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API

### S5. Rich Text Editors and Collaborative Canvases
- **Prerequisites:** Domains 10, 12, 21.6
- **Concepts:** `contenteditable` pitfalls; editor frameworks (ProseMirror, Tiptap, Lexical); document models; CRDT collaboration (Yjs); infinite canvas rendering (tldraw); AI-assisted editing inside editors
- **Resources:** ProseMirror guide — https://prosemirror.net/docs/guide/ · Lexical — https://lexical.dev/ · Yjs docs — https://docs.yjs.dev/ · tldraw — https://tldraw.dev/

### S6. Mobile with React Native
- **Prerequisites:** Domain 12
- **Concepts:** Native components; Expo; navigation; native APIs; performance; platform conventions (Apple HIG, Material Design)
- **Resources:** React Native docs — https://reactnative.dev/docs/getting-started · Expo docs — https://docs.expo.dev/

### S7. Desktop Applications
- **Prerequisites:** Domains 12, 21
- **Concepts:** Electron and Tauri architecture; IPC; security; auto-update; local AI integration
- **Resources:** Electron docs — https://www.electronjs.org/docs/latest/ · Tauri docs — https://v2.tauri.app/

### S8. WebAssembly
- **Prerequisites:** Domains 6, 10
- **Concepts:** Wasm modules, memory, JS interop; compiling Rust/C++/Go to Wasm; use cases (image/video processing, editors, ML inference)
- **Resources:** MDN WebAssembly — https://developer.mozilla.org/en-US/docs/WebAssembly · Rust and WebAssembly book — https://rustwasm.github.io/docs/book/

---

# Part V — Cross-Cutting Resource Directory

Resources relevant across many domains. Domain-specific resources appear in each domain's table.

## Official documentation hubs

| Name | Organization | URL | Use for |
|---|---|---|---|
| MDN Web Docs | Mozilla | https://developer.mozilla.org/ | Definitive reference for HTML, CSS, JavaScript, Web APIs, HTTP |
| web.dev | Google Chrome team | https://web.dev/ | Courses (Learn HTML/CSS/JS/Accessibility/Performance), articles, Baseline |
| Chrome for Developers | Google | https://developer.chrome.com/ | DevTools, new platform features, built-in AI |
| WebKit blog | Apple | https://webkit.org/blog/ | Safari feature releases |
| Mozilla Hacks | Mozilla | https://hacks.mozilla.org/ | Firefox and platform engineering |
| react.dev | Meta | https://react.dev/ | React |
| nextjs.org/docs | Vercel | https://nextjs.org/docs | Next.js |
| TypeScript docs | Microsoft | https://www.typescriptlang.org/docs/ | TypeScript |
| Claude Developer Platform | Anthropic | https://docs.claude.com/ | Claude API, agents, MCP |
| OpenAI Developers | OpenAI | https://platform.openai.com/docs | OpenAI API |
| Google AI for Developers | Google | https://ai.google.dev/ | Gemini API |
| caniuse | Alexis Deveria | https://caniuse.com/ | Browser support tables |

## Books (core shelf, in rough reading order)

| Book | Author | URL | Relevant domains |
|---|---|---|---|
| Code (2nd ed.) | Charles Petzold | https://www.charlespetzold.com/code/ | 1 |
| Eloquent JavaScript (4th ed.) | Marijn Haverbeke | https://eloquentjavascript.net/ | 5, 6 |
| You Don't Know JS Yet | Kyle Simpson | https://github.com/getify/You-Dont-Know-JS | 5 |
| Every Layout | Heydon Pickering & Andy Bell | https://every-layout.dev/ | 4, 13 |
| Refactoring UI | Adam Wathan & Steve Schoger | https://www.refactoringui.com/ | 13, 23 |
| Effective TypeScript (2nd ed.) | Dan Vanderkam | https://effectivetypescript.com/ | 9 |
| High Performance Browser Networking | Ilya Grigorik | https://hpbn.co/ | 2, 18 |
| Web Browser Engineering | Panchekha & Harrelson | https://browser.engineering/ | 10 |
| Inclusive Components | Heydon Pickering | https://inclusive-components.design/ | 11 |
| A Philosophy of Software Design | John Ousterhout | https://web.stanford.edu/~ouster/cgi-bin/book.php | 6, 24 |
| Refactoring (2nd ed.) | Martin Fowler | https://martinfowler.com/books/refactoring.html | 6, 24 |
| Designing Data-Intensive Applications | Martin Kleppmann | https://dataintensive.net/ | 21 |
| Software Engineering at Google | Winters, Manshreck, Wright | https://abseil.io/resources/swe-book | 22, 24 |
| AI Engineering | Chip Huyen | https://www.oreilly.com/library/view/ai-engineering/9781098166298/ | 25–27 |
| Hands-On Large Language Models | Alammar & Grootendorst | https://www.llm-book.com/ | 25–26 |
| Beyond Vibe Coding | Addy Osmani | https://beyond.addy.ie/ | 28 |
| The Staff Engineer's Path | Tanya Reilly | https://www.oreilly.com/library/view/the-staff-engineers/9781098118723/ | 29 |

## Course platforms

| Platform | Creator / Org | URL | Strengths |
|---|---|---|---|
| CS50 | Harvard | https://cs50.harvard.edu/ | Computer science foundations; CS50 Web; CS50 AI |
| The Odin Project | Open-source community | https://www.theodinproject.com/ | Free, project-based full-stack JavaScript path |
| freeCodeCamp | freeCodeCamp | https://www.freecodecamp.org/ | Free interactive curriculum and certifications |
| Frontend Masters | Marc & Sarah Grabanski | https://frontendmasters.com/ | Expert-taught deep courses on JS, TS, React, performance, AI |
| Josh W. Comeau's courses | Josh W. Comeau | https://www.joshwcomeau.com/courses/ | CSS for JS Devs, Joy of React, Whimsical Animations |
| Epic Web / Epic React | Kent C. Dodds | https://www.epicweb.dev/ | Full-stack web, React, testing |
| Total TypeScript / AI Hero | Matt Pocock | https://www.totaltypescript.com/ · https://www.aihero.dev/ | TypeScript; AI engineering in TypeScript |
| DeepLearning.AI | Andrew Ng | https://www.deeplearning.ai/ | AI/ML fundamentals and short applied courses |
| Anthropic Academy | Anthropic | https://anthropic.skilljar.com/ | Claude API, MCP, Claude Code |
| Hugging Face Learn | Hugging Face | https://huggingface.co/learn | LLMs, agents, MCP courses |

## YouTube channels

| Channel | Creator | URL | What to learn |
|---|---|---|---|
| Kevin Powell | Kevin Powell | https://www.youtube.com/@KevinPowell | CSS mastery |
| Fireship | Jeff Delaney | https://www.youtube.com/@Fireship | Fast overviews of technologies (starting points, not depth) |
| Web Dev Simplified | Kyle Cook | https://www.youtube.com/@WebDevSimplified | Clear JavaScript/React explanations |
| Chrome for Developers | Google | https://www.youtube.com/@ChromeforDevelopers | Platform features, performance, DevTools |
| Theo - t3.gg | Theo Browne | https://www.youtube.com/@t3dotgg | Opinionated commentary on the TypeScript/React/AI ecosystem |
| Matt Pocock | Matt Pocock | https://www.youtube.com/@mattpocockuk | TypeScript and AI engineering |
| Vercel | Vercel | https://www.youtube.com/@VercelHQ | Next.js Conf, AI SDK, v0 |
| Andrej Karpathy | Andrej Karpathy | https://www.youtube.com/@AndrejKarpathy | LLM fundamentals from first principles |
| 3Blue1Brown | Grant Sanderson | https://www.youtube.com/@3blue1brown | Math and neural network intuition |
| Anthropic | Anthropic | https://www.youtube.com/@anthropic-ai | Claude, agents, Claude Code, research talks |
| AI Engineer | AI Engineer conference | https://www.youtube.com/@aiDotEngineer | Production AI engineering talks |
| Hussein Nasser | Hussein Nasser | https://www.youtube.com/@hnasr | Networking and backend fundamentals |
| ByteByteGo | Alex Xu | https://www.youtube.com/@ByteByteGo | System design |
| CS50 | Harvard | https://www.youtube.com/@cs50 | Full CS50 lectures |
| React Conf | React team | https://www.youtube.com/@ReactConfOfficial | Official React talks |

## Specific talks and videos worth watching

| Title | Speaker | URL | Relevant domain |
|---|---|---|---|
| What the heck is the event loop anyway? | Philip Roberts | https://www.youtube.com/watch?v=8aGhZQkoFbQ | 5, 10 |
| In The Loop | Jake Archibald | https://www.youtube.com/watch?v=cCOL7MC4Pl0 | 10 |
| Intro to Large Language Models | Andrej Karpathy | https://www.youtube.com/watch?v=zjkBMFhNj_g | 25 |
| Deep Dive into LLMs like ChatGPT | Andrej Karpathy | https://www.youtube.com/watch?v=7xTGNNLPyMI | 25 |
| Let's build GPT: from scratch, in code, spelled out | Andrej Karpathy | https://www.youtube.com/watch?v=kCc8FmEb1nY | 25 (optional depth) |
| Software Is Changing (Again) | Andrej Karpathy | https://www.youtube.com/watch?v=LCEmiRjPEtQ | 28 |
| But what is a neural network? | 3Blue1Brown | https://www.youtube.com/watch?v=aircAruvnKk | 25 |

## Podcasts and interviews

| Podcast | Hosts | URL | Why |
|---|---|---|---|
| Syntax | Wes Bos & Scott Tolinski | https://syntax.fm/ | Practical web development, frequently AI tooling |
| Latent Space | swyx & Alessio Fanelli | https://www.latent.space/podcast | The AI engineer's podcast: interviews with builders at labs and startups |
| The Pragmatic Engineer Podcast | Gergely Orosz | https://newsletter.pragmaticengineer.com/podcast | How engineering works at leading companies, AI's impact |
| ShopTalk Show | Chris Coyier & Dave Rupert | https://shoptalkshow.com/ | Frontend craft, CSS, the web platform |
| PodRocket | LogRocket | https://podrocket.logrocket.com/ | Interviews with frontend framework and tool authors |
| Software Engineering Daily | SED | https://softwareengineeringdaily.com/ | Broad engineering interviews |
| Dwarkesh Podcast | Dwarkesh Patel | https://www.dwarkesh.com/podcast | Deep interviews with AI researchers (e.g., Karpathy, Oct 2025: https://www.dwarkesh.com/p/andrej-karpathy) |
| Lex Fridman Podcast — Cursor Team | Lex Fridman | https://lexfridman.com/cursor-team/ | Interview with Cursor's founders on the future of AI programming |
| Lenny's Podcast | Lenny Rachitsky | https://www.lennysnewsletter.com/podcast | Product and AI-product building interviews |

## Newsletters and blogs

| Name | Author / Org | URL | Focus |
|---|---|---|---|
| JavaScript Weekly | Cooperpress | https://javascriptweekly.com/ | JavaScript ecosystem |
| Frontend Focus | Cooperpress | https://frontendfoc.us/ | HTML, CSS, browsers |
| This Week In React | Sébastien Lorber | https://thisweekinreact.com/ | React ecosystem |
| Bytes | ui.dev | https://bytes.dev/ | Entertaining JS news |
| Smashing Magazine | Smashing | https://www.smashingmagazine.com/ | CSS, UX, accessibility, performance |
| CSS-Tricks | DigitalOcean | https://css-tricks.com/ | CSS references and articles |
| Simon Willison's Weblog | Simon Willison | https://simonwillison.net/ | LLMs, tools, security |
| Latent Space newsletter | swyx | https://www.latent.space/ | AI engineering |
| Vercel blog | Vercel | https://vercel.com/blog | Frameworks, AI SDK, performance |
| Anthropic Engineering | Anthropic | https://www.anthropic.com/engineering | Agents, context engineering, tool design, Claude Code |
| The Pragmatic Engineer | Gergely Orosz | https://newsletter.pragmaticengineer.com/ | Industry practice |
| Addy Osmani's Substack | Addy Osmani | https://addyo.substack.com/ | AI-assisted engineering, performance |

## Industry experts worth following

| Person | Known for | URL |
|---|---|---|
| Dan Abramov | React core concepts, Redux, RSC writing | https://overreacted.io/ |
| Josh W. Comeau | CSS and React education | https://www.joshwcomeau.com/ |
| Kent C. Dodds | Testing, React, full-stack education | https://kentcdodds.com/ |
| Addy Osmani | Web performance, Chrome, AI-assisted engineering | https://addyosmani.com/ |
| Jake Archibald | Browser internals, service workers, event loop | https://jakearchibald.com/ |
| Una Kravets | Modern CSS and UI platform features (Chrome) | https://una.im/ |
| Lea Verou | CSS, web standards, color | https://lea.verou.me/ |
| Rachel Andrew | CSS Grid, layout, web.dev/Chrome docs | https://rachelandrew.co.uk/ |
| Jen Simmons | CSS layout, WebKit evangelism | https://jensimmons.com/ |
| Sara Soueidan | Accessibility and SVG | https://www.sarasoueidan.com/ |
| Adrian Roselli | Accessibility | https://adrianroselli.com/ |
| Matt Pocock | TypeScript and AI engineering | https://www.totaltypescript.com/ |
| Ryan Carniato | Reactivity, SolidJS | https://github.com/ryansolid |
| Rich Harris | Svelte | https://github.com/Rich-Harris |
| Evan You | Vue, Vite, VoidZero toolchain | https://github.com/yyx990803 |
| Tanner Linsley | TanStack | https://github.com/tannerlinsley |
| Dominik Dorfmeister (TkDodo) | TanStack Query | https://tkdodo.eu/blog/ |
| Lee Robinson | Next.js, developer education, AI-era development | https://leerob.com/ |
| Guillermo Rauch | Vercel CEO; Next.js; v0 | https://rauchg.com/ |
| Emil Kowalski | Design engineering, animation | https://emilkowal.ski/ |
| Rauno Freiberg | Interaction design and design engineering | https://rauno.me/ |
| Harry Roberts | Web performance | https://csswizardry.com/ |
| Simon Willison | LLM tooling and security | https://simonwillison.net/ |
| Andrej Karpathy | LLM education; "Software 3.0" | https://karpathy.ai/ |
| Chip Huyen | AI engineering | https://huyenchip.com/ |
| Hamel Husain | LLM evaluation | https://hamel.dev/ |
| Eugene Yan | Applied ML/LLM systems | https://eugeneyan.com/ |
| swyx (Shawn Wang) | "AI engineer" movement, Latent Space | https://www.swyx.io/ |
| Gergely Orosz | Engineering industry analysis | https://newsletter.pragmaticengineer.com/ |

---

# Part VI — Timeless Knowledge vs. Current Tools

The table below separates what will remain true for a decade from what is today's best implementation. Invest most deeply in the left column; learn the right column well enough to be productive, and expect to relearn it.

| Area | Timeless knowledge (invest deeply) | Current tools, Nov 2026 (learn, expect change) |
|---|---|---|
| Computing | Processes, memory, files, shell composition | zsh/PowerShell, VS Code, Cursor, terminal agents |
| Networking | TCP/IP, DNS, HTTP semantics, caching, TLS, latency | HTTP/3, specific CDNs and hosts |
| Markup | Semantics, accessibility tree, forms, progressive enhancement | Popover API, customizable select, newer elements |
| Styling | Cascade, box model, formatting contexts, flex/grid algorithms, responsive principles | Tailwind v4, container queries, anchor positioning, view transitions |
| Language | Closures, scope, prototypes, async model, event loop, types | ES2025+ features, Temporal, TypeScript 5.x/7 (native compiler) |
| CS | Data structures, complexity, trees/graphs, state machines | — |
| Browser | Rendering pipeline, main-thread model, storage and security model | Specific DevTools features, Chrome-only APIs |
| UI architecture | Declarative UI, composition, unidirectional data flow, server vs. client state | React 19.2, React Compiler, RSC, Next.js 16, TanStack, Zustand |
| Quality | Testing strategy, debugging method, accessibility, security principles, performance metrics thinking | Vitest, Playwright, Storybook, Sentry, specific Core Web Vitals thresholds |
| Backend | HTTP APIs, auth concepts, relational modelling, SQL, consistency, idempotency | Hono, Drizzle/Prisma, Neon/Supabase, serverless platforms |
| AI foundations | Tokens, next-token prediction, attention (conceptually), embeddings, sampling, context limits, evaluation | Specific model names, context sizes, prices |
| AI engineering | Prompt/context engineering principles, tool design, RAG pipeline, structured output validation, HITL, evals, guardrails, prompt injection threat model | AI SDK 7, MCP 2026-07-28, provider SDKs, agent frameworks, AI UI kits |
| AI-assisted dev | Specification, decomposition, verification, review discipline, ownership | Claude Code, Codex, Cursor, Copilot, specific workflows and commands |
| Leadership | Judgment, communication, product sense, mentoring | — |

---

*This syllabus reflects publicly available documentation, engineering writing and industry practice as of November 2026. Version numbers and tool rankings change quickly; when a tool listed here is superseded, keep the concept and replace the tool.*
