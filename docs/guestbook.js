/**
 * Web application
 */
const apiUrl = 'https://service.us.apiconnect.ibmcloud.com/gws/apigateway/api/9cd3457add3dfb90a6d4b3d0ef3c7d41af3111235b19351bba07c78980952311/guestbook';
const guestbook = {
  // retrieve the existing guestbook entries
  get() {
    return $.ajax({
      type: 'GET',
      url: `${apiUrl}/entries`,
      dataType: 'json'
    });
  },
  // add a single guestbood entry
  add(name, email, comment) {
    console.log('Sending', name, email, comment)
    return $.ajax({
      type: 'POST',
      url: `${apiUrl}/entries`,
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({
        name,
        email,
        comment,
      }),
      dataType: 'json',
    });
  }
};

(function() {

  let entriesTemplate;

  function prepareTemplates() {
    entriesTemplate = Handlebars.compile($('#entries-template').html());
  }

  // retrieve entries and update the UI
  function loadEntries() {
    console.log('Loading entries...');
    $('#entries').html('Loading entries...');
    guestbook.get().done(function(result) {
      if (!result.entries) {
        return;
      }

      const context = {
        entries: result.entries
      }
      $('#entries').html(entriesTemplate(context));
    }).error(function(error) {
      $('#entries').html('No entries');
      console.log(error);
    });
  }

  // intercept the click on the submit button, add the guestbook entry and
  // reload entries on success
  $(document).on('submit', '#addEntry', function(e) {
    e.preventDefault();

    guestbook.add(
      $('#name').val().trim(),
      $('#email').val().trim(),
      $('#comment').val().trim()
    ).done(function(result) {
      // reload entries
      loadEntries();
    }).error(function(error) {
      console.log(error);
    });
  });

  $(document).ready(function() {
    prepareTemplates();
    loadEntries();
  });
})();
