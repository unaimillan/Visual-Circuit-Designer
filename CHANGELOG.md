# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [MVP v2] — 2025-07-06
(2.0.0)
---

### Added
- **Settings Panel**: Implemented the content and interface for user-configurable settings. `Issue#12`
- **Auth API**: Implemented backend API for user authentication (sign in, sign up). `PR#56`
- **RunnerNode API**: Implemented runner API for circuit simulation. `PR#109`
- Added support for rotating nodes on workflow. `PR#111`, `PR#130`
- Added copy / paste functionality in nodes. `PR#127`
- Creating and including frontend integration, unit tests in CI `PR#132`
- Including RunnerNode integration, unit tests in CI `PR#133`
- README, CHANGELOG, Issues templates, Architecture Docs . `PR#131`, `PR#134`, `PR#136`, `PR#129`

### Changed
- **Bezier Curve**: Set Bezier curve as the default wire rendering style for better UX. `Issue#121`

### Fixed
- **Proximity connection**: Prevent from creating wires when wire already creating
- **Start Simulation Bug**: Pressing the input button or starting the simulation now affects only the current circuit instead of all circuits. [#102]