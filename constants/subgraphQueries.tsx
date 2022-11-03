import { gql } from "@apollo/client";

export const GET_CONTRIBUTIONS = gql`
  query GetActiveContributions($first: Int!, $skip: Int!) {
    contributions(
      first: $first
      skip: $skip
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

export const GET_TOP_CONTRIBUTIONS = gql`
  query GetActiveTopContributions($first: Int!, $skip: Int!) {
    contributions(
      first: $first
      skip: $skip
      where: { from_not: "0x000000000000000000000000000000000000dead", bestContribution: true }
      orderBy: votes
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
      bestContribution
    }
  }
`;

export const GET_USER_TOP_CONTRIBUTIONS = gql`
  query GetActiveTopContributions($first: Int!, $skip: Int!, $address: String!) {
    contributions(
      first: $first
      skip: $skip
      where: { from: $address, bestContribution: true }
      orderBy: votes
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
      bestContribution
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

export const GET_PROFILE_ADDRESS = gql`
  query GetProfileAddress($username: String!) {
    profiles(where: { username: $username }) {
      address
    }
  }
`;

export const GET_SBT_COUNT = gql`
  query GetSBTCount($address: String!) {
    sbtleaderboards(where: { id: $address }) {
      topContributionsCount
    }
  }
`;

export const GET_SBT_LEADERBOARD = gql`
  query GetSBTLeaderboardAddresses {
    sbtleaderboards(orderBy: topContributionsCount, orderDirection: desc, first: 3) {
      id
      topContributionsCount
      username
      status
    }
  }
`;
