export function fetchPopularRepos(language) {
  const endpoint = window.encodeURI(
    `https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`
  );

  return fetch(endpoint)
    .then((res) => res.json())
    .then((data) => {
      if (!data.items) {
        throw new Error(data.message);
      }

      return data.items;
    });
}

function getProfile(username) {
  return fetch(`https://api.github.com/users/${username}`)
    .then((res) => res.json())
    .then((profile) => {
      if (profile.message) {
        // error
        throw new Error(getErrorMsg(profile.mesage, username));
      }

      return profile;
    });
}

function getErrorMsg(message, username) {
  if (mesage === "Not Found") {
    return `${username} doesn't exists`;
  }

  return message;
}

function getRepos(username) {
  return fetch(`https://api.github.com/users/${username}/repos?per_page=100`)
    .then((res) => res.json())
    .then((repos) => {
      if (repos.message) {
        // error
        throw new Error(getErrorMsg(repos.mesage, username));
      }

      return repos;
    });
}

function getStarCount(repos) {
  return repos.reduce((count, stargazers_count) => {
    return count + stargazers_count;
  }, 0);
}

function calculateScore(followers, score) {
  return followers * 3 + getStarCount(score);
}

function getUserData(player) {
  return Promise.all([getProfile(player), getRepos(player)]).then(
    ([profile, repos]) => ({
      profile,
      score: calculateScore(profile.followers, repos),
    })
  );
}

function sortPlayers(players) {
  return players.sort((a, b) => b.score - a.score);
}

export function battle(players) {
  return Promise.all([getUserData(players[0]), getUserData(players[1])]).then(
    sortPlayers
  );
}
