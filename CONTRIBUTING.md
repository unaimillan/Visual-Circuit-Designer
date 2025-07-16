# Development
## Kanban board
Here is our [Kanban board](https://github.com/orgs/IUMusicalFish19/projects/1/views/6)

### Columns:
- Sprint
    - Difficulty assessed (story points)
    - Acceptance criteria are specified
    - Addition to the column approved by the customer
    - Someone on the team plans to do this during the sprint
- In progress
    - Someone signed up for this task and started working on it
- Done
    - Task is done(acceptance criteria done)
    - Execution approved by team members
- Paused/Research required
    - A team member started working on this task but was unable to complete it.

## Git workflow
For our project we used GitHub flow.

### Rules:

- For creating issues from the defined templates:
<ol style="list-style-type: decimal;">
<li> Create an issue and immediately set acceptance criteria for it</li>
</ol>  

- For labeling issues:

  Currently we have 7 labels. Tasks can be labeled based on these rules:
<ol style="list-style-type: decimal;">
  <li><b>frontend</b> - Should be used for an issue that involves changing the user interface.</li>
  <li><b>backend</b> - Should be used for an issue that is related to a part of the project that is not visible to the user.</li>
  <li><b>bug</b> - Should be used for an issue that arose after an error was noticed in the project's operation.</li>
  <li><b>enhancement</b> - Should be used for an issue that somehow improves the work of the project, but without which the project works.</li>
  <li><b>task</b> - Should be used for an backlog task.</li>
  <li><b>triage</b> - Should be used for some task that is not sorted yet.</li>
  <li><b>user story</b> - Should be used for issue that formulated in user-story-format.</li>
</ol>

- For assigning issues to team members:

<ol style="list-style-type: decimal;"> 
  <li>Each team member selects tasks from the sprint that they want to complete.</li>
  <li>If any tasks from the sprint remain without an assigned teammate, this task goes to the one who has fewer user points for his tasks.</li>
</ol>

- For сreating, naming, merging branches:

<ol style="list-style-type: decimal;"> 
   <li><b>Creating: </b> For all issues should be created separate branch.</li>
  <li><b>Naming: </b> Name of branch should briefly explain the purpose of creating this branch.</li>
  <li><b>Merging: </b> To merge branch with "dev" branch teammate must create pull request.</li>
</ol>

- For commit messages format:

  A commit should explain what changes were made to the project.
- For creating a pull request for an issue using a pull request template:

- For code reviews:

- For merging pull requests:

- For resolving issues:

## Secrets management
We have no password or API keys for now, so we have no secrets