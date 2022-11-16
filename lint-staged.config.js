export default {
  "*.(html|css|cjs|js|ts)": "prettier -w ",
  ".js,.ts": "eslint --ext .js,.vue,.ts --fix --ignore-path .gitignore",
};
