export interface ContributionInterface {
  id: number;
  votes: number;
  category: number;
  timestamp: number;
  title: string;
  url: string;
  username: string;
  from: string;
  contributionId: number;
  hasProfile: boolean;
  bestContribution: boolean;
}
