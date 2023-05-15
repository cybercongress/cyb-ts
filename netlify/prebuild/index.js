module.exports.onPreBuild = function ({ netlifyConfig }) {
  console.log('Hello world from onPreBuild event!');

  console.log(netlifyConfig);

  netlifyConfig.build.environment.COMMIT_SHA = 123;
};
