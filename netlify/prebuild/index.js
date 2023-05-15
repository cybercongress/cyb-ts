module.exports.onPreBuild = function ({ netlifyConfig }) {
  netlifyConfig.build.environment.COMMIT_SHA = process.env.COMMIT_REF;
};
