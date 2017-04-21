(function(fetcher) {
  if (!fetcher) alert(
    "Warning: Fetch is not available for your browser. Check if you aren't using Internet Explorer or an older version of your browser."
    );
  function webCheckURL(mode) {
    var val = $("#url").val();
    var web = $("#weburlalert");
    var webhookRegex = /^(?:https?:\/\/)?(?:www\.)?(?:canary\.)?discordapp\.com\/api\/webhooks\/\d+\/[\w-+]+$/i;
    if (!val) {
      if (mode) web.text("This is required.");
      return false;
    }
    if (!webhookRegex.test(val)) {
      if (mode) web.text("Must be a valid webhook url.");
      return false;
    }
    return true;
  }
  window.checkURL = function(mode) {
    return webCheckURL(mode);
  };
})(window.fetch);