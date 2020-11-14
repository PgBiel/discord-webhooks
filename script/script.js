(function(fetcher) {
  if (!fetcher) alert(
    "Warning: Fetch is not available for your browser. Check if you aren't using Internet Explorer or an older version of your browser."
  );
  var urlBox = document.getElementById("url");
  var send = document.getElementById("send");
  var tts = document.getElementById("tts");
  var embedAdd = document.getElementById("newemb");
  var embeds = $("#embeds");
  var lastEmbed = 1;
  function checkURL(update = true) {
    var val = urlBox.value;
    var valText = document.getElementById("urlValidation");
    var webhookRegex = /^(?:https?:\/\/)?(?:www\.)?(?:(?:canary|ptb)\.)?discord(?:app)?\.com\/api\/webhooks\/\d+\/[\w-+]+$/i;
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
            <input type="url" name="authoricon" class="inlblock" style="width: 20em;"/>\
          </div>\
          <br/><br/>\
          <label for="authorurl">Author Clickable URL</label>\
          <input type="url" name="authorurl" style="width: 20em;"/>\
          <br/><br/>\
          <label for="thumbnail">Thumbnail URL</label>\
          <input type="url" name="thumbnail" style="width: 20em;"/>\
          <br/><br/>\
          <label for="title">Title</label>\
          <input type="text" name="title" maxlength="256" style="width: 15em;"/>\
          <br/><br/>\
          <label for="content">Content</label>\
          <textarea class="autoExpand" name="content" data-min-rows="1" rows="1" cols="50" maxlength="2048"></textarea>\
          <br/><br/>\
          <label for="sidebar">Sidebar Color</label>\
          <input type="text" name="sidebar" placeholder="#123ABC" maxlength="7"></input>\
          <br/><br/>\
          <div class="inlblock">\
            <label for="footer">Footer</label>\
            <input type="text" name="footer" maxlength="256"/>\
          </div>\
          <div class="inlblock" style="margin-left: 40px;">\
            <label for="footericon">Footer Icon URL</label>\
            <input type="url" name="footericon" class="inlblock" style="width: 20em;"/>\
          </div>\
          <br/><br/>\
          <label for="image">Image URL</label>\
          <input type="text" name="image" maxlength="2048" style="width: 15em;"/>\
        </div>');
    autosize($('div[data-embed="' + nowEmbed + '"]>textarea'));
    $('div[data-embed="' + nowEmbed + '"]>h4>span.remove').on("click", removeEmb(nowEmbed));
  });
  send.addEventListener("click", function() {
    var url = urlBox.value;
    if (!checkURL(false)) return alert("Invalid webhook url!");
    if (!fetcher) return alert(
      "Fetch is not available for your browser. Check if you aren't using Internet Explorer or an older version of your browser."
    );
    var nick = $("#nick").val();
    if (nick.length > 32) return alert("Please ensure the webhook nickname does not have more than 32 characters.");
    if (/clyde/i.test(nick)) return alert("Nickname cannot contain Clyde :(");

    var avatar = $("#avatar").val();

    var content = $("#text").val() || "\u200B";
    if (content.length > 2000) return alert("Please ensure the message content does not have more than 2000 characters.");
    
    var tts = $("#tts").is(":checked");
    var embedz = [];
    var returnable = "";
    embeds.children().each(function(index, child) {
      var embedToAdd = {
        type: "rich"
      };
      child = $(child);
      var embedNum = index + 1;
      var title = child.children('input[name="title"]').val();
      var shouldreturn = false;
      if (title.length > 256) {
        returnable += "- Please ensure the title at embed " + embedNum + " does not have more than 256 characters.\n";
        shouldreturn = true;
      }

      var author = child.children('div.inlblock:has(input[name="author"])').children('input[name="author"]').val();
      if (author.length > 256) {
        returnable += "- Please ensure the author at embed " + embedNum + " does not have more than 256 characters.\n";
        shouldreturn = true;
      }

      var authorIcon = child.children('div.inlblock:has(input[name="authoricon"])').children('input[name="authoricon"]').val();
      var authorUrl = child.children('input[name="authorurl"]').val();
    
      var thumbnail = child.children('input[name="thumbnail"]').val();
      if (thumbnail.length > 2048) {
        returnable += "- Please ensure the thumbnail URL at embed " + embedNum + " does not have more than 2048 characters.\n";
        shouldreturn = true;
      }
      
      var desc = child.children('textarea[name="content"]').val();
      if (desc.length > 2048) {
        returnable += "- Please ensure the content at embed " + embedNum + " does not have more than 2048 characters.\n";
        shouldreturn = true;
      }

      var sidebar = child.children('input[name="sidebar"]').val();
      var sidebarvalid = true;
      if (sidebar && !(/^(?:#?[\dA-F]{3}|#?[\dA-F]{6})$/i.test(sidebar))) {
        returnable += "- Please ensure the sidebar color at embed " + embedNum + " has valid hex code color.\n";
        shouldreturn = true;
        sidebarvalid = false;
      }
      if (/^#?[\dA-F]{3}$/i.test(sidebar)) {
        sidebar = sidebar.match(/^#?([\dA-F]{3})$/i)[1].repeat(2);
      }
      if (sidebarvalid && sidebar) {
        sidebar = parseInt(sidebar.match(/^#?([\dA-F]{6})$/i)[1], 16);
      }

      var footer = child.children('div.inlblock:has(input[name="footer"])').children('input[name="footer"]').val();
      if (footer.length > 256) {
        returnable += "- Please ensure the footer at embed " + embedNum + " does not have more than 256 characters.\n";
        shouldreturn = true;
      }
      var footerIcon = child.children('div.inlblock:has(input[name="footericon"])').children('input[name="footericon"]').val();
      
      var image = child.children('input[name="image"]').val();
      if (image.length > 2048) {
        returnable += "- Please ensure the image URL at embed " + embedNum + " does not have more than 2048 characters.\n";
        shouldreturn = true;
      }
      if (shouldreturn) return;
      if (title) embedToAdd.title = title;
      if (author) embedToAdd.author = {
        name: author
      };
      if (authorIcon) {
        if (!embedToAdd.author) embedToAdd.author = { name: "\u200B" };
        embedToAdd.author.icon_url = authorIcon;
      }
      if (authorUrl && embedToAdd.author) embedToAdd.author.url = authorUrl;
      if (thumbnail) embedToAdd.thumbnail = { url: thumbnail };
      if (desc) embedToAdd.description = desc;
      if (sidebar) embedToAdd.color = sidebar;
      if (footer) embedToAdd.footer = {
        text: footer
      };
      if (footerIcon) {
        if (!embedToAdd.footer) embedToAdd.footer = { text: "\u200B" };
        embedToAdd.footer.icon_url = footerIcon;
      }
      if (image) {
        embedToAdd.image = { url: image };
      }
      if (
        !embedToAdd.description && !embedToAdd.footer && !embedToAdd.author && !embedToAdd.title
      ) embedToAdd.description = "\u200B";
      embedz.push(embedToAdd);
    });
    if (returnable) return alert(returnable.replace(/\s+$/, ""));
    var obj = {
      tts: !!tts,
      embeds: embedz
    };
    if (nick) obj.username = nick;
    if (avatar) obj.avatar_url = avatar;
    if (obj.embeds.length > 0 && content !== "" && content !== "\u200B") obj.content = content;
    else if (obj.embeds.length === 0) obj.content = content;
    fetcher(url.startsWith("http") ? url : ("https://" + url), {
      method: "POST",
      headers: new Headers({"Content-Type": "application/json"}),
      body: JSON.stringify(obj),
      referrerPolicy: "no-referrer"
    }).then(function(response) {
      if (!response.ok) {
        console.error(obj);
        return alert("Discord gave status of " + response.status);
      }
    });
  });
})(window.fetch);
