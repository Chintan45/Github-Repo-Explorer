import { useEffect, useState, useCallback } from "react";
import { userQuery, githubQuery } from "./Query";
import github from "./db.js";
import RepoInfo from "./components/RepoInfo";
import QuerySearchBox from "./components/QuerySearchBox";
import NavButtons from "./components/NavButtons";
import UserSearchBox from "./components/UserSearchBox";

function App() {
  const [viewer, setViewer] = useState("");
  const [userName, setUserName] = useState("");
  const [userSearchBoxText, setUserSearchBoxText] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [repoList, setRepoList] = useState(null);
  const [pageCount, setPageCount] = useState(5);
  const [queryString, setQueryString] = useState("");
  const [totalCount, setTotalCount] = useState(null);

  const [startCursor, setStartCursor] = useState(null);
  const [endCursor, setEndCursor] = useState(null);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [paginationKeyword, setPaginationKeyword] = useState("first");
  const [paginationString, setPaginationString] = useState("");

  const fetchData = useCallback(async () => {
    const queryText = JSON.stringify(
      githubQuery(userName, pageCount, queryString, paginationKeyword, paginationString)
    );

    try {
      const response = await fetch(github.baseURL, {
        method: "POST",
        headers: github.headers,
        body: queryText,
      });

      const data = await response.json();
      const { viewer, search } = data.data;
      const { edges: repos, repositoryCount: total, pageInfo } = search;

      setViewer(viewer.name);
      setRepoList(repos);
      setTotalCount(total);

      setStartCursor(pageInfo?.startCursor);
      setEndCursor(pageInfo?.endCursor);
      setHasNextPage(pageInfo?.hasNextPage);
      setHasPreviousPage(pageInfo?.hasPreviousPage);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [userName, pageCount, paginationKeyword, paginationString, queryString]);

  useEffect(() => {
    if (userName) {
      fetchData();
    }
  }, [fetchData, userName]);

  const checkUserExists = async (userName) => {
    const queryText = JSON.stringify(userQuery(userName));
    try {
      const response = await fetch(github.baseURL, {
        method: "POST",
        headers: github.headers,
        body: queryText,
      });
      
      const data = await response.json();
      if (data.errors) {
        setErrorMessage("User does not exist!");
      } else {
        setErrorMessage(null);
      }
    } catch (error) {
      console.error("Error checking user:", error);
      setErrorMessage("An error occurred while checking the user.");
    }
  };

  return (
    <div className="App container mt-5">
      <h1 className="text-primary">
        <i className="bi bi-diagram-2-fill"></i> GitHub Repo Explorer
      </h1>
      <p> Hello 👋 {viewer}!</p>
      <UserSearchBox
        value={userSearchBoxText}
        onChange={setUserSearchBoxText}
        onSearchClick={() => {
          setUserName(userSearchBoxText);
          checkUserExists(userSearchBoxText);
        }}
      />
      {userName && errorMessage === null ? (
        <QuerySearchBox
          totalCount={totalCount}
          pageCount={pageCount}
          queryString={queryString}
          onQueryChange={setQueryString}
          onTotalChange={setPageCount}
        />
      ) : errorMessage ? (
        <p className="text-danger small mx-3">{errorMessage}</p>
      ) : null}
      {repoList && (
        <ul className="list-group list-group-flush">
          {repoList.map((repo) => (
            <RepoInfo repo={repo.node} key={repo.node.id} />
          ))}
        </ul>
      )}
      <NavButtons
        start={startCursor}
        end={endCursor}
        next={hasNextPage}
        previous={hasPreviousPage}
        onPage={(myKeyword, myString) => {
          setPaginationKeyword(myKeyword);
          setPaginationString(myString);
        }}
      />
    </div>
  );
}

export default App;
