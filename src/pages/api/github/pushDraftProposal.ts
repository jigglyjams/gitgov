import { nanoid } from 'nanoid';
import { GithubAPI } from '../../../lib/githubAPI';

export default async function pushDraftProposal(req, res) {
  const {
    space,
    governanceCycle
  } = req.body;
  console.log(req.body);
  const github = new GithubAPI(
    process.env.GITHUB_KEY ?? '',
    'jigglyjams',
    `${space}-governance`
  );
  const hash = nanoid();
  const path = `drafts/DRAFT-${hash}.md`;
  github.createCommitOnBranch([
    {
      path,
      contents: req.body.content
    }
  ], hash);

  res.status(200).json({ url: `https://github.com/jigglyjams/dev-governance/tree/main/${path}` });
}
