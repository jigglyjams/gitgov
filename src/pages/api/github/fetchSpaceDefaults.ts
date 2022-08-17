/* eslint-disable arrow-body-style */
import { GithubAPI } from '../../../lib/githubAPI';

export default async function fetchSpaceDefaults(req, res) {
  const { space } = req.body;
  const github = new GithubAPI(
    process.env.GITHUB_KEY ?? '',
    'jigglyjams',
    `${space}-governance`
  );
  const governanceCycle = await github.getContent('CURRENT_GOVERNANCE_CYCLE').then((content) => {
    return content;
  }).catch((e) => {
    Promise.reject(e);
  });

  const proposalTemplate = await github.getContent('TEMPLATE.md').then((content) => {
    return content;
  }).catch((e) => {
    Promise.reject(e);
  });
  res.status(200).json({ governanceCycle, proposalTemplate });
}
