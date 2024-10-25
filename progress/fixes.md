# Eslint errors unused vars

Update Your .eslintrc.json

```
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "no-unused-vars": "off", // Disable unused variable checks in JavaScript
    "@typescript-eslint/no-unused-vars": "off", // Disable unused variable checks in TypeScript
    "@typescript-eslint/no-empty-interface": "off", // Disable empty interface warnings
    "@typescript-eslint/no-empty-object-type": "off" // Disable empty object type warnings
  },
  "overrides": [
    {
      "files": ["*.tsx", "*.ts"], // Ensure the rules apply to TypeScript files
      "rules": {
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-empty-interface": "off",
        "@typescript-eslint/no-empty-object-type": "off"
      }
    }
  ]
}

```

Those rules disable those errors

-- tsconfig
ensure your tsconfig.json is not enforcing unused variable checks. It should look like this:

```
 
{
  "compilerOptions": {
    // other options...
    "noUnusedLocals": false, // Ensure this is set to false
    "noUnusedParameters": false, // Ensure this is set to false
  }
}

```



-- Run ESLint Again

```
 npx eslint . --ext .ts,.tsx ```



-- To remove items cached in git:

git rm -r --cached node_modules
