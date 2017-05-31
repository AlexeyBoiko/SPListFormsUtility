// jQuery needed
// Custom added elements must have isCustom="true" attr

if (typeof (Igotta) == 'undefined')
    Type.registerNamespace('Igotta');

if (typeof (Igotta.StandartListFormsUtility) == 'undefined')
    Type.registerNamespace('Igotta.StandartListFormsUtility');


(function ($) {

    //
    // base field class

    Igotta.StandartListFormsUtility.FieldBase = function (internalName, scanObject) {
        this._internalName = internalName;

        if (scanObject) {
            this._initialize(scanObject);
        }
        else {
            //this._initialize($('*'));
            this._initialize(document);
        }
    };
    Igotta.StandartListFormsUtility.FieldBase.prototype = {
        _tr: null,
        _td: null,
        _fieldType: null,

        _initialize: function (scanElem) {
            var searchStr = 'FieldInternalName="' + this._internalName + '"';
            var self = this;
            // scanElems.contents()
            // .filter(function () { return (this.nodeType == 8 && this.nodeValue.indexOf(searchStr) >= 0); })
            // .each(function (i, e) {
            //     self._td = $(e).parent();
            //     self._tr = $(e).parent().parent();
            //     self._fieldType = e.nodeValue.match(/FieldType="[a-z]+/ig)[0].substring(11); //FieldType="SPFieldLookup"
            // });
            var allTd = scanElem.querySelectorAll('td.ms-formbody');
            for (var ii = 0; ii < allTd.length; ii++) {
                for (var jj = 0; jj < allTd[ii].childNodes.length; jj++) {
                    if (allTd[ii].childNodes[jj].nodeType === 8 && allTd[ii].childNodes[jj].nodeValue.indexOf(searchStr) >= 0) {
                        self._td = $(allTd[ii]);
                        self._tr = $(allTd[ii].parentNode);
                        self._fieldType = allTd[ii].childNodes[jj].nodeValue.match(/FieldType="[a-z]+/ig)[0].substring(11); //FieldType="SPFieldLookup"
                        break;
                    }
                }
            }
        },

        getName: function () { return this._internalName; },
        getType: function () { return this._fieldType; },
        isExists: function () { return (this.getType() != null); },
        // 0 - display
        // 1 - edit
        getDisplayType: function () {
            //throw 'Method getDisplayType not implement. Field internalname: ' + this._internalName;
            if (this._td.has('input').length || this._td.has('textarea').length)
                return 1;
            else
                return 0;
        },
        setOnChangeHandler: function (handler) {
            var input = this._td.find('input[isCustom!="true"]');
            if (input.length > 0) {
                $(input).change(function () { handler(self); });
            }
        },
        getRow: function () { return (this._tr); },
        getCol: function () { return (this._td); },
        getControl: function () {
            var spans = this._td.find('span[isCustom!="true"]');
            if (spans.length > 0) { return $(spans[0]); }
            return null;
        },

        // Mark every new tag with isCustom="true" attr
        getHTML: function () { return (this._td.html()); },
        setHTML: function (value) { this._td.html(value); },
        addHTML: function (value) { this._td.append(value); },

        hide: function () { this._tr.hide(); },
        show: function () { this._tr.show(); },
        disable: function () {
            this._tr.find('input[isCustom!="true"],select[isCustom!="true"]').attr('readonly', 'readonly').addClass('readonly');
            this._tr.find('select[isCustom!="true"]').attr('disabled', 'disabled').addClass('readonly');
            this._tr.find('input:checkbox[isCustom!="true"]').attr('disabled', 'disabled').addClass('readonly');

            //var self = this;
            //this._tr.find('input:checkbox[isCustom!="true"]').each(function () {
            //    $(this).hide();
            //    $(this).siblings('br').hide();
            //    if (this.checked) { self.addHTML('<span class="disabledcheckbox" isCustom="true">Yes</span>'); }
            //    else { self.addHTML('<span class="disabledcheckbox" isCustom="true">No</span>'); }
            //});

            this._tr.find('a[isCustom!="true"]').hide();
            this._tr.find('img[isCustom!="true"]').hide();
        },

        hideDefaultControl: function () {
            this._tr.find('span[isCustom!="true"]').hide();
        },
        setReadMode: function (text) {
            this.hideDefaultControl();

            var container = this.getCol();
            var readControl = container.find('#igt_field_value_text');
            if (readControl.length == 0) {

                readControl = $('<span id="igt_field_value_text" isCustom="true"></span>');
                container.append(readControl);
            }
            if (text == undefined) {
                text = this.getValueText();
            }
            readControl.html(text);


            //this.show();
            this.hideDefaultControl();
            //this._mode = "read";
        },
        getValueText: function () {
            throw 'Method getValueText not implemented. Field internalname: ' + this._internalName;
        }
    }
    Igotta.StandartListFormsUtility.FieldBase.registerClass('Igotta.StandartListFormsUtility.FieldBase');


    //
    // SPFieldText

    Igotta.StandartListFormsUtility.SPFieldText = function (internalName, scanObject) {
        Igotta.StandartListFormsUtility.SPFieldText.initializeBase(this, [internalName, scanObject]);
    };
    Igotta.StandartListFormsUtility.SPFieldText.prototype = {
        getValue: function () {
            var input = this._tr.find('input[isCustom!="true"]');
            if (input.length > 0) {
                return $(input[0]).val();
            }

            throw 'Get value error. Field internalname: ' + this._internalName;
        },

        setValue: function (value) {
            var input = this._td.find('input[isCustom!="true"]');
            if (input.length > 0) {
                $(input[0]).val(value);
                return;
            }

            throw 'Set value error. Field internalname: ' + this._internalName;
        },

        getValueText: function () {
            return this.getValue();
        }
    };
    Igotta.StandartListFormsUtility.SPFieldText.registerClass('Igotta.StandartListFormsUtility.SPFieldText', Igotta.StandartListFormsUtility.FieldBase);


    //
    // SPFieldNote (TODO: not tested)

    Igotta.StandartListFormsUtility.SPFieldNote = function (internalName, scanObject) {
        Igotta.StandartListFormsUtility.SPFieldNote.initializeBase(this, [internalName, scanObject]);
    };
    Igotta.StandartListFormsUtility.SPFieldNote.prototype = {
        getValue: function () {
            var input = this._tr.find('textarea[isCustom!="true"]');
            if (input.length > 0) {
                return $(input[0]).val();
            }

            throw 'Get value error. Field internalname: ' + this._internalName;
        },

        setValue: function (value) {
            var input = this._td.find('textarea[isCustom!="true"]');
            if (input.length > 0) {
                $(input[0]).val(value);
                return;
            }

            throw 'Set value error. Field internalname: ' + this._internalName;
        },

        getValueText: function () {
            return this.getValue();
        }
    };
    Igotta.StandartListFormsUtility.SPFieldNote.registerClass('Igotta.StandartListFormsUtility.SPFieldNote', Igotta.StandartListFormsUtility.SPFieldText);


    //
    // SPFieldNumber

    Igotta.StandartListFormsUtility.SPFieldNumber = function (internalName, scanObject) {
        Igotta.StandartListFormsUtility.SPFieldNumber.initializeBase(this, [internalName, scanObject]);
    };
    Igotta.StandartListFormsUtility.SPFieldNumber.prototype = {
        getValue: function () {
            var val = Igotta.StandartListFormsUtility.SPFieldNumber.callBaseMethod(this, 'getValue');
            var res = null;
            if (val)
                res = parseFloat(val.replace(',', '.').replace(new RegExp(String.fromCharCode(160), "g"), '')); // only for russian regional settings

            return res;
        }
    };
    Igotta.StandartListFormsUtility.SPFieldNumber.registerClass('Igotta.StandartListFormsUtility.SPFieldNumber', Igotta.StandartListFormsUtility.SPFieldText);


    //
    // SPFieldChoice

    Igotta.StandartListFormsUtility.SPFieldChoice = function (internalName, scanObject) {
        Igotta.StandartListFormsUtility.SPFieldChoice.initializeBase(this, [internalName, scanObject]);
    };
    Igotta.StandartListFormsUtility.SPFieldChoice.prototype = {
        getValue: function () {
            var select = this._tr.find('select.ms-RadioText');
            if (select.length > 0) {
                return $(select[0]).val();
            }

            throw 'Get value error. Field internalname: ' + this._internalName;
        },
        // Set value - NOT text
        setValue: function (value) {
            var select = this._td.find('select.ms-RadioText');
            if (select.length > 0) {
                $(select[0]).val(value);
                return;
            }

            throw 'Set value error. Field internalname: ' + this._internalName;
        },
        getDisplayType: function () {
            if (this._td.has('select').length)
                return 1;
            else
                return 0;
        },
        setOnChangeHandler: function (handler) {
            var input = this._td.find('select[isCustom!="true"]');
            if (input.length > 0) {
                $(input).change(function () { handler(self); });
            }
        },

        getValueText: function () {
            return this.getValue();
        }
    };
    Igotta.StandartListFormsUtility.SPFieldChoice.registerClass('Igotta.StandartListFormsUtility.SPFieldChoice', Igotta.StandartListFormsUtility.FieldBase);


    //
    // SPFieldLookup

    Igotta.StandartListFormsUtility.SPFieldLookup = function (internalName, scanObject) {
        Igotta.StandartListFormsUtility.SPFieldLookup.initializeBase(this, [internalName, scanObject]);
    };
    Igotta.StandartListFormsUtility.SPFieldLookup.prototype = {
        getValue: function () {
            // <= 20 items
            var select = this._tr.find('select[isCustom!="true"]');
            if (select.length > 0) {
                return parseInt($(select[0]).val());
            }
            // > 20 items
            var input = this._tr.find('input[isCustom!="true"]');
            if (input.length > 0) {
                return parseInt((document.getElementById(input[0].optHid)).value);
            }

            throw 'Get value error. Field internalname: ' + this._internalName;
        },

        getValueText: function () {
            // <= 20 items
            var select = this._tr.find('select[isCustom!="true"]');
            if (select.length > 0) {
                return $(select[0]).find('option:selected').text();
            }
            // > 20 items
            var input = this._tr.find('input[isCustom!="true"]');
            if (input.length > 0) {
                //return (document.getElementById(input[0].optHid)).value;
                return (document.getElementById($(input[0]).attr('optHid'))).value;
            }

            throw 'Get value error. Field internalname: ' + this._internalName;
        },

        setValue: function (value) {
            if (!(value >= 0)) return;

            // <= 20 items
            var select = this._tr.find('select[isCustom!="true"]');
            if (select.length > 0) {
                $(select[0]).val(value);
                return;
            }
            // > 20 items
            var input = this._tr.find('input[isCustom!="true"]');
            if (input.length > 0) {
                (document.getElementById(input[0].optHid)).value = value;
                return;
            }

            throw 'Set value error. Field internalname: ' + this._internalName;
        },

        setOnChangeHandler: function (handler) {
            // <= 20 items
            var select = this._tr.find('select[isCustom!="true"]');
            if (select.length > 0) {
                var self = this;
                $(select[0]).change(function () { handler(self); });
            }
            else { throw 'Method setOnChangeHandler not implement for lookups with > 20 items. Field internalname: ' + this._internalName; }
        },

        _allLookupOptions: null,
        _allLookupOptionsInputValue: null,
        // method only for SPFieldLookup
        filterLookup: function (lookupIdsToShow) {
            this.filterLookupClear();

            // <= 20 items
            var select = this._tr.find('select[isCustom!="true"]');
            if (select.length > 0) {
                this._allLookupOptions = [];

                var options = $(select[0]).children('option');
                for (var ii = 0; ii < options.length; ii++) {
                    this._allLookupOptions.push({ value: options[ii].value, text: options[ii].text });

                    var optinValue = parseInt(options[ii].value, 10);
                    if (optinValue != 0 && jQuery.inArray(optinValue, lookupIdsToShow) == -1) {
                        $(options[ii]).remove();
                    }
                }
            }

            // > 20 items
            var input = this._tr.find('input[isCustom!="true"]');
            if (input.length > 0) {

                this._allLookupOptionsInputValue = input[0].choices;

                var allChoices = input[0].choices.split('|');

                var choicesToShow = [];
                for (var ii in allChoices) {
                    var choiceId = parseInt(allChoices[ii], 10);
                    if (choiceId && jQuery.inArray(choiceId, lookupIdsToShow) != -1) {
                        choicesToShow.push(allChoices[ii - 1]);
                        choicesToShow.push(allChoices[ii]);
                    }
                }

                input[0].choices = choicesToShow.join('|');
            }
        },

        // clear filter
        filterLookupClear: function () {
            if (this._allLookupOptions == null && this._allLookupOptionsInputValue == null) {
                return;
            }

            var currentValue = this.getValue();

            // <= 20 items
            var select = this._tr.find('select[isCustom!="true"]');
            if (select.length > 0) {

                // remove all options
                $(select[0]).children('option').remove().end();

                //_allLookupOptions
                for (var ii in this._allLookupOptions) {
                    $(select[0]).append($('<option>').text(this._allLookupOptions[ii].text).val(this._allLookupOptions[ii].value));
                }
            }

            var input = this._tr.find('input[isCustom!="true"]');
            if (input.length > 0) {
                input[0].choices = this._allLookupOptionsInputValue;
            }

            this.setValue(currentValue);
            //else { throw 'Method filterLookupClear not implement for lookups with > 20 items. Field internalname: ' + this._internalName; }
        },

        // 0 - display
        // 1 - edit
        getDisplayType: function () {
            if (this._td.attr('id') == 'SPFieldLookup')
                return 0;
            else
                return 1;
        },
    };
    Igotta.StandartListFormsUtility.SPFieldLookup.registerClass('Igotta.StandartListFormsUtility.SPFieldLookup', Igotta.StandartListFormsUtility.FieldBase);


    //
    // SPFieldLookupMulti

    Igotta.StandartListFormsUtility.SPFieldLookupMulti = function (internalName, scanObject) {
        Igotta.StandartListFormsUtility.SPFieldLookupMulti.initializeBase(this, [internalName, scanObject]);
    };
    Igotta.StandartListFormsUtility.SPFieldLookupMulti.prototype = {
        filterLookupMulti: function (lookupIdsToShow) {
            var options = this._tr.find('select option');

            for (var ii = 0; ii < options.length; ii++) {
                if (jQuery.inArray(parseInt(options[ii].value, 10), lookupIdsToShow) == -1) {
                    $(options[ii]).remove();
                }
            }
        }
    };
    Igotta.StandartListFormsUtility.SPFieldLookupMulti.registerClass('Igotta.StandartListFormsUtility.SPFieldLookupMulti', Igotta.StandartListFormsUtility.FieldBase);


    //
    // SPFieldBoolean

    Igotta.StandartListFormsUtility.SPFieldBoolean = function (internalName, scanObject) {
        Igotta.StandartListFormsUtility.SPFieldBoolean.initializeBase(this, [internalName, scanObject]);
    };
    Igotta.StandartListFormsUtility.SPFieldBoolean.prototype = {
        getValue: function () {
            var input = this._tr.find('input[isCustom!="true"]');
            if (input.length > 0) {
                return $(input[0]).prop('checked');
            }

            throw 'Get value error. Field internalname: ' + this._internalName;
        },

        setValue: function (value) {
            var input = this._tr.find('input[isCustom!="true"]');
            if (input.length > 0) {
                $(input[0]).prop('checked', value);
                return;
            }

            throw 'Set value error. Field internalname: ' + this._internalName;
        }
    };
    Igotta.StandartListFormsUtility.SPFieldBoolean.registerClass('Igotta.StandartListFormsUtility.SPFieldBoolean', Igotta.StandartListFormsUtility.FieldBase);


    //
    // SPFieldAllDayEvent

    Igotta.StandartListFormsUtility.SPFieldAllDayEvent = function (internalName, scanObject) {
        Igotta.StandartListFormsUtility.SPFieldAllDayEvent.initializeBase(this, [internalName, scanObject]);
    };
    Igotta.StandartListFormsUtility.SPFieldAllDayEvent.registerClass('Igotta.StandartListFormsUtility.SPFieldAllDayEvent', Igotta.StandartListFormsUtility.SPFieldBoolean);


    //
    // SPFieldDateTime

    Igotta.StandartListFormsUtility.SPFieldDateTime = function (internalName, scanObject) {
        Igotta.StandartListFormsUtility.SPFieldDateTime.initializeBase(this, [internalName, scanObject]);
    };
    Igotta.StandartListFormsUtility.SPFieldDateTime.prototype = {
        getValue: function () {
            var inputStr = this.getControl().find('.ms-dtinput input').val();
            if (!inputStr || inputStr.lenght == 0) {
                return null;
            }

            var date;

            var lcid = this._getSPFieldDateTimeLcid();
            switch (lcid) {
                case '1049':
                case '1031':
                    // dd.MM.yyyy
                    var dateParts = inputStr.split('.');
                    date = new Date(dateParts[2], (dateParts[1] - 1), dateParts[0]);
                    break;
                case '1033':
                    // MM/dd/yyyy
                    var dateParts = inputStr.split('/');
                    date = new Date(dateParts[2], (dateParts[0] - 1), dateParts[1]);
                    break;
                case '1041':
                    // yyyy/MM/dd
                    var dateParts = inputStr.split('/');
                    date = new Date(dateParts[0], (dateParts[1] - 1), dateParts[2]);
                    break;
                default:
                    // dd/MM/yyyy
                    var dateParts = inputStr.split('/');
                    date = new Date(dateParts[2], (dateParts[1] - 1), dateParts[0]);
                    break;
            }

            // get time
            var timeSelectors = this.getControl().find('.ms-dttimeinput select');
            if (timeSelectors.length > 1) {
                var hours = this._parseHour($(timeSelectors[0]).val()); //timeSelectors[0].selectedIndex;
                var minutes = parseInt($(timeSelectors[1]).val()) || 0; //timeSelectors[1].selectedIndex * 5;
                date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);
            }

            return date;
        },

        getValueText: function () {
            var val = this.getValue();
            if (val)
                return val.toLocaleString();
            return '';
        },

        setValue: function (value) {

            if (isNaN(Date.parse(value)) || value.format('d/M/yyyy HH:mm').indexOf('NaN') >= 0) { return; }

            var lcid = this._getSPFieldDateTimeLcid();
            var value_date = value.format(this._getDateFormatByLcid(lcid));
            var value_hour = value.getHours();
            var value_minute = Math.floor(value.getMinutes() / 5);

            var input_date = this.getControl().find('.ms-dtinput input');
            if (input_date.length > 0) {
                $(input_date[0]).val(value_date);
            }

            var input_time = this.getControl().find('.ms-dttimeinput select');
            if (input_time.length > 1) {

                var hours = $(input_time[0]).find('option');
                if (hours.length > value_hour) {
                    //$(hours[value_hour]).attr('selected', 'selected');
                    $(input_time[0]).val(value_hour);
                }

                var minutes = $(input_time[1]).find('option');
                if (minutes.length > value_minute) {
                    //$(minutes[value_minute]).attr('selected', 'selected');
                    $(input_time[1]).val(value_minute);
                }
            }
        },

        _getDateFormatByLcid: function (lcid) {
            var lcidsWithFormat_RUS = ';1031;1049;';
            var lcidsWithFormat_USA = ';1033;';
            var lcidsWithFormat_JPN = ';1041;';

            if (lcidsWithFormat_RUS.indexOf(';' + lcid + ';') >= 0)
            { return ('dd.MM.yyyy'); }

            if (lcidsWithFormat_USA.indexOf(';' + lcid + ';') >= 0)
            { return ('MM/dd/yyyy'); }

            if (lcidsWithFormat_JPN.indexOf(';' + lcid + ';') >= 0)
            { return ('yyyy/MM/dd'); }

            return ('dd/MM/yyyy');
        },

        _getSPFieldDateTimeLcid: function () {
            var lcid = '';
            var input_picker = this.getControl().find('.ms-dtinput a');
            if (input_picker.length > 0) {
                var pickerstring = $(input_picker[0]).attr('onclick').toString().toLowerCase();
                lcid = pickerstring.substr(pickerstring.indexOf('&lcid=') + 6).split('&')[0];
            }

            return lcid;
        },

        _parseHour: function (str) {
            var lc = (str || '').toLowerCase();
            var result = parseInt(lc) || 0;

            if (lc.indexOf('m') >= 0 && result == 12)
                result = 0;

            if (lc.indexOf('pm') >= 0)
                result += 12;

            return result;
        }
    };
    Igotta.StandartListFormsUtility.SPFieldDateTime.registerClass('Igotta.StandartListFormsUtility.SPFieldDateTime', Igotta.StandartListFormsUtility.FieldBase);


    //
    // SPFieldBusinessData

    Igotta.StandartListFormsUtility.SPFieldBusinessData = function (internalName, scanObject) {
        Igotta.StandartListFormsUtility.SPFieldBusinessData.initializeBase(this, [internalName, scanObject]);
    };
    Igotta.StandartListFormsUtility.SPFieldBusinessData.prototype = {
        setValue: function (entityKey, displayText, displayBcsFieldName) {
            var controlId = $(this._td.children('span')[0]).children('span').attr('id');


            // make xml

            var xml =
                '<Entities Append="False" Error="" DoEncodeErrorMessage="False" MaxHeight="3">' +
                  '<Entity Key="' + entityKey + '" DisplayText="' + displayText + '" IsResolved="True" Description="">' +
                    '<ExtraData>' +
                      '<ArrayOfDictionaryEntry xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">' +
                        '<DictionaryEntry>' +
                          '<Key xsi:type="xsd:string">' + displayBcsFieldName + '</Key>' +
                          '<Value xsi:type="xsd:string">' + displayText + '</Value>' +
                        '</DictionaryEntry>' +
                      '</ArrayOfDictionaryEntry>' +
                    '</ExtraData>' +
                    '<MultipleMatches />' +
                  '</Entity>' +
                '</Entities>';


            EntityEditorCallback(xml, controlId);
            RunCustomScriptSetForPickerControl(controlId);
        },
        getValueText: function () {
            var id = $(this.getControl()[0].firstChild).attr('Id') + '_HiddenEntityDisplayText';
            return $('#' + id).val();
        }
    };
    Igotta.StandartListFormsUtility.SPFieldBusinessData.registerClass('Igotta.StandartListFormsUtility.SPFieldBusinessData', Igotta.StandartListFormsUtility.FieldBase);


    //
    // SPFieldUser

    Igotta.StandartListFormsUtility.SPFieldUser = function (internalName, scanObject) {
        Igotta.StandartListFormsUtility.SPFieldUser.initializeBase(this, [internalName, scanObject]);
    };
    Igotta.StandartListFormsUtility.SPFieldUser.prototype = {
        getValue: function () {
            throw 'Get value error. Field internalname: ' + this._internalName;
        },
        getValueText: function () {
            return this.getControl().find('#content').text();
        },
        setValue: function () {
            throw 'Method setValue not implemented. Field internalname: ' + this._internalName;
            // TODO: перенести из StateMachines.SharePoint2010\Layouts\StateMachines.SharePoint\JS\igotta.standartlistformsutility-1.11.js
        },
        setOnChangeHandler: function () {
            throw 'Method setOnChangeHandler not implemented. Field internalname: ' + this._internalName;
        }
    };
    Igotta.StandartListFormsUtility.SPFieldUser.registerClass('Igotta.StandartListFormsUtility.SPFieldUser', Igotta.StandartListFormsUtility.FieldBase);


    //
    // SPFieldUserMulti

    Igotta.StandartListFormsUtility.SPFieldUserMulti = function (internalName, scanObject) {
        Igotta.StandartListFormsUtility.SPFieldUserMulti.initializeBase(this, [internalName, scanObject]);
    };
    Igotta.StandartListFormsUtility.SPFieldUserMulti.prototype = {
        getValue: function () {
            throw 'Method getValue not implemented. Field internalname: ' + this._internalName;
        },
        getValueText: function () {
            throw 'Method getValueText not implemented. Field internalname: ' + this._internalName;
        },

        // value: [{id:1,title:'UsersName1'},{id:2,title:'UsersName2'}]
        setValue: function (value) {

            function SetPickerValue(pickerid, values) {
                var xml = '<Entities Append="False" Error="" Separator=";" MaxHeight="3">';
                $.each(values, function () {
                    xml = xml + PreparePickerEntityXml(this.id, this.title);
                });
                xml = xml + '</Entities>';

                EntityEditorCallback(xml, pickerid, true);
            }

            function PreparePickerEntityXml(key, displayText) {
                return '<Entity Key="' + key + '" DisplayText="' + displayText + '" IsResolved="True" Description="' + key + '"><MultipleMatches /></Entity>';
            }

            var input = this._td.find('span[id$="_UserField"]');
            if (input.length > 0) {
                var id = $(input[0]).attr('id');
                SetPickerValue(id, value);
                return;
            }

            throw 'Set value error. Field internalname: ' + this._internalName;
        },
        setOnChangeHandler: function () {
            throw 'Method setOnChangeHandler not implemented. Field internalname: ' + this._internalName;
        }
    };
    Igotta.StandartListFormsUtility.SPFieldUserMulti.registerClass('Igotta.StandartListFormsUtility.SPFieldUserMulti', Igotta.StandartListFormsUtility.FieldBase);
})(jQuery);



//
// usage examples
//


////
////SPFieldBusinessData

//field = new Igotta.StandartListFormsUtility.SPFieldBusinessData('bcs');
//field.setValue('__bg40002300', 'Департамент ИТ', 'Title');

//});


////
//// SPFieldText
////

//// 'Title' - internal field name
//var field = new Igotta.StandartListFormsUtility.ListField('Title');

//// set value
//field.setValue('TEST');

//// get value
//alert(field.getValue());

//// hide all row
//field.hide();

//// hide control
//field.hideDefaultControl();

//// disable
//field.disable();

//// paint control background
//var fieldTd = field.getCol();
//$(fieldTd).css('background-color', 'red');

//// paint control
//var fieldControl = field.getControl();
//$(fieldControl).css('background-color', 'green');

//// get internal name
//alert(field.getName());

//// get field type, will return 'SPFieldText'
//alert(field.getType());


////
//// SPFieldLookup
////

//// 'Lookup' - internal field name
//field = new Igotta.StandartListFormsUtility.ListField('incType');

//// set value, 1 - is ID of lookup list element
//field.setValue(1);

//// get value, return ID of selected list element
//console.log(field.getValue());

//// make available only elements with specified ids
//field.filterLookup([1]);

//// clear filter - show all options
//field.filterLookupClear();

//// set OnChangeHandler
//field.setOnChangeHandler(function (senderField) { console.log(senderField.getValue()); });


//// all examples for SPFieldText is applicable


////
//// SPFieldLookupMulti (currently support only one method - filterLookupMulti)
////

//// 'LookupMulti' - internal filed name
//var field = new Igotta.StandartListFormsUtility.ListField('LookupMulti');

//// make available only elements with specified ids 
//field.filterLookupMulti([1, 2, 6]);


////
//// SPFieldDateTime (applicable for all cultures)
////

//// 'Date' - internal field name
//var field = new Igotta.StandartListFormsUtility.ListField('Date');

//// set value
//field.setValue(new Date());

//// get value, will return Date object
//alert(field.getValue());

//// all examples for SPFieldText is applicable


////
//// SPFieldBoolean
////

//// 'Bool' - internal field name
//var field = new Igotta.StandartListFormsUtility.ListField('Bool');

//// set value
//field.setValue(true);

//// get value
//alert(field.getValue());

//// all examples for SPFieldText is applicable


//});


////
//// SPFieldUserMulti
////

//// set current user to ParticipantsPicker field

//getCurrentUser = function () {
//    var deferred = $.Deferred();
//    var context = new SP.ClientContext.get_current();
//    var web = context.get_web();
//    var currentUser = web.get_currentUser();
//    context.load(currentUser);
//    context.executeQueryAsync(
//        function () { deferred.resolve(currentUser); },
//        function (sender, args) { deferred.reject(sender, args); });
//    return deferred.promise();
//};

//getCurrentUser().done(function (currentUser) {
//    var userField = new Igotta.StandartListFormsUtility.SPFieldUserMulti('ParticipantsPicker');
//    if (userField.isExists()) {
//        var userInfo = {
//            id: currentUser.get_loginName(),
//            title:currentUser.get_title()
//        };
//        userField.setValue([userInfo]);
//    }
//});