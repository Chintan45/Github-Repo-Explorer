const githubQuery = (userName, pageCount, queryString, paginationKeyword, paginationString) => {
  return {
    query: `
      {
        viewer {
          name
        }
        search(query: "${queryString} user:${userName} sort:updated-desc", type: REPOSITORY, ${paginationKeyword}: ${pageCount}, ${paginationString}) {
          repositoryCount
          edges {
            cursor
            node {
              ... on Repository {
                name
                description
                id
                url
                viewerSubscription
              }
            }
          }
          pageInfo {
            startCursor
            endCursor
            hasNextPage
            hasPreviousPage
          }
        }
      }
    `
  }
};

const userQuery = (userName) => {
  return {
    query: `
      {
        user(login: "${userName}") {
          login
        }
      }
    `
  }
}

const authnticationQuery = {
  query: `
    {
      viewer {
        name
      }
    }
  `
}

  export { userQuery, githubQuery, authnticationQuery };