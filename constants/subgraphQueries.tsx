import { gql } from "@apollo/client";

export const GET_CONTRIBUTIONS = gql`
  query GetActiveContributions {
    contributions(
      first: 5
      where: { from_not: "0x000000000000000000000000000000000000dead" }
      orderBy: timestamp
      orderDirection: desc
    ) {
      from
      hasProfile
      title
      url
      username
      votes
      timestamp
      category
      contributionId
    }
  }
`;

export const GET_USER_UPVOTED_CONTRIBUTIONS = gql`
  query UserUpvotedContributions($address: Bytes!) {
    contributionUpvoteds(where: { from: $address }) {
      contributionId
    }
  }
`;

export const GET_USER_DOWNVOTED_CONTRIBUTIONS = gql`
  query UserDownvotedContributions($address: Bytes!) {
    contributionDownvoteds(where: { from: $address }) {
      contributionId
    }
  }
`;
