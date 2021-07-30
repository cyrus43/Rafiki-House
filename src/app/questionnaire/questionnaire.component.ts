/* eslint-disable no-undef */
/* eslint-disable array-callback-return */
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { ApplicationUser } from '../application-user';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss'],
})
export class QuestionnaireComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) {}
  name: string;
  userObject: ApplicationUser;
  panelOpenState = false;
  loading = false;
  loadingUsername = false;
  busy;
  submissionError = false;
  filteredQuestions: any[] = [];
  answer = '';
  surveyId;
  reload() {
    window.location.reload();
  }
  answerQuestion(question, answer) {
    this.busy = true;
    this.authService
      .submitAnswers(
        question.id,
        question.column_match,
        answer,
        this.userObject.id,
        this.surveyId
      )
      .pipe(finalize(() => (this.busy = false)))
      .subscribe(
        () => {
          this._snackBar.open('Question answered successfully', 'close', {
            duration: 1500,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
          this.answer = '';
        },
        (error) => {
          this.submissionError = true;
          this._snackBar.open('Error submitting answer, try again', 'close', {
            duration: 1500,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
        }
      );
  }
  logout() {
    this.authService.logout();
    window.location.reload();
    this._snackBar.open('You have been logged out', 'close', {
      duration: 1500,
      verticalPosition: 'top',
    });
  }
  ngOnInit(): void {
    this.loadingUsername = true;
    this.userObject = JSON.parse(localStorage.getItem('user'));
    this.name = this.userObject.name;
    this.loadingUsername = false;
    this.authService.getSurveys().subscribe((survey) => {
      survey.forms.forEach((form) => {
        this.surveyId = form.id;
        form.pages.forEach((page) => {
          page.sections.forEach((section) => {
            section.questions.forEach((question) => {
              this.loading = true;
              this.filteredQuestions.push(question);
              this.loading = false;
            });
          });
        });
      });
    });
  }
}
