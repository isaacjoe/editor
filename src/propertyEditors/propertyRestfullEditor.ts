﻿import * as ko from "knockout";
import * as Survey from "survey-knockout";
import {SurveyPropertyModalEditor} from "./propertyModalEditor";
import {SurveyPropertyEditorBase} from "./propertyEditorBase";
import {editorLocalization} from "../editorLocalization";
import {SurveyPropertyEditorFactory} from "./propertyEditorFactory";

export class SurveyPropertyResultfullEditor extends SurveyPropertyModalEditor {
    koUrl: any; koPath: any; koValueName: any; koTitleName: any; 
    public survey: Survey.Survey;
    public question: Survey.QuestionDropdown;

    constructor(property: Survey.JsonObjectProperty) {
        super(property);
        this.koUrl = ko.observable();
        this.koPath = ko.observable();
        this.koValueName = ko.observable();
        this.koTitleName = ko.observable();
        this.createSurvey();
        var self = this;
        this.koUrl.subscribe(function (newValue) { self.question.choicesByUrl.url = newValue; self.run(); });
        this.koPath.subscribe(function (newValue) { self.question.choicesByUrl.path = newValue; self.run(); });
        this.koValueName.subscribe(function (newValue) { self.question.choicesByUrl.valueName = newValue; self.run(); });
        this.koTitleName.subscribe(function (newValue) { self.question.choicesByUrl.titleName = newValue; self.run(); });
    }
    public get editorType(): string { return "restfull"; }
    public get restfullValue() { return <Survey.ChoicesRestfull>this.editingValue; }
    public getValueText(value: any): string {
        if (!value || !value.url) return editorLocalization.getString("pe.empty");
        var str = value.url;
        if (str.length > 20) {
            str = str.substr(0, 20) + "...";
        }
        return str;
    }
    protected onValueChanged() {
        var val = this.restfullValue;
        this.koUrl(val ? val.url : "");
        this.koPath(val ? val.path : "");
        this.koValueName(val ? val.valueName : "");
        this.koTitleName(val ? val.titleName : "");
    }
    protected onBeforeApply() {
        var val = new Survey.ChoicesRestfull();
        val.url = this.koUrl();
        val.path = this.koPath();
        val.valueName = this.koValueName();
        val.titleName = this.koTitleName();
        this.setValueCore(val);
    }
    private run() {
        this.question.choicesByUrl.run();
    }
    private createSurvey() {
        this.survey = new Survey.Survey();
        this.survey.showNavigationButtons = false;
        this.survey.showQuestionNumbers = "off";
        var page = this.survey.addNewPage("page1");
        this.question = <Survey.QuestionDropdown>page.addNewQuestion("dropdown", "q1");
        this.question.title = editorLocalization.getString("pe.testService")
        this.question.choices = [];
    }
}

SurveyPropertyEditorFactory.registerEditor("restfull", function (property: Survey.JsonObjectProperty): SurveyPropertyEditorBase { return new SurveyPropertyResultfullEditor(property); });