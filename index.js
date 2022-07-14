const core = require('@actions/core');
const github = require('@actions/github');

async function main() {
  try {

    const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');

    const major = core.getInput('major');
    const minor = core.getInput('minor');
    const octokit = github.getOctokit(GITHUB_TOKEN);

    const username = github.context.payload.repository.owner.login;

    const package_type = core.getInput('package_type');
    const pivot_package_name = core.getInput('pivot_package_name');

    let target_version = `${major}.${minor}.0`;
    try {
      const result = await octokit.request('GET /users/{username}/packages/{package_type}/{package_name}/versions', {
        package_type: package_type,
        package_name: pivot_package_name,
        username: username
      });
      let last_version = result.data[0].name;
      const parts = last_version.split('.');
      const last_major = parseInt(parts[0]);
      const last_minor = parseInt(parts[1]);
      const last_patch = parseInt(parts[2]);

      const target_patch = major == last_major && minor == last_minor ? last_patch + 1 : 0;

      target_version = `${major}.${minor}.${target_patch}`;
    }
    catch (e) {
      console.warn(e);
    }
    
    core.setOutput("version", target_version);
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();