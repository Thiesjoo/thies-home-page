const TAG_SEARCH_VALUE = "discord_tag";
const ID_SEARCH_VALUE = "discord_id";


window.addEventListener('DOMContentLoaded', async () => {
  console.log("This is running")
  try {
    const fetchResp = await fetch("api/discord_tag")
    const response = await fetchResp.json()
    contentWithId(TAG_SEARCH_VALUE, response.tag)
    titleWithId(ID_SEARCH_VALUE, response.id)
  } catch (e) {
    contentWithId(TAG_SEARCH_VALUE, "????")
    titleWithId(ID_SEARCH_VALUE, "????")

  }
});


function contentWithId(id, content) {
  document.getElementById(id).innerHTML = content
}
function titleWithId(id, title) {
  document.getElementById(id).title = title
}