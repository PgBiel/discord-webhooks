function generateEmbed (nowEmbed) {
    return '<div data-embed="' + nowEmbed + '">\
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
  </div>';
}
