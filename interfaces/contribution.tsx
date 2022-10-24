export interface ContributionInterface {
  id: number;
  votes: number;
  category: number;
  timestamp: number;
  title: string;
  url: string;
  username: string;
  from: string;
  hasProfile: boolean;
  contributionId: number;
}

export interface ContributionVotesInterface {
  id: number;
  from: string;
  contributionId: number;
  timestamp: number;
}
