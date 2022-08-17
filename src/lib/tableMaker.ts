import { numToPrettyString } from './utils';
import { ProposalNoHash } from '../types';

export const heading = [
  'Proposal ID',
  'Title',
  'Status',
  'Governance Cycle',
  'Category',
  'Payout Recipient',
  'Payout Amount (USD)',
  'Last Payout Cycle',
  'Discussion Thread',
  'Data Backup',
  'Voting',
  'Total Votes',
  'For',
  'Against'
];

export function JSONProposalsToMd(proposals: ProposalNoHash[]) {
  const mdHeading = `| ${heading.join(' | ')} |\n|${' :--: |'.repeat(heading.length)}\n`;
  const rows = proposals.map((p: ProposalNoHash) => {
    return ([
      `| _${p.proposalId}_`,
      `[${p.title}](${p.url})`,
      `${p.status}`,
      p.governanceCycle,
      p.category,
      p.recipient,
      p.amount,
      p.endPayout,
      `[Discord](${p.discussionThreadURL})`,
      (p.ipfsURL) ? `[IPFS](${p.ipfsURL})` : '',
      (p.voteURL) ? `[Snapshot](${p.voteURL})` : '',
      `${p.voteResults?.totalVotes ?? ''}`,
      `${numToPrettyString(p.voteResults?.scores.For) ?? ''}`,
      `${numToPrettyString(p.voteResults?.scores.Against) ?? ''} |`,
    ]).join(' | ');
  }).join('\n');
  return (mdHeading + rows);
}
