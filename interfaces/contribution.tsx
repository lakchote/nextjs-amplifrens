export interface ContributionInterface {
  id: number;
  votes: number;
  category: number;
  timestamp: number;
  fromStatus: number;
  contributionId: number;
  title: string;
  url: string;
  username: string;
  from: string;
  hasProfile: boolean;
  bestContribution: boolean;
}
