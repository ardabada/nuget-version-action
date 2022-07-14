const core = require('@actions/core');
const github = require('@actions/github');

async function main() {
  try {

    const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');

    const major = core.getInput('major');
    const minor = core.getInput('minor');
    const patch = core.getInput('patch');
    const revision = core.getInput('revision');
    const octokit = github.getOctokit(GITHUB_TOKEN);

    const username = github.context.payload.repository.owner.login;

    const package_type = core.getInput('package_type');
    const pivot_package_name = core.getInput('pivot_package_name');

    const version = `${major}.${minor}.${patch}.${revision}`;
    core.setOutput("version", version);

    var result = await octokit.request('GET /users/{username}/packages/{package_type}/{package_name}/versions', {
      package_type: package_type,
      package_name: pivot_package_name,
      username: username
    });

    console.log(result);


    // `who-to-greet` input defined in action metadata file
    // const nameToGreet = core.getInput('who-to-greet');
    // console.log(`Hello ${nameToGreet}!`);
    // const time = (new Date()).toTimeString();
    // core.setOutput("time", time);
    // // Get the JSON webhook payload for the event that triggered the workflow
    // const payload = JSON.stringify(github.context.payload, undefined, 2)
    // console.log(`The event payload: ${payload}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();