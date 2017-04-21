(function(fetcher) {
  if (!fetcher) alert(
    "Warning: Fetch is not available for your browser. Check if you aren't using Internet Explorer or an older version of your browser."
  );
  var urlBox = document.getElementById("url");
  function checkURL (update) {
    var val = urlBox.value;
    var valText = document.getElementById("urlValidation");
    var webhookRegex = /^(?:https?:\/\/)?(?:www\.)?(?:canary\.)?discordapp\.com\/api\/webhooks\/\d+\/[\w-+]+$/i;
    if (!val) {
      if (mode) valText.innerHTML = "This is required.";
      return false;
    }
    if (!webhookRegex.test(val)) {
      if (mode) valText.innerHTML = "Must be a valid webhook URL.";
      return false;
    }
    if (mode) valText.innerHTML = "";
    return true;
  }
  urlBox.addEventListener("input", _.debounce(checkURL, 1000));
})(window.fetch);
