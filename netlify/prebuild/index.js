module.exports.onPreBuild = function ({ netlifyConfig }) {
  console.log('Hello world from onPreBuild event!');

  console.log(netlifyConfig);

  console.log(process.env);
  console.log(process.env.COMMIT_REF);

  netlifyConfig.build.environment.COMMIT_SHA = process.env.COMMIT_REF;
};
