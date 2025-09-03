# Use Claude Code to Explore and Develop the project 
### Download the zip file of branch 'initial'

### initialize the context
/clear
/init: generate the CLAUDE.md to understand how this project works 

npm install
npm run dev

### specify file to the current context 
> use @src/audios/chest_open.mp3 in the @src/App.tsx to play the sound effect of the chest being opened. do not do anything else.

### add more to the context
> check the comments of existing changes

type '#' first 
"add comments on the top of every new function in one line to summarize the usage and document the inputs and output parameters" 
> 2. Project memory

> use @src/audios/chest_open_with_evil_laugh.mp3 in the @src/App.tsx to play the sound effect of the chest with skeleton inside being opened  

> check the comments of existing changes

### use screenshot to develop intuitively 
> screenshot and mark the area you want the change to be. 
> [!image] show the results to be either: win, tie, loss in the circled place according to the final score 

### Challenge: change the hover mouse point icon
use the src/assets/key.png icon when the mouse hovers over the closed treasure box

### manage context 
/context 
54k/200k tokens (27%)

> (optional) go through the url recursively to understand everything about SQLite and add all information in the context. 
https://nodejs.org/docs/latest/api/sqlite.html                                                      

/compact

/context 
> 26k/200k tokens (13%)

/clear 

/context
> 16k/200k tokens (8%)

> "Check my project with AngularJS to see if any syntax error."

esc + esc > select a conversation to go back 

### Plan mode: 
make a commit to store the current state

shift + tab 
> "What database options I have to implement sign up and sign in flow?"
> "how about SQLite as local storage?"
> "use SQLite to build a simple sign up and sign in flow and store the game score for each signed in user"

> Ctrl + T: See the To-Do List 

### Ultrathink 
revert back to previous git commit 

> "Ultrathink to use SQLite to build a simple sign up and sign in flow and store the game score for each signed in user"

> Ctrl + T: See the To-Do List 

### custom command - check_typo 
"Slash commands in Claude Code are custom prompts stored as Markdown files that you can trigger with a simple /command-name syntax. Think of them as reusable prompt templates that encapsulate specific workflows or instructions."

create folder: .claude/commands
create file: check_typo.md

> I'm creating a new check_typo command @.claude/commands/check_typo.md . help me fill in information for checking Engligh grammar, typo, acronyms  

re-open a new claude code session

modify the /App.tsx with some typos, probably modify the comments  

> /check_typo @src/App.tsx

> "fix those typos for me"

### custom command - deploy to Github Pages 
sign in to Github 
create a new public project "claude_code_treasure_game"

> use "git init" for my project and commit the code as first commit
> create a new github repository to my github account from the project  

create folder: .claude/commands
create file: deploy_to_github_page.md

> I'm creating a new check_typo command @.claude/commands/deploy_to_github_page.md . help me finish it to deploy my project to Github Pages. Include an Argument to specify which branch to use for Github Page deployment. 

ex. https://[account].github.io/claude_code_treasure_game/

# claude_code_treasure_game
