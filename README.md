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

## Examples
```js
//
// SPFieldText

// 'Title' - internal field name
var field = new Igotta.StandartListFormsUtility.ListField('Title');

// set value
field.setValue('TEST');

// get value
alert(field.getValue());

// hide all row
field.hide();

// hide control
field.hideDefaultControl();

// disable
field.disable();

// paint control background
var fieldTd = field.getCol();
$(fieldTd).css('background-color', 'red');

// paint control
var fieldControl = field.getControl();
$(fieldControl).css('background-color', 'green');

// get internal name
alert(field.getName());

// get field type, will return 'SPFieldText'
alert(field.getType());


//
// SPFieldLookup

// 'Lookup' - internal field name
var field = new Igotta.StandartListFormsUtility.ListField('incType');

// set value, 1 - is ID of lookup list element
field.setValue(1);

// get value, return ID of selected list element
console.log(field.getValue());

// make available only elements with specified ids
field.filterLookup([1]);

// clear filter - show all options
field.filterLookupClear();

// set OnChangeHandler
field.setOnChangeHandler(function (senderField) { console.log(senderField.getValue()); });

// all examples for SPFieldText is applicable


//
// SPFieldLookupMulti (currently support only one method - filterLookupMulti)

// 'LookupMulti' - internal filed name
var field = new Igotta.StandartListFormsUtility.ListField('LookupMulti');

// make available only elements with specified ids 
field.filterLookupMulti([1, 2, 6]);


//
// SPFieldDateTime (applicable for all cultures)

// 'Date' - internal field name
var field = new Igotta.StandartListFormsUtility.ListField('Date');

// set value
field.setValue(new Date());

// get value, will return Date object
alert(field.getValue());

// all examples for SPFieldText is applicable


//
// SPFieldBoolean

// 'Bool' - internal field name
var field = new Igotta.StandartListFormsUtility.ListField('Bool');

// set value
field.setValue(true);

// get value
alert(field.getValue());

// all examples for SPFieldText is applicable


//
//SPFieldBusinessData

var field = new Igotta.StandartListFormsUtility.SPFieldBusinessData('bcs');
field.setValue('__bg40002300', 'Департамент ИТ', 'Title');


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
