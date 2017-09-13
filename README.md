# SPListFormsUtility
Small JavaScript library, that helps control the appearance and behavior of standart SharePoint list forms


SPListFormUtility allow you to:
* set/get fields values on standart SharePoint list forms
* hide fields
* disable fields
* helps control the appearance and behavior of controls (add custom css, modify html and so on)</li>


SPListFormUtility work only with standart SharePoint list item pages:
* DispForm.aspx
* EditForm.aspx
* NewForm.aspx


Characteristic:
* SharePoint 2010, SharePoint 2013, SharePoint 2016 support
* jQuery needed
* use internal fields names
* automatic detect culture settings for SPFieldDateTime fields

## Quick start
```js
$(document).ready(function () {
    ExecuteOrDelayUntilScriptLoaded(function () {

        // Title - internal field name
        var field = new Igotta.StandartListFormsUtility.SPFieldText('Title');
        if (field.isExists()) {
          field.setValue('TEST');

    }, "sp.js")
});
```

## Some examples
```js
//
//SPFieldBusinessData

var field = new Igotta.StandartListFormsUtility.SPFieldBusinessData('bcs');
field.setValue('__bg40002300', 'Department IT', 'Title');


//
// SPFieldUserMulti

var field = new Igotta.StandartListFormsUtility.SPFieldUserMulti('ParticipantsPicker');
field.setValue([{
    id: 'dev\developer',
    title: 'Developer'
}]);
```

### Set current user to ParticipantsPicker field
```js
// set current user to ParticipantsPicker field

getCurrentUser = function () {
    var deferred = $.Deferred();
    var context = new SP.ClientContext.get_current();
    var web = context.get_web();
    var currentUser = web.get_currentUser();
    context.load(currentUser);
    context.executeQueryAsync(
        function () { deferred.resolve(currentUser); },
        function (sender, args) { deferred.reject(sender, args); });
    return deferred.promise();
};

getCurrentUser().done(function (currentUser) {
    var userField = new Igotta.StandartListFormsUtility.SPFieldUserMulti('ParticipantsPicker');
    if (userField.isExists()) {
        var userInfo = {
            id: currentUser.get_loginName(),
            title:currentUser.get_title()
        };
        userField.setValue([userInfo]);
    }
});
```
