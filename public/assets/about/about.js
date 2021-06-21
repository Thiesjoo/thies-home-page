const TAG_SEARCH_VALUE = "discord_tag";
const ID_SEARCH_VALUE = "discord_id";

const GIT_COMMIT_SEARCH_VALUE = "github_sha"

window.addEventListener('DOMContentLoaded', async () => {
  console.log("This is running")
  getDiscordUser()
  getGithubInfo()
});


async function getDiscordUser() {
  try {
    const fetchResp = await fetch("api/discord_tag")
    const response = await fetchResp.json()
    contentWithId(TAG_SEARCH_VALUE, response.tag)
    titleWithId(ID_SEARCH_VALUE, response.id)
    changeFavicon(response.avatar)
  } catch (e) {
    contentWithId(TAG_SEARCH_VALUE, "????")
    titleWithId(ID_SEARCH_VALUE, "????")
  }
}

async function getGithubInfo() {
  try {
    const fetchResp = await fetch("api/github_data")
    const response = await fetchResp.json()
    contentWithId(GIT_COMMIT_SEARCH_VALUE, response.sha.slice(0, 7))
    titleWithId(GIT_COMMIT_SEARCH_VALUE, response.sha)
  } catch (e) {
    contentWithId(GIT_COMMIT_SEARCH_VALUE, "????")
    titleWithId(GIT_COMMIT_SEARCH_VALUE, "????")
  }
}

/**
 * Replace innerhtml with content. On the element with ID=id
 */
function contentWithId(id, content) {
  document.getElementById(id).innerHTML = content
}

/** Replace the title of an element with a new title */
function titleWithId(id, title) {
  document.getElementById(id).title = title
}

/**
 * Change the favoicon to a PNG
 * @param {*} src The link to the PNG image
 */
function changeFavicon(src) {
  var link = document.createElement('link'),
    oldLink = document.getElementById('dynamic-favicon');
  link.id = 'dynamic-favicon';
  link.rel = 'shortcut icon';
  link.href = src;
  link.type = "image/png"
  if (oldLink) {
    document.head.removeChild(oldLink);
  }
  document.head.appendChild(link);
}