(function(fetcher) {
  if (!fetcher) alert(
    "Warning: Fetch is not available for your browser. Check if you aren't using Internet Explorer or an older version of your browser."
  );
  var urlBox = document.getElementById("url");
  var send = document.getElementById("send");
  var embedAdd = document.getElementById("newemb");
  var embeds = $("#embeds");
  var lastEmbed = 1;
  function checkURL(update = true) {
    var val = urlBox.value;
    var valText = document.getElementById("urlValidation");
    var webhookRegex = /^(?:https?:\/\/)?(?:www\.)?(?:canary\.)?discordapp\.com\/api\/webhooks\/\d+\/[\w-+]+$/i;
    if (!val) {
      if (update) valText.innerHTML = "This is required.";
      return false;
    }
    if (!webhookRegex.test(val)) {
      if (update) valText.innerHTML = "Must be a valid webhook URL.";
      return false;
    }
    if (update) valText.innerHTML = "";
    return true;
  }
  function removeEmb(number) {
    return function() {
      if ($('div[data-embed="' + number + '"]').length < 1) return;
      embeds.children().each(function(_index, child) {
        var numEmbed = Number($(child).attr("data-embed"));
        if ($(child).attr("data-embed").toString() === number.toString()) {
          child.remove();
          lastEmbed--;
          if (lastEmbed < 0) lastEmbed = 1;
        } else if (numEmbed > number) {
          var newEmbed = numEmbed - 1;
          $(child).attr("data-embed", newEmbed);
          $(child).children("h4")
            .html("Embed " + newEmbed + ' (<span class="remove">Remove</span>)')
            .children("span.remove")
            .on("click", removeEmb(newEmbed));
        }
      });
    };
  }
  urlBox.addEventListener("input", _.debounce(checkURL, 1000));
  embedAdd.addEventListener("click", function() {
    var nowEmbed = lastEmbed++;
    embeds.append('<div data-embed="' + nowEmbed + '">\
          <h4>Embed ' + nowEmbed + ' (<span class="remove">Remove</span>)</h4>\
          <div class="inlblock">\
            <label for="author">Author</label>\
            <input type="text" name="author" maxlength="256"/>\
          </div>\
          <div class="inlblock" style="margin-left: 40px;">\
            <label for="authoricon">Author Icon URL</label>\
            <input type="url" name="avatar" class="inlblock" style="width: 20em;"/>\
          </div>\
          <br/><br/>\
          <label for="title">Title</label>\
          <input type="text" name="title" maxlength="256" style="width: 15em;"/>\
          <br/><br/>\
          <label for="content">Content</label>\
          <textarea class="autoExpand" id="text" name="text" data-min-rows="1" rows="1" cols="50" maxlength="2048"></textarea>\
          <br/><br/>\
          <div class="inlblock">\
            <label for="footer">Footer</label>\
            <input type="text" name="footer" maxlength="256"/>\
          </div>\
          <div class="inlblock" style="margin-left: 40px;">\
            <label for="footericon">Footer Icon URL</label>\
            <input type="url" name="footericon" class="inlblock" style="width: 20em;"/>\
          </div>\
        </div>');
    autosize($('div[data-embed="' + nowEmbed + '"]>textarea'));
    $('div[data-embed="' + nowEmbed + '"]>h4>span.remove').on("click", removeEmb(nowEmbed));
  });
})(window.fetch);
