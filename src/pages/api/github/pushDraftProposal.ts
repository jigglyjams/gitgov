import { nanoid } from 'nanoid';
import { GithubAPI } from '../../../lib/githubAPI';
import { JSONProposalsToMd } from '../../../lib/tableMaker';
import { Proposal } from '../../../types';

export default async function pushDraftProposal(req, res) {
  const { space } = req.body;
  const github = new GithubAPI(
    process.env.GITHUB_KEY ?? '',
    'jigglyjams',
    `${space}-governance`
  );
  const proposal: Proposal = {
    hash: nanoid(),
    title: req.body.title,
    markdown: req.body.content,
    governanceCycle: req.body.governanceCycle,
    url: '',
    date: req.body.date,
    category: req.body.category,
    recipient: req.body.recipient,
    amount: req.body.amount,
    endPayout: req.body.length,
    status: 'draft',
    proposalId: 'TBD',
    author: req.body.author,
    discussionThreadURL: '',
    ipfsURL: '',
    voteURL: ''
  };
  const metadataTable = JSONProposalsToMd([proposal]);
  const content = `${metadataTable}\n\n${proposal.markdown}`;
  const path = `drafts/DRAFT-${proposal.hash}.md`;
  await github.createCommitOnBranch([
    {
      path,
      contents: content
    }
  ], `new draft ${proposal.hash}`);
  res.status(200).json({ url: `https://github.com/jigglyjams/dev-governance/tree/main/${path}` });
}
