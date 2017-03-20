export default ({body, title}) => {
    let temporaryHackForHideButton = `
    <script>
    //@TODO listen form above rather that for-eaching through all to make this keep working after dom updates
    document.querySelectorAll("[data-easy-ajax-button-method]").forEach(function(button){
        button.addEventListener('click', function() {
            var method = button.getAttribute('data-easy-ajax-button-method');
            var url = button.getAttribute('data-easy-ajax-button-url');
            var confirmMessage = button.getAttribute('data-easy-ajax-button-confirm-message');
            var doneMessage = button.getAttribute('data-easy-ajax-button-done-message');
            var doIt=true;
            if(confirmMessage){
                doIt=confirm(confirmMessage);
            }
            
            if(doIt){
                var req = new XMLHttpRequest();
                button.disabled = true;
                req.addEventListener('load', function() {
                    button.innerHTML = doneMessage;
                });
                req.open(method, url);
                req.send();
            }
        });
    });
    </script>
    `;


    //        <meta name="viewport" content="width=900">


    return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
      </head>
      <body>
        <div id="root">${body}</div>
         ${temporaryHackForHideButton}
         <script>
          (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
          })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
        
          ga('create', 'UA-92623158-1', 'auto');
          ga('send', 'pageview');
        
        </script>
      </body>
    </html>
  `;
    //      <script src="/assets/bundle.js"></script>
};
