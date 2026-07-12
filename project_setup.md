# 1- NVM setup
- nvm ls
- nvm install -lts (latest lst version)
- nvm use (use the specifed version in nvmrc file)
- nvm install lst/version (install the version of node if not found in nvm ls)

# 2- setting up typescript config 
1. npm i -D typescript
2. npmx tsc --init

**uncomment these 2 lines in tsconfig**
 "rootDir": "./src",
 "outDir": "./dist",

# 3- install node types

npx i -D @types/node

# 4- add .gitignore

- install extension .gitignore by CodeZombie
- press win+shit+p
- serach .gitignore and click
- search node 
- and your .gitignore file is ready

# 5- setting up prettier

- npm install --save-dev --save-exact prettier@3.9.5
- node --eval "fs.writeFileSync('.prettierrc','{}\n')"
- node --eval "fs.writeFileSync('.prettierignore','# Ignore artifacts:\nbuild\ncoverage\n')"
- and add a script in package.json for prettier
- now add rules in .prettierrc

# 6- setup git hook (precommit)
https://typicode.github.io/husky/how-to.html run on pre commit 
https://github.com/lint-staged/lint-staged run husky only on staged files not on overall project 