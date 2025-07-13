# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [MVP v2] — 2025-07-13
(2.0.0)
---

### Added
- **Settings Panel**: Implemented the content and interface for user-configurable settings. `Issue#12`
- **Auth API**: Implemented backend API for user authentication (sign in, sign up). `PR#56`
- **RunnerNode API**: Implemented runner API for circuit simulation. `PR#109`
- Added support for rotating nodes on workflow. `PR#111`, `PR#130`
- Added copy / paste functionality in nodes. `PR#127`
- Added undo / redo functionality on workflow. `PR#154`
- Creating and including frontend integration, unit tests in CI `PR#132`
- Including RunnerNode integration, unit tests in CI `PR#133`
- README, CHANGELOG, Issues templates, Architecture Docs . `PR#131`, `PR#134`, `PR#136`, `PR#129`

### Changed
- Bezier Curve: Set Bezier curve as the default wire rendering style for better UX. `Issue#121`

### Fixed
- Proximity connection: Prevent from creating wires when wire already creating. `PR#112`
- Start Simulation Bug: Pressing the input button or starting the simulation now affects only the current circuit instead of all circuits.
- Blurry terms: Elements in the workspace (ReactFlow) became blurry after certain actions, as well as when switching to another tab in the browser and returning back.`Issue 102`
---

## [MVP v1] — 2025-06-22
(1.0.0)
---

### Added
- Logic Gates view, connection system
- Drag & Drop, spawn by click system for creating new nodes. `Issue #13` `Issue #36`
- Settings menu layout
- Simple Input Gate layout
- Toolbar functionality: selection/move, wire type choosing. `Issue #18`
- Saving, Uploading circuit functionality

### Changed
- Removed excess nodes in circuits menu
- Nodes inner parameters

### Fixed
- SVG logic gates logos in circuits menu

---

## [MVP v0] — 2025-06-16
(0.0.1)
---

### Added
- Circuits menu with basic logic gates (AND, OR, NOT) `Issue#29`
- Workspace Canvas powered by ReactFlow `Issue#6`
- Toolbar layout `Issue#18`

